import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, googleProvider, db, verifyFirestoreConnection } from './firebase';
import { Header } from './components/Header';
import { LiveRadarView } from './components/LiveRadarView';
import { LatexStudioModal } from './components/LatexStudioModal';
import { AgentAutomationView } from './components/AgentAutomationView';
import { KanbanCrmView } from './components/KanbanCrmView';
import { InterviewCockpitModal } from './components/InterviewCockpitModal';
import { MasterProfileView } from './components/MasterProfileView';
import { AuthModal } from './components/AuthModal';
import { CvUploadModal } from './components/CvUploadModal';
import { INITIAL_PROFILE, INITIAL_APPLICATIONS, INITIAL_REAL_JOBS } from './mockData';
import { UserProfile, JobOffer, Application, AgentLog, ApplicationStatus } from './types';
import { 
  Bot, 
  Sparkles, 
  FileCode2, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'radar' | 'latex' | 'agent' | 'kanban' | 'interview' | 'profile'>('radar');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [cvUploadModalOpen, setCvUploadModalOpen] = useState(false);
  const [isMandatoryOnboarding, setIsMandatoryOnboarding] = useState(false);

  // Application Data States
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [jobs, setJobs] = useState<JobOffer[]>(INITIAL_REAL_JOBS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  
  // Modals & Active Selections
  const [selectedJobForLatex, setSelectedJobForLatex] = useState<JobOffer | null>(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<Application | null>(null);
  
  // Async status states
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  // Agent Activity Logs
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([
    {
      id: "log-init-1",
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      type: "scan",
      message: "Agent de veille actif : surveillance des opportunités et des flux d'offres en temps réel."
    }
  ]);

  // Initial setup: test connection, fetch initial jobs
  useEffect(() => {
    verifyFirestoreConnection();
    handleFetchLiveJobs('Développeur React / Node.js', 'tous', 'Paris');

    let unsubApps: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load or initialize user profile in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
            // If user has not deposited a CV or has no skills/name yet, prompt onboarding
            if (!data.fullName || data.skills.length === 0) {
              setCvUploadModalOpen(true);
            }
          } else {
            const initialForUser: UserProfile = {
              ...INITIAL_PROFILE,
              userId: user.uid,
              fullName: user.displayName || '',
              email: user.email || ''
            };
            await setDoc(userDocRef, initialForUser);
            setUserProfile(initialForUser);
            // Immediately open CV Upload Modal for new user onboarding
            setIsMandatoryOnboarding(true);
            setCvUploadModalOpen(true);
          }
        } catch (e) {
          console.error("Firestore user sync error:", e);
        }

        // Real-time synchronization of applications subcollection
        try {
          const appsRef = collection(db, 'users', user.uid, 'applications');
          unsubApps = onSnapshot(appsRef, async (snap) => {
            if (!snap.empty) {
              const loaded: Application[] = [];
              snap.forEach(d => loaded.push(d.data() as Application));
              // Sort by appliedAt or createdAt descending
              loaded.sort((a, b) => new Date(b.createdAt || b.appliedAt || 0).getTime() - new Date(a.createdAt || a.appliedAt || 0).getTime());
              setApplications(loaded);
            } else {
              setApplications([]);
            }
          });
        } catch (err) {
          console.error("Firestore applications sync error:", err);
        }
      } else {
        if (unsubApps) {
          unsubApps();
          unsubApps = null;
        }
      }
    });

    return () => {
      unsubscribe();
      if (unsubApps) unsubApps();
    };
  }, []);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("Connexion réussie", "Vos candidatures et profils sont synchronisés avec Firestore.");
    } catch (e: any) {
      console.error("Login error:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("Déconnexion", "Session déconnectée.");
    } catch (e: any) {
      console.error("Logout error:", e);
    }
  };

  const handleFetchLiveJobs = async (query: string, contractType: string, location: string) => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch('/api/jobs/search-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, contractType, location })
      });
      const data = await res.json();
      if (data.jobs && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.warn("Live jobs fetch notice:", e);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Instant Auto-Apply flow from any card
  const handleInstantAutoApply = async (job: JobOffer) => {
    showToast("Agent lancé", `Génération LaTeX et auto-postulation pour ${job.company}...`);
    setIsAgentRunning(true);

    try {
      // 1. Generate tailored LaTeX CV
      const resLatex = await fetch('/api/tailor/latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate: userProfile, job })
      });
      const dataLatex = await resLatex.json();

      // 2. Generate tailored Cover Letter
      const resLetter = await fetch('/api/tailor/letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate: userProfile, job })
      });
      const dataLetter = await resLetter.json();

      // 3. Simulate ATS submission
      const resSubmit = await fetch('/api/auto-apply/simulate-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application: { jobTitle: job.title, company: job.company, source: job.source }, candidate: userProfile })
      });
      const dataSubmit = await resSubmit.json();

      // 4. Create new Application record
      const newApp: Application = {
        id: `app-${Date.now()}`,
        userId: currentUser?.uid || userProfile.userId,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        contractType: job.contractType,
        jobUrl: job.applyUrl,
        matchScore: dataLatex.matchScore || 92,
        status: 'applied',
        appliedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        matchedKeywords: dataLatex.matchedKeywords || job.skillsRequired,
        latexResumeCode: dataLatex.latexCode,
        coverLetter: dataLetter.letter,
        overleafSnippetUrl: dataLatex.overleafUrl || 'https://www.overleaf.com/docs',
        logEvents: [
          { timestamp: new Date().toLocaleTimeString('fr-FR'), message: `Candidature soumise automatiquement (${job.source})` }
        ]
      };

      setApplications(prev => [newApp, ...prev]);

      // Add log to agent console
      setAgentLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          type: 'success',
          message: `Postulation réussie chez ${job.company} (${job.title}) • Dossier archivé dans le CRM.`,
          company: job.company,
          score: dataLatex.matchScore || 92
        },
        ...prev
      ]);

      // If user is authenticated, sync to Firestore
      if (currentUser) {
        try {
          await setDoc(doc(db, 'users', currentUser.uid, 'applications', newApp.id), newApp);
        } catch (err) {
          console.error("Firestore app save error:", err);
        }
      }

      showToast("Candidature Envoyée !", `L'agent a postulé chez ${job.company}. Vous pouvez préparer l'entretien dans le Cockpit.`);
    } catch (e: any) {
      console.error("Auto apply error:", e);
      showToast("Erreur", "Une erreur est survenue lors de l'auto-postulation.");
    } finally {
      setIsAgentRunning(false);
    }
  };

  // Trigger Autonomous Cycle
  const handleTriggerAgentCycle = async () => {
    setIsAgentRunning(true);
    showToast("Cycle d'Agent Démarré", "L'agent examine les flux d'offres en direct...");

    // Find first unapplied job above threshold
    const candidateJob = jobs.find(j => !applications.some(a => a.jobTitle === j.title && a.company === j.company)) || jobs[0];

    if (candidateJob) {
      await handleInstantAutoApply(candidateJob);
    } else {
      setTimeout(() => {
        setIsAgentRunning(false);
        showToast("Veille terminée", "Toutes les offres actuelles ont déjà été traitées.");
      }, 1500);
    }
  };

  const handleSaveProfile = async (updated: UserProfile) => {
    setIsSavingProfile(true);
    setUserProfile(updated);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updated);
      } catch (e) {
        console.error("Save profile error:", e);
      }
    }
    setIsSavingProfile(false);
    showToast("Profil Enregistré", "Le profil maître est à jour et prêt pour l'adaptation de vos CV LaTeX.");
  };

  const handleUpdateAppStatus = async (appId: string, newStatus: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    if (currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid, 'applications', appId), {
          status: newStatus
        });
      } catch (err) {
        console.error("Firestore app update error:", err);
      }
    }
    showToast("Statut mis à jour", `Dossier déplacé dans l'étape ${newStatus}.`);
  };

  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const interviewCount = applications.filter(a => a.status === 'interview').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenCvUpload={() => {
          setIsMandatoryOnboarding(false);
          setCvUploadModalOpen(true);
        }}
        autoApplyActive={userProfile.autoApplyEnabled}
        appliedCount={appliedCount}
        interviewCount={interviewCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* SUB-VIEW 1: LIVE RADAR (CHASSEUR D'OFFRES TEMPS RÉEL) */}
        {currentTab === 'radar' && (
          <LiveRadarView
            jobs={jobs}
            userProfile={userProfile}
            onSelectJobForLatex={(job) => setSelectedJobForLatex(job)}
            onInstantAutoApply={handleInstantAutoApply}
            onRefreshLiveJobs={handleFetchLiveJobs}
            isLoadingJobs={isLoadingJobs}
            onOpenCvUpload={() => {
              setIsMandatoryOnboarding(false);
              setCvUploadModalOpen(true);
            }}
          />
        )}

        {/* SUB-VIEW 2: AGENT AUTOMATION (LE PILOTE AUTOMATIQUE) */}
        {currentTab === 'agent' && (
          <AgentAutomationView
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile(prev => ({ ...prev, ...updated }))}
            onTriggerAgentCycle={handleTriggerAgentCycle}
            isAgentRunning={isAgentRunning}
            agentLogs={agentLogs}
            onGoToInterviews={() => setCurrentTab('interview')}
            appliedCount={appliedCount}
          />
        )}

        {/* SUB-VIEW 3: STUDIO LATEX & OVERLEAF (DIRECT VIEW) */}
        {currentTab === 'latex' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FileCode2 className="w-6 h-6 text-indigo-600" />
                  Studio de Personnalisation LaTeX & Overleaf
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Choisissez une offre ci-dessous pour générer le code source LaTeX (`.tex`) et l'ouvrir en 1 clic dans Overleaf.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-indigo-400 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {job.contractType}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                    <p className="text-xs font-semibold text-indigo-600">{job.company}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
                  </div>

                  <button
                    onClick={() => setSelectedJobForLatex(job)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all border border-indigo-200"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    Ouvrir l'Éditeur LaTeX & Overleaf
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-VIEW 4: KANBAN CRM */}
        {currentTab === 'kanban' && (
          <KanbanCrmView
            applications={applications}
            onOpenLatexForApp={(app) => {
              const matchedJob = jobs.find(j => j.title === app.jobTitle) || {
                id: app.jobId,
                title: app.jobTitle,
                company: app.company,
                location: app.location,
                contractType: app.contractType,
                remote: 'hybride',
                description: "Poste suivi dans votre CRM",
                skillsRequired: app.matchedKeywords,
                source: "Direct ATS",
                applyUrl: app.jobUrl,
                publishedAt: "Récemment"
              };
              setSelectedJobForLatex(matchedJob);
            }}
            onOpenInterviewPrep={(app) => setSelectedAppForInterview(app)}
            onUpdateAppStatus={handleUpdateAppStatus}
          />
        )}

        {/* SUB-VIEW 5: COCKPIT ENTRETIENS */}
        {currentTab === 'interview' && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
                    <Award className="w-3.5 h-3.5" />
                    Focus Candidat • Préparation d'Entretien
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Cockpit de Préparation d'Entretiens
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    L'agent s'est occupé de postuler. C'est votre moment de briller ! Entraînez-vous avec les 10 questions pièges, le pitch 90s et l'analyse stratégique de l'entreprise.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {app.company}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {app.status === 'interview' ? '🎉 Entretien' : 'Postulé'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{app.jobTitle}</h3>
                    <p className="text-xs text-slate-400">{app.location}</p>
                  </div>

                  <button
                    onClick={() => setSelectedAppForInterview(app)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Lancer la Préparation de l'Entretien
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-VIEW 6: MASTER PROFILE */}
        {currentTab === 'profile' && (
          <MasterProfileView
            userProfile={userProfile}
            onSaveProfile={handleSaveProfile}
            isSaving={isSavingProfile}
            currentUser={currentUser}
            onOpenAuthModal={(mode) => {
              setAuthModalMode(mode);
              setAuthModalOpen(true);
            }}
            onOpenCvUpload={() => {
              setIsMandatoryOnboarding(false);
              setCvUploadModalOpen(true);
            }}
          />
        )}

      </main>

      {/* AUTHENTICATION & ACCOUNT CREATION MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
        onSuccess={(user, isNewAccount) => {
          setCurrentUser(user);
          if (isNewAccount) {
            showToast("Compte créé avec succès !", "Bienvenue ! Veuillez maintenant déposer votre CV pour que l'IA l'analyse.");
            setIsMandatoryOnboarding(true);
            setCvUploadModalOpen(true);
          } else {
            showToast("Connexion réussie", "Ravi de vous revoir ! Vos données sont synchronisées.");
          }
        }}
      />

      {/* CV UPLOAD & ONBOARDING ANALYSIS MODAL */}
      <CvUploadModal
        isOpen={cvUploadModalOpen}
        onClose={() => {
          setCvUploadModalOpen(false);
          setIsMandatoryOnboarding(false);
        }}
        currentProfile={userProfile}
        isMandatoryOnboarding={isMandatoryOnboarding}
        onSaveProfile={async (updated) => {
          await handleSaveProfile(updated);
          showToast("Profil actualisé avec succès", "Vos compétences et expériences extraites du CV ont été enregistrées !");
        }}
      />

      {/* LATEX STUDIO MODAL */}
      {selectedJobForLatex && (
        <LatexStudioModal
          job={selectedJobForLatex}
          userProfile={userProfile}
          onClose={() => setSelectedJobForLatex(null)}
          onApplyWithLatex={(job, latexCode, coverLetter, matchScore) => {
            const newApp: Application = {
              id: `app-${Date.now()}`,
              userId: currentUser?.uid || userProfile.userId,
              jobId: job.id,
              jobTitle: job.title,
              company: job.company,
              location: job.location,
              contractType: job.contractType,
              jobUrl: job.applyUrl,
              matchScore,
              status: 'applied',
              appliedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              matchedKeywords: job.skillsRequired,
              latexResumeCode: latexCode,
              coverLetter,
              overleafSnippetUrl: 'https://www.overleaf.com/docs',
              logEvents: [
                { timestamp: new Date().toLocaleTimeString('fr-FR'), message: "Candidature soumise avec CV LaTeX sur mesure" }
              ]
            };
            setApplications(prev => [newApp, ...prev]);
            showToast("Candidature Enregistrée", `Dossier soumis pour ${job.company}.`);
          }}
        />
      )}

      {/* INTERVIEW COCKPIT MODAL */}
      {selectedAppForInterview && (
        <InterviewCockpitModal
          application={selectedAppForInterview}
          userProfile={userProfile}
          onClose={() => setSelectedAppForInterview(null)}
        />
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-3 max-w-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-white">{toastMessage.title}</p>
            <p className="text-slate-300 mt-0.5">{toastMessage.desc}</p>
          </div>
        </div>
      )}

    </div>
  );
}
