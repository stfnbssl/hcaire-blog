import { useEffect, useState } from 'react';
import StepList from './StepList';
import ExternalInputForm from './ExternalInputForm';
import ExecutionLogViewer from './ExecutionLogViewer';
import ExecutionOutputViewer from './ExecutionOutputViewer';
import VerificationPanel from './VerificationPanel';
import PendingDecisionBanner from './PendingDecisionBanner';
import HumanDecisionDialog from './HumanDecisionDialog';
import { pipelineOrchestratorService } from '../../../services/pipelineOrchestratorService';
import { useAuth } from '@clerk/clerk-react';
import type { UsePipelineOrchestrationResult } from './types';

interface OrchestrationPanelProps {
  temaId: string;
  orchestration: UsePipelineOrchestrationResult;
}

interface ModalState {
  inputForm: { stepId: string } | null;
  decisionDialog: boolean;
  verify: { stepId: string; executionId: string } | null;
  logs: { stepId: string; executionId: string } | null;
  skipPrompt: { stepId: string } | null;
  history: { stepId: string } | null;
  output: { stepId: string; executionId: string } | null;
}

export default function OrchestrationPanel({ temaId, orchestration }: OrchestrationPanelProps) {
  const { getToken } = useAuth();
  const [coworkActive, setCoworkActive] = useState<boolean | null>(null);
  const [coworkInfo, setCoworkInfo] = useState<{ active_executions: number } | null>(null);
  const [modal, setModal] = useState<ModalState>({
    inputForm: null,
    decisionDialog: false,
    verify: null,
    logs: null,
    skipPrompt: null,
    history: null,
    output: null,
  });

  // System status (ping Cowork) — una sola volta al mount
  useEffect(() => {
    pipelineOrchestratorService.getSystemStatus(getToken)
      .then((s) => { setCoworkActive(s.cowork_server.active); setCoworkInfo({ active_executions: s.cowork_server.active_executions }); })
      .catch(() => setCoworkActive(false));
  }, [getToken]);

  const ctx = orchestration.context;
  if (orchestration.isLoading && !ctx) {
    return (
      <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" /></div>
    );
  }
  if (orchestration.error) {
    return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">{orchestration.error}</div>;
  }
  if (!ctx) return null;

  return (
    <div className="space-y-6">
      {/* Header generale */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-slate-500">Tema:</span>
        <span className="font-semibold text-slate-900">{ctx.label}</span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500">{ctx.steps_completed.length} step completati</span>
        {ctx.robustezza && (
          <>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">Robustezza: <span className="font-semibold text-slate-800">{ctx.robustezza}</span></span>
          </>
        )}
        {(ctx.correzioni_residue ?? 0) > 0 && (
          <>
            <span className="text-slate-300">·</span>
            <span className="text-orange-700">{ctx.correzioni_residue} correzioni residue</span>
          </>
        )}
        <div className="flex-1" />
        {coworkActive === null && <span className="text-xs text-slate-400">Cowork: verifica…</span>}
        {coworkActive === true && (
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            Cowork attivo {coworkInfo ? `· ${coworkInfo.active_executions} run` : ''}
          </span>
        )}
        {coworkActive === false && (
          <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
            Cowork non raggiungibile
          </span>
        )}
      </div>

      {/* Pending decision banner */}
      {ctx.pending_decision && (
        <PendingDecisionBanner
          decision={ctx.pending_decision}
          onOpenDialog={() => setModal((m) => ({ ...m, decisionDialog: true }))}
        />
      )}

      {/* Lista step */}
      <StepList
        stepConfig={orchestration.stepConfig}
        stepStates={orchestration.stepStates}
        contextType={ctx.context_type}
        onLaunch={async (stepId) => {
          // Se lo step ha input esterni dichiarati nel config, il lancio passa SEMPRE
          // dal form — anche se gli input erano già forniti (es. dopo "Annulla esecuzione"
          // di una run precedente). L'utente vede i valori pre-compilati e può rivedere
          // prima di rilanciare. L'OK del form fa save + runStep.
          const stepCfg = orchestration.stepConfig.find((s) => s.id === stepId);
          const hasExternalInputs = (stepCfg?.inputs_esterni ?? []).length > 0;
          if (hasExternalInputs) {
            setModal((m) => ({ ...m, inputForm: { stepId } }));
            return;
          }
          try {
            const result = await orchestration.runStep(stepId);
            // Se il viewer log è già aperto su un'altra run, switch alla nuova così
            // l'utente vede subito lo streaming del nuovo step senza riaprirlo a mano.
            setModal((m) => m.logs ? { ...m, logs: { stepId, executionId: result.execution_id } } : m);
          } catch (e) {
            alert(`Errore: ${(e as Error).message}`);
          }
        }}
        onCancel={async (_stepId, executionId) => {
          if (!confirm('Cancellare questa esecuzione?')) return;
          try {
            await orchestration.cancelExecution(executionId);
          } catch (e) {
            alert(`Errore: ${(e as Error).message}`);
          }
        }}
        onVerify={(stepId, executionId) => setModal((m) => ({ ...m, verify: { stepId, executionId } }))}
        onProvideInput={(stepId) => setModal((m) => ({ ...m, inputForm: { stepId } }))}
        onViewLogs={(stepId, executionId) => setModal((m) => ({ ...m, logs: { stepId, executionId } }))}
        onSkip={(stepId) => setModal((m) => ({ ...m, skipPrompt: { stepId } }))}
        onDecide={() => setModal((m) => ({ ...m, decisionDialog: true }))}
        onShowHistory={(stepId) => setModal((m) => ({ ...m, history: { stepId } }))}
        onViewOutput={(stepId, executionId) => setModal((m) => ({ ...m, output: { stepId, executionId } }))}
        onRollback={async (stepId) => {
          const state = orchestration.stepStates[stepId];
          const label = state?.label ?? stepId;
          const msg = `Annullare l'esecuzione di "${label}"?\n\nLo step verrà riportato a "non avviato" e potrà essere rilanciato. Lo storico run resta visibile.`;
          if (!confirm(msg)) return;
          try {
            await orchestration.resetStep(stepId);
          } catch (e) {
            const errMsg = (e as Error).message;
            const detail = (e as { detail?: { blocking?: { step_id: string; status: string }[] } }).detail;
            if (detail?.blocking && detail.blocking.length > 0) {
              alert(
                `Impossibile annullare ${stepId}: gli step a valle non sono stati ancora resettati.\n\n` +
                detail.blocking.map((b) => `• ${b.step_id} (${b.status})`).join('\n') +
                `\n\nAnnulla prima quegli step in ordine inverso.`,
              );
            } else {
              alert(`Errore: ${errMsg}`);
            }
          }
        }}
      />

      {/* Skip dialog (semplice prompt) */}
      {modal.skipPrompt && (
        <SkipDialog
          stepId={modal.skipPrompt.stepId}
          onClose={() => setModal((m) => ({ ...m, skipPrompt: null }))}
          onConfirm={async (reason) => {
            try {
              await orchestration.skipStep(modal.skipPrompt!.stepId, reason);
              setModal((m) => ({ ...m, skipPrompt: null }));
            } catch (e) {
              alert(`Errore: ${(e as Error).message}`);
            }
          }}
        />
      )}

      {/* Modal completi (task 23-26 in progressione) */}
      {modal.inputForm && (() => {
        const stepCfg = orchestration.stepConfig.find((s) => s.id === modal.inputForm!.stepId);
        const inputCfg = stepCfg?.inputs_esterni ?? [];
        const existing = orchestration.externalInputs.filter((i) => i.step_id === modal.inputForm!.stepId);
        return (
          <ExternalInputForm
            stepId={modal.inputForm.stepId}
            contextId={ctx.context_id}
            inputConfig={inputCfg}
            existingInputs={existing}
            onSubmit={async (inputId, data) => {
              const stepId = modal.inputForm!.stepId;
              await orchestration.submitExternalInput(stepId, inputId, data);
              // OK del form = save + run. Se runStep fallisce l'input è comunque
              // salvato e l'utente può ritentare riaprendo il form.
              try {
                const result = await orchestration.runStep(stepId);
                // Se il viewer log è aperto, switch al nuovo execution_id.
                setModal((m) => m.logs ? { ...m, logs: { stepId, executionId: result.execution_id } } : m);
              } catch (e) {
                alert(`Input salvato ma errore al lancio: ${(e as Error).message}`);
              }
            }}
            onClose={() => setModal((m) => ({ ...m, inputForm: null }))}
          />
        );
      })()}
      {modal.logs && (() => {
        const state = orchestration.stepStates[modal.logs.stepId];
        return (
          <ExecutionLogViewer
            executionId={modal.logs.executionId}
            stepId={modal.logs.stepId}
            stepLabel={state?.label ?? modal.logs.stepId}
            runNumber={state?.current_run}
            onClose={() => setModal((m) => ({ ...m, logs: null }))}
            onGoToVerify={() => setModal((m) => ({ ...m, logs: null, verify: { stepId: modal.logs!.stepId, executionId: modal.logs!.executionId } }))}
          />
        );
      })()}
      {modal.verify && (() => {
        const state = orchestration.stepStates[modal.verify.stepId];
        return (
          <VerificationPanel
            executionId={modal.verify.executionId}
            stepId={modal.verify.stepId}
            stepLabel={state?.label ?? modal.verify.stepId}
            runNumber={state?.current_run}
            outputFile={state?.output_file ?? null}
            onVerify={async (outcome, notes, feedback) => {
              await orchestration.verifyExecution(modal.verify!.executionId, outcome, notes, feedback);
            }}
            onClose={() => setModal((m) => ({ ...m, verify: null }))}
          />
        );
      })()}
      {modal.decisionDialog && ctx.pending_decision && (
        <HumanDecisionDialog
          decision={ctx.pending_decision}
          context={ctx}
          orchestration={orchestration}
          onSubmitContextDecision={(confirmed, notes) => orchestration.submitTemaDecision(confirmed, notes)}
          onClose={() => setModal((m) => ({ ...m, decisionDialog: false }))}
        />
      )}
      {modal.history && (
        <StubModal title={`Storico ${modal.history.stepId}`} onClose={() => setModal((m) => ({ ...m, history: null }))}>
          History viewer — TODO.
        </StubModal>
      )}
      {modal.output && (() => {
        const state = orchestration.stepStates[modal.output.stepId];
        return (
          <ExecutionOutputViewer
            executionId={modal.output.executionId}
            stepId={modal.output.stepId}
            stepLabel={state?.label ?? modal.output.stepId}
            runNumber={state?.current_run}
            onClose={() => setModal((m) => ({ ...m, output: null }))}
          />
        );
      })()}
    </div>
  );
}

function SkipDialog({ stepId, onClose, onConfirm }: { stepId: string; onClose: () => void; onConfirm: (reason: string) => void | Promise<void> }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5">
        <h3 className="font-semibold text-slate-900 mb-2">Salta {stepId}</h3>
        <p className="text-sm text-slate-600 mb-3">Indica la motivazione dello skip (verrà registrata nel log decisionale).</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          placeholder="Motivazione…"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Annulla</button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="text-sm px-3 py-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
          >Conferma skip</button>
        </div>
      </div>
    </div>
  );
}

function StubModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <p className="text-sm text-slate-600">{children}</p>
      </div>
    </div>
  );
}
