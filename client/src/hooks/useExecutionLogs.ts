import { useEffect, useState } from 'react';
import { API_URL } from '../utils/constants';
import type { ExecutionStatus } from '../types/pipeline';

export interface SseLogLine {
  ts: string;
  text: string;
  level: 'info' | 'warn' | 'error';
}

export interface ExecutionFailureError {
  message: string;
  source: string;
  detail: string | null;
}

export interface UseExecutionLogsResult {
  logs: SseLogLine[];
  status: ExecutionStatus | string | null;
  isConnected: boolean;
  isFinished: boolean;
  error: string | null;
  failureError: ExecutionFailureError | null;
}

export function useExecutionLogs(executionId: string | null): UseExecutionLogsResult {
  const [logs, setLogs] = useState<SseLogLine[]>([]);
  const [status, setStatus] = useState<ExecutionStatus | string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failureError, setFailureError] = useState<ExecutionFailureError | null>(null);

  useEffect(() => {
    if (!executionId) return;

    setLogs([]);
    setStatus(null);
    setIsFinished(false);
    setError(null);
    setFailureError(null);

    const url = `${API_URL}/pipeline/executions/${executionId}/logs`;
    const es = new EventSource(url);

    const onLog = (e: MessageEvent) => {
      try {
        const line = JSON.parse(e.data) as SseLogLine;
        setLogs((prev) => [...prev, line]);
      } catch { /* ignore malformed */ }
    };
    const onStatus = (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data) as { status?: string; error?: ExecutionFailureError | null };
        if (payload.status) setStatus(payload.status);
        if (payload.error) setFailureError(payload.error);
      } catch { /* */ }
    };
    const onDone = () => {
      setIsFinished(true);
      es.close();
      setIsConnected(false);
    };
    const onOpen = () => setIsConnected(true);
    const onError = () => {
      setError('Connessione SSE persa');
      setIsConnected(false);
      es.close();
    };

    es.addEventListener('log', onLog);
    es.addEventListener('status', onStatus);
    es.addEventListener('done', onDone);
    es.addEventListener('open', onOpen);
    es.addEventListener('error', onError);

    return () => {
      es.removeEventListener('log', onLog);
      es.removeEventListener('status', onStatus);
      es.removeEventListener('done', onDone);
      es.removeEventListener('open', onOpen);
      es.removeEventListener('error', onError);
      es.close();
    };
  }, [executionId]);

  return { logs, status, isConnected, isFinished, error, failureError };
}
