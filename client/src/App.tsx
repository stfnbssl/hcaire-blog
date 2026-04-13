import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import LoginForm from './components/LoginForm';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const muiTheme = createTheme({
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
  palette: {
    primary: { main: '#0284c7' },
  },
});

function AdminRoute() {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return <LoginForm />;
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin"      element={<AdminRoute />} />
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
