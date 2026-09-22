import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Search, 
  FileCode2, 
  Send, 
  Trello, 
  Award, 
  UserCircle2, 
  LogIn, 
  LogOut,
  CheckCircle2,
  Activity,
  UserPlus,
  ChevronDown
} from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentTab: 'radar' | 'latex' | 'agent' | 'kanban' | 'interview' | 'profile';
  setCurrentTab: (tab: 'radar' | 'latex' | 'agent' | 'kanban' | 'interview' | 'profile') => void;
  currentUser: User | null;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenCvUpload?: () => void;
  autoApplyActive: boolean;
  appliedCount: number;
  interviewCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenCvUpload,
  autoApplyActive,
  appliedCount,
  interviewCount
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Agent Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  AutoPostule AI
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  LaTeX & Overleaf
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${autoApplyActive ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${autoApplyActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span>{autoApplyActive ? 'Agent Autonome Actif' : 'Mode Semi-Auto (Veille)'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-medium">{appliedCount} postulé(s)</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">{interviewCount} entretien(s)</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setCurrentTab('radar')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'radar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Radar Offres
            </button>

            <button
              onClick={() => setCurrentTab('agent')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'agent'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-amber-300" />
              Agent Autonome
            </button>

            <button
              onClick={() => setCurrentTab('latex')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'latex'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-sky-300" />
              Studio Overleaf
            </button>

            <button
              onClick={() => setCurrentTab('kanban')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Trello className="w-3.5 h-3.5" />
              CRM Candidatures
            </button>

            <button
              onClick={() => setCurrentTab('interview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'interview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-300" />
              Cockpit Entretiens
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCircle2 className="w-3.5 h-3.5" />
              Mon Profil Maître
            </button>
          </nav>

          {/* User Auth with Firebase */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            {onOpenCvUpload && (
              <button
                type="button"
                onClick={onOpenCvUpload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 hover:text-white text-xs font-semibold rounded-xl border border-indigo-500/40 transition-all shadow-sm"
                title="Déposer un CV pour analyse IA et extraction de vos données"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Déposer un CV</span>
                <span className="sm:hidden">CV</span>
              </button>
            )}

            {currentUser ? (
              <div>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-800 pl-2 pr-3 py-1.5 rounded-full border border-slate-700/80 transition-all text-left shadow-sm group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                    {currentUser.displayName ? currentUser.displayName[0] : (currentUser.email ? currentUser.email[0] : 'U')}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold leading-none text-slate-100 group-hover:text-white flex items-center gap-1.5">
                      <span>{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                    </p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Sync Firestore OK
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-white truncate">
                        {currentUser.displayName || 'Candidat AutoPostule'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate font-mono">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      {onOpenCvUpload && (
                        <button
                          onClick={() => { onOpenCvUpload(); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                        >
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          Déposer un CV (Analyse IA)
                        </button>
                      )}

                      <button
                        onClick={() => { setCurrentTab('profile'); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                      >
                        <UserCircle2 className="w-4 h-4 text-indigo-400" />
                        Mon Profil Maître & Paramètres
                      </button>

                      <button
                        onClick={() => { setCurrentTab('kanban'); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                      >
                        <Trello className="w-4 h-4 text-sky-400" />
                        CRM & Candidatures ({appliedCount})
                      </button>

                      <button
                        onClick={() => { setCurrentTab('latex'); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                      >
                        <FileCode2 className="w-4 h-4 text-emerald-400" />
                        Studio Overleaf & LaTeX
                      </button>
                    </div>

                    <div className="border-t border-slate-800 mt-2 pt-1">
                      <button
                        onClick={() => { onLogout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700/80 transition-all shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Créer un compte</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800 text-xs no-scrollbar">
          <button
            onClick={() => setCurrentTab('radar')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'radar' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
          >
            Radar Offres
          </button>
          <button
            onClick={() => setCurrentTab('agent')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'agent' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
          >
            Agent Autonome
          </button>
          <button
            onClick={() => setCurrentTab('latex')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'latex' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
          >
            Studio Overleaf
          </button>
          <button
            onClick={() => setCurrentTab('kanban')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
          >
            CRM
          </button>
          <button
            onClick={() => setCurrentTab('interview')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'interview' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
          >
            Entretiens
          </button>
          <button
            onClick={() => setCurrentTab('profile')}
            className={`px-3 py-1 rounded-md whitespace-nowrap ${currentTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
          >
            Profil
          </button>
        </div>
      </div>
    </header>
  );
};
