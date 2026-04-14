import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { Content, ContentFormData } from '../types/content';
import {
  Button, IconButton, Tooltip,
  Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, Chip, CircularProgress,
  Paper, TableContainer, FormControlLabel, Switch, Select, MenuItem, InputLabel, FormControl,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// File System Access API — disponibile su Chrome/Edge ma non su Firefox
interface FsFileHandle { getFile(): Promise<File>; }
interface FsDirHandle { getFileHandle(name: string, opts?: { create?: boolean }): Promise<FsFileHandle>; }
declare global { interface Window { showDirectoryPicker?(): Promise<FsDirHandle>; } }

const DEFAULT_FORM: ContentFormData = {
  slug: '', titolo: '', descrizione: '', contenuto: '',
  autore: 'admin', categoria: 'general', tags: [],
  isPublished: true, isPinned: false, accessType: 'free',
};

function ContentForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<ContentFormData>;
  onSave: (data: ContentFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form,      setForm]      = useState<ContentFormData>({ ...DEFAULT_FORM, ...initial });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(', '));
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave({
        ...form,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore nel salvataggio');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof ContentFormData, multiline?: number) => (
    <TextField
      label={label}
      value={form[key] as string}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      fullWidth
      required={key === 'slug' || key === 'titolo'}
      multiline={!!multiline}
      rows={multiline}
      sx={{ mb: 2 }}
    />
  );

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {field('Slug', 'slug')}
      {field('Titolo', 'titolo')}
      {field('Descrizione', 'descrizione', 2)}
      {field('Contenuto (Markdown)', 'contenuto', 10)}
      {field('Categoria', 'categoria')}
      <TextField
        label="Tags (separati da virgola)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {field('Autore', 'autore')}
      <FormControlLabel
        control={
          <Switch
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            color="success"
          />
        }
        label={form.isPublished ? 'Pubblicato' : 'Bozza'}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Accesso</InputLabel>
        <Select
          label="Accesso"
          value={form.accessType}
          onChange={(e) => setForm({ ...form, accessType: e.target.value as 'free' | 'plus' })}
        >
          <MenuItem value="free">Libero (tutti)</MenuItem>
          <MenuItem value="plus">Plus (abbonati)</MenuItem>
        </Select>
      </FormControl>
      <DialogActions sx={{ px: 0 }}>
        <Button onClick={onCancel} disabled={loading}>Annulla</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={18} color="inherit" /> : 'Salva'}
        </Button>
      </DialogActions>
    </>
  );
}

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [contents,      setContents]      = useState<Content[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [dialogMode,    setDialogMode]    = useState<'create' | 'edit' | null>(null);
  const [selected,      setSelected]      = useState<Content | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Content | null>(null);
  const [importedData,  setImportedData]  = useState<Partial<ContentFormData> | undefined>(undefined);

  // Fallback per browser senza File System Access API (es. Firefox)
  const mdInputRef   = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const fallbackMd   = useRef<string>('');

  const openCreateWithData = (data: Partial<ContentFormData>) => {
    setImportedData(data);
    setDialogMode('create');
  };

  // Percorso principale: showDirectoryPicker (Chrome/Edge)
  // L'utente seleziona la cartella dell'articolo generata da Cowork;
  // il codice legge articolo.md e metadata.json automaticamente.
  const handleImport = async () => {
    if (window.showDirectoryPicker) {
      try {
        const dir = await window.showDirectoryPicker();

        let contenuto = '';
        try {
          const mdFile = await (await dir.getFileHandle('articolo.md')).getFile();
          contenuto = await mdFile.text();
        } catch {
          setError('File "articolo.md" non trovato nella cartella selezionata.');
          return;
        }

        let meta: Partial<ContentFormData> = {};
        try {
          const jsonFile = await (await dir.getFileHandle('metadata.json')).getFile();
          const parsed = JSON.parse(await jsonFile.text()) as Record<string, unknown>;
          meta = {
            slug:        typeof parsed.slug        === 'string'  ? parsed.slug        : '',
            titolo:      typeof parsed.titolo      === 'string'  ? parsed.titolo      : '',
            descrizione: typeof parsed.descrizione === 'string'  ? parsed.descrizione : '',
            categoria:   typeof parsed.categoria   === 'string'  ? parsed.categoria   : 'general',
            tags:        Array.isArray(parsed.tags)              ? parsed.tags as string[] : [],
          };
        } catch {
          // metadata.json assente o non valido — si apre il form senza metadati
        }

        openCreateWithData({ ...meta, contenuto, isPublished: false });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Errore durante il caricamento della cartella.');
        }
      }
      return;
    }

    // Fallback: due <input type="file"> separati
    fallbackMd.current = '';
    mdInputRef.current?.click();
  };

  // Fallback step 1: lettura articolo.md
  const onFallbackMd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fallbackMd.current = await file.text();
    e.target.value = '';
    jsonInputRef.current?.click();  // chiede subito il metadata.json
  };

  // Fallback step 2: lettura metadata.json (opzionale — l'utente può annullare)
  const onFallbackJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    let meta: Partial<ContentFormData> = {};
    if (file) {
      try {
        const parsed = JSON.parse(await file.text()) as Record<string, unknown>;
        meta = {
          slug:        typeof parsed.slug        === 'string'  ? parsed.slug        : '',
          titolo:      typeof parsed.titolo      === 'string'  ? parsed.titolo      : '',
          descrizione: typeof parsed.descrizione === 'string'  ? parsed.descrizione : '',
          categoria:   typeof parsed.categoria   === 'string'  ? parsed.categoria   : 'general',
          tags:        Array.isArray(parsed.tags)              ? parsed.tags as string[] : [],
        };
      } catch {
        // JSON non valido — si ignora
      }
    }
    e.target.value = '';
    openCreateWithData({ ...meta, contenuto: fallbackMd.current, isPublished: false });
  };

  const load = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const data  = await contentService.getAllAdmin(token ?? undefined);
      setContents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore caricamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (data: ContentFormData) => {
    const token = await getToken();
    await contentService.create(data, token ?? undefined);
    setDialogMode(null);
    load();
  };

  const handleEdit = async (data: ContentFormData) => {
    if (!selected) return;
    const token = await getToken();
    await contentService.update(selected._id, data, token ?? undefined);
    setDialogMode(null);
    setSelected(null);
    load();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const token = await getToken();
    await contentService.delete(deleteConfirm._id, token ?? undefined);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Input nascosti per fallback browser senza File System Access API */}
      <input ref={mdInputRef}   type="file" accept=".md"   style={{ display: 'none' }} onChange={onFallbackMd} />
      <input ref={jsonInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={onFallbackJson} />

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outlined" onClick={handleImport}>
          Carica articolo
        </Button>
        <Button variant="contained" onClick={() => { setImportedData(undefined); setDialogMode('create'); }}>
          + Nuovo articolo
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><CircularProgress /></div>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Titolo</strong></TableCell>
                <TableCell><strong>Slug</strong></TableCell>
                <TableCell><strong>Categoria</strong></TableCell>
                <TableCell><strong>Accesso</strong></TableCell>
                <TableCell><strong>Stato</strong></TableCell>
                <TableCell><strong>Data</strong></TableCell>
                <TableCell align="right"><strong>Azioni</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contents.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>{item.titolo}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{item.slug}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.accessType === 'plus' ? 'Plus' : 'Libero'}
                      size="small"
                      color={item.accessType === 'plus' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.isPublished ? 'Pubblicato' : 'Bozza'}
                      size="small"
                      color={item.isPublished ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {new Date(item.createdAt).toLocaleDateString('it-IT')}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Visualizza">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/blog/${item.slug}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifica">
                      <IconButton
                        size="small"
                        onClick={() => { setSelected(item); setDialogMode('edit'); }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Elimina">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteConfirm(item)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {contents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Nessun articolo presente
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog crea/modifica */}
      <Dialog open={!!dialogMode} onClose={() => setDialogMode(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Nuovo articolo' : 'Modifica articolo'}
        </DialogTitle>
        <DialogContent>
          <ContentForm
            initial={
              dialogMode === 'edit' && selected
                ? selected
                : importedData
            }
            onSave={dialogMode === 'create' ? handleCreate : handleEdit}
            onCancel={() => { setDialogMode(null); setSelected(null); setImportedData(undefined); }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog conferma eliminazione */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          Sei sicuro di voler eliminare <strong>"{deleteConfirm?.titolo}"</strong>?
          L'operazione è irreversibile.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Annulla</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Elimina</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
