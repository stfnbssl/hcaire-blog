import mongoose, { Schema, Document } from 'mongoose';

export type AssiRebuildStatus = 'in_coda' | 'in_esecuzione' | 'completato' | 'fallito';
export type AssiLogLevel = 'info' | 'warn' | 'error';

export const ASSI_REBUILD_STATI: AssiRebuildStatus[] = [
  'in_coda', 'in_esecuzione', 'completato', 'fallito',
];

export interface IAssiLogLine {
  ts: Date;
  text: string;
  level: AssiLogLevel;
}

export interface IAssiRebuildExecution extends Document {
  status: AssiRebuildStatus;
  triggered_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  log_lines: IAssiLogLine[];
  axes_updated: string[];
  error: string | null;
  triggered_by: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const LogLineSchema = new Schema<IAssiLogLine>(
  {
    ts: { type: Date, required: true, default: Date.now },
    text: { type: String, required: true },
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  },
  { _id: false },
);

const AssiRebuildExecutionSchema = new Schema<IAssiRebuildExecution>(
  {
    status: { type: String, enum: ASSI_REBUILD_STATI, default: 'in_coda' },
    triggered_at: { type: Date, required: true, default: Date.now },
    started_at: { type: Date, default: null },
    completed_at: { type: Date, default: null },
    log_lines: { type: [LogLineSchema], default: [] },
    axes_updated: { type: [String], default: [] },
    error: { type: String, default: null },
    triggered_by: { type: String, default: null },
  },
  { timestamps: true, collection: 'assi_rebuild_executions' },
);

AssiRebuildExecutionSchema.index({ status: 1, triggered_at: -1 });
AssiRebuildExecutionSchema.index({ triggered_at: -1 });

export default mongoose.model<IAssiRebuildExecution>('AssiRebuildExecution', AssiRebuildExecutionSchema);
