// Test isolato del PromptComposer (D6 §9).
// Esegue: node --no-warnings --experimental-strip-types src/pipeline/test-composer.mjs
// Carica le env da .env per usare i path reali.

import 'dotenv/config';
import { PromptComposer } from './PromptComposer.ts';

async function main() {
  const composer = new PromptComposer();

  const ROOT = process.env.PIPELINE_OUTPUT_ROOT
    ?? 'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/output/produzioni';

  // Caso: f3_step_3 con due input file reali
  const prompt = await composer.compose({
    step_id: 'f3_step_3',
    context_id: 'pointing',
    run_number: 1,
    input_files: [
      { role: 'lettura-configurazionale', path: `${ROOT}/temi/pointing/lettura-configurazionale-clinico-v2.json` },
      { role: 'stress-test', path: `${ROOT}/temi/pointing/stress-test-clinico-v2.json` },
    ],
    external_inputs: [],
    dispositivo_sorgente: null,
    output_dir_abs: `${ROOT}/temi/pointing`,
    output_filename: 'correzione-strutturale-clinico-v3.json',
  });

  console.log('=== PROMPT COMPOSITO (f3_step_3) ===');
  console.log(prompt.slice(0, 2000) + (prompt.length > 2000 ? '\n…[truncato]' : ''));
  console.log('=== FINE ===');
  console.log(`Lunghezza: ${prompt.length} caratteri`);
  console.log(`Blocchi separati da '---': ${prompt.match(/^---$/gm)?.length ?? 0}`);

  // Sanity checks
  const checks = [
    ['Blocco 1 contiene FILE DI INPUT DISPONIBILI', prompt.includes('FILE DI INPUT DISPONIBILI')],
    ['Blocco 1 contiene contenuto JSON inline', prompt.includes('"step":')],
    ['Blocco 2 contiene ISTRUZIONI STEP', prompt.includes('ISTRUZIONI STEP')],
    ['Blocco 2 NON contiene "### Salvataggio"', !/###\s*Salvataggio/i.test(prompt)],
    ['Blocco 3 contiene DIRETTIVA OUTPUT', prompt.includes('DIRETTIVA OUTPUT')],
    ['Blocco 3 contiene il filename atteso', prompt.includes('correzione-strutturale-clinico-v3.json')],
    ['Blocco 3 contiene la cartella output', prompt.includes('temi/pointing') || prompt.includes('temi\\pointing')],
  ];
  console.log('\n=== SANITY CHECKS ===');
  let pass = 0;
  for (const [name, ok] of checks) {
    console.log(`${ok ? '✓' : '✗'} ${name}`);
    if (ok) pass++;
  }
  console.log(`\n${pass}/${checks.length} check passati`);
  if (pass < checks.length) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
