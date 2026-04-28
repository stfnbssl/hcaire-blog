// Compositore del prompt per Cowork per la pipeline Letture.
// Differenze rispetto al PromptComposer di Sviluppo Bambino:
//   - legge CLAUDE.md da LETTURE_SPECS_ROOT (non STEPS_ROOT)
//   - accetta un `prompt_prefix` opzionale (usato dallo step_1 per i metadati dell'opera)
//   - supporta input .md (oltre a .json) — necessario per step_5f che legge i .md di 5d/5e
//   - inline opzionale di `stile-editoriale.md` per gli step editoriali

import { promises as fs } from 'fs';
import { join, dirname, basename } from 'path';
import {
  LETTURE_SPECS_ROOT,
  LETTURE_STEP_FOLDER_MAP,
  LETTURE_STILE_EDITORIALE_PATH,
  INLINE_FILE_THRESHOLD_BYTES,
  isEditorialStep,
  stripPrefix,
  LettureStepId,
} from './lettureConstants.js';

export interface LettureComposeInput {
  step_id: string;             // wire id (`lett_step_X`) o doc id (`step_X`)
  context_id: string;           // slug dell'opera
  run_number: number;
  input_files: { role: string; path: string }[];
  external_inputs?: { input_id: string; data: Record<string, unknown> }[];
  prompt_prefix?: string | null; // testo da prependere al blocco di input (es. metadati step_1)
  output_dir_abs: string;
  output_filename: string;
  output_md_filename?: string | null; // per 5d/5e/5f: file .md atteso oltre al JSON
}

export class LetturePromptComposer {
  async compose(input: LettureComposeInput): Promise<string> {
    const blocks: string[] = [];

    if (input.prompt_prefix && input.prompt_prefix.trim().length > 0) {
      blocks.push(this._buildPrefixBlock(input.prompt_prefix));
    }

    blocks.push(await this._buildInputBlock(input));

    const stepIdPlain = stripPrefix(input.step_id) as LettureStepId;
    if (isEditorialStep(stepIdPlain)) {
      const stile = await this._loadStileEditoriale();
      if (stile) blocks.push(stile);
    }

    blocks.push(await this._loadAndCleanClaudeMd(stepIdPlain));
    blocks.push(this._buildOutputBlock(input));

    return blocks.join('\n\n');
  }

  // ---------- blocchi ----------

  private _buildPrefixBlock(prefix: string): string {
    return [
      '---',
      'METADATI OPERA (forniti dal sistema, da utilizzare come contesto per lo step)',
      '---',
      '',
      prefix.trim(),
    ].join('\n');
  }

  private async _buildInputBlock(input: LettureComposeInput): Promise<string> {
    const lines: string[] = [
      '---',
      'CONTESTO DI ESECUZIONE AUTOMATICA',
      `Step: ${stripPrefix(input.step_id)}  |  Opera: ${input.context_id}  |  Run: #${input.run_number}`,
      '',
      'FILE DI INPUT DISPONIBILI',
    ];

    for (const f of input.input_files) {
      lines.push(`• [${f.role}]  ${f.path}`);
      try {
        const stats = await fs.stat(f.path);
        if (stats.size <= INLINE_FILE_THRESHOLD_BYTES) {
          const content = await fs.readFile(f.path, 'utf8');
          const isMd = f.path.toLowerCase().endsWith('.md');
          if (isMd) {
            lines.push('  Contenuto:');
            lines.push('  ```markdown');
            lines.push(content.split('\n').map((l) => '  ' + l).join('\n'));
            lines.push('  ```');
          } else {
            JSON.parse(content); // valida JSON prima di iniettarlo
            lines.push('  Contenuto:');
            lines.push('  ```json');
            lines.push(content.split('\n').map((l) => '  ' + l).join('\n'));
            lines.push('  ```');
          }
        } else {
          lines.push(`  (file > ${Math.round(INLINE_FILE_THRESHOLD_BYTES / 1024)}KB — leggi direttamente dal path)`);
        }
      } catch (err) {
        lines.push(`  (file non leggibile: ${(err as Error).message})`);
      }
    }

    if (input.external_inputs && input.external_inputs.length > 0) {
      lines.push('');
      lines.push('INPUT FORNITI DAL SISTEMA');
      for (const ei of input.external_inputs) {
        lines.push(`${ei.input_id}:`);
        lines.push('```json');
        lines.push(JSON.stringify(ei.data, null, 2));
        lines.push('```');
      }
    }

    lines.push('---');
    return lines.join('\n');
  }

  private async _loadStileEditoriale(): Promise<string | null> {
    try {
      const content = await fs.readFile(LETTURE_STILE_EDITORIALE_PATH, 'utf8');
      return [
        '---',
        'STILE EDITORIALE (linee guida da rispettare nella scrittura)',
        '---',
        '',
        content.trim(),
      ].join('\n');
    } catch {
      return null; // file opzionale: assenza non è errore
    }
  }

  private async _loadAndCleanClaudeMd(stepId: LettureStepId): Promise<string> {
    const folder = LETTURE_STEP_FOLDER_MAP[stepId];
    if (!folder) throw new Error(`Step non mappato in LETTURE_STEP_FOLDER_MAP: ${stepId}`);

    const claudePath = join(LETTURE_SPECS_ROOT, folder, 'CLAUDE.md');
    let raw: string;
    try {
      raw = await fs.readFile(claudePath, 'utf8');
    } catch (err) {
      throw new Error(`CLAUDE.md non trovato in ${claudePath}: ${(err as Error).message}`);
    }

    const withSchema = await this._inlineSchemaSection(raw, claudePath);
    return this._cleanClaudeMd(withSchema);
  }

  // Cerca "### Schema" che contenga un path in backtick e sostituisce con il contenuto.
  // Risoluzione path: prima il valore così com'è, poi sibling del CLAUDE.md.
  private async _inlineSchemaSection(raw: string, claudeMdPath: string): Promise<string> {
    const sectionRe = /###\s*Schema\b[^\n]*\n[\s\S]*?(?=\n###|\n##|\n---|$)/i;
    const match = raw.match(sectionRe);
    if (!match) {
      // Fallback: se esiste schema.json accanto al CLAUDE.md, inlinalo come sezione finale.
      const sibling = join(dirname(claudeMdPath), 'schema.json');
      try {
        const c = await fs.readFile(sibling, 'utf8');
        JSON.parse(c);
        return raw + '\n\n' + this._renderSchemaBlock(c, sibling);
      } catch {
        return raw;
      }
    }

    const pathMatch = match[0].match(/`([^`\n]+)`/);
    if (!pathMatch) return raw;

    const referenced = pathMatch[1];
    const candidates = [referenced, join(dirname(claudeMdPath), basename(referenced))];

    let schemaContent: string | null = null;
    let usedPath: string | null = null;
    for (const p of candidates) {
      try {
        const c = await fs.readFile(p, 'utf8');
        JSON.parse(c);
        schemaContent = c;
        usedPath = p;
        break;
      } catch { /* prova il prossimo */ }
    }

    if (!schemaContent) {
      throw new Error(
        `Schema referenziato dal CLAUDE.md non leggibile o non JSON valido. ` +
        `Tentativi: ${candidates.join(' ; ')}`,
      );
    }

    return raw.replace(sectionRe, this._renderSchemaBlock(schemaContent, usedPath!));
  }

  private _renderSchemaBlock(schemaContent: string, sourcePath: string): string {
    return [
      '### Schema di output (JSON Schema — inlined automaticamente dalla pipeline)',
      '',
      `> Origine: ${sourcePath}`,
      '',
      'L\'output prodotto DEVE rispettare il seguente JSON Schema. Non aprire file esterni: lo schema è qui sotto.',
      '',
      '```json',
      schemaContent.trimEnd(),
      '```',
    ].join('\n');
  }

  private _cleanClaudeMd(raw: string): string {
    let cleaned = raw;

    // Rimuovi sezione "### Salvataggio" (la pipeline gestisce l'output autonomamente).
    cleaned = cleaned.replace(
      /###\s*(Salvataggio|SALVATAGGIO|Output\s*path|OUTPUT\s*PATH)[\s\S]*?(?=\n###|\n---|\n##|$)/gi,
      '',
    );

    // Sostituisci path Windows hardcoded `C:\...` (in backtick).
    cleaned = cleaned.replace(
      /`[A-Z]:\\[^`\n]+`/g,
      '[path gestito automaticamente dal sistema]',
    );

    const header = [
      '---',
      'ISTRUZIONI STEP (esecuzione automatica — i file di input sono già elencati sopra)',
      '---',
      '',
    ].join('\n');

    return header + cleaned.trim();
  }

  private _buildOutputBlock(input: LettureComposeInput): string {
    const lines: string[] = [
      '---',
      'DIRETTIVA OUTPUT (ha priorità su qualsiasi percorso menzionato sopra)',
      '',
      'Salva il risultato JSON con queste specifiche esatte:',
      `• Nome file:  ${input.output_filename}`,
      `• Cartella:   ${input.output_dir_abs}`,
      '• Formato:    JSON valido, nessun testo prima o dopo il JSON',
      '• Encoding:   UTF-8',
    ];
    if (input.output_md_filename) {
      lines.push('');
      lines.push('Inoltre, salva il testo Markdown corrispondente con:');
      lines.push(`• Nome file:  ${input.output_md_filename}`);
      lines.push(`• Cartella:   ${input.output_dir_abs}`);
      lines.push('• Formato:    Markdown puro (no frontmatter), nessun blocco di codice esterno');
    }
    lines.push('');
    lines.push('Non creare sottocartelle aggiuntive.');
    lines.push('Quando hai scritto i file, termina la risposta.');
    lines.push('---');
    return lines.join('\n');
  }
}
