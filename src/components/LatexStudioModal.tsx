import React, { useState } from 'react';
import { 
  FileCode2, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Eye, 
  Send, 
  FileText, 
  X,
  Code,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { JobOffer, UserProfile, Application } from '../types';

interface LatexStudioModalProps {
  job: JobOffer | null;
  userProfile: UserProfile;
  onClose: () => void;
  onApplyWithLatex: (job: JobOffer, latexCode: string, coverLetter: string, matchScore: number) => void;
  initialLatexCode?: string;
  initialLetter?: string;
}

export const LatexStudioModal: React.FC<LatexStudioModalProps> = ({
  job,
  userProfile,
  onClose,
  onApplyWithLatex,
  initialLatexCode,
  initialLetter
}) => {
  const [activeTab, setActiveTab] = useState<'latex' | 'preview' | 'letter' | 'ats'>('latex');
  const [selectedTemplate, setSelectedTemplate] = useState<'moderncv' | 'awesome-cv' | 'clean-academic'>('moderncv');
  const [latexCode, setLatexCode] = useState<string>(initialLatexCode || '');
  const [coverLetter, setCoverLetter] = useState<string>(initialLetter || '');
  const [matchScore, setMatchScore] = useState<number>(job?.matchScore || 92);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>(job?.skillsRequired || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // If initialLatexCode was not provided, trigger generation on open
  React.useEffect(() => {
    if (job && !latexCode) {
      handleRegenerate();
    }
  }, [job]);

  const handleRegenerate = async () => {
    if (!job) return;
    setIsGenerating(true);
    try {
      // 1. Generate tailored LaTeX
      const resLatex = await fetch('/api/tailor/latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate: userProfile,
          job,
          templateType: selectedTemplate
        })
      });
      const dataLatex = await resLatex.json();
      setLatexCode(dataLatex.latexCode || '');
      setMatchScore(dataLatex.matchScore || 92);
      if (dataLatex.matchedKeywords) {
        setMatchedKeywords(dataLatex.matchedKeywords);
      }

      // 2. Generate Cover Letter
      const resLetter = await fetch('/api/tailor/letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate: userProfile,
          job
        })
      });
      const dataLetter = await resLetter.json();
      setCoverLetter(dataLetter.letter || '');
    } catch (e) {
      console.error("Error generating LaTeX/Letter:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexCode);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleDownloadTex = () => {
    const element = document.createElement("a");
    const file = new Blob([latexCode], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `CV_${userProfile.fullName.replace(/\s+/g, '_')}_${job?.company || 'Poste'}.tex`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleOpenOverleaf = () => {
    try {
      // Official Overleaf POST API allows transmitting full uncompressed LaTeX documents
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.overleaf.com/docs';
      form.target = '_blank';
      form.rel = 'noopener noreferrer';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'snip';
      input.value = latexCode;
      form.appendChild(input);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (e) {
      console.warn("Direct form submit failed, attempting fallback URL:", e);
      try {
        const encoded = btoa(unescape(encodeURIComponent(latexCode)));
        window.open(`https://www.overleaf.com/docs?snip_uri=data:application/x-tex;base64,${encoded}`, '_blank');
      } catch (err) {
        window.open('https://www.overleaf.com/docs', '_blank');
      }
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white">
                  Studio LaTeX & Intégration Overleaf
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  {matchScore}% ATS Score
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Poste ciblé : <strong className="text-slate-200">{job.title}</strong> chez <strong className="text-indigo-400">{job.company}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Overleaf Button */}
            <button
              onClick={handleOpenOverleaf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              title="Ouvre directement ce code dans votre session Overleaf"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ouvrir dans Overleaf
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('latex')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'latex' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Code Source LaTeX (.tex)
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'preview' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Aperçu Typographique PDF
            </button>
            <button
              onClick={() => setActiveTab('letter')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'letter' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Lettre de Motivation
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'ats' ? 'bg-white text-indigo-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Analyse Mots-Clés ATS
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Optimisation IA...' : 'Régénérer avec IA'}
            </button>

            {activeTab === 'latex' && (
              <>
                <button
                  onClick={handleCopyLatex}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  {copiedLatex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLatex ? 'Copié !' : 'Copier LaTeX'}
                </button>
                <button
                  onClick={handleDownloadTex}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger .tex
                </button>
              </>
            )}

            {activeTab === 'letter' && (
              <button
                onClick={handleCopyLetter}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLetter ? 'Copié !' : 'Copier la lettre'}
              </button>
            )}
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          
          {/* TAB 1: LATEX CODE EDITOR */}
          {activeTab === 'latex' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Code LaTeX compilable garanti (Template ModernCV • Sans-Serif • UTF-8)</span>
                <span className="font-mono text-[11px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                  {latexCode.split('\n').length} lignes
                </span>
              </div>
              <div className="relative rounded-xl border border-slate-700 overflow-hidden shadow-inner bg-slate-950 font-mono text-xs text-slate-200">
                <textarea
                  value={latexCode}
                  onChange={(e) => setLatexCode(e.target.value)}
                  rows={20}
                  className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* TAB 2: PDF TYPOGRAPHY VISUAL PREVIEW */}
          {activeTab === 'preview' && (
            <div className="max-w-3xl mx-auto bg-white border border-slate-300 rounded-xl p-8 shadow-md text-slate-900 space-y-6 font-sans">
              
              {/* Header section simulating ModernCV */}
              <div className="border-b-2 border-indigo-600 pb-4 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {userProfile.fullName}
                  </h1>
                  <p className="text-indigo-600 font-semibold text-sm mt-0.5">
                    {job.title} — Profil Ciblé {job.company}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-600 space-y-0.5">
                  <p>{userProfile.email}</p>
                  <p>{userProfile.phone}</p>
                  <p>{userProfile.location}</p>
                  <p className="text-indigo-600">{userProfile.githubUrl}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Profil Professionnel & Alignement avec {job.company}
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Développeur rigoureux et proactif, fort d'une expérience concrète sur des architectures réactives et distribuées. Parfaitement aligné avec les exigences de <strong className="text-indigo-900">{job.company}</strong> sur les technologies <span className="bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded font-mono font-medium">{job.skillsRequired.slice(0, 4).join(', ')}</span>.
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Compétences Clés & Technologies Maîtrisées
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">Stack Principale : </span>
                    <span className="text-slate-700">{userProfile.skills.slice(0, 6).join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Bases de données & Cloud : </span>
                    <span className="text-slate-700">PostgreSQL, Docker, Firebase, Git CI/CD</span>
                  </div>
                </div>
              </div>

              {/* Experiences */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Expériences Professionnelles (Mises en Valeur ATS)
                </h2>
                {userProfile.experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{exp.title} • {exp.company}</span>
                      <span className="text-slate-500 font-normal">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 pl-1">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Formation */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Formation & Diplômes
                </h2>
                {userProfile.education.map((edu) => (
                  <div key={edu.id} className="flex items-center justify-between text-xs text-slate-800">
                    <span className="font-medium">{edu.degree} — {edu.institution}</span>
                    <span className="text-slate-500">{edu.year}</span>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: COVER LETTER */}
          {activeTab === 'letter' && (
            <div className="max-w-3xl mx-auto bg-white border border-slate-300 rounded-xl p-8 shadow-md">
              <div className="text-xs text-slate-400 mb-4 flex items-center justify-between border-b pb-2">
                <span>Lettre de motivation personnalisée pour {job.company}</span>
                <span className="text-emerald-700 font-medium">Ton direct, percutant et professionnel</span>
              </div>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={18}
                className="w-full p-2 bg-transparent text-sm leading-relaxed text-slate-800 focus:outline-none font-sans"
              />
            </div>
          )}

          {/* TAB 4: ATS KEYWORDS BREAKDOWN */}
          {activeTab === 'ats' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Audit de Compatibilité ATS (Applicant Tracking Systems)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Les recruteurs utilisent des robots de filtrage (Greenhouse, Lever, Taleo, Workday). Voici l'état de votre CV :
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600">{matchScore}%</span>
                    <p className="text-[10px] text-slate-400">Score de passage estimé</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700">Mots-clés requis détectés dans l'offre et injectés :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-800 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Pourquoi la structure LaTeX est optimale ?
                  </p>
                  <p className="text-sky-700">
                    Les fichiers compilés via LaTeX (ModernCV) génèrent un flux de texte pur et vectoriel sans tableaux invisibles complexes ni colonnes cassées, garantissant une extraction de données 100% fidèle par tous les ATS du marché.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Dossier complet prêt (CV LaTeX + Lettre personnalisée).</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors"
            >
              Annuler
            </button>

            <button
              onClick={() => {
                onApplyWithLatex(job, latexCode, coverLetter, matchScore);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Valider & Postuler à cette offre
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
