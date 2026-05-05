import { useEffect, useState, type ChangeEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
  Alert, Button, Chip, CircularProgress,
  FormControl, FormControlLabel, FormLabel, IconButton, InputLabel,
  MenuItem, Radio, RadioGroup, Select, TextField,
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon,
} from '@mui/icons-material';
import {
  TEMA_ASSI, TEMA_ASSE_LABEL, TEMA_STATO_LABEL,
  TEMA_STATI_EDITABILI_ARCHIVIO,
  type Tema, type TemaAsse, type TemaFormData, type TemaStato,
} from '../../types/tema';
import { createTema, getTema, updateTema } from '../../services/archivioTemiService';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

function slugifyLabel(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function emptyForm(): TemaFormData {
  return {
    tema_id: '',
    label: '',
    stato: 'bozza',
    descrizione: '',
    fonti: [],
    asse_dominante: null,
    note_ricercatore: '',
  };
}

function temaToForm(t: Tema): TemaFormData {
  return {
    tema_id: t.tema_id,
    label: t.label,
    stato: (TEMA_STATI_EDITABILI_ARCHIVIO as string[]).includes(t.stato) ? t.stato : 'bozza',
    descrizione: t.descrizione,
    fonti: t.fonti,
    asse_dominante: t.asse_dominante,
    note_ricercatore: t.note_ricercatore,
  };
}

export default function ArchivioTemaFormPage() {
  const { temaId } = useParams<{ temaId?: string }>();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const isEdit = Boolean(temaId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const [form, setForm]       = useState<TemaFormData>(emptyForm());
  const [tema, setTema]       = useState<Tema | null>(null);   // record originale (per stati non editabili)
  const [slugTouched, setSlugTouched] = useState(false);
  const [newFonte, setNewFonte] = useState('');

  // ─── Caricamento (solo edit) ────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !temaId) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('Token non disponibile');
        const { tema } = await getTema(token, temaId);
        if (cancelled) return;
        setTema(tema);
        setForm(temaToForm(tema));
        setSlugTouched(true);  // in edit non auto-deriviamo dallo label
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Errore caricamento');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isEdit, temaId, getToken]);

  // ─── Auto-slug dal label finché l'utente non lo tocca, solo in create ────
  useEffect(() => {
    if (isEdit) return;
    if (slugTouched) return;
    setForm((f) => ({ ...f, tema_id: slugifyLabel(f.label) }));
  }, [form.label, slugTouched, isEdit]);

  const isReadOnly = isEdit && tema && !(TEMA_STATI_EDITABILI_ARCHIVIO as string[]).includes(tema.stato);
  const slugValid = SLUG_RE.test(form.tema_id);

  const canSubmit =
    !saving &&
    !isReadOnly &&
    form.label.trim().length > 0 &&
    slugValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');

      const payload: TemaFormData = {
        ...form,
        label: form.label.trim(),
        tema_id: form.tema_id.trim(),
        descrizione: form.descrizione.trim(),
        note_ricercatore: form.note_ricercatore.trim(),
        fonti: form.fonti.map((f) => f.trim()).filter(Boolean),
      };

      if (isEdit && temaId) {
        await updateTema(token, temaId, payload);
      } else {
        await createTema(token, payload);
      }
      navigate('/archivio/temi');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFonte = () => {
    const v = newFonte.trim();
    if (!v) return;
    setForm({ ...form, fonti: [...form.fonti, v] });
    setNewFonte('');
  };

  const handleRemoveFonte = (i: number) => {
    setForm({ ...form, fonti: form.fonti.filter((_, idx) => idx !== i) });
  };

  if (loading) {
    return (
      <>
        <SviluppoBambinoNav />
        <SviluppoBambinoProduzioniNav />
        <div className="flex justify-center py-24"><CircularProgress /></div>
      </>
    );
  }

  return (
    <>
      <SviluppoBambinoNav />
      <SviluppoBambinoProduzioniNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/archivio/temi"
          className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 mb-4"
        >
          ← Torna all'Archivio
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Modifica tema' : 'Nuovo tema'}
        </h1>
        {tema && (
          <p className="text-sm text-gray-500 mb-6">
            Stato attuale: <Chip label={TEMA_STATO_LABEL[tema.stato]} size="small" />
          </p>
        )}

        {isReadOnly && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Questo tema è in stato <strong>{TEMA_STATO_LABEL[tema!.stato]}</strong> ed è gestito dal Laboratorio.
            Dall'Archivio è visibile in sola lettura. Per modificarlo torna al laboratorio del tema corrispondente.
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Titolo del tema *"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            disabled={isReadOnly || saving}
            fullWidth
            required
            helperText="Frase breve descrittiva (es. «Technoference e qualità della presenza relazionale»)"
          />

          <TextField
            label="Slug (tema_id) *"
            value={form.tema_id}
            onChange={(e) => { setSlugTouched(true); setForm({ ...form, tema_id: e.target.value }); }}
            disabled={isEdit || isReadOnly || saving}
            fullWidth
            required
            error={form.tema_id.length > 0 && !slugValid}
            helperText={
              isEdit
                ? 'Lo slug non è modificabile dopo la creazione'
                : form.tema_id.length > 0 && !slugValid
                  ? 'Solo a-z, 0-9, trattini. Non può iniziare/finire con trattino.'
                  : 'Identificativo URL-safe in kebab-case. Auto-derivato dal titolo finché non lo modifichi.'
            }
          />

          <TextField
            label="Descrizione"
            value={form.descrizione}
            onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
            disabled={isReadOnly || saving}
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            helperText="Definizione breve del tema (1-3 frasi)"
          />

          <FormControl disabled={isReadOnly || saving}>
            <FormLabel>Asse strutturale dominante (presunto)</FormLabel>
            <RadioGroup
              value={form.asse_dominante ?? ''}
              onChange={(e) => setForm({
                ...form,
                asse_dominante: e.target.value === '' ? null : (e.target.value as TemaAsse),
              })}
            >
              <FormControlLabel value="" control={<Radio />} label="(nessuno)" />
              {TEMA_ASSI.map((a) => (
                <FormControlLabel key={a} value={a} control={<Radio />} label={TEMA_ASSE_LABEL[a]} />
              ))}
            </RadioGroup>
          </FormControl>

          <div>
            <FormLabel>Fonti</FormLabel>
            <div className="space-y-2 mt-2">
              {form.fonti.map((fonte, i) => (
                <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-md p-2">
                  <span className="flex-1 text-sm">{fonte}</span>
                  <IconButton size="small" onClick={() => handleRemoveFonte(i)} disabled={isReadOnly || saving}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
              {!isReadOnly && (
                <div className="flex gap-2">
                  <TextField
                    size="small"
                    placeholder="Citazione, URL, riferimento bibliografico…"
                    value={newFonte}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFonte(e.target.value)}
                    fullWidth
                    disabled={saving}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFonte();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddFonte}
                    disabled={saving || !newFonte.trim()}
                    startIcon={<AddIcon />}
                  >
                    Aggiungi
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TextField
            label="Note del ricercatore"
            value={form.note_ricercatore}
            onChange={(e) => setForm({ ...form, note_ricercatore: e.target.value })}
            disabled={isReadOnly || saving}
            fullWidth
            multiline
            minRows={4}
            maxRows={12}
            helperText="Annotazioni libere (markdown supportato in lettura)"
          />

          {!isReadOnly && (
            <FormControl fullWidth>
              <InputLabel>Stato iniziale</InputLabel>
              <Select
                label="Stato iniziale"
                value={form.stato}
                onChange={(e) => setForm({ ...form, stato: e.target.value as TemaStato })}
                disabled={saving}
              >
                <MenuItem value="bozza">{TEMA_STATO_LABEL.bozza} — metadati incompleti</MenuItem>
                <MenuItem value="maturo">{TEMA_STATO_LABEL.maturo} — pronto per promozione</MenuItem>
              </Select>
            </FormControl>
          )}

          {!isReadOnly && (
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button variant="outlined" onClick={() => navigate('/archivio/temi')} disabled={saving}>
                Annulla
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              >
                {saving ? 'Salvo…' : (isEdit ? 'Salva modifiche' : 'Crea tema')}
              </Button>
            </div>
          )}
        </form>
      </main>
    </>
  );
}
