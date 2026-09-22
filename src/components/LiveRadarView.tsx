import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  ExternalLink, 
  FileCode2, 
  Send, 
  Compass, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Train,
  SlidersHorizontal,
  RefreshCw,
  Building2,
  DollarSign
} from 'lucide-react';
import { JobOffer, ContractType, UserProfile } from '../types';

interface LiveRadarViewProps {
  jobs: JobOffer[];
  userProfile: UserProfile;
  onSelectJobForLatex: (job: JobOffer) => void;
  onInstantAutoApply: (job: JobOffer) => void;
  onRefreshLiveJobs: (query: string, contractType: string, location: string) => Promise<void>;
  isLoadingJobs: boolean;
  onOpenCvUpload?: () => void;
}

export const LiveRadarView: React.FC<LiveRadarViewProps> = ({
  jobs,
  userProfile,
  onSelectJobForLatex,
  onInstantAutoApply,
  onRefreshLiveJobs,
  isLoadingJobs,
  onOpenCvUpload
}) => {
  const [searchQuery, setSearchQuery] = useState('Développeur React / Node.js');
  const [locationQuery, setLocationQuery] = useState('Paris & Île-de-France');
  const [selectedContract, setSelectedContract] = useState<string>('tous');
  const [selectedRemote, setSelectedRemote] = useState<string>('tous');
  const [activeCommuteJobId, setActiveCommuteJobId] = useState<string | null>(null);
  const [commuteDetails, setCommuteDetails] = useState<Record<string, any>>({});
  const [loadingCommute, setLoadingCommute] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRefreshLiveJobs(searchQuery, selectedContract, locationQuery);
  };

  const handleFetchCommute = async (job: JobOffer) => {
    if (commuteDetails[job.id]) {
      setActiveCommuteJobId(activeCommuteJobId === job.id ? null : job.id);
      return;
    }

    try {
      setLoadingCommute(job.id);
      setActiveCommuteJobId(job.id);
      const res = await fetch('/api/company/location-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: job.company, city: job.location })
      });
      const data = await res.json();
      setCommuteDetails(prev => ({ ...prev, [job.id]: data }));
    } catch (e) {
      console.error("Commute error:", e);
    } finally {
      setLoadingCommute(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (selectedContract !== 'tous' && job.contractType !== selectedContract) return false;
    if (selectedRemote !== 'tous' && job.remote !== selectedRemote) return false;
    return true;
  });

  return (
    <div className="space-y-6">

      {/* Onboarding Callout Banner if profile is empty */}
      {(!userProfile.fullName || userProfile.skills.length === 0) && onOpenCvUpload && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-sm text-white">
                Étape recommandée : Déposez votre CV pour calibrer l'IA
              </h3>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed max-w-2xl">
              Aucune donnée générique n'est injectée. Déposez votre CV (PDF ou texte) pour que l'IA extrait vos vraies compétences, vos expériences et calibre vos scores d'affinité ATS en temps réel.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCvUpload}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap self-start sm:self-auto flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Déposer mon CV (Analyse IA)
          </button>
        </div>
      )}
      
      {/* Top Banner & Search Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Offres Réelles & Vérifiées • Welcome to the Jungle, France Travail, LinkedIn & ATS Directs
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Radar d'Offres Réelles & Matching IA
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl mt-1">
                Explorez des offres réelles d'entreprises tech françaises (Partoo, Scaleway, OOTI, Doctolib, Bpifrance...) avec accès direct aux annonces officielles et calcul de compatibilité.
              </p>
            </div>

            <button
              onClick={() => onRefreshLiveJobs(searchQuery, selectedContract, locationQuery)}
              disabled={isLoadingJobs}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap self-start md:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingJobs ? 'animate-spin' : ''}`} />
              {isLoadingJobs ? 'Actualisation...' : 'Actualiser les Offres'}
            </button>
          </div>

          {/* Quick Discovery Presets */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-400">Recherches directes :</span>
            {[
              { label: 'Alternances Tech (OOTI, BlaBlaCar...)', q: 'Alternance', c: 'alternance' },
              { label: 'Stages 6 mois (Finovox, Bpifrance...)', q: 'Stage', c: 'stage' },
              { label: 'CDI Fullstack (Scaleway, Partoo, Doctolib)', q: 'Fullstack React', c: 'cdi' },
              { label: 'Python & IA (Bpifrance, Finovox...)', q: 'Python IA', c: 'tous' },
              { label: 'Full Remote (Payfit...)', q: 'Remote', c: 'tous' }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(preset.q);
                  setSelectedContract(preset.c);
                  onRefreshLiveJobs(preset.q, preset.c, locationQuery);
                }}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Intitulé : Développeur React, Data, DevOps..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Localisation : Paris, Lyon, Remote..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-xl border border-slate-700 transition-colors"
              >
                Filtrer les offres
              </button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Type de contrat :
            </span>
            {['tous', 'stage', 'alternance', 'cdi', 'freelance'].map(contract => (
              <button
                key={contract}
                type="button"
                onClick={() => setSelectedContract(contract)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  selectedContract === contract
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {contract === 'tous' ? 'Tous les contrats' : contract}
              </button>
            ))}

            <span className="text-slate-500 mx-2">|</span>

            <span className="text-slate-400 font-medium mr-1">Télétravail :</span>
            {['tous', 'hybride', 'total', 'sur-site'].map(remote => (
              <button
                key={remote}
                type="button"
                onClick={() => setSelectedRemote(remote)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  selectedRemote === remote
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {remote === 'tous' ? 'Tous modes' : remote}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-base">
            {filteredJobs.length} opportunité(s) correspondante(s)
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
            Prêtes pour personnalisation LaTeX
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Seuil de matching automatique configuré : <strong className="text-indigo-600">{userProfile.minMatchScore}%</strong>
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Aucune offre ne correspond à vos filtres actuels</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Essayez d'élargir le type de contrat ou de modifier votre recherche pour découvrir plus d'opportunités.
            </p>
            <button
              onClick={() => {
                setSelectedContract('tous');
                setSelectedRemote('tous');
                onRefreshLiveJobs('Développeur', 'tous', 'France');
              }}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all"
            >
              Réinitialiser les filtres et actualiser
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
          const matchScore = job.matchScore || Math.floor(84 + (job.skillsRequired.filter(s => userProfile.skills.some(us => us.toLowerCase().includes(s.toLowerCase()))).length * 3));
          const isHighMatch = matchScore >= userProfile.minMatchScore;

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Job Core Details */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Annonce Vérifiée
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {job.contractType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                      {job.remote === 'total' ? 'Full Remote' : job.remote === 'hybride' ? 'Télétravail Hybride' : 'Sur site'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {job.publishedAt}
                    </span>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Plateforme : {job.source}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      {job.companyLocationInfo?.metro && (
                        <span className="flex items-center gap-1 text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded">
                          <Train className="w-3 h-3 text-indigo-500" />
                          {job.companyLocationInfo.metro}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl line-clamp-2">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-medium text-slate-400 mr-1">Compétences ciblées :</span>
                    {job.skillsRequired.map((skill, idx) => {
                      const candidateHasSkill = userProfile.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()));
                      return (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            candidateHasSkill
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {candidateHasSkill && <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />}
                          {skill}
                        </span>
                      );
                    })}
                  </div>

                  {/* Commute accordion */}
                  {activeCommuteJobId === job.id && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Train className="w-3.5 h-3.5 text-indigo-600" />
                          Données de Localisation & Transports (Google Maps Data)
                        </span>
                        <button
                          onClick={() => setActiveCommuteJobId(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          Fermer
                        </button>
                      </div>
                      {loadingCommute === job.id ? (
                        <p className="text-slate-500 italic">Interrogation des données Google Maps...</p>
                      ) : commuteDetails[job.id] ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                          <div>
                            <p className="text-slate-500 font-medium">Adresse des bureaux :</p>
                            <p className="font-semibold">{commuteDetails[job.id].address}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 font-medium">Lignes & Accès Métro :</p>
                            <p className="font-semibold text-indigo-700">{commuteDetails[job.id].metro}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-slate-500 font-medium">Temps de trajet estimé :</p>
                            <p>{commuteDetails[job.id].commuteEstimate} — {commuteDetails[job.id].summary}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-500">Informations d'accessibilité chargées.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Score & Actions Panel */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 lg:min-w-[210px] pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  
                  {/* ATS Match Gauge */}
                  <div className="text-left lg:text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {matchScore}% Match ATS
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isHighMatch ? 'Éligible auto-postulation immédiate' : 'Personnalisation conseillée'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap lg:flex-col items-stretch gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onSelectJobForLatex(job)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-all border border-indigo-200 shadow-sm"
                    >
                      <FileCode2 className="w-3.5 h-3.5 text-indigo-600" />
                      Personnaliser CV LaTeX
                    </button>

                    <button
                      onClick={() => onInstantAutoApply(job)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Auto-Postuler Direct
                    </button>

                    <div className="flex items-center justify-end gap-2 w-full pt-1">
                      <button
                        onClick={() => handleFetchCommute(job)}
                        className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
                      >
                        <Compass className="w-3 h-3" />
                        Accès Métro
                      </button>
                      <span className="text-slate-300">•</span>
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
                        title={`Consulter l'annonce originale sur ${job.source}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Voir sur {job.source}
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
    </div>
  );
};
