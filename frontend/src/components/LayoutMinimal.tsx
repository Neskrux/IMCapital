import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LayoutMinimal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      path: 'dashboard', 
      label: 'Dashboard', 
      icon: 'M13,2.05V5.08C16.39,5.57 19,8.47 19,12C19,12.9 18.82,13.75 18.52,14.54L21.12,17.14C21.68,15.8 22,14.3 22,12.5C22,6.75 17.25,2 11.5,2C11.33,2 11.16,2 11,2.05M12,10.5V22C12,22 22,20 22,11C22,11 22,12 22,12C22,5.38 16.62,0 10,0C10,0 10,0 10,0V11.5C10,11.5 10,10.5 12,10.5M3,9V15H7L12,20V4L7,9H3Z'
    },
    { 
      path: 'debentures', 
      label: 'Debêntures', 
      icon: 'M19,6H17C17,3.2 14.8,1 12,1S7,3.2 7,6H5C3.9,6 3,6.9 3,8V20C3,21.1 3.9,22 5,22H19C20.1,22 21,21.1 21,20V8C21,6.9 20.1,6 19,6M12,3C13.7,3 15,4.3 15,6H9C9,4.3 10.3,3 12,3M19,20H5V8H19V20M12,12C10.3,12 9,10.7 9,9H7C7,11.8 9.2,14 12,14S17,11.8 17,9H15C15,10.7 13.7,12 12,12Z'
    },
    { 
      path: 'wallet', 
      label: 'Carteira', 
      icon: 'M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z'
    },
    { 
      path: 'profile', 
      label: 'Perfil', 
      icon: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z'
    },
  ];

  const isActive = (path: string) => {
    if (path === 'dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === `/${path}`;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0b' }}>
      {/* Sidebar - Minimal Design */}
      <aside style={{
        width: sidebarCollapsed ? '70px' : '260px',
        background: '#0a0a0b',
        borderRight: '1px solid #18181b',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'relative',
        zIndex: 50
      }}>
        {/* Logo Section */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #18181b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          gap: '1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            minWidth: 0
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(240, 180, 41, 0.1) 0%, rgba(240, 180, 41, 0.05) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(240, 180, 41, 0.2)',
              flexShrink: 0,
              padding: '6px'
            }}>
              <img 
                src="/images/logo-brasao-branco.png" 
                alt="IMCapital"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: 'brightness(1.2)'
                }}
              />
            </div>
            {!sidebarCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ 
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#f7f7f8',
                  letterSpacing: '-0.025em'
                }}>
                  IMCapital
                </div>
                <div style={{ 
                  fontSize: '0.625rem',
                  color: '#52525b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Premium Invest
                </div>
              </div>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid #27272a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#71717a',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3f3f46';
                e.currentTarget.style.color = '#a1a1aa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272a';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1,
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={`/${item.path}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.75rem' : '0.75rem 1rem',
                  borderRadius: '8px',
                  background: active ? 'rgba(240, 180, 41, 0.1)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(240, 180, 41, 0.2)' : 'transparent'}`,
                  color: active ? '#f0b429' : '#71717a',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: active ? '500' : '400',
                  transition: 'all 0.2s',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = '#a1a1aa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#71717a';
                  }
                }}
                onClick={() => setSidebarOpen(false)}
              >
                {active && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2px',
                    height: '60%',
                    background: '#f0b429',
                    borderRadius: '0 2px 2px 0'
                  }}></div>
                )}
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  style={{ flexShrink: 0 }}
                >
                  <path d={item.icon} />
                </svg>
                {!sidebarCollapsed && <span>{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div style={{
                    position: 'absolute',
                    left: '100%',
                    marginLeft: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    background: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#f7f7f8',
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s',
                    zIndex: 100
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  className="nav-tooltip"
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div style={{
          padding: sidebarCollapsed ? '0.75rem' : '1rem',
          borderTop: '1px solid #18181b'
        }}>
          {/* Balance Card - Minimal */}
          {!sidebarCollapsed && (
            <div style={{
              background: '#18181b',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '0.75rem',
              border: '1px solid #27272a'
            }}>
              <p style={{ 
                color: '#52525b',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.375rem'
              }}>
                Saldo Total
              </p>
              <p style={{ 
                fontSize: '1.25rem',
                fontWeight: '300',
                color: '#f7f7f8',
                marginBottom: '0.25rem'
              }}>
                R$ <span style={{ fontWeight: '500' }}>
                  {user?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </span>
              </p>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#10b981',
                fontSize: '0.625rem'
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,14L12,9L17,14H7Z" />
                </svg>
                <span>+12.5% este mês</span>
              </div>
            </div>
          )}

          {/* User Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: sidebarCollapsed ? '0' : '0.75rem',
            borderRadius: '8px',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #3f3f46',
              flexShrink: 0
            }}>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '400',
                color: '#f0b429'
              }}>
                {user?.name?.split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase() || 'U'}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div style={{ minWidth: 0 }}>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: '#f7f7f8',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user?.name}
                </p>
                <p style={{ 
                  fontSize: '0.625rem',
                  color: '#52525b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Premium
                </p>
              </div>
            )}
          </div>

          {/* Logout Button - Minimal */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: sidebarCollapsed ? '0.75rem' : '0.75rem 1rem',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid #27272a',
              color: '#71717a',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#27272a';
              e.currentTarget.style.color = '#71717a';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
            </svg>
            {!sidebarCollapsed && <span>Sair</span>}
          </button>

          {/* Collapse Button for collapsed state */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid #27272a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#71717a',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3f3f46';
                e.currentTarget.style.color = '#a1a1aa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272a';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              zIndex: 40,
              backdropFilter: 'blur(4px)',
              display: 'none'
            }}
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '260px',
              background: '#0a0a0b',
              borderRight: '1px solid #18181b',
              zIndex: 50,
              transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s ease',
              display: 'none'
            }}
            className="lg:hidden"
          >
            {/* Mobile sidebar content - same as desktop */}
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Bar - Minimal */}
        <header style={{
          height: '64px',
          background: '#0a0a0b',
          borderBottom: '1px solid #18181b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem'
        }}>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid #27272a',
              color: '#71717a',
              cursor: 'pointer'
            }}
            className="lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
          </button>

          {/* Breadcrumb or Page Title */}
          <div style={{ flex: 1 }}>
            <p style={{ 
              color: '#71717a',
              fontSize: '0.75rem',
              marginBottom: '0.125rem'
            }}>
              Bem-vindo de volta,
            </p>
            <p style={{ 
              color: '#f7f7f8',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              {user?.name}
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid #27272a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#71717a',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3f3f46';
                e.currentTarget.style.color = '#a1a1aa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272a';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,21H14A2,2 0 0,1 12,23A2,2 0 0,1 10,21M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M17,11A5,5 0 0,0 12,6A5,5 0 0,0 7,11V18H17V11Z" />
              </svg>
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                background: '#f0b429',
                borderRadius: '50%',
                border: '2px solid #0a0a0b'
              }}></div>
            </button>

            <button
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid #27272a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#71717a',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3f3f46';
                e.currentTarget.style.color = '#a1a1aa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272a';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          background: '#0a0a0b',
          padding: '1.5rem'
        }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .nav-item:hover .nav-tooltip {
          opacity: 1 !important;
        }
        
        @media (max-width: 1024px) {
          .lg\\:hidden {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LayoutMinimal;
