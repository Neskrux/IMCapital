import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LayoutSimple = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm8 3a3 3 0 100 6 3 3 0 000-6z' },
    { path: 'debentures', label: 'Debêntures', icon: 'M9 2a1 1 0 000 2h6a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h8a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z' },
    { path: 'wallet', label: 'Carteira', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: 'profile', label: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const isActive = (path: string) => {
    if (path === 'dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === `/${path}`;
  };

  return (
    <div className="main-layout">
      {/* Sidebar Desktop */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div style={{ 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '8px',
              background: 'rgba(240, 180, 41, 0.1)',
              padding: '6px'
            }}>
              <img 
                src="/images/logo-brasao-branco.png" 
                alt="IMCapital"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: 'brightness(1.2) contrast(1.1)'
                }}
              />
            </div>
            <div>
              <div className="sidebar-title">IMCapital</div>
              <div className="sidebar-subtitle">Investimentos Premium</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={`/${item.path}`}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon} />
                </svg>
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="balance-card">
            <div className="balance-label">Saldo Total</div>
            <div className="balance-amount">
              R$ {user?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
            <div className="balance-change">
              <span>📈</span>
              <span>+12.5% este mês</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="nav-item w-full text-left"
            style={{ color: '#ef4444', justifyContent: 'flex-start' }}
          >
            <span className="nav-icon">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
        />
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mobile-menu-btn"
          >
            ☰
          </button>
          
          <div className="user-info">
            <div className="user-details">
              <div className="user-welcome">Bem-vindo,</div>
              <div className="user-name">{user?.name}</div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f0b429 0%, #de911d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px'
            }}>
              <img 
                src="/images/logo-brasao-branco.png" 
                alt="User"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutSimple;
