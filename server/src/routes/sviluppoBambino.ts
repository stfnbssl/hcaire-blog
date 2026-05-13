import { Router } from 'express';
import {
  getFinalita,
  getModello,
  getModelloAsse,
  getConcetti,
  getNotaMetodologica,
  getAssiIndex,
  getAsseChapters,
  getChapter,
  getCitations,
  getCatalogoAuthors,
  getCatalogoBooks,
  getRiflessioni,
  getInterlocuzioni,
  getInterlocuzioneDisciplina,
  getProduzioniGuidaPipeline,
  getProduzioniNuovaRicercaInfo,
} from '../controllers/sviluppoBambinoController';

const router = Router();

router.get('/finalita',                     getFinalita);
router.get('/concetti',                     getConcetti);
router.get('/nota-metodologica',            getNotaMetodologica);
router.get('/modello',                      getModello);
router.get('/modello/:asseSlug',            getModelloAsse);
router.get('/assi',                         getAssiIndex);
router.get('/assi/citazioni',               getCitations);
router.get('/assi/:asseSlug',              getAsseChapters);
router.get('/assi/:asseSlug/:chapterSlug',            getChapter);
router.get('/catalogo/authors',                       getCatalogoAuthors);
router.get('/catalogo/books',                         getCatalogoBooks);
router.get('/riflessioni',                  getRiflessioni);
router.get('/interlocuzioni',                        getInterlocuzioni);
router.get('/interlocuzioni/:disciplinaSlug',        getInterlocuzioneDisciplina);
router.get('/produzioni/guida-pipeline',             getProduzioniGuidaPipeline);
router.get('/produzioni/nuova-ricerca-info',         getProduzioniNuovaRicercaInfo);

export default router;
