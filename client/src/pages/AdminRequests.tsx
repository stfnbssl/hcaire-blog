import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  Box, Typography, Chip, CircularProgress, Alert,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
} from '@mui/material';
import { getArticleRequests } from '../services/articleRequestService';
import type { ArticleRequest, ArticleRequestStatus } from '../types/articleRequest';

const STATUS_LABEL: Record<ArticleRequestStatus, string> = {
  pending:    'In attesa',
  processing: 'In lavorazione',
  done:       'Completato',
  error:      'Errore',
};

const STATUS_COLOR: Record<ArticleRequestStatus, 'default' | 'info' | 'success' | 'error'> = {
  pending:    'default',
  processing: 'info',
  done:       'success',
  error:      'error',
};

export default function AdminRequests() {
  const { getToken } = useAuth();
  const [requests, setRequests] = useState<ArticleRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const token = await getToken();
      const data  = await getArticleRequests(token ?? undefined);
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore caricamento');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, [load]);

  const pending = requests.filter((r) => r.status !== 'done' && r.status !== 'error');

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Richieste Articoli
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {pending.length > 0
          ? `${pending.length} richiesta${pending.length > 1 ? 'e' : ''} in corso`
          : 'Nessuna richiesta in corso'}
      </Typography>

      {loading && <CircularProgress size={28} />}
      {error   && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && requests.length === 0 && (
        <Typography color="text.secondary">Nessuna richiesta presente.</Typography>
      )}

      {requests.length > 0 && (
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Data</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Richiesta</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Pubblica</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stato</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow
                  key={req._id}
                  hover
                  sx={req.status !== 'done' && req.status !== 'error'
                    ? { bgcolor: 'primary.50' }
                    : undefined}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 12, color: 'text.secondary' }}>
                    {new Date(req.createdAt).toLocaleString('it-IT')}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, maxWidth: 500 }}>
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {req.testo}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>
                    {req.pubblica ? 'Sì' : 'No'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABEL[req.status]}
                      size="small"
                      color={STATUS_COLOR[req.status]}
                    />
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
