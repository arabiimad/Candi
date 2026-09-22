import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Building2, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Volume2, 
  X, 
  Copy, 
  Check, 
  Send,
  Lightbulb,
  ShieldAlert
} from 'lucide-react';
import { Application, InterviewPrepKit, UserProfile } from '../types';

interface InterviewCockpitModalProps {
  application: Application | null;
  userProfile: UserProfile;
  onClose: () => void;
}

export const InterviewCockpitModal: React.FC<InterviewCockpitModalProps> = ({
  application,
  userProfile,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'pitch' | 'questions' | 'simulator' | 'questionsToAsk'>('synthesis');
  const [prepKit, setPrepKit] = useState<InterviewPrepKit | null>(application?.interviewPrep || null);
  const [loadingKit, setLoadingKit] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Mock interview interactive sandbox
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userDraftAnswer, setUserDraftAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    verdict: string;
    starBreakdown?: {
      situation?: string;
      task?: string;
      action?: string;
      result?: string;
    };
    strengths?: string[];
    improvements?: string[];
    improvedSample?: string;
  } | null>(null);

  React.useEffect(() => {
    if (application && !prepKit) {
      handleFetchPrepKit();
    }
  }, [application]);

  const handleFetchPrepKit = async () => {
    if (!application) return;
    setLoadingKit(true);
    try {
      const res = await fetch('/api/interview/prep-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate: userProfile,
          job: {
            title: application.jobTitle,
            company: application.company,
            description: "Offre d'emploi ciblée pour développeur",
            skillsRequired: application.matchedKeywords
          }
        })
      });
      const data = await res.json();
      setPrepKit(data);
    } catch (e) {
      console.error("Prep kit load error:", e);
    } finally {
      setLoadingKit(false);
    }
  };

  const handleCopyPitch = () => {
    if (!prepKit?.elevatorPitch) return;
    navigator.clipboard.writeText(prepKit.elevatorPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleEvaluateAnswer = async () => {
    if (!userDraftAnswer.trim() || !prepKit) return;
    setEvaluating(true);
    try {
      const currentQuestion = prepKit.topQuestions[selectedQuestionIndex];
      const res = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: userDraftAnswer,
          jobTitle: application?.jobTitle,
          company: application?.company,
          candidateName: userProfile.fullName
        })
      });
      const data = await res.json();
      setEvaluationResult(data);
    } catch (e) {
      console.error("Evaluation error:", e);
    } finally {
      setEvaluating(false);
    }
  };

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white">
                  Cockpit de Préparation d'Entretien
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  {application.company}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Poste : <strong className="text-slate-200">{application.jobTitle}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('synthesis')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'synthesis' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Synthèse Entreprise & Enjeux
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'pitch' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Mon Pitch 90s
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'questions' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Questions Clés & Réponses STAR
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'simulator' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Simulateur Entraînement IA
          </button>
          <button
            onClick={() => setActiveTab('questionsToAsk')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'questionsToAsk' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5. Questions à Poser au Recruteur
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          
          {loadingKit ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">L'IA génère votre kit d'entretien sur mesure pour {application.company}...</p>
            </div>
          ) : !prepKit ? (
            <div className="text-center py-12 text-slate-500">
              <p>Impossible de charger le kit d'entretien pour le moment.</p>
              <button
                onClick={handleFetchPrepKit}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              
              {/* TAB 1: SYNTHESIS */}
              {activeTab === 'synthesis' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      Portrait Rapide de {application.company}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {prepKit.companySynthesis.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
                      <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Défis Techniques & Métier Principaux
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {prepKit.companySynthesis.coreChallenges.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
                      <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Valeurs Culturelles & Profil Recherché
                      </h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {prepKit.companySynthesis.culturalValues.map((v, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ELEVATOR PITCH */}
              {activeTab === 'pitch' && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Votre Présentation d'Ouverture en 90 Secondes
                      </h3>
                      <p className="text-xs text-slate-500">
                        Réponse idéale à : "Pouvez-vous vous présenter en quelques mots ?"
                      </p>
                    </div>
                    <button
                      onClick={handleCopyPitch}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedPitch ? 'Copié !' : 'Copier le pitch'}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-serif italic">
                    "{prepKit.elevatorPitch}"
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Conseil de coach :</p>
                      <p className="text-amber-800 mt-0.5">
                        Ne récitez pas votre CV chronologiquement. Insistez sur le "Pourquoi vous" et "Pourquoi {application.company}", avec enthousiasme et clarté.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: QUESTIONS & STAR ANSWERS */}
              {activeTab === 'questions' && (
                <div className="space-y-3">
                  {prepKit.topQuestions.map((q, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{q.question}</h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                          {q.category}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          Ce que cherche à tester le recruteur :
                        </span>
                        <p className="text-slate-600">{q.whyTheyAsk}</p>
                      </div>

                      <div className="text-xs space-y-1">
                        <span className="font-bold text-emerald-800">Trame de réponse conseillée :</span>
                        <p className="text-slate-700 leading-relaxed">{q.suggestedAnswer}</p>
                      </div>

                      {q.keyPoints && q.keyPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {q.keyPoints.map((kp, kpi) => (
                            <span key={kpi} className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                              ✓ {kp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SIMULATOR / INTERACTIVE MOCK */}
              {activeTab === 'simulator' && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Simulateur d'Entraînement en Direct (Feedback IA)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Entraînez-vous à répondre à l'écrit, et l'IA analyse la pertinence de vos arguments avant votre véritable rendez-vous.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Choisissez la question à travailler :</label>
                    <select
                      value={selectedQuestionIndex}
                      onChange={(e) => {
                        setSelectedQuestionIndex(Number(e.target.value));
                        setEvaluationResult(null);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      {prepKit.topQuestions.map((q, idx) => (
                        <option key={idx} value={idx}>
                          Q{idx + 1} : {q.question}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Votre réponse préparée :</label>
                    <textarea
                      value={userDraftAnswer}
                      onChange={(e) => setUserDraftAnswer(e.target.value)}
                      placeholder="Structurez votre réponse (Situation, Tâche, Action concrète, Résultat)..."
                      rows={5}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !userDraftAnswer.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {evaluating ? 'Analyse de votre réponse en cours...' : 'Évaluer ma réponse avec l\'IA'}
                  </button>

                  {evaluationResult && (
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <h4 className="font-bold text-sm text-white">Analyse Coaching IA</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                          Score : {evaluationResult.score}/10
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 italic">
                        "{evaluationResult.verdict}"
                      </p>

                      {evaluationResult.starBreakdown && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                            <span className="font-bold text-indigo-400 block mb-0.5">S - Situation :</span>
                            <span className="text-slate-300">{evaluationResult.starBreakdown.situation}</span>
                          </div>
                          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                            <span className="font-bold text-indigo-400 block mb-0.5">T - Tâche :</span>
                            <span className="text-slate-300">{evaluationResult.starBreakdown.task}</span>
                          </div>
                          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                            <span className="font-bold text-indigo-400 block mb-0.5">A - Action :</span>
                            <span className="text-slate-300">{evaluationResult.starBreakdown.action}</span>
                          </div>
                          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                            <span className="font-bold text-indigo-400 block mb-0.5">R - Résultat :</span>
                            <span className="text-slate-300">{evaluationResult.starBreakdown.result}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
                          <div className="space-y-1">
                            <span className="font-bold text-emerald-400">Points forts :</span>
                            <ul className="space-y-1">
                              {evaluationResult.strengths.map((str, i) => (
                                <li key={i} className="text-slate-300 flex items-start gap-1.5">
                                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {evaluationResult.improvements && evaluationResult.improvements.length > 0 && (
                          <div className="space-y-1">
                            <span className="font-bold text-amber-400">Axes de perfectionnement :</span>
                            <ul className="space-y-1">
                              {evaluationResult.improvements.map((imp, i) => (
                                <li key={i} className="text-slate-300 flex items-start gap-1.5">
                                  <span className="text-amber-400 font-bold shrink-0">→</span>
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {evaluationResult.improvedSample && (
                        <div className="pt-2 border-t border-slate-800 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-300">Reformulation recommandée par le coach :</span>
                            <button
                              type="button"
                              onClick={() => setUserDraftAnswer(evaluationResult.improvedSample || '')}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-semibold"
                            >
                              Copier dans ma réponse
                            </button>
                          </div>
                          <p className="p-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700/80 leading-relaxed font-sans">
                            {evaluationResult.improvedSample}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: QUESTIONS TO ASK */}
              {activeTab === 'questionsToAsk' && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Questions Intelligentes à Poser au Recruteur
                    </h3>
                    <p className="text-xs text-slate-500">
                      En fin d'entretien, poser des questions techniques et stratégiques montre votre maturité et vous démarque immédiatement.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {prepKit.smartQuestionsToAskInterviewer.map((q, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <p className="font-semibold text-slate-800">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Bonne chance pour votre entretien chez <strong className="text-slate-700">{application.company}</strong> !
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
          >
            Fermer le Cockpit
          </button>
        </div>

      </div>
    </div>
  );
};
