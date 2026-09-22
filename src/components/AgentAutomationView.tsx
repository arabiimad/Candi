import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Send,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserProfile, JobOffer, AgentLog } from '../types';

interface AgentAutomationViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onTriggerAgentCycle: () => Promise<void>;
  isAgentRunning: boolean;
  agentLogs: AgentLog[];
  onGoToInterviews: () => void;
  appliedCount: number;
}

export const AgentAutomationView: React.FC<AgentAutomationViewProps> = ({
  userProfile,
  onUpdateProfile,
  onTriggerAgentCycle,
  isAgentRunning,
  agentLogs,
  onGoToInterviews,
  appliedCount
}) => {
  const [autoMode, setAutoMode] = useState<'full' | 'semi'>(userProfile.autoApplyEnabled ? 'full' : 'semi');
  const [minScore, setMinScore] = useState<number>(userProfile.minMatchScore || 85);
  const [maxDaily, setMaxDaily] = useState<number>(10);

  const handleToggleAutoApply = () => {
    const nextState = !userProfile.autoApplyEnabled;
    onUpdateProfile({ autoApplyEnabled: nextState });
  };

  const handleScoreChange = (score: number) => {
    setMinScore(score);
    onUpdateProfile({ minMatchScore: score });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Système Autonome de Détection & Soumission
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Pilote Automatique de Candidatures
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Dès qu'une opportunité correspondante est publiée sur le web, l'agent adapte instantanément votre CV en LaTeX, rédige la lettre de motivation et soumet le dossier à votre place.
            </p>
          </div>

          {/* Master Switch */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between lg:min-w-[280px]">
            <div>
              <p className="text-xs text-slate-400 font-medium">Statut du Robot</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${userProfile.autoApplyEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                {userProfile.autoApplyEnabled ? 'Agent Actif (En Veille)' : 'Agent en Pause'}
              </p>
            </div>
            <button
              onClick={handleToggleAutoApply}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                userProfile.autoApplyEnabled
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {userProfile.autoApplyEnabled ? 'Mettre en pause' : 'Activer le Pilote'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Settings & Agent Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Mode Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              Mode de Soumission
            </h3>

            <div className="space-y-2">
              <label
                onClick={() => setAutoMode('full')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  autoMode === 'full'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="automode"
                  checked={autoMode === 'full'}
                  onChange={() => setAutoMode('full')}
                  className="mt-1 text-indigo-600"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">100% Autonome (Zéro intervention)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    L'agent détecte, génère le CV LaTeX et postule immédiatement sans attendre votre validation.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setAutoMode('semi')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  autoMode === 'semi'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="automode"
                  checked={autoMode === 'semi'}
                  onChange={() => setAutoMode('semi')}
                  className="mt-1 text-indigo-600"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Semi-Automatique (Human-in-the-Loop)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Le dossier complet (CV LaTeX + Lettre) est préparé et prêt. Vous le validez en un seul clic.
                  </p>
                </div>
              </label>
            </div>

            {/* Threshold Slider */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Seuil de Matching ATS Minimal :</span>
                <span className="font-bold text-indigo-600 text-sm">{minScore}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={98}
                value={minScore}
                onChange={(e) => handleScoreChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400">
                Seules les offres ayant une pertinence supérieure à {minScore}% déclencheront une postulation.
              </p>
            </div>

            {/* Daily Quota */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-700">Plafond de sécurité journalier :</p>
                <p className="text-[10px] text-slate-400">Évite les blocages et garantit un taux qualitatif élevé</p>
              </div>
              <select
                value={maxDaily}
                onChange={(e) => setMaxDaily(Number(e.target.value))}
                className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              >
                <option value={5}>5 / jour</option>
                <option value={10}>10 / jour</option>
                <option value={15}>15 / jour</option>
                <option value={25}>25 / jour</option>
              </select>
            </div>

            {/* Trigger Button */}
            <button
              onClick={onTriggerAgentCycle}
              disabled={isAgentRunning}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:from-slate-700 disabled:to-slate-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
            >
              {isAgentRunning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Cycle d'Agent en cours d'exécution...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Déclencher un Cycle d'Auto-Candidature Maintenant
                </>
              )}
            </button>
          </div>

          {/* Value Prop Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Objectif Candidat : 100% Focus Entretiens
            </div>
            <p className="leading-relaxed text-emerald-800/90 text-[11px]">
              Tant que l'agent postule en tâche de fond, vous recevez automatiquement les fiches de révision et les simulateurs d'entretien pour chaque opportunité décrochée.
            </p>
            <button
              onClick={onGoToInterviews}
              className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 pt-1 text-[11px]"
            >
              Accéder au Cockpit de Préparation <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Right Column: Live Terminal / Agent Activity Logs */}
        <div className="lg:col-span-7">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full min-h-[460px]">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Console d'Exécution de l'Agent Autonome</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Daemon actif
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs text-slate-300 pr-1 max-h-[380px]">
              {agentLogs.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <Bot className="w-8 h-8 text-slate-600" />
                  <p>Aucun log récent. Cliquez sur "Déclencher un Cycle" pour lancer l'agent.</p>
                </div>
              ) : (
                agentLogs.map((log) => {
                  let badgeColor = 'text-slate-400';
                  if (log.type === 'scan') badgeColor = 'text-sky-400';
                  if (log.type === 'match') badgeColor = 'text-amber-400';
                  if (log.type === 'latex') badgeColor = 'text-indigo-400';
                  if (log.type === 'apply') badgeColor = 'text-rose-400';
                  if (log.type === 'success') badgeColor = 'text-emerald-400';

                  return (
                    <div key={log.id} className="flex items-start gap-2.5 py-1 border-b border-slate-900/80">
                      <span className="text-slate-600 text-[10px] whitespace-nowrap pt-0.5">
                        {log.timestamp}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 ${badgeColor}`}>
                        [{log.type}]
                      </span>
                      <p className="flex-1 leading-relaxed text-slate-200">
                        {log.message}
                        {log.company && (
                          <span className="text-indigo-400 font-bold ml-1">
                            @{log.company}
                          </span>
                        )}
                        {log.score && (
                          <span className="text-emerald-400 font-bold ml-1">
                            ({log.score}% ATS)
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Terminal Footer */}
            <div className="border-t border-slate-800 pt-3 mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Flux actifs : France Travail, LinkedIn, WTTJ, Greenhouse</span>
              <span>Total soumis : <strong className="text-emerald-400">{appliedCount}</strong></span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
