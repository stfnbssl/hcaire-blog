import WorkflowLog from '../models/WorkflowLog';
import ArticleRequest from '../models/ArticleRequest';
import type { LogStep, LogActor } from '../models/ArticleRequest';

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
      WorkflowLog.create({ articleRequestId, testoPreview, step, actor, message, requestStatus }),
      newStatus ? ArticleRequest.findByIdAndUpdate(articleRequestId, { status: newStatus }) : Promise.resolve(),
    ]);
  } catch (err) {
    console.error('[WorkflowLogger] Errore scrittura log:', err);
  }
}
