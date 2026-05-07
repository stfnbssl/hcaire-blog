import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AsseChaptersPage          from './pages/assi-strutturali/AsseChapters';
import ChapterPage               from './pages/assi-strutturali/Chapter';

import SviluppoBambinoPage                from './pages/sviluppo-bambino/SviluppoBambinoPage';
import SviluppoBambinoMetodoLanding       from './pages/sviluppo-bambino/SviluppoBambinoMetodoLanding';
import SviluppoBambinoMetodoPage          from './pages/sviluppo-bambino/SviluppoBambinoMetodoPage';
import SviluppoBambinoMetodoFasiIndex     from './pages/sviluppo-bambino/SviluppoBambinoMetodoFasiIndex';
import SviluppoBambinoMetodoFasePage      from './pages/sviluppo-bambino/SviluppoBambinoMetodoFasePage';
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
const PresentazioneCorsi = lazy(() => import('./pages/sviluppo-bambino/PresentazioneCorsi'));

const KnowledgeBase    = lazy(() => import('./pages/bartleby/KnowledgeBase'));
const AdminSiteConfig  = lazy(() => import('./pages/AdminSiteConfig'));
const AdminSiteContent = lazy(() => import('./pages/AdminSiteContent'));
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
          <Route path="/hcaire/:section"                           element={<HcairePage />} />
          {/* Sviluppo bambino */}
          {/* Letture critiche (sezione pubblica) */}
          <Route path="/letture"          element={<AdminSuspense><LettureCriticheLanding /></AdminSuspense>} />
          <Route path="/letture/elenco"   element={<AdminSuspense><LettureLanding /></AdminSuspense>} />
          <Route path="/letture/:slug"    element={<AdminSuspense><LetturaDetail /></AdminSuspense>} />
          <Route path="/sviluppo-bambino"                                        element={<SviluppoBambinoLanding />} />
          <Route path="/sviluppo-bambino/finalita"                              element={<SviluppoBambinoFinalitaLanding />} />
          <Route path="/sviluppo-bambino/metodo"                                element={<SviluppoBambinoMetodoLanding />} />
          <Route path="/sviluppo-bambino/metodo/introduzione"                   element={<SviluppoBambinoMetodoPage />} />
          <Route path="/sviluppo-bambino/metodo/fasi"                          element={<SviluppoBambinoMetodoFasiIndex />} />
          <Route path="/sviluppo-bambino/metodo/fasi/:faseSlug"                element={<SviluppoBambinoMetodoFasePage />} />
          <Route path="/sviluppo-bambino/metodo/ricerca-scientifica"            element={<SviluppoBambinoMetodoPage />} />
          <Route path="/sviluppo-bambino/metodo/rapporto-con-ia"               element={<SviluppoBambinoMetodoPage />} />
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
          {/* Presentazione dei corsi (F1, F2, F3) */}
          <Route path="/sviluppo-bambino/presentazione"                                                 element={<AdminSuspense><PresentazioneCorsi /></AdminSuspense>} />
          {/* Corso F2 — Traduzione interdisciplinare */}
          <Route path="/sviluppo-bambino/traduzione-interdisciplinare"                                  element={<AdminSuspense><CorsoFase2Page /></AdminSuspense>} />
          <Route path="/sviluppo-bambino/traduzione-interdisciplinare/:moduleId"                        element={<AdminSuspense><CorsoFase2Page /></AdminSuspense>} />
          <Route path="/sviluppo-bambino/traduzione-interdisciplinare/:moduleId/:slideId"               element={<AdminSuspense><CorsoFase2Page /></AdminSuspense>} />
          {/* Corso F1 — Fondazione ontologica */}
          <Route path="/sviluppo-bambino/fondazione-ontologica"                                         element={<AdminSuspense><CorsoFase1Page /></AdminSuspense>} />
          <Route path="/sviluppo-bambino/fondazione-ontologica/:moduleId"                               element={<AdminSuspense><CorsoFase1Page /></AdminSuspense>} />
          <Route path="/sviluppo-bambino/fondazione-ontologica/:moduleId/:slideId"                      element={<AdminSuspense><CorsoFase1Page /></AdminSuspense>} />
          {/* Corso F3 — Strumenti operativi contestualizzati */}
          <Route path="/sviluppo-bambino/strumenti-operativi-contestualizzati"                          element={<AdminSuspense><CorsoFase3Page /></AdminSuspense>} />
          <Route path="/sviluppo-bambino/strumenti-operativi-contestualizzati/:moduleId"                element={<AdminSuspense><CorsoFase3Page /></AdminSuspense>} />
          <Route path="/sviluppo-bambino/strumenti-operativi-contestualizzati/:moduleId/:slideId"       element={<AdminSuspense><CorsoFase3Page /></AdminSuspense>} />
          {/* Assi Strutturali — sezione top-level */}
          <Route path="/assi-strutturali"                                       element={<AssiStrutturaliLanding />} />
          <Route path="/assi-strutturali/capitoli"                              element={<AssiStrutturaliCapitoli />} />
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
