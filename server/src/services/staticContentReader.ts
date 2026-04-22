import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Lazy getter: reads env at call time, not at import time (dotenv runs after imports).
// Falls back to server/content/ (relative to compiled output at server/dist/services/).
export function getContentBase(): string {
  return process.env.CONTENT_BASE_PATH
    || path.resolve(__dirname, '../../content');
}

export interface ParsedSection {
  slug: string;
  title: string;
  content: string;
  isEmpty: boolean;
}

export interface ParsedChapter {
  frontmatter: Record<string, unknown>;
  content: string;
  isEmpty: boolean;
}

function stripMdFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\\([.!\-])/g, '$1')
    .trim();
}

export function readMarkdownFile(relativePath: string): ParsedChapter {
  const fullPath = path.join(getContentBase(), relativePath);
  if (!fs.existsSync(fullPath)) {
    return { frontmatter: {}, content: '', isEmpty: true };
  }
  const raw = fs.readFileSync(fullPath, 'utf-8');
  if (!raw.trim()) {
    return { frontmatter: {}, content: '', isEmpty: true };
  }
  const { data, content } = matter(raw);
  return { frontmatter: data, content: content.trim(), isEmpty: !content.trim() };
}

// Split a markdown string by H1 headings (# )
export function splitByH1(rawText: string): Array<{ rawHeading: string; title: string; content: string }> {
  const lines = rawText.split('\n');
  const sections: Array<{ rawHeading: string; title: string; content: string; lines: string[] }> = [];
  let current: { rawHeading: string; title: string; lines: string[] } | null = null;
  const preamble: string[] = [];

  for (const line of lines) {
    if (/^# [^#]/.test(line)) {
      if (current) {
        sections.push({ ...current, content: current.lines.join('\n').trim() });
      } else if (preamble.length) {
        sections.push({ rawHeading: '', title: '__preamble__', lines: preamble, content: preamble.join('\n').trim() });
      }
      const rawHeading = line.slice(2).trim();
      current = { rawHeading, title: stripMdFormatting(rawHeading), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      preamble.push(line);
    }
  }
  if (current) sections.push({ ...current, content: current.lines.join('\n').trim() });

  return sections;
}

// Split a markdown section by H2 headings (## )
export function splitByH2(rawText: string): Array<{ rawHeading: string; title: string; content: string }> {
  const lines = rawText.split('\n');
  const sections: Array<{ rawHeading: string; title: string; content: string; lines: string[] }> = [];
  let current: { rawHeading: string; title: string; lines: string[] } | null = null;
  const preamble: string[] = [];

  for (const line of lines) {
    if (/^## [^#]/.test(line) || line === '## ') {
      if (current) {
        sections.push({ ...current, content: current.lines.join('\n').trim() });
      } else if (preamble.length) {
        sections.push({ rawHeading: '', title: '__preamble__', lines: preamble, content: preamble.join('\n').trim() });
      }
      const rawHeading = line.slice(3).trim();
      current = { rawHeading, title: stripMdFormatting(rawHeading), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      preamble.push(line);
    }
  }
  if (current) sections.push({ ...current, content: current.lines.join('\n').trim() });

  return sections;
}

// List immediate subdirectories of a path relative to CONTENT_BASE
export function listSubdirectories(relativePath: string): string[] {
  const fullPath = path.join(getContentBase(), relativePath);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath).filter((name) => {
    const p = path.join(fullPath, name);
    return fs.statSync(p).isDirectory();
  });
}

// List .md files in a directory relative to CONTENT_BASE
export function listMdFiles(relativePath: string): string[] {
  const fullPath = path.join(getContentBase(), relativePath);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath)
    .filter((name) => name.endsWith('.md'))
    .sort();
}

// Read all .md files in a dir, parse frontmatter, return sorted by `chapter` or `order`
export function readChaptersInDir(relativePath: string): ParsedChapter[] {
  const files = listMdFiles(relativePath);
  const chapters = files.map((filename) => readMarkdownFile(path.join(relativePath, filename)));
  return chapters.sort((a, b) => {
    const ao = (a.frontmatter.chapter ?? a.frontmatter.order ?? 0) as number;
    const bo = (b.frontmatter.chapter ?? b.frontmatter.order ?? 0) as number;
    return ao - bo;
  });
}
