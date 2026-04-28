// Caricamento env PRIMA di qualsiasi altro import.
// Importato come prima riga di index.ts: deve venire eseguito prima che gli altri
// moduli (es. messageBus, pipelineEventSubscriber) leggano process.env al loro
// caricamento.
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
