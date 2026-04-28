import type { ExecutionStatus } from '../../../types/pipeline';

const CONFIG: Record<ExecutionStatus, { color: string; icon: string; label: string }> = {
  non_avviato:         { color: 'bg-slate-100 text-slate-600 border-slate-200',   icon: '○',  label: 'Non avviato' },
  attende_input:       { color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: '✎',  label: 'Fornire input' },
  attende_decisione:   { color: 'bg-amber-50 text-amber-800 border-amber-200',    icon: '⏳', label: 'Decisione richiesta' },
  in_coda:             { color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: '⋯',  label: 'In coda' },
  in_esecuzione:       { color: 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse', icon: '⟳', label: 'In esecuzione' },
  completato:          { color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '✓', label: 'Completato' },
  in_verifica:         { color: 'bg-amber-50 text-amber-800 border-amber-200',    icon: '◎',  label: 'In verifica' },
  verificato:          { color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: '✓✓', label: 'Verificato' },
  richiede_correzione: { color: 'bg-red-50 text-red-700 border-red-200',          icon: '✗',  label: 'Da correggere' },
  saltato:             { color: 'bg-slate-100 text-slate-500 border-slate-200',   icon: '—',  label: 'Saltato' },
  fallito:             { color: 'bg-red-50 text-red-800 border-red-300',          icon: '✗',  label: 'Fallito' },
};

export default function StepStatusBadge({ status }: { status: ExecutionStatus }) {
  const c = CONFIG[status] ?? CONFIG.non_avviato;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded border ${c.color}`}>
      <span aria-hidden>{c.icon}</span>
      <span>{c.label}</span>
    </span>
  );
}
