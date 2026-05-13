import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { SiteContentProvider } from './context/SiteContentContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import Progetti from './pages/Progetti';
import WorkInProgress from './pages/WorkInProgress';
import BartlebyLanding   from './pages/bartleby/BartlebyLanding';
import BartlebyHome      from './pages/bartleby/BartlebyHome';
import OutputList        from './pages/bartleby/OutputList';
import OutputDetail      from './pages/bartleby/OutputDetail';
import BartlebyNotifier  from './components/bartleby/BartlebyNotifier';
import HcaireLanding            from './pages/hcaire/HcaireLanding';
import HcairePage               from './pages/hcaire/HcairePage';
import HcaireProtocolliLanding  from './pages/hcaire/HcaireProtocolliLanding';
import HcaireProtocolPage       from './pages/hcaire/HcaireProtocolPage';
import SviluppoBambinoLanding     from './pages/sviluppo-bambino/SviluppoBambinoLanding';
import SviluppoBambinoModello     from './pages/sviluppo-bambino/SviluppoBambinoModello';
import SviluppoBambinoAsseOverview from './pages/sviluppo-bambino/SviluppoBambinoAsseOverview';
import AssiStrutturaliCapitoli   from './pages/assi-strutturali/AssiStrutturaliCapitoli';
import BibliografiaPage          from './pages/assi-strutturali/Bibliografia';
import AsseChaptersPage          from './pages/assi-strutturali/AsseChapters';
import ChapterPage               from './pages/assi-strutturali/Chapter';

import SviluppoBambinoPage                from './pages/sviluppo-bambino/SviluppoBambinoPage';
import MetodoLanding                      from './pages/metodo/MetodoLanding';
import MetodoPage                         from './pages/metodo/MetodoPage';
import MetodoFasiIndex                    from './pages/metodo/MetodoFasiIndex';
import MetodoFasePage                     from './pages/metodo/MetodoFasePage';
import AnthroposLanding                   from './pages/anthropos/AnthroposLanding';
import AssiStrutturaliLanding                  from './pages/assi-strutturali/AssiStrutturaliLanding';
import SviluppoBambinoFinalitaLanding         from './pages/sviluppo-bambino/SviluppoBambinoFinalitaLanding';
import SviluppoBambinoInterlocuzioniLanding    from './pages/sviluppo-bambino/SviluppoBambinoInterlocuzioniLanding';
import SviluppoBambinoInterlocuzioniDisciplineIndex from './pages/sviluppo-bambino/SviluppoBambinoInterlocuzioniDisciplineIndex';
import SviluppoBambinoInterlocuzioniDisciplinaPage  from './pages/sviluppo-bambino/SviluppoBambinoInterlocuzioniDisciplinaPage';
import SviluppoBambinoProduzioniLanding  from './pages/sviluppo-bambino/SviluppoBambinoProduzioniLanding';
import SviluppoBambinoProduzioniTemiPage from './pages/sviluppo-bambino/SviluppoBambinoProduzioniTemiPage';
import SviluppoBambinoPipelineMap            from './pages/sviluppo-bambino/SviluppoBambinoPipelineMap';
import SviluppoBambinoPipelineDeviceOverview from './pages/sviluppo-bambino/SviluppoBambinoPipelineDeviceOverview';
import SviluppoBambinoPipelineDeviceViewer   from './pages/sviluppo-bambino/SviluppoBambinoPipelineDeviceViewer';
import SviluppoBambinoPipelineStressTest     from './pages/sviluppo-bambino/SviluppoBambinoPipelineStressTest';
import SviluppoBambinoPipelineRicercaOverview from './pages/sviluppo-bambino/SviluppoBambinoPipelineRicercaOverview';
import SviluppoBambinoPipelineNuovaRicerca from './pages/sviluppo-bambino/SviluppoBambinoPipelineNuovaRicerca';

const CorsoFase2Page = lazy(() => import('./pages/sviluppo-bambino/corso-fase2/CorsoFase2Page'));
const CorsoFase1Page = lazy(() => import('./pages/sviluppo-bambino/corso-fase1/CorsoFase1Page'));
const CorsoFase3Page = lazy(() => import('./pages/sviluppo-bambino/corso-fase3/CorsoFase3Page'));
const DidatticaLanding = lazy(() => import('./pages/metodo/DidatticaLanding'));

const KnowledgeBase    = lazy(() => import('./pages/bartleby/KnowledgeBase'));
const AdminSiteConfig  = lazy(() => import('./pages/AdminSiteConfig'));
const AdminSiteContent = lazy(() => import('./pages/AdminSiteContent'));
const AdminServices    = lazy(() => import('./pages/AdminServices'));
const AdminSkills          = lazy(() => import('./pages/AdminSkills'));
const AdminPlugins         = lazy(() => import('./pages/AdminPlugins'));
const AdminJobDefinitions  = lazy(() => import('./pages/AdminJobDefinitions'));
const AdminJobs            = lazy(() => import('./pages/AdminJobs'));
const AdminAssi            = lazy(() => import('./pages/AdminAssi'));
const AdminAssiRebuild     = lazy(() => import('./pages/AdminAssiRebuild'));
const AdminAssiChapters    = lazy(() => import('./pages/AdminAssiChapters'));
const AdminAssiChapterEdit = lazy(() => import('./pages/AdminAssiChapterEdit'));
const AdminCatalogo        = lazy(() => import('./pages/AdminCatalogo'));
const LettureCriticheLanding = lazy(() => import('./pages/letture/LettureCriticheLanding'));
const LettureLanding  = lazy(() => import('./pages/letture/LettureLanding'));
const LetturaDetail   = lazy(() => import('./pages/letture/LetturaDetail'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const WorkflowLog    = lazy(() => import('./pages/WorkflowLog'));
const AdminRequests  = lazy(() => import('./pages/AdminRequests'));
const AdminLetture        = lazy(() => import('./pages/AdminLetture'));
const AdminLetturaNuova   = lazy(() => import('./pages/AdminLetturaNuova'));
const AdminLetturaDetail  = lazy(() => import('./pages/AdminLetturaDetail'));

const ArchivioTemiIndexPage = lazy(() => import('./pages/archivio/ArchivioTemiIndexPage'));
const ArchivioTemaFormPage  = lazy(() => import('./pages/archivio/ArchivioTemaFormPage'));

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const muiTheme = createTheme({
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
  palette: {
    primary: { main: '#0284c7' },
  },
});

const AdminSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    </div>
  }>
    {children}
  </Suspense>
);

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isSignedIn || user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-gray-600 text-lg">Accesso riservato agli amministratori.</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <AdminSuspense>{children}</AdminSuspense>
    </AdminLayout>
  );
}

function RedirectMetodoFase() {
  const { faseSlug } = useParams();
  return <Navigate to={`/metodo/fasi/${faseSlug}`} replace />;
}

function RedirectDidatticaFase({ fase }: { fase: string }) {
  const { '*': rest = '' } = useParams();
  const tail = rest ? `/${rest}` : '';
  return <Navigate to={`/metodo/didattica/${fase}${tail}`} replace />;
}

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow">
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/about"           element={<About />} />
          <Route path="/blog/:slug"      element={<BlogPost />} />
          <Route path="/pricing"         element={<Pricing />} />
          <Route path="/account"         element={<Account />} />
          <Route path="/progetti"        element={<Progetti />} />
          {/* Metodo — sezione top-level */}
          <Route path="/metodo"                                                 element={<MetodoLanding />} />
          <Route path="/metodo/introduzione"                                    element={<MetodoPage />} />
          <Route path="/metodo/fasi"                                            element={<MetodoFasiIndex />} />
          <Route path="/metodo/fasi/:faseSlug"                                  element={<MetodoFasePage />} />
          <Route path="/metodo/ricerca-scientifica"                             element={<MetodoPage />} />
          <Route path="/metodo/rapporto-con-ia"                                 element={<MetodoPage />} />
          {/* Didattica — presentazioni del metodo */}
          <Route path="/metodo/didattica"                                                          element={<AdminSuspense><DidatticaLanding /></AdminSuspense>} />
          <Route path="/metodo/didattica/fondazione-ontologica"                                    element={<AdminSuspense><CorsoFase1Page /></AdminSuspense>} />
          <Route path="/metodo/didattica/fondazione-ontologica/:moduleId"                          element={<AdminSuspense><CorsoFase1Page /></AdminSuspense>} />
          <Route path="/metodo/didattica/fondazione-ontologica/:moduleId/:slideId"                 element={<AdminSuspense><CorsoFase1Page /></AdminSuspense>} />
          <Route path="/metodo/didattica/traduzione-interdisciplinare"                             element={<AdminSuspense><CorsoFase2Page /></AdminSuspense>} />
          <Route path="/metodo/didattica/traduzione-interdisciplinare/:moduleId"                   element={<AdminSuspense><CorsoFase2Page /></AdminSuspense>} />
          <Route path="/metodo/didattica/traduzione-interdisciplinare/:moduleId/:slideId"          element={<AdminSuspense><CorsoFase2Page /></AdminSuspense>} />
          <Route path="/metodo/didattica/strumenti-operativi-contestualizzati"                     element={<AdminSuspense><CorsoFase3Page /></AdminSuspense>} />
          <Route path="/metodo/didattica/strumenti-operativi-contestualizzati/:moduleId"           element={<AdminSuspense><CorsoFase3Page /></AdminSuspense>} />
          <Route path="/metodo/didattica/strumenti-operativi-contestualizzati/:moduleId/:slideId"  element={<AdminSuspense><CorsoFase3Page /></AdminSuspense>} />
          {/* Anthropos — progetto sotto Progetti */}
          <Route path="/anthropos"                                              element={<AnthroposLanding />} />
          <Route path="/bartleby"                                              element={<BartlebyLanding />} />
          <Route path="/bartleby/console"                                      element={<BartlebyHome />} />
          <Route path="/bartleby/knowledge-base"                            element={<AdminSuspense><KnowledgeBase /></AdminSuspense>} />
          <Route path="/bartleby/knowledge-base/:section"                   element={<AdminSuspense><KnowledgeBase /></AdminSuspense>} />
          <Route path="/bartleby/knowledge-base/:section/:itemId"           element={<AdminSuspense><KnowledgeBase /></AdminSuspense>} />
          <Route path="/bartleby/outputs"                                   element={<OutputList />} />
          <Route path="/bartleby/outputs/:id"                               element={<OutputDetail />} />
          {/* HCAIRE */}
          <Route path="/hcaire"                                    element={<HcaireLanding />} />
          <Route path="/hcaire/protocolli"                         element={<HcaireProtocolliLanding />} />
          <Route path="/hcaire/protocolli/:slug"                   element={<HcaireProtocolPage />} />
          {/* Redirect del vecchio slug "ia-centrata-sull-umano" al nuovo Manifesto */}
          <Route path="/hcaire/ia-centrata-sull-umano"             element={<Navigate to="/hcaire/manifesto" replace />} />
          {/* Le sottosezioni /hcaire/progetti e /hcaire/metodo sono state rimosse: redirect alle sezioni principali */}
          <Route path="/hcaire/progetti"                           element={<Navigate to="/progetti" replace />} />
          <Route path="/hcaire/metodo"                             element={<Navigate to="/metodo" replace />} />
          <Route path="/hcaire/:section"                           element={<HcairePage />} />
          {/* Sviluppo bambino */}
          {/* Letture critiche (sezione pubblica) */}
          <Route path="/letture"          element={<AdminSuspense><LettureCriticheLanding /></AdminSuspense>} />
          <Route path="/letture/elenco"   element={<AdminSuspense><LettureLanding /></AdminSuspense>} />
          <Route path="/letture/:slug"    element={<AdminSuspense><LetturaDetail /></AdminSuspense>} />
          <Route path="/sviluppo-bambino"                                        element={<SviluppoBambinoLanding />} />
          <Route path="/sviluppo-bambino/finalita"                              element={<SviluppoBambinoFinalitaLanding />} />
          {/* Redirect dei vecchi path /sviluppo-bambino/metodo* alla nuova sezione top-level /metodo* */}
          <Route path="/sviluppo-bambino/metodo"                                element={<Navigate to="/metodo" replace />} />
          <Route path="/sviluppo-bambino/metodo/introduzione"                   element={<Navigate to="/metodo/introduzione" replace />} />
          <Route path="/sviluppo-bambino/metodo/fasi"                           element={<Navigate to="/metodo/fasi" replace />} />
          <Route path="/sviluppo-bambino/metodo/fasi/:faseSlug"                 element={<RedirectMetodoFase />} />
          <Route path="/sviluppo-bambino/metodo/ricerca-scientifica"            element={<Navigate to="/metodo/ricerca-scientifica" replace />} />
          <Route path="/sviluppo-bambino/metodo/rapporto-con-ia"                element={<Navigate to="/metodo/rapporto-con-ia" replace />} />
          <Route path="/sviluppo-bambino/concetti"                              element={<SviluppoBambinoPage />} />
          <Route path="/sviluppo-bambino/nota-metodologica"                     element={<SviluppoBambinoPage />} />
          <Route path="/sviluppo-bambino/riflessioni"                           element={<SviluppoBambinoPage />} />
          <Route path="/sviluppo-bambino/interlocuzioni"                                           element={<SviluppoBambinoInterlocuzioniLanding />} />
          <Route path="/sviluppo-bambino/interlocuzioni/discipline"                               element={<SviluppoBambinoInterlocuzioniDisciplineIndex />} />
          <Route path="/sviluppo-bambino/interlocuzioni/discipline/:disciplinaSlug"               element={<SviluppoBambinoInterlocuzioniDisciplinaPage />} />
          <Route path="/sviluppo-bambino/produzioni"                             element={<SviluppoBambinoProduzioniLanding />} />
          <Route path="/sviluppo-bambino/produzioni/temi"                       element={<SviluppoBambinoProduzioniTemiPage />} />
          <Route path="/sviluppo-bambino/produzioni/pipeline"                                  element={<SviluppoBambinoPipelineMap />} />
          <Route path="/sviluppo-bambino/produzioni/pipeline/nuova-ricerca"                    element={<SviluppoBambinoPipelineNuovaRicerca />} />
          <Route path="/sviluppo-bambino/produzioni/pipeline/ricerche/:ricercaId"              element={<SviluppoBambinoPipelineRicercaOverview />} />
          <Route path="/sviluppo-bambino/produzioni/pipeline/temi/:temaId"                     element={<SviluppoBambinoPipelineDeviceOverview />} />
          <Route path="/sviluppo-bambino/produzioni/pipeline/temi/:temaId/dispositivo"         element={<SviluppoBambinoPipelineDeviceViewer />} />
          <Route path="/sviluppo-bambino/produzioni/pipeline/temi/:temaId/stress-test"         element={<SviluppoBambinoPipelineStressTest />} />
          <Route path="/sviluppo-bambino/modello"                               element={<SviluppoBambinoModello />} />
          <Route path="/sviluppo-bambino/modello/:asseSlug"                     element={<SviluppoBambinoAsseOverview />} />
          {/* Redirect dei vecchi path /sviluppo-bambino/{presentazione,fasi*} alla nuova sezione /metodo/didattica/* */}
          <Route path="/sviluppo-bambino/presentazione"                                                 element={<Navigate to="/metodo/didattica" replace />} />
          <Route path="/sviluppo-bambino/fondazione-ontologica/*"                                       element={<RedirectDidatticaFase fase="fondazione-ontologica" />} />
          <Route path="/sviluppo-bambino/traduzione-interdisciplinare/*"                                element={<RedirectDidatticaFase fase="traduzione-interdisciplinare" />} />
          <Route path="/sviluppo-bambino/strumenti-operativi-contestualizzati/*"                        element={<RedirectDidatticaFase fase="strumenti-operativi-contestualizzati" />} />
          {/* Assi Strutturali — sezione top-level */}
          <Route path="/assi-strutturali"                                       element={<AssiStrutturaliLanding />} />
          <Route path="/assi-strutturali/capitoli"                              element={<AssiStrutturaliCapitoli />} />
          <Route path="/assi-strutturali/bibliografia"                          element={<BibliografiaPage />} />
          <Route path="/assi-strutturali/:asseSlug"                             element={<AsseChaptersPage />} />
          <Route path="/assi-strutturali/:asseSlug/:chapterSlug"                element={<ChapterPage />} />
          <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/workflow"  element={<AdminRoute><WorkflowLog /></AdminRoute>} />
          <Route path="/admin/requests"    element={<AdminRoute><AdminRequests /></AdminRoute>} />
          <Route path="/admin/letture"          element={<AdminRoute><AdminLetture /></AdminRoute>} />
          <Route path="/admin/letture/nuova"    element={<AdminRoute><AdminLetturaNuova /></AdminRoute>} />
          <Route path="/admin/letture/:slug"    element={<AdminRoute><AdminLetturaDetail /></AdminRoute>} />
          <Route path="/admin/site-config"  element={<AdminRoute><AdminSiteConfig /></AdminRoute>} />
          <Route path="/admin/testi"        element={<AdminRoute><AdminSiteContent /></AdminRoute>} />
          <Route path="/admin/servizi"      element={<AdminRoute><AdminServices /></AdminRoute>} />
          <Route path="/admin/skills"           element={<AdminRoute><AdminSkills /></AdminRoute>} />
          <Route path="/admin/plugins"          element={<AdminRoute><AdminPlugins /></AdminRoute>} />
          <Route path="/admin/job-definitions"  element={<AdminRoute><AdminJobDefinitions /></AdminRoute>} />
          <Route path="/admin/jobs"             element={<AdminRoute><AdminJobs /></AdminRoute>} />
          <Route path="/admin/assi"             element={<AdminRoute><AdminAssi /></AdminRoute>} />
          <Route path="/admin/assi/rebuild"     element={<AdminRoute><AdminAssiRebuild /></AdminRoute>} />
          <Route path="/admin/assi/capitoli"                              element={<AdminRoute><AdminAssiChapters /></AdminRoute>} />
          <Route path="/admin/assi/capitoli/:axisSlug/:slug"              element={<AdminRoute><AdminAssiChapterEdit /></AdminRoute>} />
          <Route path="/admin/catalogo"                                   element={<AdminRoute><AdminCatalogo /></AdminRoute>} />
          {/* Archivio temi (admin) — vedi docs/90-todo/laboratorio-d5b-backend.md §12 */}
          <Route path="/archivio/temi"          element={<AdminRoute><ArchivioTemiIndexPage /></AdminRoute>} />
          <Route path="/archivio/temi/nuovo"    element={<AdminRoute><ArchivioTemaFormPage /></AdminRoute>} />
          <Route path="/archivio/temi/:temaId"  element={<AdminRoute><ArchivioTemaFormPage /></AdminRoute>} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <BartlebyNotifier />
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <SiteConfigProvider>
            <SiteContentProvider>
              <SubscriptionProvider>
                <AppLayout />
              </SubscriptionProvider>
            </SiteContentProvider>
          </SiteConfigProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}
