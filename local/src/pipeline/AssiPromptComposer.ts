// Composer del prompt per il rebuild Assi Strutturali.
// Il prompt è interamente contenuto nel CLAUDE.md di preprocessing — non servono
// placeholder né file inlinati: Cowork legge le sorgenti direttamente dal disco.

import { promises as fs } from 'fs';
import { AXES_CLAUDE_MD_PATH } from './assiConstants.js';

export class AssiPromptComposer {
  async compose(): Promise<string> {
    return fs.readFile(AXES_CLAUDE_MD_PATH, 'utf8');
  }
}
