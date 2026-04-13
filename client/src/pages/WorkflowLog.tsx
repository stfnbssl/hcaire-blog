import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Chip, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getArticleRequests } from '../services/articleRequestService';
import type { ArticleRequest, ArticleRequestStatus, LogStep, WorkflowLog } from '../types/articleRequest';

const STATUS_COLOR: Record<ArticleRequestStatus, 'default' | 'warning' | 'success' | 'error'> = {
  pending:    'default',
  processing: 'warning',
  done:       'success',
  error:      'error',
};

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

function LogRow({ log }: { log: WorkflowLog }) {
  return (
    <TableRow>
      <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 12, color: 'text.secondary' }}>
        {new Date(log.timestamp).toLocaleString('it-IT')}
      </TableCell>
      <TableCell>
        <Chip
          label={log.actor}
          size="small"
          sx={{ bgcolor: ACTOR_COLOR[log.actor] || '#666', color: '#fff', fontSize: 11 }}
        />
      </TableCell>
      <TableCell sx={{ fontSize: 13 }}>{STEP_LABEL[log.step] ?? log.step}</TableCell>
      <TableCell sx={{ fontSize: 13 }}>{log.message}</TableCell>
    </TableRow>
  );
}

function RequestRow({ request }: { request: ArticleRequest }) {
  const preview = request.testo.length > 120
    ? request.testo.slice(0, 120) + '…'
    : request.testo;

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
          <Chip
            label={request.status}
            color={STATUS_COLOR[request.status]}
            size="small"
            sx={{ minWidth: 90 }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {new Date(request.createdAt).toLocaleString('it-IT')}
          </Typography>
          {request.pubblica && (
            <Chip label="pubblica" size="small" color="primary" variant="outlined" />
          )}
          <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {preview}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {request.logs.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
            Nessun log disponibile.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Actor</TableCell>
                <TableCell>Step</TableCell>
                <TableCell>Messaggio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {request.logs.map((log, i) => (
                <LogRow key={i} log={log} />
              ))}
            </TableBody>
          </Table>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function WorkflowLog() {
  const [requests, setRequests] = useState<ArticleRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getArticleRequests();
      setRequests(data);
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
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Workflow Log — Produzione Articoli
      </Typography>

      {loading && <CircularProgress size={28} />}
      {error   && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && requests.length === 0 && (
        <Typography color="text.secondary">Nessuna richiesta ancora ricevuta.</Typography>
      )}

      {requests.map((r) => (
        <RequestRow key={r._id} request={r} />
      ))}
    </Box>
  );
}
