import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import './backup.css';
import './dashboard.css';
import './enhancements.css';

import LayoutMinimal from './components/LayoutMinimal';
import LoginMinimal from './pages/LoginMinimal';
import RegisterMinimal from './pages/RegisterMinimal';
import InvestorProfileMinimal from './pages/InvestorProfileMinimal';
import DashboardMinimal from './pages/DashboardMinimal';
import DebenturesMinimal from './pages/DebenturesMinimal';
import CreateDebentureMinimal from './pages/CreateDebentureMinimal';
import WalletMinimal from './pages/WalletMinimal';
import ProfileMinimal from './pages/ProfileMinimal';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  // Se ainda está carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginMinimal onLogin={() => {}} />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterMinimal onRegister={() => {}} onBackToLogin={() => {}} />
      } />
      <Route path="/investor-profile" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <InvestorProfileMinimal onComplete={() => {}} />
      } />
      
      {/* Rotas protegidas */}
      <Route path="/" element={
        isAuthenticated ? <LayoutMinimal /> : <Navigate to="/login" replace />
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardMinimal />} />
        <Route path="debentures" element={<DebenturesMinimal />} />
        <Route path="create-debenture" element={<CreateDebentureMinimal />} />
        <Route path="wallet" element={<WalletMinimal />} />
        <Route path="profile" element={<ProfileMinimal />} />
      </Route>
      
      {/* Rota catch-all para redirecionar para login se não autenticado */}
      <Route path="*" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18181b',
            color: '#f7f7f8',
            border: '1px solid #27272a',
            borderRadius: '8px',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#18181b',
            },
            style: {
              background: '#18181b',
              color: '#10b981',
              border: '1px solid #10b981',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#18181b',
            },
            style: {
              background: '#18181b',
              color: '#ef4444',
              border: '1px solid #ef4444',
            },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}

export default App;