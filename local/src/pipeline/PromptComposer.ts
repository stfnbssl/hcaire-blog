// Composizione del prompt per Cowork (D3 §12 + D6 §4).
//
// Tre blocchi:
//   1. CONTESTO INPUT (file di input con contenuto inline se < 50KB)
//   2. ISTRUZIONI STEP (CLAUDE.md ripulito da sezione Salvataggio + path hardcoded)
//   3. DIRETTIVA OUTPUT (nome file + cartella espliciti)

import { promises as fs } from 'fs';
import { join, dirname, basename } from 'path';
import {
  STEPS_ROOT,
  STEP_FOLDER_MAP,
  STEP_CLAUDE_FILE_MAP,
  INLINE_FILE_THRESHOLD_BYTES,
} from './constants.js';

export interface ComposeInput {
  step_id: string;
  context_id: string;
  run_number: number;
  input_files: { role: string; path: string }[];
  external_inputs?: { input_id: string; data: Record<string, unknown> }[];
  dispositivo_sorgente?: { tema_id: string; file: string } | null;
  output_dir_abs: string;
  output_filename: string;
}

export class PromptComposer {
  async compose(input: ComposeInput): Promise<string> {
    const block1 = await this._buildInputBlock(input);
    const block2 = await this._loadAndCleanClaudeMd(input.step_id);
    const block3 = this._buildOutputBlock(input);
    return [block1, block2, block3].join('\n\n');
  }

  private async _buildInputBlock(input: ComposeInput): Promise<string> {
    const lines: string[] = [
      '---',
      'CONTESTO DI ESECUZIONE AUTOMATICA',
      `Step: ${input.step_id}  |  Tema: ${input.context_id}  |  Run: #${input.run_number}`,
      '',
      'FILE DI INPUT DISPONIBILI',
    ];

    for (const f of input.input_files) {
      lines.push(`• [${f.role}]  ${f.path}`);
      try {
        const stats = await fs.stat(f.path);
        if (stats.size <= INLINE_FILE_THRESHOLD_BYTES) {
          const content = await fs.readFile(f.path, 'utf8');
          // valida JSON prima di iniettarlo
          JSON.parse(content);
          lines.push('  Contenuto:');
          lines.push('  ```json');
          lines.push(content.split('\n').map((l) => '  ' + l).join('\n'));
          lines.push('  ```');
        } else {
          lines.push(`  (file > ${Math.round(INLINE_FILE_THRESHOLD_BYTES / 1024)}KB — leggi direttamente dal path)`);
        }
      } catch (err) {
        lines.push(`  (file non leggibile: ${(err as Error).message})`);
      }
    }

    if (input.external_inputs && input.external_inputs.length > 0) {
      lines.push('');
      lines.push('INPUT FORNITI DAL RICERCATORE');
      for (const ei of input.external_inputs) {
        lines.push(`${ei.input_id}:`);
        lines.push('```json');
        lines.push(JSON.stringify(ei.data, null, 2));
        lines.push('```');
      }
    }

    if (input.dispositivo_sorgente) {
      lines.push('');
      lines.push('DISPOSITIVO SORGENTE (tema di origine)');
      lines.push(`• Tema: ${input.dispositivo_sorgente.tema_id}`);
      lines.push(`• File: ${input.dispositivo_sorgente.file}`);
      try {
        const content = await fs.readFile(input.dispositivo_sorgente.file, 'utf8');
        lines.push('  Contenuto:');
        lines.push('  ```json');
        lines.push(content.split('\n').map((l) => '  ' + l).join('\n'));
        lines.push('  ```');
      } catch {
        lines.push('  (file non leggibile — verifica il path)');
      }
    }

    lines.push('---');
    return lines.join('\n');
  }

  private async _loadAndCleanClaudeMd(stepId: string): Promise<string> {
    const folder = STEP_FOLDER_MAP[stepId];
    if (!folder) throw new Error(`Step non mappato in STEP_FOLDER_MAP: ${stepId}`);

    const filename = STEP_CLAUDE_FILE_MAP[stepId] ?? 'CLAUDE.md';
    const claudePath = join(STEPS_ROOT, folder, filename);

    let raw: string;
    let resolvedClaudePath = claudePath;
    try {
      raw = await fs.readFile(claudePath, 'utf8');
    } catch (err) {
      // Fallback per CLAUDE-C.md mancante (D6 §2): cade su CLAUDE.md
      if (filename !== 'CLAUDE.md') {
        const fallback = join(STEPS_ROOT, folder, 'CLAUDE.md');
        try {
          raw = await fs.readFile(fallback, 'utf8');
          resolvedClaudePath = fallback;
        } catch {
          throw new Error(`CLAUDE.md non trovato in ${claudePath} né in fallback ${fallback}`);
        }
      } else {
        throw new Error(`CLAUDE.md non trovato in ${claudePath}: ${(err as Error).message}`);
      }
    }

    // Inlina lo schema referenziato dalla sezione "### Schema" PRIMA del cleanup,
    // altrimenti la regex di sostituzione path Windows distruggerebbe il riferimento.
    const withSchema = await this._inlineSchemaSection(raw, resolvedClaudePath);
    return this._cleanClaudeMd(withSchema, stepId);
  }

  // Cerca una sezione "### Schema" che contenga un path in backtick e la sostituisce
  // con il contenuto del file (in fenced JSON). Risoluzione path:
  //   1. path così com'è (assoluto)
  //   2. <cartella del CLAUDE.md>/<basename(path)>  ← convenzione "schema accanto al CLAUDE.md"
  // Se la sezione non esiste, ritorna il testo invariato. Se esiste ma il file non è
  // leggibile/valido, alza un errore esplicito (meglio fallire qui che far produrre a
  // Cowork un output fuori-schema silenziosamente).
  private async _inlineSchemaSection(raw: string, claudeMdPath: string): Promise<string> {
    const sectionRe = /###\s*Schema\b[^\n]*\n[\s\S]*?(?=\n###|\n##|\n---|$)/i;
    const match = raw.match(sectionRe);
    if (!match) return raw;

    const pathMatch = match[0].match(/`([^`\n]+)`/);
    if (!pathMatch) return raw; // sezione presente ma senza path → lascio com'è

    const referenced = pathMatch[1];
    const candidates = [referenced, join(dirname(claudeMdPath), basename(referenced))];

    let schemaContent: string | null = null;
    let usedPath: string | null = null;
    for (const p of candidates) {
      try {
        const c = await fs.readFile(p, 'utf8');
        JSON.parse(c); // valida che sia JSON ben formato
        schemaContent = c;
        usedPath = p;
        break;
      } catch { /* tenta il prossimo candidato */ }
    }

    if (!schemaContent) {
      throw new Error(
        `Schema referenziato dal CLAUDE.md non leggibile o non JSON valido. ` +
        `Tentativi: ${candidates.join(' ; ')}`,
      );
    }

    const replacement = [
      '### Schema di output (JSON Schema — inlined automaticamente dalla pipeline)',
      '',
      `> Origine: ${usedPath}`,
      '',
      'L\'output prodotto DEVE rispettare il seguente JSON Schema. Non aprire file esterni: lo schema è qui sotto.',
      '',
      '```json',
      schemaContent.trimEnd(),
      '```',
    ].join('\n');

    return raw.replace(sectionRe, replacement);
  }

  private _cleanClaudeMd(raw: string, stepId: string): string {
    let cleaned = raw;

    // Rimuovi sezione "### Salvataggio" / "### SALVATAGGIO" / "### Output path" e contenuto
    // fino alla prossima sezione (### / ---) o fine file
    cleaned = cleaned.replace(
      /###\s*(Salvataggio|SALVATAGGIO|Output\s*path|OUTPUT\s*PATH)[\s\S]*?(?=\n###|\n---|\n##|$)/gi,
      '',
    );

    // Sostituisce path Windows hardcoded `C:\...` (in backtick) con segnaposto
    cleaned = cleaned.replace(
      /`[A-Z]:\\[^`\n]+`/g,
      '[path gestito automaticamente dal sistema]',
    );

    // Caso speciale step 10: sostituisce il template MICRO CASI con riferimento ai casi nel Blocco 1
    if (stepId === 'f3_step_10') {
      cleaned = cleaned.replace(
        /```json\s*[\r\n]+\s*"cases":\s*\[[\s\S]*?\]\s*```/g,
        '> I casi reali per lo stress test sono nel blocco "INPUT FORNITI DAL RICERCATORE" sopra (campo `cases`).',
      );
    }

    const header = [
      '---',
      'ISTRUZIONI STEP (esecuzione automatica — i file di input sono già elencati sopra)',
      '---',
      '',
    ].join('\n');

    return header + cleaned.trim();
  }

  private _buildOutputBlock(input: ComposeInput): string {
    return [
      '---',
      'DIRETTIVA OUTPUT (ha priorità su qualsiasi percorso menzionato sopra)',
      '',
      'Salva il risultato con queste specifiche esatte:',
      `• Nome file:  ${input.output_filename}`,
      `• Cartella:   ${input.output_dir_abs}`,
      '• Formato:    JSON valido, nessun testo prima o dopo il JSON',
      '• Encoding:   UTF-8',
      '',
      'Non creare sottocartelle aggiuntive.',
      'Quando hai scritto il file, termina la risposta.',
      '---',
    ].join('\n');
  }
}
