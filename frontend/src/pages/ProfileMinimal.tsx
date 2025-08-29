import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const ProfileMinimal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    birthDate: '1990-01-01',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: true,
    language: 'pt-BR',
    twoFactor: true,
  });

  const handleSave = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const tabs = [
    { 
      id: 'personal', 
      label: 'Dados Pessoais',
      icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
    },
    { 
      id: 'security', 
      label: 'Segurança',
      icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z'
    },
    { 
      id: 'preferences', 
      label: 'Preferências',
      icon: 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z'
    },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '300',
          color: '#f7f7f8',
          letterSpacing: '-0.025em'
        }}>
          Meu Perfil
        </h1>
        <p style={{ 
          color: '#71717a',
          fontSize: '0.875rem',
          marginTop: '0.25rem'
        }}>
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      {/* Profile Overview - Minimal */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
      }}>
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #3f3f46',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #f0b429 0%, transparent 100%)'
            }}></div>
            <span style={{
              fontSize: '2rem',
              fontWeight: '200',
              color: '#f0b429',
              fontFamily: 'monospace'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <button style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '28px',
            height: '28px',
            background: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#71717a',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f0b429';
            e.currentTarget.style.color = '#f0b429';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#3f3f46';
            e.currentTarget.style.color = '#71717a';
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,4V1h2v3h3v2H5v3H3V6H0V4H3z M6,10V7h3V4h7l1.83,2H21c1.1,0,2,0.9,2,2v12c0,1.1-0.9,2-2,2H5c-1.1,0-2-0.9-2-2V10H6z M13,19c2.76,0,5-2.24,5-5s-2.24-5-5-5s-5,2.24-5,5S10.24,19,13,19z M9.8,14c0,1.77,1.43,3.2,3.2,3.2s3.2-1.43,3.2-3.2 s-1.43-3.2-3.2-3.2S9.8,12.23,9.8,14z"/>
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '400',
            color: '#f7f7f8',
            marginBottom: '0.25rem'
          }}>
            {user?.name}
          </h2>
          <p style={{ 
            color: '#71717a',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            {user?.email}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              fontSize: '0.75rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
              </svg>
              Verificado
            </span>
            <span style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '6px',
              background: 'rgba(240, 180, 41, 0.05)',
              border: '1px solid rgba(240, 180, 41, 0.2)',
              color: '#f0b429',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Premium
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'flex',
          gap: '2rem',
          paddingLeft: '2rem',
          borderLeft: '1px solid #27272a'
        }}>
          <div>
            <p style={{ 
              color: '#52525b',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.25rem'
            }}>
              Membro desde
            </p>
            <p style={{ 
              color: '#f7f7f8',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Jan 2024
            </p>
          </div>
          <div>
            <p style={{ 
              color: '#52525b',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.25rem'
            }}>
              Investimentos
            </p>
            <p style={{ 
              color: '#f7f7f8',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              12 ativos
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Minimal Tabs */}
        <div style={{ 
          display: 'flex',
          borderBottom: '1px solid #27272a'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '1rem',
                background: activeTab === tab.id ? '#0a0a0b' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? '#f7f7f8' : '#71717a',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab.id ? '500' : '400',
                transition: 'all 0.2s',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {activeTab === tab.id && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '2px',
                  background: '#f0b429'
                }}></div>
              )}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d={tab.icon} />
              </svg>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2rem' }}>
          {activeTab === 'personal' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#52525b',
                      fontSize: '0.875rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  background: '#f0b429',
                  color: '#0a0a0b',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#de911d'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f0b429'}
              >
                Salvar Alterações
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {/* Change Password */}
              <div style={{
                background: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ 
                  fontSize: '1rem',
                  fontWeight: '400',
                  color: '#f7f7f8',
                  marginBottom: '1.5rem'
                }}>
                  Alterar Senha
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="password"
                    placeholder="Senha atual"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '6px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '6px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '6px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <button style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: 'transparent',
                    color: '#f0b429',
                    border: '1px solid #f0b429',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    alignSelf: 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0b429';
                    e.currentTarget.style.color = '#0a0a0b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#f0b429';
                  }}>
                    Alterar Senha
                  </button>
                </div>
              </div>

              {/* Two Factor */}
              <div style={{
                background: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1rem',
                      fontWeight: '400',
                      color: '#f7f7f8',
                      marginBottom: '0.25rem'
                    }}>
                      Autenticação em Duas Etapas
                    </h3>
                    <p style={{ 
                      fontSize: '0.75rem',
                      color: '#71717a'
                    }}>
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <label style={{ 
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={preferences.twoFactor}
                      onChange={(e) => setPreferences({ ...preferences, twoFactor: e.target.checked })}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '40px',
                      height: '22px',
                      background: preferences.twoFactor ? '#f0b429' : '#27272a',
                      borderRadius: '11px',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        background: '#0a0a0b',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: preferences.twoFactor ? '20px' : '2px',
                        transition: 'all 0.2s'
                      }} />
                    </div>
                  </label>
                </div>
                {preferences.twoFactor && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981">
                      <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                    </svg>
                    <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                      Autenticação ativada
                    </span>
                  </div>
                )}
              </div>

              {/* Active Sessions */}
              <div style={{
                background: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <h3 style={{ 
                  fontSize: '1rem',
                  fontWeight: '400',
                  color: '#f7f7f8',
                  marginBottom: '1rem'
                }}>
                  Sessões Ativas
                </h3>
                <div style={{
                  padding: '0.75rem',
                  background: '#18181b',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#71717a">
                      <path d="M21,2H3A2,2 0 0,0 1,4V16A2,2 0 0,0 3,18H10L8,21V22H16V21L14,18H21A2,2 0 0,0 23,16V4A2,2 0 0,0 21,2M21,16H3V4H21V16Z" />
                    </svg>
                    <div>
                      <p style={{ color: '#f7f7f8', fontSize: '0.875rem' }}>
                        Windows - Chrome
                      </p>
                      <p style={{ color: '#52525b', fontSize: '0.75rem' }}>
                        São Paulo, Brasil • Agora
                      </p>
                    </div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    fontSize: '0.625rem',
                    fontWeight: '500'
                  }}>
                    ATUAL
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {/* Notification Settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    key: 'emailNotifications',
                    icon: 'M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z',
                    title: 'Notificações por Email',
                    description: 'Atualizações sobre investimentos'
                  },
                  {
                    key: 'smsNotifications',
                    icon: 'M9,7V9H11V7H9M13,7V9H15V7H13M17,7V9H19V7H17M9,11V13H11V11H9M13,11V13H15V11H13M17,11V13H19V11H17M9,15V17H11V15H9M13,15V17H15V15H13M17,15V17H19V15H17M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3Z',
                    title: 'Notificações por SMS',
                    description: 'Alertas importantes via SMS'
                  },
                  {
                    key: 'darkMode',
                    icon: 'M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z',
                    title: 'Modo Escuro',
                    description: 'Interface em tema escuro'
                  }
                ].map((pref) => (
                  <div
                    key={pref.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#111113'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#0a0a0b'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#71717a">
                        <path d={pref.icon} />
                      </svg>
                      <div>
                        <p style={{ 
                          color: '#f7f7f8',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {pref.title}
                        </p>
                        <p style={{ 
                          color: '#52525b',
                          fontSize: '0.75rem'
                        }}>
                          {pref.description}
                        </p>
                      </div>
                    </div>
                    <label style={{ 
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={Boolean(preferences[pref.key as keyof typeof preferences])}
                        onChange={(e) => setPreferences({ 
                          ...preferences, 
                          [pref.key]: e.target.checked 
                        })}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        width: '40px',
                        height: '22px',
                        background: preferences[pref.key as keyof typeof preferences] 
                          ? '#f0b429' 
                          : '#27272a',
                        borderRadius: '11px',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          background: '#0a0a0b',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '2px',
                          left: preferences[pref.key as keyof typeof preferences] 
                            ? '20px' 
                            : '2px',
                          transition: 'all 0.2s'
                        }} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(240, 180, 41, 0.05)',
                border: '1px solid rgba(240, 180, 41, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f0b429">
                  <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
                </svg>
                <div>
                  <p style={{ 
                    color: '#f0b429',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem'
                  }}>
                    Atenção
                  </p>
                  <p style={{ 
                    color: '#71717a',
                    fontSize: '0.75rem',
                    lineHeight: '1.4'
                  }}>
                    Algumas preferências podem afetar como você recebe informações importantes sobre seus investimentos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileMinimal;

