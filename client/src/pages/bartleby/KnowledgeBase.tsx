import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BartlebyNav from '../../components/bartleby/BartlebyNav';
import {
  getConceptNodes, getConceptNodeById,
  getDomainAreas,  getDomainAreaById,
  getSkills,       getSkillById,
  getFoundationDocuments, getFoundationDocumentById,
} from '../../services/bartlebyService';
import type {
  ConceptNode, DomainArea, Skill, FoundationDocument,
} from '../../types/bartleby';

type Tab = 'nodes' | 'areas' | 'skills' | 'foundations';

const TAB_LABELS: Record<Tab, string> = {
  nodes:       'Nodi trasversali',
  areas:       'Ambiti',
  skills:      'Skill',
  foundations: 'Documenti fondativi',
};

// ─── Pill badge ───────────────────────────────────────────────────────────────
function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs bg-slate-100 text-slate-600 rounded px-2 py-0.5">{label}</span>
  );
}

// ─── Lista nodi ───────────────────────────────────────────────────────────────
function NodeList({ onSelect }: { onSelect: (id: string) => void }) {
  const [nodes, setNodes]   = useState<ConceptNode[]>([]);
  const [loading, setLoad]  = useState(true);
  useEffect(() => { getConceptNodes().then(setNodes).finally(() => setLoad(false)); }, []);
  if (loading) return <Spinner />;
  return (
    <ul className="space-y-2">
      {nodes.map((n) => (
        <li key={n.bartlebyId}>
          <button
            onClick={() => onSelect(n.bartlebyId)}
            className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group"
          >
            <p className="font-medium text-slate-800 group-hover:text-slate-900">{n.name}</p>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{n.definition}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ─── Dettaglio nodo ───────────────────────────────────────────────────────────
function NodeDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [node, setNode]    = useState<ConceptNode | null>(null);
  const [loading, setLoad] = useState(true);
  useEffect(() => { getConceptNodeById(id).then(setNode).finally(() => setLoad(false)); }, [id]);
  if (loading) return <Spinner />;
  if (!node) return <p className="text-red-600 text-sm">Nodo non trovato.</p>;
  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div>
        <h2 className="text-xl font-bold text-slate-900">{node.name}</h2>
        <Badge label={node.priority_level} />
      </div>
      <Section title="Definizione"><p className="text-slate-700 leading-relaxed">{node.definition}</p></Section>
      <Section title="Perché è trasversale"><p className="text-slate-700 leading-relaxed">{node.why_transversal}</p></Section>
      {node.guiding_questions?.length > 0 && (
        <Section title="Domande guida">
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            {node.guiding_questions.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </Section>
      )}
      {node.reduction_risks?.length > 0 && (
        <Section title="Rischi di riduzione">
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            {node.reduction_risks.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </Section>
      )}
      {node.related_area_sheets && node.related_area_sheets.length > 0 && (
        <Section title="Ambiti collegati">
          <div className="flex flex-wrap gap-2">
            {node.related_area_sheets.map((a) => (
              <Link key={a.bartlebyId} to={`/bartleby/knowledge-base/domain-areas/${a.domain_area_id}`}
                className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900">
                {a.title.replace('Scheda di ambito — ', '')}
              </Link>
            ))}
          </div>
        </Section>
      )}
      {node.related_skills && node.related_skills.length > 0 && (
        <Section title="Skill collegate">
          <ul className="space-y-1">
            {node.related_skills.map((s) => (
              <li key={s.bartlebyId}>
                <Link to={`/bartleby/knowledge-base/skills/${s.bartlebyId}`}
                  className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900">
                  {s.name}
                </Link>
                <span className="ml-2 text-xs text-slate-400">{s.skill_type}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {node.example_outputs && node.example_outputs.length > 0 && (
        <Section title="Output esemplificativi">
          <ul className="space-y-1">
            {node.example_outputs.map((o) => (
              <li key={o.bartlebyId}>
                <Link to={`/bartleby/outputs/${o.bartlebyId}`}
                  className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

// ─── Lista ambiti ─────────────────────────────────────────────────────────────
function AreaList({ onSelect }: { onSelect: (id: string) => void }) {
  const [areas, setAreas]  = useState<DomainArea[]>([]);
  const [loading, setLoad] = useState(true);
  useEffect(() => { getDomainAreas().then(setAreas).finally(() => setLoad(false)); }, []);
  if (loading) return <Spinner />;
  return (
    <ul className="space-y-2">
      {areas.map((a) => (
        <li key={a.bartlebyId}>
          <button onClick={() => onSelect(a.bartlebyId)}
            className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group">
            <p className="font-medium text-slate-800 group-hover:text-slate-900">{a.name}</p>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{a.purpose}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ─── Dettaglio ambito ─────────────────────────────────────────────────────────
function AreaDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [area, setArea]    = useState<DomainArea | null>(null);
  const [loading, setLoad] = useState(true);
  useEffect(() => { getDomainAreaById(id).then(setArea).finally(() => setLoad(false)); }, [id]);
  if (loading) return <Spinner />;
  if (!area) return <p className="text-red-600 text-sm">Ambito non trovato.</p>;
  const sheet = area.area_sheet;
  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <h2 className="text-xl font-bold text-slate-900">{area.name}</h2>
      <Section title="Finalità"><p className="text-slate-700 leading-relaxed">{area.purpose}</p></Section>
      <Section title="Stile linguistico"><p className="text-slate-700">{area.language_style}</p></Section>
      <Section title="Profilo di rischio"><p className="text-slate-700">{area.risk_profile}</p></Section>
      {sheet && (
        <>
          {sheet.scope && <Section title="Scopo operativo"><p className="text-slate-700 leading-relaxed">{sheet.scope}</p></Section>}
          {sheet.translation_of_model && (
            <Section title="Come si traduce il modello">
              <p className="text-slate-700 leading-relaxed">{sheet.translation_of_model}</p>
            </Section>
          )}
          {sheet.guiding_questions?.length > 0 && (
            <Section title="Domande guida">
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {sheet.guiding_questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </Section>
          )}
          {sheet.reduction_risks?.length > 0 && (
            <Section title="Rischi di riduzione">
              <ul className="space-y-1">
                {(sheet.reduction_risks as Array<{ name: string; description: string }>).map((r, i) => (
                  <li key={i} className="text-sm text-slate-700">
                    <span className="font-medium">{r.name}:</span> {r.description}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}
      {area.priority_nodes && area.priority_nodes.length > 0 && (
        <Section title="Nodi prioritari">
          <div className="flex flex-wrap gap-2">
            {area.priority_nodes.map((n) => (
              <button key={n.bartlebyId} onClick={onBack}
                className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900">
                {n.name}
              </button>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Lista skill ──────────────────────────────────────────────────────────────
function SkillList({ onSelect }: { onSelect: (id: string) => void }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoad]  = useState(true);
  useEffect(() => { getSkills().then(setSkills).finally(() => setLoad(false)); }, []);
  if (loading) return <Spinner />;
  const fondative = skills.filter((s) => s.skill_type === 'fondativa');
  const ambito    = skills.filter((s) => s.skill_type !== 'fondativa');
  return (
    <div className="space-y-6">
      {fondative.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Fondative</h3>
          <ul className="space-y-2">
            {fondative.map((s) => <SkillItem key={s.bartlebyId} skill={s} onSelect={onSelect} />)}
          </ul>
        </div>
      )}
      {ambito.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Di ambito</h3>
          <ul className="space-y-2">
            {ambito.map((s) => <SkillItem key={s.bartlebyId} skill={s} onSelect={onSelect} />)}
          </ul>
        </div>
      )}
    </div>
  );
}
function SkillItem({ skill, onSelect }: { skill: Skill; onSelect: (id: string) => void }) {
  return (
    <li>
      <button onClick={() => onSelect(skill.bartlebyId)}
        className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group">
        <div className="flex items-center gap-2">
          <Badge label={skill.skill_type} />
          <p className="font-medium text-slate-800 group-hover:text-slate-900">{skill.name}</p>
        </div>
        {skill.description && (
          <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{skill.description}</p>
        )}
      </button>
    </li>
  );
}

// ─── Dettaglio skill ──────────────────────────────────────────────────────────
function SkillDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [skill, setSkill]  = useState<Skill | null>(null);
  const [loading, setLoad] = useState(true);
  useEffect(() => { getSkillById(id).then(setSkill).finally(() => setLoad(false)); }, [id]);
  if (loading) return <Spinner />;
  if (!skill) return <p className="text-red-600 text-sm">Skill non trovata.</p>;
  const payload = skill.instruction_payload as Record<string, unknown> | null;
  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-2">
        <Badge label={skill.skill_type} />
        <h2 className="text-xl font-bold text-slate-900">{skill.name}</h2>
      </div>
      {skill.description && <Section title="Descrizione"><p className="text-slate-700 leading-relaxed">{skill.description}</p></Section>}
      {typeof payload?.function_in_system === 'string' && (
        <Section title="Funzione nel sistema">
          <p className="text-slate-700 leading-relaxed">{payload.function_in_system}</p>
        </Section>
      )}
      {Array.isArray(payload?.key_concepts) && (
        <Section title="Concetti chiave">
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            {(payload.key_concepts as string[]).map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Section>
      )}
      {Array.isArray(payload?.activation_triggers) && (
        <Section title="Trigger di attivazione">
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            {(payload.activation_triggers as string[]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </Section>
      )}
      {skill.related_nodes && skill.related_nodes.length > 0 && (
        <Section title="Nodi collegati">
          <div className="flex flex-wrap gap-2">
            {skill.related_nodes.map((n) => (
              <span key={n.bartlebyId} className="text-sm text-slate-700">{n.name}</span>
            ))}
          </div>
        </Section>
      )}
      {skill.related_areas && skill.related_areas.length > 0 && (
        <Section title="Ambiti in cui opera">
          <div className="flex flex-wrap gap-2">
            {skill.related_areas.map((a) => (
              <span key={a.bartlebyId} className="text-sm text-slate-700">{a.name}</span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Lista fondativi ──────────────────────────────────────────────────────────
function FoundationList({ onSelect }: { onSelect: (id: string) => void }) {
  const [docs, setDocs]    = useState<FoundationDocument[]>([]);
  const [loading, setLoad] = useState(true);
  useEffect(() => { getFoundationDocuments().then(setDocs).finally(() => setLoad(false)); }, []);
  if (loading) return <Spinner />;
  return (
    <ul className="space-y-2">
      {docs.map((d) => (
        <li key={d.bartlebyId}>
          <button onClick={() => onSelect(d.bartlebyId)}
            className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group">
            <p className="font-medium text-slate-800 group-hover:text-slate-900">{d.title}</p>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{d.summary}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ─── Dettaglio fondativo ──────────────────────────────────────────────────────
function FoundationDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [doc, setDoc]      = useState<FoundationDocument | null>(null);
  const [loading, setLoad] = useState(true);
  useEffect(() => { getFoundationDocumentById(id).then(setDoc).finally(() => setLoad(false)); }, [id]);
  if (loading) return <Spinner />;
  if (!doc) return <p className="text-red-600 text-sm">Documento non trovato.</p>;
  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div>
        <Badge label={doc.type} />
        <h2 className="text-xl font-bold text-slate-900 mt-1">{doc.title}</h2>
      </div>
      <Section title="Sintesi"><p className="text-slate-700 leading-relaxed">{doc.summary}</p></Section>
      {doc.generated_nodes && doc.generated_nodes.length > 0 && (
        <Section title="Nodi generati">
          <ul className="space-y-1">
            {doc.generated_nodes.map((n) => (
              <li key={n.bartlebyId} className="text-sm text-slate-700">{n.name}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

// ─── Helpers UI ───────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-slate-600" />
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{title}</h3>
      {children}
    </div>
  );
}
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-sm text-slate-400 hover:text-slate-600">
      ← Indietro
    </button>
  );
}

// ─── Pagina principale ────────────────────────────────────────────────────────
export default function KnowledgeBase() {
  const { section, itemId } = useParams<{ section?: string; itemId?: string }>();
  const navigate            = useNavigate();

  // Determina il tab attivo in base all'URL
  const tabFromSection = (s?: string): Tab => {
    if (s === 'domain-areas')         return 'areas';
    if (s === 'skills')               return 'skills';
    if (s === 'foundation-documents') return 'foundations';
    return 'nodes';
  };
  const activeTab = tabFromSection(section);

  const handleTabChange = (tab: Tab) => {
    const paths: Record<Tab, string> = {
      nodes:       '/bartleby/knowledge-base',
      areas:       '/bartleby/knowledge-base/domain-areas',
      skills:      '/bartleby/knowledge-base/skills',
      foundations: '/bartleby/knowledge-base/foundation-documents',
    };
    navigate(paths[tab]);
  };

  const handleSelect = useCallback((id: string) => {
    navigate(`/bartleby/knowledge-base/${section ?? 'concept-nodes'}/${id}`);
  }, [navigate, section]);

  const handleBack = useCallback(() => {
    navigate(`/bartleby/knowledge-base${section ? `/${section}` : ''}`);
  }, [navigate, section]);

  return (
    <div>
      <BartlebyNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Knowledge Base</h1>
        <p className="text-slate-500 text-sm mb-6">
          La base di conoscenza strutturata di HCAIRE: fondamenti, nodi concettuali, ambiti, skill.
        </p>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`whitespace-nowrap pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-slate-800 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Contenuto tab */}
        {itemId ? (
          /* Vista dettaglio */
          activeTab === 'nodes'       ? <NodeDetail       id={itemId} onBack={handleBack} /> :
          activeTab === 'areas'       ? <AreaDetail       id={itemId} onBack={handleBack} /> :
          activeTab === 'skills'      ? <SkillDetail      id={itemId} onBack={handleBack} /> :
                                        <FoundationDetail id={itemId} onBack={handleBack} />
        ) : (
          /* Vista lista */
          activeTab === 'nodes'       ? <NodeList       onSelect={handleSelect} /> :
          activeTab === 'areas'       ? <AreaList       onSelect={handleSelect} /> :
          activeTab === 'skills'      ? <SkillList      onSelect={handleSelect} /> :
                                        <FoundationList onSelect={handleSelect} />
        )}
      </div>
    </div>
  );
}
