import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
  Alert, Button, Chip, CircularProgress, IconButton, MenuItem,
  Paper, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon,
  PlayArrow as PromuoviIcon,
} from '@mui/icons-material';
import {
  TEMA_STATI, TEMA_STATO_LABEL, TEMA_ASSE_LABEL,
  TEMA_STATI_EDITABILI_ARCHIVIO, TEMA_STATI_PROMUOVIBILI,
  type Tema, type TemaStato,
} from '../../types/tema';
import { listTemi, deleteTema, promuoveTema } from '../../services/archivioTemiService';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';

const STATO_FILTER_OPTIONS: Array<{ value: '' | TemaStato; label: string }> = [
  { value: '',    label: 'Tutti gli stati' },
  ...TEMA_STATI.map((s) => ({ value: s, label: TEMA_STATO_LABEL[s] })),
];

const STATO_COLOR: Record<TemaStato, 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'> = {
  bozza:        'default',
  maturo:       'info',
  promosso:     'primary',
  f2_in_corso:  'warning',
  f2_verificata: 'success',
  parcheggiato: 'default',
  abbandonato:  'error',
  archiviato:   'default',
};

export default function ArchivioTemiIndexPage() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [filterStato, setFilterStato] = useState<'' | TemaStato>('');
  const [temi,        setTemi]        = useState<Tema[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [busyId,      setBusyId]      = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete]     = useState<Tema | null>(null);
  const [confirmPromuovi, setConfirmPromuovi] = useState<Tema | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      const data = await listTemi(token, filterStato || undefined);
      setTemi(data.temi);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore caricamento temi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStato]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.tema_id);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      await deleteTema(token, confirmDelete.tema_id);
      setConfirmDelete(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore eliminazione');
    } finally {
      setBusyId(null);
    }
  };

  const handlePromuovi = async () => {
    if (!confirmPromuovi) return;
    setBusyId(confirmPromuovi.tema_id);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      await promuoveTema(token, confirmPromuovi.tema_id);
      setConfirmPromuovi(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore promozione');
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => {
    const m = new Map<TemaStato, number>();
    for (const t of temi) m.set(t.stato, (m.get(t.stato) ?? 0) + 1);
    return m;
  }, [temi]);

  const isEditable  = (t: Tema) => (TEMA_STATI_EDITABILI_ARCHIVIO as string[]).includes(t.stato);
  const isPromuovibile = (t: Tema) => (TEMA_STATI_PROMUOVIBILI as string[]).includes(t.stato);

  return (
    <>
      <SviluppoBambinoNav />
      <SviluppoBambinoProduzioniNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Archivio temi</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestione dei temi candidati. I temi in stato <strong>maturo</strong> possono essere promossi a Ricerca F2.
            </p>
          </div>
          <Button
            variant="contained"
            onClick={() => navigate('/archivio/temi/nuovo')}
          >
            + Nuovo tema
          </Button>
        </div>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

        <div className="flex items-center gap-3 mb-4 text-sm">
          <span className="text-gray-600">Filtra per stato:</span>
          <Select
            size="small"
            value={filterStato}
            onChange={(e) => setFilterStato(e.target.value as '' | TemaStato)}
            sx={{ minWidth: 200 }}
          >
            {STATO_FILTER_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
          <span className="text-gray-400 ml-auto text-xs">
            Totale: {temi.length}
            {filterStato === '' && counts.size > 0 && (
              <> · {Array.from(counts.entries()).map(([s, n]) => `${TEMA_STATO_LABEL[s]}: ${n}`).join(' · ')}</>
            )}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><CircularProgress /></div>
        ) : temi.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-2">Nessun tema {filterStato ? `in stato "${TEMA_STATO_LABEL[filterStato as TemaStato]}"` : ''}.</p>
            {filterStato === '' && (
              <p className="text-sm">
                Per popolare l'archivio dai candidati esistenti, esegui:
                <code className="block mt-2 px-3 py-1.5 bg-gray-100 rounded inline-block font-mono text-xs">
                  npm run seed:archivio
                </code>
              </p>
            )}
          </div>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Titolo</strong></TableCell>
                  <TableCell><strong>Slug</strong></TableCell>
                  <TableCell><strong>Stato</strong></TableCell>
                  <TableCell><strong>Asse</strong></TableCell>
                  <TableCell><strong>Aggiornato</strong></TableCell>
                  <TableCell align="right"><strong>Azioni</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {temi.map((t) => (
                  <TableRow key={t.tema_id} hover>
                    <TableCell>
                      <Link
                        to={`/archivio/temi/${t.tema_id}`}
                        className="text-primary-700 hover:text-primary-800 font-medium"
                      >
                        {t.label}
                      </Link>
                      {t.descrizione && (
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.descrizione}</div>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                      {t.tema_id}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={TEMA_STATO_LABEL[t.stato]}
                        size="small"
                        color={STATO_COLOR[t.stato]}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>
                      {t.asse_dominante ? TEMA_ASSE_LABEL[t.asse_dominante].split('—')[0].trim() : '—'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {new Date(t.updatedAt).toLocaleDateString('it-IT')}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {isPromuovibile(t) && (
                        <Tooltip title="Promuovi a Ricerca F2">
                          <IconButton
                            size="small"
                            color="primary"
                            disabled={busyId === t.tema_id}
                            onClick={() => setConfirmPromuovi(t)}
                          >
                            <PromuoviIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={isEditable(t) ? 'Modifica' : 'Apri (read-only)'}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/archivio/temi/${t.tema_id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {isEditable(t) && (
                        <Tooltip title="Elimina">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={busyId === t.tema_id}
                            onClick={() => setConfirmDelete(t)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog conferma eliminazione */}
        <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Eliminare il tema?</DialogTitle>
          <DialogContent>
            Stai per eliminare il tema <strong>"{confirmDelete?.label}"</strong> (slug: <code>{confirmDelete?.tema_id}</code>).
            L'operazione è irreversibile.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)}>Annulla</Button>
            <Button color="error" variant="contained" onClick={handleDelete} disabled={!!busyId}>
              {busyId ? 'Elimino…' : 'Elimina'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog conferma promozione */}
        <Dialog open={!!confirmPromuovi} onClose={() => setConfirmPromuovi(null)}>
          <DialogTitle>Promuovere a Ricerca F2?</DialogTitle>
          <DialogContent>
            <p className="mb-2">
              Stai per promuovere il tema <strong>"{confirmPromuovi?.label}"</strong> (slug: <code>{confirmPromuovi?.tema_id}</code>).
            </p>
            <p className="text-sm text-gray-600">
              Lo stato passa da <strong>maturo</strong> a <strong>promosso</strong>. Da quel momento il tema esce dall'Archivio
              (non più modificabile/eliminabile da qui) ed entra nel Laboratorio per l'esecuzione della pipeline F2.
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmPromuovi(null)}>Annulla</Button>
            <Button color="primary" variant="contained" onClick={handlePromuovi} disabled={!!busyId}>
              {busyId ? 'Promuovo…' : 'Promuovi'}
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </>
  );
}
