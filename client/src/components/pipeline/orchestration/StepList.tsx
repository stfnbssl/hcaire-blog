import StepRow from './StepRow';
import type { EnrichedStepState, StepConfig } from '../../../types/pipeline';

interface StepListProps {
  stepConfig: StepConfig[];
  stepStates: Record<string, EnrichedStepState>;
  contextType: 'tema' | 'ricerca';
  onLaunch: (stepId: string) => void;
  onCancel: (stepId: string, executionId: string) => void;
  onVerify: (stepId: string, executionId: string) => void;
  onProvideInput: (stepId: string) => void;
  onViewLogs: (stepId: string, executionId: string) => void;
  onSkip: (stepId: string) => void;
  onDecide: () => void;
  onShowHistory: (stepId: string) => void;
  onRollback: (stepId: string) => void;
  onViewOutput: (stepId: string, executionId: string) => void;
}

export default function StepList(props: StepListProps) {
  const phase = props.contextType === 'tema' ? 'F3' : 'F2';
  const filtered = props.stepConfig.filter((s) => s.phase === phase);

  return (
    <div className="space-y-2">
      {filtered.map((cfg) => {
        const state = props.stepStates[cfg.id];
        if (!state) {
          return (
            <div key={cfg.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              {cfg.label} — caricamento stato…
            </div>
          );
        }
        return (
          <StepRow
            key={cfg.id}
            state={state}
            onLaunch={() => props.onLaunch(cfg.id)}
            onCancel={() => state.last_execution_id && props.onCancel(cfg.id, state.last_execution_id)}
            onVerify={() => state.last_execution_id && props.onVerify(cfg.id, state.last_execution_id)}
            onProvideInput={() => props.onProvideInput(cfg.id)}
            onViewLogs={() => state.last_execution_id && props.onViewLogs(cfg.id, state.last_execution_id)}
            onSkip={() => props.onSkip(cfg.id)}
            onDecide={() => props.onDecide()}
            onShowHistory={() => props.onShowHistory(cfg.id)}
            onRollback={() => props.onRollback(cfg.id)}
            onViewOutput={() => state.last_execution_id && props.onViewOutput(cfg.id, state.last_execution_id)}
          />
        );
      })}
    </div>
  );
}
