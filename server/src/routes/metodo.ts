import { Router } from 'express';
import {
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
} from '../controllers/metodoController';

const router = Router();

router.get('/',                                          getMetodo);
router.get('/introduzione',                              getMetodoIntroduzione);
router.get('/introduzione/architettura',                 getMetodoArchitettura);
router.get('/introduzione/metodologia',                  getMetodoMetodologia);
router.get('/fasi',                                      getFasiIndex);
router.get('/fasi/:faseSlug',                            getFase);
router.get('/ricerca-scientifica',                       getMetodoRicercaScientifica);
router.get('/ricerca-scientifica/collocazione',          getMetodoCollocazione);
router.get('/ricerca-scientifica/statuto-epistemologico', getMetodoStatutoEpistemologico);
router.get('/rapporto-con-ia',                           getMetodoRapportoConIA);

export default router;
