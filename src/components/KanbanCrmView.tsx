import React from 'react';
import { 
  Trello, 
  FileCode2, 
  Send, 
  Award, 
  Building2, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Application, ApplicationStatus, JobOffer } from '../types';

interface KanbanCrmViewProps {
  applications: Application[];
  onOpenLatexForApp: (app: Application) => void;
  onOpenInterviewPrep: (app: Application) => void;
  onUpdateAppStatus: (appId: string, newStatus: ApplicationStatus) => void;
}

const COLUMNS: { id: ApplicationStatus; title: string; color: string; badge: string }[] = [
  { id: 'detected', title: '1. Détectées par IA', color: 'border-slate-300 bg-slate-50', badge: 'bg-slate-200 text-slate-700' },
  { id: 'prepared', title: '2. CV & Lettre Prêts', color: 'border-indigo-300 bg-indigo-50/30', badge: 'bg-indigo-100 text-indigo-700' },
  { id: 'applied', title: '3. Postulées (Auto)', color: 'border-sky-300 bg-sky-50/30', badge: 'bg-sky-100 text-sky-700' },
  { id: 'interview', title: '4. Entretiens Décrochés', color: 'border-emerald-300 bg-emerald-50/40', badge: 'bg-emerald-100 text-emerald-800' },
  { id: 'offer', title: '5. Offres Reçues', color: 'border-amber-300 bg-amber-50/30', badge: 'bg-amber-100 text-amber-800' }
];

export const KanbanCrmView: React.FC<KanbanCrmViewProps> = ({
  applications,
  onOpenLatexForApp,
  onOpenInterviewPrep,
  onUpdateAppStatus
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trello className="w-6 h-6 text-indigo-600" />
            CRM Pipeline des Candidatures
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Suivi temps réel de chaque opportunité, de l'ingestion jusqu'à l'entretien final.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <span>Total suivi : {applications.length} poste(s)</span>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((app) => app.status === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-2xl border ${col.color} p-3.5 flex flex-col min-w-[240px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-bold text-xs text-slate-800">{col.title}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                  {colApps.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1">
                {colApps.length === 0 ? (
                  <div className="h-28 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400 text-center p-3">
                    Aucun dossier dans cette étape
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl border border-slate-200 hover:border-indigo-400 p-3.5 shadow-sm hover:shadow transition-all space-y-2.5 text-xs group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {app.contractType}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {app.matchScore}% ATS
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {app.jobTitle}
                        </h4>
                        <p className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-indigo-500" />
                          {app.company}
                        </p>
                        <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {app.location}
                        </p>
                      </div>

                      {/* Log or date info */}
                      {app.appliedAt && (
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Postulé le {new Date(app.appliedAt).toLocaleDateString('fr-FR')}
                        </p>
                      )}

                      {/* Actions depending on stage */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                        
                        {/* Interview CTA if reached interview */}
                        {col.id === 'interview' && (
                          <button
                            onClick={() => onOpenInterviewPrep(app)}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                          >
                            <Award className="w-3.5 h-3.5" />
                            Kit Entretien Débloqué
                          </button>
                        )}

                        {/* Open LaTeX in Overleaf */}
                        <button
                          onClick={() => onOpenLatexForApp(app)}
                          className="w-full flex items-center justify-center gap-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
                        >
                          <FileCode2 className="w-3 h-3 text-indigo-600" />
                          Voir CV LaTeX / Overleaf
                        </button>

                        {/* Quick state transitions */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Changer :</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {col.id !== 'prepared' && (
                              <button
                                onClick={() => onUpdateAppStatus(app.id, 'prepared')}
                                className="hover:text-indigo-600 underline font-medium"
                              >
                                CV Prêt
                              </button>
                            )}
                            {col.id !== 'applied' && (
                              <button
                                onClick={() => onUpdateAppStatus(app.id, 'applied')}
                                className="hover:text-sky-600 underline font-medium"
                              >
                                Postulé
                              </button>
                            )}
                            {col.id !== 'interview' && (
                              <button
                                onClick={() => onUpdateAppStatus(app.id, 'interview')}
                                className="hover:text-emerald-600 underline font-medium"
                              >
                                Entretien 🎉
                              </button>
                            )}
                            {col.id !== 'offer' && (
                              <button
                                onClick={() => onUpdateAppStatus(app.id, 'offer')}
                                className="hover:text-amber-600 underline font-medium"
                              >
                                Offre ⭐
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
