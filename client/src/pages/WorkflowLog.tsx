import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  Box, Typography, Chip, CircularProgress, Alert,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Tabs, Tab,
} from '@mui/material';
import { getWorkflowLogs } from '../services/articleRequestService';
import type { WorkflowLog, LogStep } from '../types/articleRequest';

// ─── Labels ──────────────────────────────────────────────────────────────────

const STEP_LABEL: Record<LogStep, string> = {
  // article
  telegram_received: 'Telegram ricevuto',
  redis_published:   'Redis pubblicato',
  coworker_started:  'Coworker avviato',
  coworker_done:     'Coworker completato',
  coworker_error:    'Coworker errore',
  article_published: 'Articolo pubblicato',
  // bartleby
  trace_submitted:   'Traccia salvata',
  trace_queued:      'Job in coda Redis',
  worker_started:    'Worker avviato',
  claude_called:     'Chiamata Claude API',
  output_saved:      'Output salvato',
  worker_error:      'Errore worker',
};

const ACTOR_COLOR: Record<string, string> = {
  server:   '#0284c7',
  local:    '#7c3aed',
  coworker: '#059669',
  worker:   '#d97706',
};

const ERROR_STEPS: LogStep[] = ['coworker_error', 'worker_error'];
const OK_STEPS:    LogStep[] = ['article_published', 'output_saved'];

function stepColor(step: LogStep): string {
  if (ERROR_STEPS.includes(step)) return '#fef2f2';
  if (OK_STEPS.includes(step))    return '#f0fdf4';
  return 'inherit';
}

// ─── Component ───────────────────────────────────────────────────────────────

type TabValue = 'all' | 'article' | 'bartleby';

export default function WorkflowLog() {
  const { getToken } = useAuth();
  const [tab,     setTab]     = useState<TabValue>('all');
  const [logs,    setLogs]    = useState<WorkflowLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async (cancelled: { current: boolean }) => {
    try {
      const token = await getToken();
      const type  = tab === 'all' ? undefined : tab;
      const data  = await getWorkflowLogs(200, token ?? undefined, type);
      if (cancelled.current) return;
      setLogs(data);
      setError(null);
    } catch (err) {
      if (cancelled.current) return;
      setError(err instanceof Error ? err.message : 'Errore caricamento');
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, [getToken, tab]);

  useEffect(() => {
    const cancelled = { current: false };
    setLogs([]);
    setLoading(true);
    load(cancelled);
    const interval = setInterval(() => load(cancelled), 10_000);
    return () => {
      cancelled.current = true;
      clearInterval(interval);
    };
  }, [load]);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Workflow Log
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Aggiornamento automatico ogni 10s
      </Typography>

      <Tabs
        value={tab}
        onChange={(_e, v) => setTab(v as TabValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Tutti" value="all" />
        <Tab label="Articoli" value="article" />
        <Tab label="Bartleby" value="bartleby" />
      </Tabs>

      {loading && <CircularProgress size={28} />}
      {error   && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && logs.length === 0 && (
        <Typography color="text.secondary">Nessun log disponibile.</Typography>
      )}

      {logs.length > 0 && (
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Step</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stato</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Messaggio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Preview traccia</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log._id}
                  hover
                  sx={{ bgcolor: stepColor(log.step) }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 12, color: 'text.secondary' }}>
                    {new Date(log.createdAt).toLocaleString('it-IT')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.workflow_type ?? 'article'}
                      size="small"
                      sx={{
                        bgcolor: log.workflow_type === 'bartleby' ? '#f59e0b' : '#64748b',
                        color: '#fff',
                        fontSize: 10,
                        height: 20,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.actor}
                      size="small"
                      sx={{ bgcolor: ACTOR_COLOR[log.actor] || '#666', color: '#fff', fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                    {ERROR_STEPS.includes(log.step) && (
                      <span style={{ marginRight: 4 }}>⚠️</span>
                    )}
                    {OK_STEPS.includes(log.step) && (
                      <span style={{ marginRight: 4 }}>✓</span>
                    )}
                    {STEP_LABEL[log.step] ?? log.step}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.requestStatus}
                      size="small"
                      variant="outlined"
                      color={
                        log.requestStatus === 'error'      ? 'error'   :
                        log.requestStatus === 'done'       ? 'success' :
                        log.requestStatus === 'processing' ? 'warning' :
                        'default'
                      }
                      sx={{ fontSize: 10, height: 20 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{log.message}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary', maxWidth: 220 }}>
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.testoPreview || '—'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {log.traceId ?? log.articleRequestId ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
