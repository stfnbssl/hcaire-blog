import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Chip, CircularProgress, Alert,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
} from '@mui/material';
import { getWorkflowLogs } from '../services/articleRequestService';
import type { WorkflowLog, LogStep } from '../types/articleRequest';

const STEP_LABEL: Record<LogStep, string> = {
  telegram_received: 'Telegram ricevuto',
  redis_published:   'Redis pubblicato',
  coworker_started:  'Coworker avviato',
  coworker_done:     'Coworker completato',
  coworker_error:    'Coworker errore',
  article_published: 'Articolo pubblicato',
};

const ACTOR_COLOR: Record<string, string> = {
  server:   '#0284c7',
  local:    '#7c3aed',
  coworker: '#059669',
};


export default function WorkflowLog() {
  const [logs,    setLogs]    = useState<WorkflowLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getWorkflowLogs();
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore caricamento');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Workflow Log — Produzione Articoli
      </Typography>

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
                <TableCell sx={{ fontWeight: 600 }}>Actor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Step</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Messaggio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Articolo (preview)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Request ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 12, color: 'text.secondary' }}>
                    {new Date(log.createdAt).toLocaleString('it-IT')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.actor}
                      size="small"
                      sx={{ bgcolor: ACTOR_COLOR[log.actor] || '#666', color: '#fff', fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                    {STEP_LABEL[log.step] ?? log.step}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{log.message}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary', maxWidth: 220 }}>
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.testoPreview || '—'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {log.articleRequestId}
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
