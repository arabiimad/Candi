import React, { useState, useEffect } from 'react';
import { 
  UserCircle2, 
  Save, 
  Plus, 
  Trash2, 
  Check, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  UploadCloud
} from 'lucide-react';
import { UserProfile, ContractType } from '../types';
import { User } from 'firebase/auth';

interface MasterProfileViewProps {
  userProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => Promise<void>;
  isSaving: boolean;
  currentUser?: User | null;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onOpenCvUpload?: () => void;
}

export const MasterProfileView: React.FC<MasterProfileViewProps> = ({
  userProfile,
  onSaveProfile,
  isSaving,
  currentUser,
  onOpenAuthModal,
  onOpenCvUpload
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile]);

  const handleTextChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleToggleContract = (contract: ContractType) => {
    const current = profile.preferredContracts || [];
    const next = current.includes(contract)
      ? current.filter(c => c !== contract)
      : [...current, contract];
    setProfile(prev => ({ ...prev, preferredContracts: next }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCircle2 className="w-6 h-6 text-indigo-600" />
            Profil Maître du Candidat (Knowledge Base)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ce profil sert de base de connaissances exhaustive pour que l'IA adapte votre CV en LaTeX et rédige vos lettres de motivation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenCvUpload && (
            <button
              type="button"
              onClick={onOpenCvUpload}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-sky-50 hover:from-indigo-100 hover:to-sky-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Importer un CV (Analyse IA)
            </button>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Sauvegardé dans Firestore !
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isSaving ? 'Enregistrement Cloud...' : 'Enregistrer le Profil'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Account Cloud Status Banner */}
      {currentUser ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <div>
              <p className="font-bold text-emerald-950">
                Compte Cloud Actif : <span className="font-mono">{currentUser.email}</span>
              </p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Vos candidatures et votre profil sont automatiquement synchronisés en temps réel dans votre base Firestore.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] border border-emerald-300 self-start sm:self-auto">
            Sync Cloud OK
          </span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-indigo-950">
                Mode Session Locale (Non connecté)
              </p>
              <p className="text-indigo-700 text-[11px] mt-0.5">
                Créez un compte gratuit pour conserver vos candidatures, vos projets Overleaf et retrouver votre historique sur n'importe quel appareil.
              </p>
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              type="button"
              onClick={() => onOpenAuthModal('register')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-sm transition-all self-start sm:self-auto whitespace-nowrap"
            >
              Créer un compte candidat
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal info & Links */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2">
              Coordonnées Personnelles
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom Complet :</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleTextChange('fullName', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Titre Professionnel Souhaité :</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Adresse Email :</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleTextChange('email', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Téléphone :</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleTextChange('phone', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ville & Mobilité :</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleTextChange('location', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Links & Profiles */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-indigo-600" />
              Liens Publics & Overleaf
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Profil GitHub :</label>
                <input
                  type="text"
                  value={profile.githubUrl}
                  onChange={(e) => handleTextChange('githubUrl', e.target.value)}
                  placeholder="github.com/mon-compte"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Profil LinkedIn :</label>
                <input
                  type="text"
                  value={profile.linkedinUrl}
                  onChange={(e) => handleTextChange('linkedinUrl', e.target.value)}
                  placeholder="linkedin.com/in/mon-profil"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Identifiant Overleaf (Optionnel) :</label>
                <input
                  type="text"
                  value={profile.overleafUser}
                  onChange={(e) => handleTextChange('overleafUser', e.target.value)}
                  placeholder="mon_pseudo_overleaf"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Target Contracts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2">
              Contrats Recherchés
            </h3>

            <div className="flex flex-wrap gap-2">
              {(['stage', 'alternance', 'cdi', 'cdd', 'freelance'] as ContractType[]).map((c) => {
                const active = profile.preferredContracts?.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleToggleContract(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
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

        </div>

        {/* Right Column: Skills, Experiences, Education */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Summary / Pitch */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Résumé / Présentation Générale
            </h3>
            <textarea
              value={profile.summary}
              onChange={(e) => handleTextChange('summary', e.target.value)}
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Skills Management */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Compétences Techniques & Outils ({profile.skills.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  L'IA puise dans cette liste pour injecter les mots-clés ATS pertinents dans votre CV LaTeX.
                </p>
              </div>
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ex: Docker, Tailwind, Rust, GraphQL..."
                className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>

            {/* Tags cloud */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {profile.skills.map((skill) => (
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
            </div>
          </div>

          {/* Experiences List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Expériences Professionnelles Clés
            </h3>

            <div className="space-y-4">
              {profile.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-sm">{exp.title} — {exp.company}</span>
                    <span className="text-slate-500 text-xs font-normal">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                    {exp.bullets.map((bullet, bidx) => (
                      <li key={bidx}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {exp.technologies.map((t, ti) => (
                      <span key={ti} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Education */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b pb-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Formations
              </h3>
              <div className="space-y-2.5 text-xs">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600">{edu.institution} ({edu.year})</p>
                    {edu.details && <p className="text-[11px] text-slate-400">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b pb-2">
                <FolderGit2 className="w-4 h-4 text-indigo-600" />
                Projets Notables
              </h3>
              <div className="space-y-2.5 text-xs">
                {profile.projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900">{proj.name}</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {proj.technologies.map((t, ti) => (
                        <span key={ti} className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </form>
  );
};
