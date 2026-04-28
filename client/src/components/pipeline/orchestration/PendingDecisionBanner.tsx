import type { HumanDecision } from '../../../types/pipeline';

interface PendingDecisionBannerProps {
  decision: HumanDecision;
  onOpenDialog: () => void;
}

const TITLE_BY_TYPE: Record<HumanDecision['type'], string> = {
  f2_to_f3_tema_selection: 'Selezione tema da portare in F3',
  step7_context_selection: 'Definizione contesto del dispositivo',
};

export default function PendingDecisionBanner({ decision, onOpenDialog }: PendingDecisionBannerProps) {
  return (
    <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
      <span className="text-2xl flex-shrink-0" aria-hidden>🔔</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-amber-900 mb-1">
          Decisione richiesta: {TITLE_BY_TYPE[decision.type] ?? decision.type}
        </p>
        <p className="text-sm text-amber-800">{decision.description}</p>
      </div>
      <button
        onClick={onOpenDialog}
        className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-sm px-3 py-1.5 rounded-md"
      >Prendi decisione →</button>
    </div>
  );
}
