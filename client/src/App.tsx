import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import WorkInProgress from './pages/WorkInProgress';
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
import SviluppoBambinoAssi        from './pages/sviluppo-bambino/SviluppoBambinoAssi';
import SviluppoBambinoAsseChapters from './pages/sviluppo-bambino/SviluppoBambinoAsseChapters';
import SviluppoBambinoChapter     from './pages/sviluppo-bambino/SviluppoBambinoChapter';

import SviluppoBambinoPage                from './pages/sviluppo-bambino/SviluppoBambinoPage';
import SviluppoBambinoMetodoLanding       from './pages/sviluppo-bambino/SviluppoBambinoMetodoLanding';
import SviluppoBambinoMetodoPage          from './pages/sviluppo-bambino/SviluppoBambinoMetodoPage';
import SviluppoBambinoMetodoFasiIndex     from './pages/sviluppo-bambino/SviluppoBambinoMetodoFasiIndex';
import SviluppoBambinoMetodoFasePage      from './pages/sviluppo-bambino/SviluppoBambinoMetodoFasePage';
import SviluppoBambinoAssiLanding              from './pages/sviluppo-bambino/SviluppoBambinoAssiLanding';
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

const KnowledgeBase   = lazy(() => import('./pages/bartleby/KnowledgeBase'));
const AdminSiteConfig = lazy(() => import('./pages/AdminSiteConfig'));
const LettureLanding  = lazy(() => import('./pages/letture/LettureLanding'));
const LetturaDetail   = lazy(() => import('./pages/letture/LetturaDetail'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const WorkflowLog    = lazy(() => import('./pages/WorkflowLog'));
const AdminRequests  = lazy(() => import('./pages/AdminRequests'));
const AdminLetture        = lazy(() => import('./pages/AdminLetture'));
const AdminLetturaNuova   = lazy(() => import('./pages/AdminLetturaNuova'));
const AdminLetturaDetail  = lazy(() => import('./pages/AdminLetturaDetail'));

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
          <Route path="/bartleby"                                              element={<BartlebyHome />} />
          <Route path="/bartleby/knowledge-base"                            element={<AdminSuspense><KnowledgeBase /></AdminSuspense>} />
          <Route path="/bartleby/knowledge-base/:section"                   element={<AdminSuspense><KnowledgeBase /></AdminSuspense>} />
          <Route path="/bartleby/knowledge-base/:section/:itemId"           element={<AdminSuspense><KnowledgeBase /></AdminSuspense>} />
          <Route path="/bartleby/outputs"                                   element={<OutputList />} />
          <Route path="/bartleby/outputs/:id"                               element={<OutputDetail />} />
          {/* HCAIRE */}
          <Route path="/hcaire"                                    element={<HcaireLanding />} />
          <Route path="/hcaire/protocolli"                         element={<HcaireProtocolliLanding />} />
          <Route path="/hcaire/protocolli/:slug"                   element={<HcaireProtocolPage />} />
          <Route path="/hcaire/:section"                           element={<HcairePage />} />
          {/* Sviluppo bambino */}
          {/* Letture (sezione pubblica) */}
          <Route path="/letture"          element={<AdminSuspense><LettureLanding /></AdminSuspense>} />
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
          <Route path="/sviluppo-bambino/assi"                                  element={<SviluppoBambinoAssiLanding />} />
          <Route path="/sviluppo-bambino/assi/capitoli"                         element={<SviluppoBambinoAssi />} />
          <Route path="/sviluppo-bambino/assi/:asseSlug"                        element={<SviluppoBambinoAsseChapters />} />
          <Route path="/sviluppo-bambino/assi/:asseSlug/:chapterSlug"           element={<SviluppoBambinoChapter />} />
          <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/workflow"  element={<AdminRoute><WorkflowLog /></AdminRoute>} />
          <Route path="/admin/requests"    element={<AdminRoute><AdminRequests /></AdminRoute>} />
          <Route path="/admin/letture"          element={<AdminRoute><AdminLetture /></AdminRoute>} />
          <Route path="/admin/letture/nuova"    element={<AdminRoute><AdminLetturaNuova /></AdminRoute>} />
          <Route path="/admin/letture/:slug"    element={<AdminRoute><AdminLetturaDetail /></AdminRoute>} />
          <Route path="/admin/site-config" element={<AdminRoute><AdminSiteConfig /></AdminRoute>} />
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
            <SubscriptionProvider>
              <AppLayout />
            </SubscriptionProvider>
          </SiteConfigProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}
