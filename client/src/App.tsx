import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { SubscriptionProvider } from './context/SubscriptionContext';
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

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const WorkflowLog    = lazy(() => import('./pages/WorkflowLog'));
const AdminRequests  = lazy(() => import('./pages/AdminRequests'));

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
          <Route path="/bartleby"        element={<WorkInProgress />} />
          <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/workflow"  element={<AdminRoute><WorkflowLog /></AdminRoute>} />
          <Route path="/admin/requests"  element={<AdminRoute><AdminRequests /></AdminRoute>} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <SubscriptionProvider>
            <AppLayout />
          </SubscriptionProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}
