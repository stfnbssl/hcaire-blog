import { Request, Response } from 'express';
import { readMarkdownFile, splitByH2 } from '../services/staticContentReader';

const HCAIRE_INDEX = 'hcaire/index.md';

// Slugs for the sections derived from ## headings in index.md.
// Le sezioni con file standalone in hcaire/<slug>.md NON vanno mappate qui:
// il controller cerca prima nelle sezioni di index.md, poi nei file standalone.
// Migrate: "metodo" è ora servito da hcaire/metodo.md, "manifesto" da hcaire/manifesto.md.
const SECTION_SLUGS: Record<string, string> = {
  'un progetto fondativo': 'progetti',
  'un ambiente editoriale': 'ambiente-editoriale',
  'bartleby': 'bartleby-preview',
  'una intelligenza artificiale orientata alla comprensione': 'ia-centrata-sull-umano',
  'un ambiente aperto': 'ambiente-aperto',
};

function buildSections() {
  const { content, isEmpty } = readMarkdownFile(HCAIRE_INDEX);
  if (isEmpty) return [];

  // The file starts with H1 and H2 subtitle before the ## sections
  // Split by ## to get all named sections
  const h2sections = splitByH2(content);
  return h2sections.map((s) => {
    const slug = SECTION_SLUGS[s.title.toLowerCase()] ?? s.title.toLowerCase().replace(/\s+/g, '-');
    return { slug, title: s.title, content: s.content, isEmpty: !s.content.trim() };
  });
}

// GET /api/hcaire — returns all sections with content
export function getHcaireIndex(req: Request, res: Response) {
  try {
    const sections = buildSections();
    const { content } = readMarkdownFile(HCAIRE_INDEX);
    // Return the raw full content plus the split sections
    res.json({ sections, fullContent: content });
  } catch (err) {
    res.status(500).json({ error: 'Errore lettura contenuto HCAIRE' });
  }
}

// GET /api/hcaire/:section — returns a single section
export function getHcaireSection(req: Request, res: Response) {
  try {
    const { section } = req.params;
    const sections = buildSections();
    const found = sections.find((s) => s.slug === section);
    if (found) {
      return res.json(found);
    }
    // Fall back to standalone file hcaire/{section}.md
    const standalone = readMarkdownFile(`hcaire/${section}.md`);
    if (!standalone.isEmpty || Object.keys(standalone.frontmatter).length > 0) {
      return res.json({
        slug: section,
        title: (standalone.frontmatter.title as string) ?? section,
        content: standalone.content,
        isEmpty: standalone.isEmpty,
        frontmatter: standalone.frontmatter,
      });
    }
    // Fall back to hcaire/{section}/index.md (for subsection landing pages)
    const indexFile = readMarkdownFile(`hcaire/${section}/index.md`);
    if (!indexFile.isEmpty || Object.keys(indexFile.frontmatter).length > 0) {
      return res.json({
        slug: section,
        title: (indexFile.frontmatter.title as string) ?? section,
        content: indexFile.content,
        isEmpty: indexFile.isEmpty,
        frontmatter: indexFile.frontmatter,
      });
    }
    return res.status(404).json({ error: 'Sezione non trovata' });
  } catch (err) {
    res.status(500).json({ error: 'Errore lettura sezione HCAIRE' });
  }
}

// GET /api/hcaire/:section/:subsection — returns a subsection page
export function getHcaireSubsection(req: Request, res: Response) {
  try {
    const { section, subsection } = req.params;
    const file = readMarkdownFile(`hcaire/${section}/${subsection}.md`);
    if (file.isEmpty && Object.keys(file.frontmatter).length === 0) {
      return res.status(404).json({ error: 'Pagina non trovata' });
    }
    return res.json({
      slug: subsection,
      title: (file.frontmatter.title as string) ?? subsection,
      content: file.content,
      isEmpty: file.isEmpty,
      frontmatter: file.frontmatter,
    });
  } catch (err) {
    res.status(500).json({ error: 'Errore lettura contenuto' });
  }
}
