import { Router } from 'express';
import {
  getFinalita,
  getMetodo,
  getMetodoIntroduzione,
  getMetodoArchitettura,
  getMetodoMetodologia,
  getFasiIndex,
  getFase,
  getMetodoRicercaScientifica,
  getMetodoCollocazione,
  getMetodoStatutoEpistemologico,
  getMetodoRapportoConIA,
  getModello,
  getModelloAsse,
  getConcetti,
  getNotaMetodologica,
  getAssiIndex,
  getAsseChapters,
  getChapter,
  getRiflessioni,
  getInterlocuzioni,
  getInterlocuzioneDisciplina,
  getProduzioniGuidaPipeline,
  getProduzioniNuovaRicercaInfo,
} from '../controllers/sviluppoBambinoController';

const router = Router();

router.get('/finalita',                     getFinalita);
router.get('/metodo',                       getMetodo);
router.get('/metodo/introduzione',                              getMetodoIntroduzione);
router.get('/metodo/introduzione/architettura',                 getMetodoArchitettura);
router.get('/metodo/introduzione/metodologia',                  getMetodoMetodologia);
router.get('/metodo/fasi',                                      getFasiIndex);
router.get('/metodo/fasi/:faseSlug',                            getFase);
router.get('/metodo/ricerca-scientifica',                       getMetodoRicercaScientifica);
router.get('/metodo/ricerca-scientifica/collocazione',          getMetodoCollocazione);
router.get('/metodo/ricerca-scientifica/statuto-epistemologico', getMetodoStatutoEpistemologico);
router.get('/metodo/rapporto-con-ia',                           getMetodoRapportoConIA);
router.get('/concetti',                     getConcetti);
router.get('/nota-metodologica',            getNotaMetodologica);
router.get('/modello',                      getModello);
router.get('/modello/:asseSlug',            getModelloAsse);
router.get('/assi',                         getAssiIndex);
router.get('/assi/:asseSlug',              getAsseChapters);
router.get('/assi/:asseSlug/:chapterSlug', getChapter);
router.get('/riflessioni',                  getRiflessioni);
router.get('/interlocuzioni',                        getInterlocuzioni);
router.get('/interlocuzioni/:disciplinaSlug',        getInterlocuzioneDisciplina);
router.get('/produzioni/guida-pipeline',             getProduzioniGuidaPipeline);
router.get('/produzioni/nuova-ricerca-info',         getProduzioniNuovaRicercaInfo);

export default router;
