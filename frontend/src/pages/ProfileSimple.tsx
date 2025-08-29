import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const ProfileSimple = () => {
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
    { id: 'personal', label: 'Dados Pessoais', icon: '👤' },
    { id: 'security', label: 'Segurança', icon: '🔒' },
    { id: 'preferences', label: 'Preferências', icon: '⚙️' },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Meu Perfil</h1>
        <p className="page-subtitle">Gerencie suas informações e preferências</p>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f0b429 0%, #de911d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <img 
                src="/images/logo-brasao-branco.png" 
                alt="User Avatar"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
            <button style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '32px',
              height: '32px',
              background: '#f0b429',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              color: '#0a0a0b'
            }}>
              📷
            </button>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f7f7f8', marginBottom: '0.25rem' }}>
              {user?.name}
            </h2>
            <p style={{ color: '#a8a8ad', marginBottom: '0.5rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                ✅ Conta Verificada
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(240, 180, 41, 0.1)',
                color: '#f0b429',
                fontSize: '0.875rem'
              }}>
                Investidor Premium
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid #27272a' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === tab.id ? '#f0b429' : '#a8a8ad',
                borderBottom: activeTab === tab.id ? '2px solid #f0b429' : 'none',
                fontWeight: '600'
              }}
            >
              <span>{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '1.5rem 0' }}>
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CPF</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    className="form-input"
                    disabled
                    style={{ opacity: 0.5 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                💾 Salvar Alterações
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: '#27272a',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f7f7f8', marginBottom: '1rem' }}>
                  Alterar Senha
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Senha Atual</label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nova Senha</label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirmar Nova Senha</label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>
                    Alterar Senha
                  </button>
                </div>
              </div>

              <div style={{
                background: '#27272a',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f7f7f8' }}>
                      Autenticação em Duas Etapas
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#a8a8ad', marginTop: '0.25rem' }}>
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={preferences.twoFactor}
                      onChange={(e) => setPreferences({ ...preferences, twoFactor: e.target.checked })}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '44px',
                      height: '24px',
                      background: preferences.twoFactor ? '#f0b429' : '#3f3f46',
                      borderRadius: '12px',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: preferences.twoFactor ? '22px' : '2px',
                        transition: 'all 0.2s'
                      }} />
                    </div>
                  </label>
                </div>
                {preferences.twoFactor && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '8px',
                    gap: '0.75rem'
                  }}>
                    <span style={{ color: '#22c55e' }}>✅</span>
                    <span style={{ fontSize: '0.875rem', color: '#22c55e' }}>
                      Autenticação em duas etapas está ativada
                    </span>
                  </div>
                )}
              </div>

              <div style={{
                background: '#27272a',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f7f7f8', marginBottom: '1rem' }}>
                  Sessões Ativas
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: '#3f3f46',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🌐</span>
                    <div>
                      <p style={{ color: '#f7f7f8', fontSize: '0.875rem' }}>Windows - Chrome</p>
                      <p style={{ color: '#a8a8ad', fontSize: '0.75rem' }}>São Paulo, Brasil</p>
                    </div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    fontSize: '0.75rem'
                  }}>
                    Atual
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: '#27272a',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>📧</span>
                  <div>
                    <p style={{ color: '#f7f7f8', fontWeight: '500' }}>Notificações por Email</p>
                    <p style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>Receba atualizações sobre seus investimentos</p>
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: preferences.emailNotifications ? '#f0b429' : '#3f3f46',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: preferences.emailNotifications ? '22px' : '2px',
                      transition: 'all 0.2s'
                    }} />
                  </div>
                </label>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: '#27272a',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>📱</span>
                  <div>
                    <p style={{ color: '#f7f7f8', fontWeight: '500' }}>Notificações por SMS</p>
                    <p style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>Alertas importantes via SMS</p>
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.smsNotifications}
                    onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: preferences.smsNotifications ? '#f0b429' : '#3f3f46',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: preferences.smsNotifications ? '22px' : '2px',
                      transition: 'all 0.2s'
                    }} />
                  </div>
                </label>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: '#27272a',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>🌙</span>
                  <div>
                    <p style={{ color: '#f7f7f8', fontWeight: '500' }}>Modo Escuro</p>
                    <p style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>Interface em tema escuro</p>
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.darkMode}
                    onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: preferences.darkMode ? '#f0b429' : '#3f3f46',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: preferences.darkMode ? '22px' : '2px',
                      transition: 'all 0.2s'
                    }} />
                  </div>
                </label>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>⚠️</span>
                  <div>
                    <p style={{ color: '#f59e0b', fontWeight: '500' }}>Atenção</p>
                    <p style={{ color: '#a8a8ad', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Algumas preferências podem afetar como você recebe informações importantes sobre seus investimentos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSimple;
