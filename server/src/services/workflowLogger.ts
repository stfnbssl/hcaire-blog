import WorkflowLog from '../models/WorkflowLog';
import ArticleRequest from '../models/ArticleRequest';
import InputTrace from '../models/bartleby/InputTrace';
import type { LogStep, LogActor } from '../models/ArticleRequest';
import { sendTelegramAlert } from './telegramBot';

const PREVIEW_LENGTH = 80;

export async function logWorkflow(
  articleRequestId: string,
  step: LogStep,
  actor: LogActor,
  message: string,
  newStatus?: string
): Promise<void> {
  try {
    const request = await ArticleRequest.findById(articleRequestId).select('testo status');
    if (!request) return;

    const testoPreview = request.testo.length > PREVIEW_LENGTH
      ? request.testo.slice(0, PREVIEW_LENGTH) + '…'
      : request.testo;

    const requestStatus = newStatus ?? request.status;

    await Promise.all([
      WorkflowLog.create({ workflow_type: 'article', articleRequestId, testoPreview, step, actor, message, requestStatus }),
      newStatus ? ArticleRequest.findByIdAndUpdate(articleRequestId, { status: newStatus }) : Promise.resolve(),
    ]);
  } catch (err) {
    console.error('[WorkflowLogger] Errore scrittura log:', err);
  }
}

const BARTLEBY_ERROR_STEPS: LogStep[] = ['worker_error'];

export async function logBartlebyWorkflow(
  traceId: string,
  step: LogStep,
  actor: LogActor,
  message: string,
  newStatus?: string
): Promise<void> {
  try {
    const trace = await InputTrace.findOne({
      $or: [{ bartlebyId: traceId }, { _id: traceId.match(/^[a-f\d]{24}$/i) ? traceId : null }],
    }).select('raw_text status').lean();

    const rawText = (trace as { raw_text?: string } | null)?.raw_text ?? '';
    const testoPreview = rawText.length > PREVIEW_LENGTH
      ? rawText.slice(0, PREVIEW_LENGTH) + '…'
      : rawText;

    const requestStatus = newStatus ?? (trace as { status?: string } | null)?.status ?? 'pending';

    await Promise.all([
      WorkflowLog.create({ workflow_type: 'bartleby', traceId, testoPreview, step, actor, message, requestStatus }),
      newStatus
        ? InputTrace.updateOne(
            { $or: [{ bartlebyId: traceId }, { _id: traceId.match(/^[a-f\d]{24}$/i) ? traceId : null }] },
            { status: newStatus }
          )
        : Promise.resolve(),
    ]);

    if (BARTLEBY_ERROR_STEPS.includes(step)) {
      await sendTelegramAlert(
        `⚠️ <b>Bartleby — errore pipeline</b>\n` +
        `Traccia: <code>${traceId}</code>\n` +
        `Step: <code>${step}</code>\n` +
        `${message}`
      );
    }
  } catch (err) {
    console.error('[WorkflowLogger/Bartleby] Errore scrittura log:', err);
  }
}
