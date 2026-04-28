// Viewer strutturato per gli output della pipeline Letture (step_1, step_2).
// Clone semplificato del pattern di F2OutputViewer: riusa le primitive da
// `pipeline/output-viewers/viewerPrimitives` per coerenza visiva.

import {
  Card, Chip, KeyValue, Prose, Subtle, BulletList,
  SectionTitle, CalloutBox,
} from '../pipeline/output-viewers/viewerPrimitives';
import MarkdownRenderer from '../MarkdownRenderer';

// ───── step 1: dossier-contenutistico ─────

interface Step1Opera {
  titolo?: string;
  titolo_originale?: string;
  autore?: string;
  altri_autori?: string[];
  macrotipologia?: string;
  genere?: string;
  anno?: number;
  paese?: string;
  editore_produttore?: string;
  serie_o_ciclo?: string;
  materiali_disponibili?: string[];
  fonti_utilizzate?: string[];
}

interface Step1StrutturaUnita {
  nome?: string;
  descrizione_sintetica?: string;
}

interface Step1Struttura {
  descrizione?: string;
  unita?: Step1StrutturaUnita[];
  scelte_formali_rilevanti?: string;
}

interface Step1Personaggio {
  nome?: string;
  tipo?: string;
  ruolo?: string;
  relazioni_principali?: string[];
}

interface Step1Scena {
  titolo_sintetico?: string;
  posizione_nell_opera?: string;
  descrizione?: string;
}

interface Step1Tema {
  tema?: string;
  manifestazione?: string;
}

interface Step1Tensione {
  descrizione?: string;
  localizzazione?: string;
}

interface Step1Contesto {
  clima_culturale?: string;
  riferimenti_storici?: string;
  tradizione_di_appartenenza?: string;
  ricezione_critica?: string;
}

interface Step1Avvertenza {
  tipo?: string;
  descrizione?: string;
}

interface Step1Data {
  opera?: Step1Opera;
  sintesi_contenutistica?: string;
  struttura_formale?: Step1Struttura;
  personaggi_figure_gruppi?: Step1Personaggio[];
  scene_momenti_chiave?: Step1Scena[];
  temi_espliciti?: Step1Tema[];
  tensioni_emergenti?: Step1Tensione[];
  contesto_storico_culturale?: Step1Contesto;
  avvertenze_anti_confabulazione?: Step1Avvertenza[];
  metadata?: Record<string, unknown>;
}

const AVVERTENZA_TONE: Record<string, 'emerald' | 'sky' | 'amber' | 'rose' | 'slate'> = {
  informazione_certa:           'emerald',
  informazione_probabile:       'sky',
  informazione_incerta:         'amber',
  informazione_non_reperibile:  'rose',
  accesso_limitato_ai_materiali:'slate',
};

function Step1Viewer({ data }: { data: Step1Data }) {
  const o = data.opera ?? {};
  const struttura = data.struttura_formale;
  const personaggi = data.personaggi_figure_gruppi ?? [];
  const scene = data.scene_momenti_chiave ?? [];
  const temi = data.temi_espliciti ?? [];
  const tensioni = data.tensioni_emergenti ?? [];
  const contesto = data.contesto_storico_culturale;
  const avvertenze = data.avvertenze_anti_confabulazione ?? [];

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-base font-semibold text-slate-900">{o.titolo ?? 'Opera senza titolo'}</h3>
        {o.titolo_originale && o.titolo_originale !== o.titolo && (
          <p className="text-xs text-slate-500 italic mt-0.5">titolo originale: {o.titolo_originale}</p>
        )}
        <p className="text-sm text-slate-700 mt-1">
          {o.autore ?? '—'}
          {o.altri_autori && o.altri_autori.length > 0 && (
            <span className="text-slate-500"> · con {o.altri_autori.join(', ')}</span>
          )}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {o.macrotipologia && <Chip>{o.macrotipologia.replace(/_/g, ' ')}</Chip>}
          {o.genere && <Chip>{o.genere}</Chip>}
          {o.anno !== undefined && o.anno !== null && <Chip>{o.anno}</Chip>}
          {o.paese && <Chip>{o.paese}</Chip>}
        </div>
        {(o.editore_produttore || o.serie_o_ciclo) && (
          <div className="mt-3 space-y-0.5">
            {o.editore_produttore && <KeyValue label="Editore/produttore" value={o.editore_produttore} />}
            {o.serie_o_ciclo && <KeyValue label="Serie/ciclo" value={o.serie_o_ciclo} />}
          </div>
        )}
        {o.materiali_disponibili && o.materiali_disponibili.length > 0 && (
          <div className="mt-2"><KeyValue label="Materiali" value={o.materiali_disponibili.join(', ')} /></div>
        )}
        {o.fonti_utilizzate && o.fonti_utilizzate.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold text-slate-600">Fonti consultate</summary>
            <div className="mt-2"><BulletList items={o.fonti_utilizzate} /></div>
          </details>
        )}
      </Card>

      {data.sintesi_contenutistica && (
        <CalloutBox title="Sintesi contenutistica" tone="slate">
          <Prose>{data.sintesi_contenutistica}</Prose>
        </CalloutBox>
      )}

      {struttura && (
        <div>
          <SectionTitle>Struttura formale</SectionTitle>
          <Card>
            {struttura.descrizione && <Prose>{struttura.descrizione}</Prose>}
            {struttura.unita && struttura.unita.length > 0 && (
              <div className="mt-3 space-y-2">
                {struttura.unita.map((u, i) => (
                  <div key={i} className="border-l-2 border-slate-300 pl-3">
                    <p className="text-sm font-medium text-slate-900">{u.nome ?? `Unità ${i + 1}`}</p>
                    {u.descrizione_sintetica && (
                      <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{u.descrizione_sintetica}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {struttura.scelte_formali_rilevanti && (
              <div className="mt-3">
                <KeyValue label="Scelte formali" value={<Prose>{struttura.scelte_formali_rilevanti}</Prose>} />
              </div>
            )}
          </Card>
        </div>
      )}

      {personaggi.length > 0 && (
        <div>
          <SectionTitle>Personaggi, figure, gruppi ({personaggi.length})</SectionTitle>
          <div className="space-y-2">
            {personaggi.map((p, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-900">{p.nome ?? '—'}</span>
                  {p.tipo && <Chip>{p.tipo.replace(/_/g, ' ')}</Chip>}
                </div>
                {p.ruolo && <div className="mt-1"><KeyValue label="Ruolo" value={<Prose>{p.ruolo}</Prose>} /></div>}
                {p.relazioni_principali && p.relazioni_principali.length > 0 && (
                  <div className="mt-1">
                    <KeyValue label="Relazioni" value={<BulletList items={p.relazioni_principali} />} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {scene.length > 0 && (
        <div>
          <SectionTitle>Scene/momenti chiave ({scene.length})</SectionTitle>
          <div className="space-y-2">
            {scene.map((s, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-sm font-medium text-slate-900">{s.titolo_sintetico ?? `Momento ${i + 1}`}</p>
                  {s.posizione_nell_opera && (
                    <span className="text-xs text-slate-500 font-mono">{s.posizione_nell_opera}</span>
                  )}
                </div>
                {s.descrizione && <Prose>{s.descrizione}</Prose>}
              </div>
            ))}
          </div>
        </div>
      )}

      {temi.length > 0 && (
        <div>
          <SectionTitle>Temi espliciti ({temi.length})</SectionTitle>
          <div className="space-y-2">
            {temi.map((t, i) => (
              <Card key={i}>
                <p className="font-medium text-slate-900 text-sm">{t.tema ?? '—'}</p>
                {t.manifestazione && (
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">{t.manifestazione}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {tensioni.length > 0 && (
        <div>
          <SectionTitle>Tensioni emergenti ({tensioni.length})</SectionTitle>
          <div className="space-y-1.5">
            {tensioni.map((t, i) => (
              <div key={i} className="border-l-2 border-amber-300 pl-3 py-1">
                {t.descrizione && <Prose>{t.descrizione}</Prose>}
                {t.localizzazione && <Subtle>↳ {t.localizzazione}</Subtle>}
              </div>
            ))}
          </div>
        </div>
      )}

      {contesto && Object.values(contesto).some(Boolean) && (
        <div>
          <SectionTitle>Contesto storico-culturale</SectionTitle>
          <Card>
            {contesto.clima_culturale && <KeyValue label="Clima culturale" value={<Prose>{contesto.clima_culturale}</Prose>} />}
            {contesto.riferimenti_storici && <KeyValue label="Riferimenti storici" value={<Prose>{contesto.riferimenti_storici}</Prose>} />}
            {contesto.tradizione_di_appartenenza && <KeyValue label="Tradizione" value={<Prose>{contesto.tradizione_di_appartenenza}</Prose>} />}
            {contesto.ricezione_critica && <KeyValue label="Ricezione critica" value={<Prose>{contesto.ricezione_critica}</Prose>} />}
          </Card>
        </div>
      )}

      {avvertenze.length > 0 && (
        <div>
          <SectionTitle>Avvertenze anti-confabulazione ({avvertenze.length})</SectionTitle>
          <div className="space-y-1.5">
            {avvertenze.map((a, i) => {
              const tone = AVVERTENZA_TONE[a.tipo ?? ''] ?? 'amber';
              return (
                <CalloutBox key={i} title={(a.tipo ?? 'avvertenza').replace(/_/g, ' ')} tone={tone}>
                  {a.descrizione && <Prose>{a.descrizione}</Prose>}
                </CalloutBox>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ───── step 2: lettura-libera-orientata ─────

interface Step2Riferimento {
  titolo?: string;
  autore?: string;
}

interface Step2Nucleo {
  formulazione?: string;
  motivazione?: string;
}

interface Step2Ipotesi {
  tesi?: string;
  basi_nel_dossier?: string[];
  carattere_provvisorio?: string;
}

interface Step2Tensione {
  descrizione?: string;
  polo_a?: string;
  polo_b?: string;
  dove_si_manifesta?: string;
}

interface Step2Domanda {
  domanda?: string;
  motivazione?: string;
}

interface Step2Aree {
  antropologica?: string;
  esistenziale?: string;
  storica?: string;
  simbolica?: string;
}

interface Step2Data {
  opera_riferimento?: Step2Riferimento;
  nucleo_tematico_centrale?: Step2Nucleo;
  ipotesi_critica_provvisoria?: Step2Ipotesi;
  tensioni_principali?: Step2Tensione[];
  domande_critiche_aperte?: Step2Domanda[];
  aree_di_rilevanza?: Step2Aree;
  note_metodologiche?: string;
  metadata?: Record<string, unknown>;
}

function Step2Viewer({ data }: { data: Step2Data }) {
  const rif = data.opera_riferimento;
  const nucleo = data.nucleo_tematico_centrale;
  const ipotesi = data.ipotesi_critica_provvisoria;
  const tensioni = data.tensioni_principali ?? [];
  const domande = data.domande_critiche_aperte ?? [];
  const aree = data.aree_di_rilevanza;

  return (
    <div className="space-y-5">
      {rif && (rif.titolo || rif.autore) && (
        <p className="text-xs text-slate-500">
          Riferimento: <span className="font-medium text-slate-700">{rif.titolo ?? '—'}</span>
          {rif.autore && <span> · {rif.autore}</span>}
        </p>
      )}

      {nucleo && (nucleo.formulazione || nucleo.motivazione) && (
        <CalloutBox title="Nucleo tematico centrale" tone="emerald">
          {nucleo.formulazione && <Prose>{nucleo.formulazione}</Prose>}
          {nucleo.motivazione && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold opacity-80">Motivazione</summary>
              <div className="mt-1"><Prose>{nucleo.motivazione}</Prose></div>
            </details>
          )}
        </CalloutBox>
      )}

      {ipotesi && (ipotesi.tesi || ipotesi.basi_nel_dossier?.length || ipotesi.carattere_provvisorio) && (
        <CalloutBox title="Ipotesi critica provvisoria" tone="sky">
          {ipotesi.tesi && <Prose>{ipotesi.tesi}</Prose>}
          {ipotesi.basi_nel_dossier && ipotesi.basi_nel_dossier.length > 0 && (
            <div className="mt-2">
              <KeyValue label="Basi nel dossier" value={<BulletList items={ipotesi.basi_nel_dossier} />} />
            </div>
          )}
          {ipotesi.carattere_provvisorio && (
            <div className="mt-2">
              <KeyValue label="Carattere provvisorio" value={<Prose>{ipotesi.carattere_provvisorio}</Prose>} />
            </div>
          )}
        </CalloutBox>
      )}

      {tensioni.length > 0 && (
        <div>
          <SectionTitle>Tensioni principali ({tensioni.length})</SectionTitle>
          <div className="space-y-2">
            {tensioni.map((t, i) => (
              <Card key={i}>
                {t.descrizione && <Prose>{t.descrizione}</Prose>}
                {(t.polo_a || t.polo_b) && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    {t.polo_a && <Chip color="sky">{t.polo_a}</Chip>}
                    <span className="text-slate-400">↔</span>
                    {t.polo_b && <Chip color="rejected">{t.polo_b}</Chip>}
                  </div>
                )}
                {t.dove_si_manifesta && (
                  <Subtle>↳ {t.dove_si_manifesta}</Subtle>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {domande.length > 0 && (
        <div>
          <SectionTitle>Domande critiche aperte ({domande.length})</SectionTitle>
          <div className="space-y-2">
            {domande.map((d, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-1">
                {d.domanda && <p className="text-sm font-medium text-slate-900">{d.domanda}</p>}
                {d.motivazione && (
                  <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{d.motivazione}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {aree && Object.values(aree).some(Boolean) && (
        <div>
          <SectionTitle>Aree di rilevanza</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {aree.antropologica && (
              <Card><p className="text-xs font-bold uppercase tracking-wide text-rose-700 mb-1">Antropologica</p><Prose>{aree.antropologica}</Prose></Card>
            )}
            {aree.esistenziale && (
              <Card><p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1">Esistenziale</p><Prose>{aree.esistenziale}</Prose></Card>
            )}
            {aree.storica && (
              <Card><p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">Storica</p><Prose>{aree.storica}</Prose></Card>
            )}
            {aree.simbolica && (
              <Card><p className="text-xs font-bold uppercase tracking-wide text-purple-700 mb-1">Simbolica</p><Prose>{aree.simbolica}</Prose></Card>
            )}
          </div>
        </div>
      )}

      {data.note_metodologiche && (
        <div>
          <SectionTitle>Note metodologiche</SectionTitle>
          <Card><Prose>{data.note_metodologiche}</Prose></Card>
        </div>
      )}
    </div>
  );
}

// ───── step 3: lettura-strutturata-per-assi ─────

const GRADO_COLORS: Record<string, string> = {
  alto:    'forte',        // emerald
  medio:   'plausibile',   // sky
  basso:   'da_verificare', // amber
  assente: 'assente',      // slate
};

const FORMA_DINAMICA_COLORS: Record<string, 'emerald' | 'sky' | 'amber' | 'rose' | 'slate' | 'blue'> = {
  espansione:      'emerald',
  resistenza:      'amber',
  restringimento:  'sky',
  collasso:        'rose',
  trasformazione:  'blue',
  sospensione:     'slate',
};

interface Step3AsseImplicato {
  axis_id?: string;
  axis_name?: string;
  grado_implicazione?: string;
  motivazione?: string;
  nodi_attivati_in_questo_asse?: string[];
}

interface Step3NodoTrasversale {
  nodo?: string;
  asse_di_appartenenza?: string;
  definizione_breve?: string;
  evidenza_nell_opera?: string;
}

interface Step3NodoAssente {
  nodo?: string;
  asse_di_appartenenza?: string;
  motivazione_assenza?: string;
}

interface Step3Evidenza {
  tipo?: string;
  descrizione?: string;
  localizzazione?: string;
  assi_connessi?: string[];
  interpretazione_sintetica?: string;
}

interface Step3Configurazione {
  descrizione?: string;
  relazione_con_ipotesi_step2?: string;
}

interface Step3FaseDinamica {
  fase?: string;
  forma?: string;
  descrizione?: string;
}

interface Step3Dinamica {
  forma_prevalente?: string[];
  descrizione?: string;
  articolazione_in_fasi?: Step3FaseDinamica[];
}

interface Step3Rischio {
  asse_coinvolto?: string;
  tipo_di_rischio?: string;
  descrizione?: string;
  cautela_adottata?: string;
}

interface Step3Data {
  opera_riferimento?: { titolo?: string; autore?: string };
  assi_implicati?: Step3AsseImplicato[];
  nodi_trasversali_attivati?: Step3NodoTrasversale[];
  nodi_assenti?: Step3NodoAssente[];
  evidenze?: Step3Evidenza[];
  configurazione_strutturale_dominante?: Step3Configurazione;
  dinamica_opera?: Step3Dinamica;
  rischi_di_forzatura?: Step3Rischio[];
  metadata?: Record<string, unknown>;
}

function asseLabel(axisId?: string): string {
  if (!axisId) return '—';
  return axisId.replace('asse_', 'Asse ');
}

function Step3Viewer({ data }: { data: Step3Data }) {
  const rif = data.opera_riferimento;
  const assi = data.assi_implicati ?? [];
  const nodiTrasv = data.nodi_trasversali_attivati ?? [];
  const nodiAssenti = data.nodi_assenti ?? [];
  const evidenze = data.evidenze ?? [];
  const configurazione = data.configurazione_strutturale_dominante;
  const dinamica = data.dinamica_opera;
  const rischi = data.rischi_di_forzatura ?? [];

  return (
    <div className="space-y-5">
      {rif && (rif.titolo || rif.autore) && (
        <p className="text-xs text-slate-500">
          Riferimento: <span className="font-medium text-slate-700">{rif.titolo ?? '—'}</span>
          {rif.autore && <span> · {rif.autore}</span>}
        </p>
      )}

      {configurazione && (configurazione.descrizione || configurazione.relazione_con_ipotesi_step2) && (
        <CalloutBox title="Configurazione strutturale dominante" tone="emerald">
          {configurazione.descrizione && <Prose>{configurazione.descrizione}</Prose>}
          {configurazione.relazione_con_ipotesi_step2 && (
            <div className="mt-2">
              <KeyValue
                label="Relazione con ipotesi step 2"
                value={<Prose>{configurazione.relazione_con_ipotesi_step2}</Prose>}
              />
            </div>
          )}
        </CalloutBox>
      )}

      {dinamica && (
        <div>
          <SectionTitle>Dinamica dell'opera</SectionTitle>
          <Card>
            {dinamica.forma_prevalente && dinamica.forma_prevalente.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {dinamica.forma_prevalente.map((f, i) => {
                  const tone = FORMA_DINAMICA_COLORS[f] ?? 'slate';
                  return <Chip key={i} color={tone === 'emerald' ? 'forte' : tone === 'sky' ? 'plausibile' : tone === 'amber' ? 'da_verificare' : tone === 'rose' ? 'distorta' : tone === 'blue' ? 'secondary' : 'assente'}>{f}</Chip>;
                })}
              </div>
            )}
            {dinamica.descrizione && <Prose>{dinamica.descrizione}</Prose>}
            {dinamica.articolazione_in_fasi && dinamica.articolazione_in_fasi.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-slate-600">Articolazione in fasi</p>
                {dinamica.articolazione_in_fasi.map((f, i) => (
                  <div key={i} className="border-l-2 border-slate-300 pl-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-900">{f.fase ?? `Fase ${i + 1}`}</span>
                      {f.forma && <Chip>{f.forma}</Chip>}
                    </div>
                    {f.descrizione && <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{f.descrizione}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {assi.length > 0 && (
        <div>
          <SectionTitle>Assi implicati ({assi.length})</SectionTitle>
          <div className="space-y-2">
            {assi.map((a, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono text-slate-400">{a.axis_id}</span>
                  <span className="font-medium text-slate-900">{a.axis_name ?? asseLabel(a.axis_id)}</span>
                  {a.grado_implicazione && (
                    <Chip color={GRADO_COLORS[a.grado_implicazione] ?? 'slate'}>
                      grado: {a.grado_implicazione}
                    </Chip>
                  )}
                </div>
                {a.motivazione && <Prose>{a.motivazione}</Prose>}
                {a.nodi_attivati_in_questo_asse && a.nodi_attivati_in_questo_asse.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Nodi attivati</p>
                    <div className="flex flex-wrap gap-1">
                      {a.nodi_attivati_in_questo_asse.map((n, j) => (
                        <Chip key={j} color="derived">{n}</Chip>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {nodiTrasv.length > 0 && (
        <div>
          <SectionTitle>Nodi trasversali attivati ({nodiTrasv.length})</SectionTitle>
          <div className="space-y-2">
            {nodiTrasv.map((n, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-slate-900">{n.nodo ?? '—'}</span>
                  {n.asse_di_appartenenza && <Chip>{asseLabel(n.asse_di_appartenenza)}</Chip>}
                </div>
                {n.definizione_breve && <Subtle>{n.definizione_breve}</Subtle>}
                {n.evidenza_nell_opera && (
                  <div className="mt-1">
                    <KeyValue label="Evidenza" value={<Prose>{n.evidenza_nell_opera}</Prose>} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {nodiAssenti.length > 0 && (
        <div>
          <SectionTitle>Nodi attesi ma assenti ({nodiAssenti.length})</SectionTitle>
          <div className="space-y-1.5">
            {nodiAssenti.map((n, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-1 opacity-90">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-700 line-through decoration-slate-300">{n.nodo ?? '—'}</span>
                  {n.asse_di_appartenenza && <Chip color="rejected">{asseLabel(n.asse_di_appartenenza)}</Chip>}
                </div>
                {n.motivazione_assenza && (
                  <p className="text-sm text-slate-600 italic leading-relaxed mt-0.5">{n.motivazione_assenza}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {evidenze.length > 0 && (
        <div>
          <SectionTitle>Evidenze nell'opera ({evidenze.length})</SectionTitle>
          <div className="space-y-2">
            {evidenze.map((e, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {e.tipo && <Chip>{e.tipo.replace(/_/g, ' ')}</Chip>}
                  {e.localizzazione && (
                    <span className="text-xs text-slate-500 font-mono">{e.localizzazione}</span>
                  )}
                  {e.assi_connessi && e.assi_connessi.length > 0 && (
                    <div className="flex gap-1 ml-auto">
                      {e.assi_connessi.map((ax, j) => (
                        <Chip key={j} color="derived">{asseLabel(ax)}</Chip>
                      ))}
                    </div>
                  )}
                </div>
                {e.descrizione && <Prose>{e.descrizione}</Prose>}
                {e.interpretazione_sintetica && (
                  <div className="mt-1">
                    <KeyValue label="Interpretazione" value={<Prose>{e.interpretazione_sintetica}</Prose>} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {rischi.length > 0 && (
        <div>
          <SectionTitle>Rischi di forzatura ({rischi.length})</SectionTitle>
          <div className="space-y-1.5">
            {rischi.map((r, i) => (
              <CalloutBox
                key={i}
                title={[r.tipo_di_rischio, r.asse_coinvolto && asseLabel(r.asse_coinvolto)].filter(Boolean).join(' · ') || 'rischio'}
                tone="amber"
              >
                {r.descrizione && <Prose>{r.descrizione}</Prose>}
                {r.cautela_adottata && (
                  <div className="mt-2">
                    <KeyValue label="Cautela adottata" value={<Prose>{r.cautela_adottata}</Prose>} />
                  </div>
                )}
              </CalloutBox>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ───── step 4: saggio-critico-revisione ─────

interface Step4Tesi {
  tesi?: string;
  relazione_con_ipotesi_step2?: string;
  relazione_con_configurazione_step3?: string;
}

interface Step4Scena {
  titolo_sintetico?: string;
  localizzazione?: string;
  analisi?: string;
  assi_attivati?: string[];
  connessione_alla_tesi?: string;
}

interface Step4ControLettura {
  tesi_alternativa?: string;
  basi_nell_opera?: string[];
  relazione_con_lettura_principale?: string;
}

interface Step4Limite {
  tipo?: string;
  descrizione?: string;
}

interface Step4Valore {
  descrizione?: string;
  aspetti_resi_visibili?: string[];
  aspetti_lasciati_aperti?: string[];
  formulazione_conclusiva?: string;
}

interface Step4AsseIntegrato {
  axis_id?: string;
  modalita_di_integrazione?: string;
}

interface Step4Data {
  opera_riferimento?: { titolo?: string; autore?: string };
  tesi_interpretativa_centrale?: Step4Tesi;
  testo_saggio?: string;
  analisi_scene_momenti_forti?: Step4Scena[];
  contro_lettura?: Step4ControLettura;
  limiti_della_lettura?: Step4Limite[];
  valore_aggiunto_del_modello?: Step4Valore;
  assi_integrati_nel_saggio?: Step4AsseIntegrato[];
  metadata?: Record<string, unknown>;
}

function Step4Viewer({ data }: { data: Step4Data }) {
  const rif = data.opera_riferimento;
  const tesi = data.tesi_interpretativa_centrale;
  const scene = data.analisi_scene_momenti_forti ?? [];
  const contro = data.contro_lettura;
  const limiti = data.limiti_della_lettura ?? [];
  const valore = data.valore_aggiunto_del_modello;
  const assiIntegrati = data.assi_integrati_nel_saggio ?? [];

  return (
    <div className="space-y-5">
      {rif && (rif.titolo || rif.autore) && (
        <p className="text-xs text-slate-500">
          Riferimento: <span className="font-medium text-slate-700">{rif.titolo ?? '—'}</span>
          {rif.autore && <span> · {rif.autore}</span>}
        </p>
      )}

      {tesi && (
        <CalloutBox title="Tesi interpretativa centrale" tone="emerald">
          {tesi.tesi && <Prose>{tesi.tesi}</Prose>}
          {tesi.relazione_con_ipotesi_step2 && (
            <div className="mt-2">
              <KeyValue label="Relazione con ipotesi step 2" value={<Prose>{tesi.relazione_con_ipotesi_step2}</Prose>} />
            </div>
          )}
          {tesi.relazione_con_configurazione_step3 && (
            <div className="mt-2">
              <KeyValue label="Relazione con configurazione step 3" value={<Prose>{tesi.relazione_con_configurazione_step3}</Prose>} />
            </div>
          )}
        </CalloutBox>
      )}

      {data.testo_saggio && (
        <div>
          <SectionTitle>Testo del saggio</SectionTitle>
          <details className="rounded-lg border border-slate-200 bg-white" open>
            <summary className="cursor-pointer text-xs font-semibold text-slate-600 px-4 py-2 border-b border-slate-100">
              {data.testo_saggio.length.toLocaleString('it-IT')} caratteri · clicca per nascondere
            </summary>
            <div className="px-4 py-3 max-h-[500px] overflow-y-auto prose prose-sm prose-slate max-w-none">
              <MarkdownRenderer content={data.testo_saggio} />
            </div>
          </details>
        </div>
      )}

      {scene.length > 0 && (
        <div>
          <SectionTitle>Analisi scene/momenti forti ({scene.length})</SectionTitle>
          <div className="space-y-2">
            {scene.map((s, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-slate-900">{s.titolo_sintetico ?? `Momento ${i + 1}`}</span>
                  {s.localizzazione && (
                    <span className="text-xs text-slate-500 font-mono">{s.localizzazione}</span>
                  )}
                  {s.assi_attivati && s.assi_attivati.length > 0 && (
                    <div className="flex gap-1 ml-auto">
                      {s.assi_attivati.map((ax, j) => (
                        <Chip key={j} color="derived">{asseLabel(ax)}</Chip>
                      ))}
                    </div>
                  )}
                </div>
                {s.analisi && <Prose>{s.analisi}</Prose>}
                {s.connessione_alla_tesi && (
                  <div className="mt-2">
                    <KeyValue label="Connessione alla tesi" value={<Prose>{s.connessione_alla_tesi}</Prose>} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {contro && (contro.tesi_alternativa || contro.basi_nell_opera?.length || contro.relazione_con_lettura_principale) && (
        <CalloutBox title="Contro-lettura" tone="rose">
          {contro.tesi_alternativa && <Prose>{contro.tesi_alternativa}</Prose>}
          {contro.basi_nell_opera && contro.basi_nell_opera.length > 0 && (
            <div className="mt-2">
              <KeyValue label="Basi nell'opera" value={<BulletList items={contro.basi_nell_opera} />} />
            </div>
          )}
          {contro.relazione_con_lettura_principale && (
            <div className="mt-2">
              <KeyValue label="Relazione con lettura principale" value={<Prose>{contro.relazione_con_lettura_principale}</Prose>} />
            </div>
          )}
        </CalloutBox>
      )}

      {limiti.length > 0 && (
        <div>
          <SectionTitle>Limiti della lettura ({limiti.length})</SectionTitle>
          <div className="space-y-1.5">
            {limiti.map((l, i) => (
              <div key={i} className="border-l-2 border-amber-300 pl-3 py-1">
                {l.tipo && <Chip color="da_verificare" className="mb-1">{l.tipo.replace(/_/g, ' ')}</Chip>}
                {l.descrizione && <Prose>{l.descrizione}</Prose>}
              </div>
            ))}
          </div>
        </div>
      )}

      {valore && (
        <div>
          <SectionTitle>Valore aggiunto del modello</SectionTitle>
          <Card>
            {valore.descrizione && <Prose>{valore.descrizione}</Prose>}
            {valore.aspetti_resi_visibili && valore.aspetti_resi_visibili.length > 0 && (
              <div className="mt-2">
                <KeyValue label="Aspetti resi visibili" value={<BulletList items={valore.aspetti_resi_visibili} />} />
              </div>
            )}
            {valore.aspetti_lasciati_aperti && valore.aspetti_lasciati_aperti.length > 0 && (
              <div className="mt-2">
                <KeyValue label="Aspetti lasciati aperti" value={<BulletList items={valore.aspetti_lasciati_aperti} />} />
              </div>
            )}
            {valore.formulazione_conclusiva && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Formulazione conclusiva</p>
                <p className="text-sm text-slate-800 italic leading-relaxed">{valore.formulazione_conclusiva}</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {assiIntegrati.length > 0 && (
        <div>
          <SectionTitle>Assi integrati nel saggio ({assiIntegrati.length})</SectionTitle>
          <div className="space-y-1.5">
            {assiIntegrati.map((a, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-slate-400">{a.axis_id}</span>
                  <span className="font-medium text-slate-700">{asseLabel(a.axis_id)}</span>
                </div>
                {a.modalita_di_integrazione && (
                  <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{a.modalita_di_integrazione}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ───── helpers condivisi step 5 ─────

function BooleanRow({ label, value }: { label: string; value: boolean | undefined }) {
  const ok = value === true;
  const ko = value === false;
  return (
    <div className="flex items-start gap-2 text-sm py-0.5">
      <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
        ok ? 'bg-emerald-100 text-emerald-700' : ko ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400'
      }`}>
        {ok ? '✓' : ko ? '✗' : '·'}
      </span>
      <span className={ko ? 'text-rose-800' : 'text-slate-700'}>{label}</span>
    </div>
  );
}

function MarkdownBlock({ content, label }: { content: string; label?: string }) {
  return (
    <details className="rounded-lg border border-slate-200 bg-white" open>
      <summary className="cursor-pointer text-xs font-semibold text-slate-600 px-4 py-2 border-b border-slate-100">
        {label ?? 'Testo'} · {content.length.toLocaleString('it-IT')} caratteri
      </summary>
      <div className="px-4 py-3 max-h-[500px] overflow-y-auto prose prose-sm prose-slate max-w-none">
        <MarkdownRenderer content={content} />
      </div>
    </details>
  );
}

// ───── step 5a: selezione-editoriale ─────

interface Step5aElementoIncluso {
  elemento?: string;
  funzione_editoriale?: string;
}

interface Step5aStep3Inclusi {
  assi?: string[];
  nodi?: string[];
  evidenze?: string[];
  configurazione_dominante?: boolean;
}

interface Step5aElementoEscluso {
  elemento?: string;
  provenienza?: string;
  motivo_esclusione?: string;
}

interface Step5aSceneValorizzata {
  titolo_sintetico?: string;
  localizzazione?: string;
  motivo_della_scelta?: string;
  come_raccontarla?: string;
}

interface Step5aAsseNodoSel {
  id?: string;
  tipo?: string;
  nome?: string;
  funzione_editoriale?: string;
  formula_linguistica_suggerita?: string;
}

interface Step5aRischio {
  descrizione?: string;
  come_presidiarlo?: string;
}

interface Step5aTitolo {
  titolo_principale?: string;
  sottotitolo?: string;
  titoli_alternativi?: string[];
  motivazione_scelta?: string;
}

interface Step5aSezione {
  numero?: number;
  titolo_sezione?: string;
  funzione?: string;
  materiali_di_riferimento?: string[];
  lunghezza_indicativa?: string;
}

interface Step5aData {
  opera_riferimento?: { titolo?: string; autore?: string };
  tesi_editoriale?: { formulazione_accessibile?: string; relazione_con_tesi_step4?: string };
  elementi_da_includere?: {
    step_1?: Step5aElementoIncluso[];
    step_2?: Step5aElementoIncluso[];
    step_3?: Step5aStep3Inclusi;
    step_4?: Step5aElementoIncluso[];
  };
  elementi_da_escludere?: Step5aElementoEscluso[];
  scene_momenti_da_valorizzare?: Step5aSceneValorizzata[];
  assi_nodi_selezionati?: Step5aAsseNodoSel[];
  rischi_di_forzatura_residui?: Step5aRischio[];
  proposta_titolo?: Step5aTitolo;
  struttura_proposta?: Step5aSezione[];
  nota_editoriale?: string;
}

function Step5aIncluseStepBlock({ label, items }: { label: string; items?: Step5aElementoIncluso[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-emerald-800 mb-1">{label} ({items.length})</p>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="border-l-2 border-emerald-300 pl-2 text-xs">
            <p className="font-medium text-slate-900">{it.elemento ?? '—'}</p>
            {it.funzione_editoriale && (
              <p className="text-slate-600 leading-relaxed mt-0.5 italic">{it.funzione_editoriale}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step5aViewer({ data }: { data: Step5aData }) {
  const tit = data.proposta_titolo;
  const tesi = data.tesi_editoriale;
  const inc = data.elementi_da_includere;
  const inc3 = inc?.step_3;
  const esc = data.elementi_da_escludere ?? [];
  const scene = data.scene_momenti_da_valorizzare ?? [];
  const sel = data.assi_nodi_selezionati ?? [];
  const rischi = data.rischi_di_forzatura_residui ?? [];
  const struttura = data.struttura_proposta ?? [];

  return (
    <div className="space-y-5">
      {tit && (tit.titolo_principale || tit.sottotitolo) && (
        <Card>
          {tit.titolo_principale && <h3 className="text-base font-semibold text-slate-900">{tit.titolo_principale}</h3>}
          {tit.sottotitolo && <p className="text-sm text-slate-600 italic mt-1">{tit.sottotitolo}</p>}
          {tit.titoli_alternativi && tit.titoli_alternativi.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Titoli alternativi</p>
              <BulletList items={tit.titoli_alternativi} />
            </div>
          )}
          {tit.motivazione_scelta && (
            <div className="mt-2"><KeyValue label="Motivazione" value={<Prose>{tit.motivazione_scelta}</Prose>} /></div>
          )}
        </Card>
      )}

      {tesi && (tesi.formulazione_accessibile || tesi.relazione_con_tesi_step4) && (
        <CalloutBox title="Tesi editoriale" tone="emerald">
          {tesi.formulazione_accessibile && <Prose>{tesi.formulazione_accessibile}</Prose>}
          {tesi.relazione_con_tesi_step4 && (
            <div className="mt-2"><KeyValue label="Relazione con tesi step 4" value={<Prose>{tesi.relazione_con_tesi_step4}</Prose>} /></div>
          )}
        </CalloutBox>
      )}

      {inc && (
        <div>
          <SectionTitle>Elementi da includere</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            <Step5aIncluseStepBlock label="Da step 1 (dossier)" items={inc.step_1} />
            <Step5aIncluseStepBlock label="Da step 2 (lettura libera)" items={inc.step_2} />
            <Step5aIncluseStepBlock label="Da step 4 (saggio)" items={inc.step_4} />
            {inc3 && (inc3.assi?.length || inc3.nodi?.length || inc3.evidenze?.length || inc3.configurazione_dominante) && (
              <div>
                <p className="text-xs font-semibold text-emerald-800 mb-1">Da step 3 (assi)</p>
                <div className="space-y-1 text-xs">
                  {inc3.assi && inc3.assi.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {inc3.assi.map((a, i) => <Chip key={i} color="derived">{asseLabel(a)}</Chip>)}
                    </div>
                  )}
                  {inc3.nodi && inc3.nodi.length > 0 && <KeyValue label="Nodi" value={inc3.nodi.join(', ')} />}
                  {inc3.evidenze && inc3.evidenze.length > 0 && <KeyValue label="Evidenze" value={<BulletList items={inc3.evidenze} />} />}
                  {inc3.configurazione_dominante && (
                    <Chip color="forte">configurazione dominante inclusa</Chip>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {esc.length > 0 && (
        <div>
          <SectionTitle>Elementi da escludere ({esc.length})</SectionTitle>
          <div className="space-y-1.5">
            {esc.map((e, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-1 opacity-90">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-slate-800">{e.elemento ?? '—'}</span>
                  {e.provenienza && <Chip>{e.provenienza}</Chip>}
                  {e.motivo_esclusione && <Chip color="rejected">{e.motivo_esclusione.replace(/_/g, ' ')}</Chip>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {scene.length > 0 && (
        <div>
          <SectionTitle>Scene da valorizzare ({scene.length})</SectionTitle>
          <div className="space-y-2">
            {scene.map((s, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-900">{s.titolo_sintetico ?? `Scena ${i + 1}`}</span>
                  {s.localizzazione && <span className="text-xs text-slate-500 font-mono">{s.localizzazione}</span>}
                </div>
                {s.motivo_della_scelta && <KeyValue label="Motivo della scelta" value={<Prose>{s.motivo_della_scelta}</Prose>} />}
                {s.come_raccontarla && <KeyValue label="Come raccontarla" value={<Prose>{s.come_raccontarla}</Prose>} />}
              </Card>
            ))}
          </div>
        </div>
      )}

      {sel.length > 0 && (
        <div>
          <SectionTitle>Assi/nodi selezionati ({sel.length})</SectionTitle>
          <div className="space-y-2">
            {sel.map((s, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {s.tipo && <Chip color={s.tipo === 'asse' ? 'derived' : 'plausibile'}>{s.tipo}</Chip>}
                  <span className="font-medium text-slate-900">{s.nome ?? '—'}</span>
                  <span className="text-xs font-mono text-slate-400">{s.id}</span>
                </div>
                {s.funzione_editoriale && <KeyValue label="Funzione editoriale" value={<Prose>{s.funzione_editoriale}</Prose>} />}
                {s.formula_linguistica_suggerita && (
                  <div className="mt-2 p-2 rounded bg-sky-50 border border-sky-200">
                    <p className="text-xs font-semibold text-sky-800 mb-0.5">Formula linguistica suggerita</p>
                    <p className="text-sm text-sky-900 italic">"{s.formula_linguistica_suggerita}"</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {rischi.length > 0 && (
        <div>
          <SectionTitle>Rischi residui di forzatura ({rischi.length})</SectionTitle>
          <div className="space-y-1.5">
            {rischi.map((r, i) => (
              <CalloutBox key={i} title={`rischio ${i + 1}`} tone="amber">
                {r.descrizione && <Prose>{r.descrizione}</Prose>}
                {r.come_presidiarlo && (
                  <div className="mt-2"><KeyValue label="Come presidiarlo" value={<Prose>{r.come_presidiarlo}</Prose>} /></div>
                )}
              </CalloutBox>
            ))}
          </div>
        </div>
      )}

      {struttura.length > 0 && (
        <div>
          <SectionTitle>Struttura proposta ({struttura.length} sezioni)</SectionTitle>
          <div className="space-y-1.5">
            {struttura.map((s, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-slate-400">§{s.numero ?? i + 1}</span>
                  <span className="font-medium text-slate-900 text-sm">{s.titolo_sezione ?? '—'}</span>
                  {s.lunghezza_indicativa && (
                    <span className="text-xs text-slate-500 ml-auto">{s.lunghezza_indicativa}</span>
                  )}
                </div>
                {s.funzione && <p className="text-xs text-slate-600 italic mt-0.5">{s.funzione}</p>}
                {s.materiali_di_riferimento && s.materiali_di_riferimento.length > 0 && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    materiali: {s.materiali_di_riferimento.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.nota_editoriale && (
        <div>
          <SectionTitle>Nota editoriale</SectionTitle>
          <Card><Prose>{data.nota_editoriale}</Prose></Card>
        </div>
      )}
    </div>
  );
}

// ───── step 5b: scaletta ─────

interface Step5bSezione {
  numero?: number;
  titolo_provvisorio?: string;
  funzione?: string;
  materiali_di_riferimento?: string[];
  tesi_locale?: string;
  contenuti_chiave?: string[];
  lunghezza_indicativa?: string;
  transizione_verso_sezione_successiva?: string;
}

interface Step5bVerifica {
  sequenza_logica_tiene?: boolean;
  tesi_emerge_progressivamente?: boolean;
  sezione_limiti_presente?: boolean;
  sezione_contro_lettura_presente?: boolean;
  nota_metodo_prevista?: boolean;
  lunghezza_nei_limiti?: boolean;
  note?: string;
}

interface Step5bData {
  opera_riferimento?: { titolo?: string; autore?: string };
  titolo_definitivo?: string;
  sottotitolo?: string;
  scaletta?: Step5bSezione[];
  verifica_coerenza?: Step5bVerifica;
  lunghezza_totale_prevista?: string;
  note_di_stesura?: string;
}

function Step5bViewer({ data }: { data: Step5bData }) {
  const scaletta = data.scaletta ?? [];
  const v = data.verifica_coerenza;

  return (
    <div className="space-y-5">
      {(data.titolo_definitivo || data.sottotitolo) && (
        <Card>
          {data.titolo_definitivo && <h3 className="text-base font-semibold text-slate-900">{data.titolo_definitivo}</h3>}
          {data.sottotitolo && <p className="text-sm text-slate-600 italic mt-1">{data.sottotitolo}</p>}
          {data.lunghezza_totale_prevista && (
            <p className="text-xs text-slate-500 mt-2">Lunghezza prevista: {data.lunghezza_totale_prevista}</p>
          )}
        </Card>
      )}

      {scaletta.length > 0 && (
        <div>
          <SectionTitle>Scaletta ({scaletta.length} sezioni)</SectionTitle>
          <div className="space-y-2">
            {scaletta.map((s, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono text-slate-400">§{s.numero ?? i + 1}</span>
                  <span className="font-medium text-slate-900">{s.titolo_provvisorio ?? '—'}</span>
                  {s.lunghezza_indicativa && (
                    <span className="text-xs text-slate-500 ml-auto">{s.lunghezza_indicativa}</span>
                  )}
                </div>
                {s.funzione && <KeyValue label="Funzione" value={<Prose>{s.funzione}</Prose>} />}
                {s.tesi_locale && <KeyValue label="Tesi locale" value={<Prose>{s.tesi_locale}</Prose>} />}
                {s.materiali_di_riferimento && s.materiali_di_riferimento.length > 0 && (
                  <KeyValue label="Materiali" value={s.materiali_di_riferimento.join(', ')} />
                )}
                {s.contenuti_chiave && s.contenuti_chiave.length > 0 && (
                  <KeyValue label="Contenuti chiave" value={<BulletList items={s.contenuti_chiave} />} />
                )}
                {s.transizione_verso_sezione_successiva && (
                  <KeyValue label="Transizione →" value={<Prose>{s.transizione_verso_sezione_successiva}</Prose>} />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {v && (
        <div>
          <SectionTitle>Verifica di coerenza</SectionTitle>
          <Card>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <BooleanRow label="Sequenza logica tiene" value={v.sequenza_logica_tiene} />
              <BooleanRow label="Tesi emerge progressivamente" value={v.tesi_emerge_progressivamente} />
              <BooleanRow label="Sezione limiti presente" value={v.sezione_limiti_presente} />
              <BooleanRow label="Sezione contro-lettura presente" value={v.sezione_contro_lettura_presente} />
              <BooleanRow label="Nota metodo prevista" value={v.nota_metodo_prevista} />
              <BooleanRow label="Lunghezza nei limiti (1500-2500)" value={v.lunghezza_nei_limiti} />
            </div>
            {v.note && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <KeyValue label="Note" value={<Prose>{v.note}</Prose>} />
              </div>
            )}
          </Card>
        </div>
      )}

      {data.note_di_stesura && (
        <div>
          <SectionTitle>Note di stesura</SectionTitle>
          <Card><Prose>{data.note_di_stesura}</Prose></Card>
        </div>
      )}
    </div>
  );
}

// ───── step 5c: stesura ─────

interface Step5cTesto {
  titolo?: string;
  sottotitolo?: string;
  corpo_del_testo?: string;
  nota_sul_metodo?: string;
}

interface Step5cLunghezza {
  corpo_del_testo_parole?: number;
  nota_sul_metodo_parole?: number;
  totale_parole?: number;
}

interface Step5cDeviazione {
  sezione?: string;
  deviazione?: string;
  motivazione?: string;
}

interface Step5cAderenza {
  struttura_rispettata?: boolean;
  deviazioni?: Step5cDeviazione[];
}

interface Step5cNotaRevisione {
  localizzazione?: string;
  tipo?: string;
  nota?: string;
}

interface Step5cData {
  opera_riferimento?: { titolo?: string; autore?: string };
  testo_prima_stesura?: Step5cTesto;
  lunghezza_stimata?: Step5cLunghezza;
  aderenza_alla_scaletta?: Step5cAderenza;
  note_per_revisione?: Step5cNotaRevisione[];
}

function Step5cViewer({ data }: { data: Step5cData }) {
  const t = data.testo_prima_stesura;
  const l = data.lunghezza_stimata;
  const ad = data.aderenza_alla_scaletta;
  const note = data.note_per_revisione ?? [];

  return (
    <div className="space-y-5">
      {t && (
        <Card>
          {t.titolo && <h3 className="text-base font-semibold text-slate-900">{t.titolo}</h3>}
          {t.sottotitolo && <p className="text-sm text-slate-600 italic mt-1">{t.sottotitolo}</p>}
          {l && (
            <p className="text-xs text-slate-500 mt-2">
              {l.totale_parole ?? '—'} parole totali
              {l.corpo_del_testo_parole !== undefined && (
                <span> · corpo: {l.corpo_del_testo_parole}</span>
              )}
              {l.nota_sul_metodo_parole !== undefined && (
                <span> · nota: {l.nota_sul_metodo_parole}</span>
              )}
            </p>
          )}
        </Card>
      )}

      {t?.corpo_del_testo && (
        <div>
          <SectionTitle>Corpo del testo</SectionTitle>
          <MarkdownBlock content={t.corpo_del_testo} label="Corpo" />
        </div>
      )}

      {t?.nota_sul_metodo && (
        <div>
          <SectionTitle>Nota sul metodo</SectionTitle>
          <MarkdownBlock content={t.nota_sul_metodo} label="Nota sul metodo" />
        </div>
      )}

      {ad && (
        <div>
          <SectionTitle>Aderenza alla scaletta</SectionTitle>
          <Card>
            <BooleanRow label="Struttura rispettata senza deviazioni significative" value={ad.struttura_rispettata} />
            {ad.deviazioni && ad.deviazioni.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Deviazioni ({ad.deviazioni.length})</p>
                <div className="space-y-1.5">
                  {ad.deviazioni.map((d, i) => (
                    <div key={i} className="border-l-2 border-amber-300 pl-3 py-1">
                      <p className="text-sm font-medium text-slate-900">{d.sezione ?? '—'}</p>
                      {d.deviazione && <p className="text-sm text-slate-700">{d.deviazione}</p>}
                      {d.motivazione && <p className="text-xs text-slate-600 italic mt-0.5">→ {d.motivazione}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {note.length > 0 && (
        <div>
          <SectionTitle>Note per la revisione ({note.length})</SectionTitle>
          <div className="space-y-1.5">
            {note.map((n, i) => (
              <div key={i} className="border-l-2 border-amber-300 pl-3 py-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {n.tipo && <Chip color="da_verificare">{n.tipo.replace(/_/g, ' ')}</Chip>}
                  {n.localizzazione && (
                    <span className="text-xs text-slate-500 font-mono">{n.localizzazione}</span>
                  )}
                </div>
                {n.nota && <Prose>{n.nota}</Prose>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ───── step 5d: revisione-finale ─────

interface Step5dTesto {
  titolo?: string;
  sottotitolo?: string;
  corpo_del_testo?: string;
  nota_sul_metodo?: string;
  lunghezza_finale_parole?: number;
  formato_consigliato?: string;
}

interface Step5dChecklist {
  comprensibile_senza_opera?: boolean;
  sunto_adeguato?: boolean;
  termini_modello_spiegati?: boolean;
  metodo_chiaro_non_invasivo?: boolean;
  assi_come_lenti_non_etichette?: boolean;
  tesi_emerge_con_forza?: boolean;
  evidenze_sufficienti?: boolean;
  limiti_dichiarati?: boolean;
  contro_lettura_presente?: boolean;
  nessun_dato_inventato?: boolean;
  nessuna_intenzione_attribuita?: boolean;
  distinzione_contenuto_interpretazione?: boolean;
  no_diagnostica_personaggi?: boolean;
  qualita_editoriale?: boolean;
  lunghezza_adeguata?: boolean;
  nota_metodo_sobria?: boolean;
  note_checklist?: string;
}

interface Step5dLogModifica {
  sezione?: string;
  tipo_modifica?: string;
  descrizione?: string;
  motivazione?: string;
}

interface Step5dValutazione {
  punti_di_forza?: string[];
  limiti_residui?: string[];
  note_per_eventuale_pubblicazione?: string;
}

interface Step5dData {
  opera_riferimento?: { titolo?: string; autore?: string };
  testo_finale?: Step5dTesto;
  checklist_di_controllo?: Step5dChecklist;
  log_modifiche?: Step5dLogModifica[];
  valutazione_finale?: Step5dValutazione;
}

const CHECKLIST_LABELS: Record<keyof Step5dChecklist, string> = {
  comprensibile_senza_opera:            'Comprensibile senza conoscere l\'opera',
  sunto_adeguato:                       'Sunto adeguato',
  termini_modello_spiegati:             'Termini del modello spiegati',
  metodo_chiaro_non_invasivo:           'Metodo chiaro ma non invasivo',
  assi_come_lenti_non_etichette:        'Assi come lenti, non etichette',
  tesi_emerge_con_forza:                'Tesi emerge con forza',
  evidenze_sufficienti:                 'Evidenze sufficienti',
  limiti_dichiarati:                    'Limiti dichiarati',
  contro_lettura_presente:              'Contro-lettura presente',
  nessun_dato_inventato:                'Nessun dato inventato',
  nessuna_intenzione_attribuita:        'Nessuna intenzione attribuita',
  distinzione_contenuto_interpretazione:'Distinzione contenuto/interpretazione',
  no_diagnostica_personaggi:            'No diagnostica personaggi',
  qualita_editoriale:                   'Qualità editoriale',
  lunghezza_adeguata:                   'Lunghezza adeguata',
  nota_metodo_sobria:                   'Nota sul metodo sobria',
  note_checklist:                       '',
};

function Step5dViewer({ data }: { data: Step5dData }) {
  const t = data.testo_finale;
  const c = data.checklist_di_controllo;
  const log = data.log_modifiche ?? [];
  const v = data.valutazione_finale;

  const checklistKeys = (Object.keys(CHECKLIST_LABELS) as (keyof Step5dChecklist)[])
    .filter((k) => k !== 'note_checklist');
  const passed = c ? checklistKeys.filter((k) => c[k] === true).length : 0;
  const failed = c ? checklistKeys.filter((k) => c[k] === false).length : 0;

  return (
    <div className="space-y-5">
      {t && (
        <Card>
          {t.titolo && <h3 className="text-base font-semibold text-slate-900">{t.titolo}</h3>}
          {t.sottotitolo && <p className="text-sm text-slate-600 italic mt-1">{t.sottotitolo}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {t.formato_consigliato && <Chip>{t.formato_consigliato.replace(/_/g, ' ')}</Chip>}
            {t.lunghezza_finale_parole !== undefined && (
              <span className="text-xs text-slate-500">{t.lunghezza_finale_parole} parole</span>
            )}
          </div>
        </Card>
      )}

      {t?.corpo_del_testo && (
        <div>
          <SectionTitle>Corpo del testo (versione finale)</SectionTitle>
          <MarkdownBlock content={t.corpo_del_testo} label="Corpo finale" />
        </div>
      )}

      {t?.nota_sul_metodo && (
        <div>
          <SectionTitle>Nota sul metodo</SectionTitle>
          <MarkdownBlock content={t.nota_sul_metodo} label="Nota sul metodo" />
        </div>
      )}

      {c && (
        <div>
          <SectionTitle>
            Checklist di controllo
            <span className="ml-2 text-xs font-normal text-slate-500">
              {passed}/{checklistKeys.length} passati
              {failed > 0 && <span className="text-rose-700"> · {failed} fallit{failed === 1 ? 'o' : 'i'}</span>}
            </span>
          </SectionTitle>
          <Card>
            <div className="grid sm:grid-cols-2 gap-x-4">
              {checklistKeys.map((k) => (
                <BooleanRow key={k} label={CHECKLIST_LABELS[k]} value={c[k] as boolean | undefined} />
              ))}
            </div>
            {c.note_checklist && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <KeyValue label="Note checklist" value={<Prose>{c.note_checklist}</Prose>} />
              </div>
            )}
          </Card>
        </div>
      )}

      {log.length > 0 && (
        <div>
          <SectionTitle>Log modifiche ({log.length})</SectionTitle>
          <div className="space-y-1.5">
            {log.map((m, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {m.tipo_modifica && <Chip color="derived">{m.tipo_modifica.replace(/_/g, ' ')}</Chip>}
                  {m.sezione && <span className="text-xs text-slate-500 font-mono">{m.sezione}</span>}
                </div>
                {m.descrizione && <Prose>{m.descrizione}</Prose>}
                {m.motivazione && (
                  <p className="text-xs text-slate-600 italic mt-0.5">→ {m.motivazione}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {v && (
        <div>
          <SectionTitle>Valutazione finale</SectionTitle>
          <Card>
            {v.punti_di_forza && v.punti_di_forza.length > 0 && (
              <KeyValue label="Punti di forza" value={<BulletList items={v.punti_di_forza} />} />
            )}
            {v.limiti_residui && v.limiti_residui.length > 0 && (
              <KeyValue label="Limiti residui" value={<BulletList items={v.limiti_residui} />} />
            )}
            {v.note_per_eventuale_pubblicazione && (
              <KeyValue label="Note per pubblicazione" value={<Prose>{v.note_per_eventuale_pubblicazione}</Prose>} />
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// ───── step 5e: resoconto-processo ─────

interface Step5eMomento {
  titolo_sintetico?: string;
  step_di_provenienza?: string;
  descrizione?: string;
  impatto_sul_percorso?: string;
}

interface Step5eData {
  opera_riferimento?: { titolo?: string; autore?: string };
  domanda_di_partenza?: string;
  momenti_salienti?: Step5eMomento[];
  testo_resoconto?: string;
  nota_tecnica?: string;
}

function Step5eViewer({ data }: { data: Step5eData }) {
  const momenti = data.momenti_salienti ?? [];

  return (
    <div className="space-y-5">
      {data.domanda_di_partenza && (
        <CalloutBox title="Domanda di partenza" tone="sky">
          <Prose>{data.domanda_di_partenza}</Prose>
        </CalloutBox>
      )}

      {momenti.length > 0 && (
        <div>
          <SectionTitle>Momenti salienti ({momenti.length})</SectionTitle>
          <div className="space-y-2">
            {momenti.map((m, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono text-slate-400">{i + 1}</span>
                  <span className="font-medium text-slate-900">{m.titolo_sintetico ?? '—'}</span>
                  {m.step_di_provenienza && <Chip>{m.step_di_provenienza}</Chip>}
                </div>
                {m.descrizione && <Prose>{m.descrizione}</Prose>}
                {m.impatto_sul_percorso && (
                  <div className="mt-2"><KeyValue label="Impatto sul percorso" value={<Prose>{m.impatto_sul_percorso}</Prose>} /></div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {data.testo_resoconto && (
        <div>
          <SectionTitle>Testo del resoconto</SectionTitle>
          <MarkdownBlock content={data.testo_resoconto} label="Resoconto" />
        </div>
      )}

      {data.nota_tecnica && (
        <div>
          <SectionTitle>Nota tecnica</SectionTitle>
          <Card><Prose>{data.nota_tecnica}</Prose></Card>
        </div>
      )}
    </div>
  );
}

// ───── step 5f: saggio-integrato ─────

const TECNICA_INTRECCIO_COLORS: Record<string, string> = {
  'opera-poi-processo':   'plausibile',
  'processo-poi-opera':   'derived',
  'parallelo':            'forte',
};

interface Step5fNucleo {
  titolo?: string;
  dimensione_interpretativa?: string;
  dimensione_di_processo?: string;
  tecnica_di_intreccio?: string;
}

interface Step5fTesto {
  titolo?: string;
  sottotitolo?: string;
  testo_completo?: string;
}

interface Step5fData {
  opera_riferimento?: { titolo?: string; autore?: string };
  principio_strutturale?: string;
  nuclei_tematici?: Step5fNucleo[];
  testo_integrato?: Step5fTesto;
  lunghezza_stimata?: number;
  note_di_stesura?: string;
}

function Step5fViewer({ data }: { data: Step5fData }) {
  const nuclei = data.nuclei_tematici ?? [];
  const t = data.testo_integrato;

  return (
    <div className="space-y-5">
      {t && (
        <Card>
          {t.titolo && <h3 className="text-base font-semibold text-slate-900">{t.titolo}</h3>}
          {t.sottotitolo && <p className="text-sm text-slate-600 italic mt-1">{t.sottotitolo}</p>}
          {data.lunghezza_stimata !== undefined && (
            <p className="text-xs text-slate-500 mt-2">{data.lunghezza_stimata} parole</p>
          )}
        </Card>
      )}

      {data.principio_strutturale && (
        <CalloutBox title="Principio strutturale" tone="sky">
          <Prose>{data.principio_strutturale}</Prose>
        </CalloutBox>
      )}

      {nuclei.length > 0 && (
        <div>
          <SectionTitle>Nuclei tematici ({nuclei.length})</SectionTitle>
          <div className="space-y-2">
            {nuclei.map((n, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono text-slate-400">{i + 1}</span>
                  <span className="font-medium text-slate-900">{n.titolo ?? '—'}</span>
                  {n.tecnica_di_intreccio && (
                    <Chip color={TECNICA_INTRECCIO_COLORS[n.tecnica_di_intreccio] ?? 'slate'}>
                      {n.tecnica_di_intreccio.replace(/-/g, ' ')}
                    </Chip>
                  )}
                </div>
                {n.dimensione_interpretativa && (
                  <KeyValue label="Dimensione interpretativa" value={<Prose>{n.dimensione_interpretativa}</Prose>} />
                )}
                {n.dimensione_di_processo && (
                  <KeyValue label="Dimensione di processo" value={<Prose>{n.dimensione_di_processo}</Prose>} />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {t?.testo_completo && (
        <div>
          <SectionTitle>Testo integrato</SectionTitle>
          <MarkdownBlock content={t.testo_completo} label="Saggio integrato" />
        </div>
      )}

      {data.note_di_stesura && (
        <div>
          <SectionTitle>Note di stesura</SectionTitle>
          <Card><Prose>{data.note_di_stesura}</Prose></Card>
        </div>
      )}
    </div>
  );
}

// ───── dispatcher ─────

export interface LettureOutputViewerProps {
  stepId: string;
  data: unknown;
}

export default function LettureOutputViewer({ stepId, data }: LettureOutputViewerProps) {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;

  switch (stepId) {
    case 'step_1':  return <Step1Viewer  data={d as Step1Data} />;
    case 'step_2':  return <Step2Viewer  data={d as Step2Data} />;
    case 'step_3':  return <Step3Viewer  data={d as Step3Data} />;
    case 'step_4':  return <Step4Viewer  data={d as Step4Data} />;
    case 'step_5a': return <Step5aViewer data={d as Step5aData} />;
    case 'step_5b': return <Step5bViewer data={d as Step5bData} />;
    case 'step_5c': return <Step5cViewer data={d as Step5cData} />;
    case 'step_5d': return <Step5dViewer data={d as Step5dData} />;
    case 'step_5e': return <Step5eViewer data={d as Step5eData} />;
    case 'step_5f': return <Step5fViewer data={d as Step5fData} />;
    default: return null;
  }
}

const SUPPORTED_STEPS = new Set([
  'step_1', 'step_2', 'step_3', 'step_4',
  'step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f',
]);

export function hasLettureViewer(stepId: string): boolean {
  return SUPPORTED_STEPS.has(stepId);
}
