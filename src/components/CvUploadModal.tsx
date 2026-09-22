import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  X, 
  RotateCcw, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Globe, 
  Check, 
  ArrowRight,
  FileCheck,
  Edit3
} from 'lucide-react';
import { UserProfile, Experience, Education, Project, ContractType } from '../types';

interface CvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => Promise<void>;
  isMandatoryOnboarding?: boolean;
}

export const CvUploadModal: React.FC<CvUploadModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  isMandatoryOnboarding = false
}) => {
  const [step, setStep] = useState<'upload' | 'confirm' | 'success'>('upload');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<UserProfile>(currentProfile);
  const [newSkill, setNewSkill] = useState<string>('');
  const [newLanguage, setNewLanguage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysisError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setAnalysisError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const readFileAsBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(f);
    });
  };

  const readFileAsText = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(f);
    });
  };

  const handleStartAnalysis = async () => {
    setAnalysisError(null);

    if (inputMode === 'file' && !file) {
      setAnalysisError('Veuillez sélectionner ou déposer un fichier de CV (PDF, Word ou Texte).');
      return;
    }

    if (inputMode === 'text' && !cvText.trim()) {
      setAnalysisError('Veuillez copier/coller le texte de votre CV dans le champ prévu.');
      return;
    }

    setIsAnalyzing(true);

    try {
      let payload: { fileBase64?: string; mimeType?: string; cvText?: string } = {};

      if (inputMode === 'file' && file) {
        const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
        const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md');

        if (isText) {
          const textContent = await readFileAsText(file);
          payload = { cvText: textContent };
        } else {
          // Read base64 (works natively for PDF & documents)
          const base64Content = await readFileAsBase64(file);
          payload = {
            fileBase64: base64Content,
            mimeType: isPdf ? 'application/pdf' : (file.type || 'application/pdf')
          };
        }
      } else {
        payload = { cvText: cvText.trim() };
      }

      const res = await fetch('/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data: any = null;
      try {
        const rawText = await res.text();
        data = JSON.parse(rawText);
      } catch {
        if (!res.ok) {
          throw new Error(`Le service d'analyse a rencontré une erreur temporaire (${res.status}). Veuillez réessayer.`);
        }
        throw new Error("Réponse inattendue reçue du serveur d'analyse.");
      }

      if (!res.ok || !data?.success || !data?.profile) {
        throw new Error(data?.error || `Impossible d'extraire les données du CV (${res.status}).`);
      }

      const p = data.profile;

      // Merge cleanly into user profile format, preserving existing auth metadata
      const preparedProfile: UserProfile = {
        ...currentProfile,
        fullName: p.fullName?.trim() || currentProfile.fullName || '',
        email: p.email?.trim() || currentProfile.email || '',
        phone: p.phone?.trim() || currentProfile.phone || '',
        title: p.title?.trim() || currentProfile.title || 'Développeur',
        location: p.location?.trim() || currentProfile.location || 'France',
        linkedinUrl: p.linkedinUrl?.trim() || currentProfile.linkedinUrl || '',
        githubUrl: p.githubUrl?.trim() || currentProfile.githubUrl || '',
        portfolioUrl: p.portfolioUrl?.trim() || currentProfile.portfolioUrl || '',
        summary: p.summary?.trim() || currentProfile.summary || '',
        skills: Array.isArray(p.skills) && p.skills.length > 0 ? p.skills : currentProfile.skills,
        experiences: Array.isArray(p.experiences) && p.experiences.length > 0 
          ? p.experiences.map((exp: any, idx: number) => ({
              id: exp.id || `exp-${Date.now()}-${idx}`,
              title: exp.title || 'Poste',
              company: exp.company || 'Entreprise',
              location: exp.location || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              current: !!exp.current,
              bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
              technologies: Array.isArray(exp.technologies) ? exp.technologies : []
            }))
          : currentProfile.experiences,
        education: Array.isArray(p.education) && p.education.length > 0
          ? p.education.map((edu: any, idx: number) => ({
              id: edu.id || `edu-${Date.now()}-${idx}`,
              degree: edu.degree || 'Formation',
              institution: edu.institution || 'Établissement',
              year: edu.year || '',
              details: edu.details || ''
            }))
          : currentProfile.education,
        projects: Array.isArray(p.projects) && p.projects.length > 0
          ? p.projects.map((proj: any, idx: number) => ({
              id: proj.id || `proj-${Date.now()}-${idx}`,
              name: proj.name || 'Projet',
              description: proj.description || '',
              technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
              link: proj.link || ''
            }))
          : currentProfile.projects,
        languages: Array.isArray(p.languages) && p.languages.length > 0 
          ? p.languages 
          : (currentProfile.languages.length > 0 ? currentProfile.languages : ['Français', 'Anglais']),
        targetRoles: Array.isArray(p.targetRoles) && p.targetRoles.length > 0
          ? p.targetRoles
          : (p.title ? [p.title] : currentProfile.targetRoles)
      };

      setExtractedProfile(preparedProfile);
      setStep('confirm');

    } catch (err: any) {
      console.error("Analysis failure:", err);
      setAnalysisError(err.message || "Une erreur est survenue lors de l'analyse du document.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAndSave = async () => {
    setIsSaving(true);
    try {
      await onSaveProfile(extractedProfile);
      setStep('success');
    } catch (err) {
      console.error("Save error:", err);
      setAnalysisError("Impossible d'enregistrer le profil dans la base de données.");
    } finally {
      setIsSaving(false);
    }
  };

  // Add / remove skill helpers
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!extractedProfile.skills.includes(newSkill.trim())) {
      setExtractedProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setExtractedProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Add / remove language
  const handleAddLanguage = () => {
    if (!newLanguage.trim()) return;
    if (!extractedProfile.languages.includes(newLanguage.trim())) {
      setExtractedProfile(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
    }
    setNewLanguage('');
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setExtractedProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== langToRemove)
    }));
  };

  // Experiences helpers
  const handleUpdateExperience = (index: number, field: keyof Experience, value: any) => {
    setExtractedProfile(prev => {
      const copy = [...prev.experiences];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, experiences: copy };
    });
  };

  const handleRemoveExperience = (index: number) => {
    setExtractedProfile(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      title: 'Nouveau Poste',
      company: 'Entreprise',
      location: 'Paris',
      startDate: '2023',
      endDate: 'Présent',
      current: true,
      technologies: ['React', 'TypeScript'],
      bullets: ['Responsabilités et missions accomplies.']
    };
    setExtractedProfile(prev => ({
      ...prev,
      experiences: [newExp, ...prev.experiences]
    }));
  };

  // Education helpers
  const handleRemoveEducation = (index: number) => {
    setExtractedProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: 'Diplôme ou Formation',
      institution: 'Établissement',
      year: '2024',
      details: ''
    };
    setExtractedProfile(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const handleToggleContract = (contract: ContractType) => {
    const current = extractedProfile.preferredContracts || [];
    const next = current.includes(contract)
      ? current.filter(c => c !== contract)
      : [...current, contract];
    setExtractedProfile(prev => ({ ...prev, preferredContracts: next }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {step === 'upload' && 'Dépôt de votre CV & Analyse IA'}
                {step === 'confirm' && 'Confirmation des Informations Extraites'}
                {step === 'success' && 'Profil Prêt & Validé'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {step === 'upload' && 'Vos vraies données uniquement — Aucune donnée générique ou fictive.'}
                {step === 'confirm' && "Vérifiez attentivement les données extraites par l'IA avant enregistrement."}
                {step === 'success' && 'Votre base de connaissances candidat est synchronisée.'}
              </p>
            </div>
          </div>

          {!isMandatoryOnboarding && step !== 'confirm' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-6">
              
              {/* Informational banner */}
              <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3.5">
                <FileCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 space-y-1">
                  <p className="font-bold">Extraction 100% Fidèle et Personnalisée</p>
                  <p className="text-indigo-800 leading-relaxed">
                    Déposez votre CV au format PDF, Word ou copiez son texte. L'IA extrait automatiquement vos vraies coordonnées, expériences, formations et compétences techniques pour créer votre profil sur mesure.
                  </p>
                </div>
              </div>

              {/* Mode switch tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setInputMode('file')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    inputMode === 'file'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  Importer un fichier (PDF, Word, TXT)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    inputMode === 'text'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Coller le texte du CV
                </button>
              </div>

              {/* Input Mode: File Dropzone */}
              {inputMode === 'file' && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                    file
                      ? 'border-indigo-400 bg-indigo-50/30'
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf,.md,image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                    {file ? <FileCheck className="w-7 h-7 text-indigo-600" /> : <UploadCloud className="w-7 h-7" />}
                  </div>

                  <div>
                    {file ? (
                      <div>
                        <p className="text-sm font-bold text-slate-900">{file.name}</p>
                        <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                          {(file.size / 1024).toFixed(1)} Ko • Prêt pour l'analyse IA
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">Cliquez pour choisir un autre fichier</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Glissez-déposez votre CV ici, ou <span className="text-indigo-600 underline">parcourez vos fichiers</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Formats supportés : PDF, DOCX, TXT (Taille max : 15 Mo)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Input Mode: Text Area */}
              {inputMode === 'text' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Collez l'intégralité du texte de votre CV :
                  </label>
                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    rows={8}
                    placeholder="Collez ici les sections de votre CV : Nom, coordonnées, expériences professionnelles, diplômes, compétences techniques, etc."
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <p className="text-[11px] text-slate-400">
                    Astuce : Ouvrez votre CV ou profil LinkedIn, sélectionnez tout le texte (Ctrl+A), copiez et collez-le ici.
                  </p>
                </div>
              )}

              {analysisError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-700 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end gap-3 pt-2">
                {!isMandatoryOnboarding && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                  >
                    Annuler
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || (inputMode === 'file' && !file) || (inputMode === 'text' && !cvText.trim())}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyse IA en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Analyser mon CV avec l'IA</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: CONFIRMATION & EDITING */}
          {step === 'confirm' && (
            <div className="space-y-6">
              
              {/* Highlight Confirmation Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold text-amber-950">
                    Étape de validation requise
                  </p>
                  <p className="text-amber-800 leading-relaxed">
                    L'IA a extrait les informations ci-dessous directement depuis votre CV. Vérifiez qu'elles sont exactes et apportez d'éventuelles corrections avant de valider votre profil.
                  </p>
                </div>
              </div>

              {/* Section 1: Identity & Contact */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 text-indigo-600">
                  <Edit3 className="w-4 h-4" />
                  1. Identité & Coordonnées Extraites
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nom Complet :</label>
                    <input
                      type="text"
                      value={extractedProfile.fullName}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, fullName: e.target.value })}
                      placeholder="Ex: Ayman Hakim"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Titre Professionnel Détecté :</label>
                    <input
                      type="text"
                      value={extractedProfile.title}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, title: e.target.value })}
                      placeholder="Ex: Développeur Fullstack React / Node.js"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email :</label>
                    <input
                      type="email"
                      value={extractedProfile.email}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, email: e.target.value })}
                      placeholder="email@exemple.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Téléphone :</label>
                    <input
                      type="text"
                      value={extractedProfile.phone}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, phone: e.target.value })}
                      placeholder="+33 6 ..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Ville & Mobilité :</label>
                    <input
                      type="text"
                      value={extractedProfile.location}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, location: e.target.value })}
                      placeholder="Paris, France (Remote)"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Profil LinkedIn :</label>
                    <input
                      type="text"
                      value={extractedProfile.linkedinUrl}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, linkedinUrl: e.target.value })}
                      placeholder="linkedin.com/in/..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Profil GitHub :</label>
                    <input
                      type="text"
                      value={extractedProfile.githubUrl}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, githubUrl: e.target.value })}
                      placeholder="github.com/..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Site Web / Portfolio :</label>
                    <input
                      type="text"
                      value={extractedProfile.portfolioUrl}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, portfolioUrl: e.target.value })}
                      placeholder="mon-site.dev"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Identifiant Overleaf (Optionnel) :</label>
                    <input
                      type="text"
                      value={extractedProfile.overleafUser}
                      onChange={(e) => setExtractedProfile({ ...extractedProfile, overleafUser: e.target.value })}
                      placeholder="pseudo_overleaf"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 text-indigo-600">
                  <FileText className="w-4 h-4" />
                  2. Synthèse Professionnelle / Accroche
                </h3>
                <textarea
                  value={extractedProfile.summary}
                  onChange={(e) => setExtractedProfile({ ...extractedProfile, summary: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="Brève présentation extraite du CV..."
                />
              </div>

              {/* Section 3: Skills */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 text-indigo-600">
                    <Code2 className="w-4 h-4" />
                    3. Compétences Techniques & Outils Détectés ({extractedProfile.skills.length})
                  </h3>
                </div>

                {/* Add new skill inline */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    placeholder="Ajouter une compétence (ex: Docker, Rust, Tailwind...)"
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                  {extractedProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-400 hover:text-rose-600 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {extractedProfile.skills.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Aucune compétence listée. Ajoutez-en via le champ ci-dessus.</p>
                  )}
                </div>
              </div>

              {/* Section 4: Experiences */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 text-indigo-600">
                    <Briefcase className="w-4 h-4" />
                    4. Expériences Professionnelles ({extractedProfile.experiences.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter une expérience
                  </button>
                </div>

                <div className="space-y-4">
                  {extractedProfile.experiences.map((exp, idx) => (
                    <div key={exp.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs">Expérience #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Supprimer cette expérience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Poste :</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleUpdateExperience(idx, 'title', e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Entreprise :</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Dates :</label>
                          <input
                            type="text"
                            value={`${exp.startDate} - ${exp.endDate}`}
                            onChange={(e) => {
                              const parts = e.target.value.split('-');
                              handleUpdateExperience(idx, 'startDate', parts[0]?.trim() || '');
                              handleUpdateExperience(idx, 'endDate', parts[1]?.trim() || '');
                            }}
                            placeholder="2022 - 2024"
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600 block mb-1">Technologies :</label>
                          <input
                            type="text"
                            value={exp.technologies.join(', ')}
                            onChange={(e) => handleUpdateExperience(idx, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            placeholder="React, Node.js..."
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1">Réalisations & Puces :</label>
                        <textarea
                          value={exp.bullets.join('\n')}
                          onChange={(e) => handleUpdateExperience(idx, 'bullets', e.target.value.split('\n').filter(Boolean))}
                          rows={2}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none text-[11px]"
                          placeholder="Une réalisation par ligne..."
                        />
                      </div>
                    </div>
                  ))}
                  {extractedProfile.experiences.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Aucune expérience renseignée.</p>
                  )}
                </div>
              </div>

              {/* Section 5: Education */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 text-indigo-600">
                    <GraduationCap className="w-4 h-4" />
                    5. Formations & Diplômes ({extractedProfile.education.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter une formation
                  </button>
                </div>

                <div className="space-y-3">
                  {extractedProfile.education.map((edu, idx) => (
                    <div key={edu.id || idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const copy = [...extractedProfile.education];
                            copy[idx] = { ...copy[idx], degree: e.target.value };
                            setExtractedProfile({ ...extractedProfile, education: copy });
                          }}
                          placeholder="Diplôme"
                          className="p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const copy = [...extractedProfile.education];
                            copy[idx] = { ...copy[idx], institution: e.target.value };
                            setExtractedProfile({ ...extractedProfile, education: copy });
                          }}
                          placeholder="Établissement"
                          className="p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const copy = [...extractedProfile.education];
                            copy[idx] = { ...copy[idx], year: e.target.value };
                            setExtractedProfile({ ...extractedProfile, education: copy });
                          }}
                          placeholder="Année"
                          className="p-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {extractedProfile.education.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Aucune formation listée.</p>
                  )}
                </div>
              </div>

              {/* Section 6: Target Contracts */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">
                  6. Types de Contrats Recherchés
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(['stage', 'alternance', 'cdi', 'cdd', 'freelance'] as ContractType[]).map((c) => {
                    const active = extractedProfile.preferredContracts?.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleToggleContract(c)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Confirmation Bar */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  ← Re-déposer un autre document
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Confirmer et Enregistrer mon Profil</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="text-center py-8 px-4 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Profil Validé avec Succès !
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Votre profil maître a été enregistré avec vos données réelles. L'IA utilisera désormais vos compétences et votre parcours authentique pour faire matcher les offres et compiler vos CV LaTeX dans Overleaf.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700">
                <span className="font-bold text-slate-900">{extractedProfile.fullName}</span> • {extractedProfile.title}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  <span>Accéder au Radar d'Offres</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
