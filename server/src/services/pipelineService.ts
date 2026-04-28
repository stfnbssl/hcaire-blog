import PipelineContext, { IPipelineContext } from '../models/PipelineContext';
import PipelineStepExecution from '../models/PipelineStepExecution';
import PipelineExternalInput from '../models/PipelineExternalInput';
import {
  mapRicercaContext,
  mapTemaContext,
  type RicercaIndexEntry,
  type TemaIndexEntry,
  type MapperContextTema,
  type MapperContextShared,
} from './pipelineMappers';

export type {
  CanonicalDeviceShape,
  RicercaIndexEntry,
  TemaIndexEntry,
} from './pipelineMappers';

export interface PipelineIndex {
  generated_at: string;
  ricerche: RicercaIndexEntry[];
  temi: TemaIndexEntry[];
}

export async function contextToRicercaIndexEntry(ctx: IPipelineContext): Promise<RicercaIndexEntry> {
  return mapRicercaContext(ctx as unknown as MapperContextShared);
}

export async function contextToTemaIndexEntry(ctx: IPipelineContext): Promise<TemaIndexEntry> {
  const [skippedExecs, externalInputs] = await Promise.all([
    PipelineStepExecution.find(
      { context_id: ctx.context_id, is_skipped: true },
      { step_id: 1, skip_reason: 1 },
    ).lean(),
    PipelineExternalInput.find(
      { context_id: ctx.context_id, is_superseded: false },
      { step_id: 1, label: 1, file_path: 1 },
    ).lean(),
  ]);
  return mapTemaContext(
    ctx as unknown as MapperContextTema,
    skippedExecs.map((e) => ({ step_id: e.step_id, skip_reason: e.skip_reason })),
    externalInputs.map((i) => ({ step_id: i.step_id, label: i.label, file_path: i.file_path })),
  );
}

export async function getPipelineIndex(): Promise<PipelineIndex> {
  const [ricercheCtx, temiCtx] = await Promise.all([
    PipelineContext.find({ context_type: 'ricerca' }).sort({ context_id: 1 }),
    PipelineContext.find({ context_type: 'tema' }).sort({ context_id: 1 }),
  ]);
  const ricerche = await Promise.all(ricercheCtx.map((c) => contextToRicercaIndexEntry(c)));
  const temi = await Promise.all(temiCtx.map((c) => contextToTemaIndexEntry(c)));
  return { generated_at: new Date().toISOString(), ricerche, temi };
}
