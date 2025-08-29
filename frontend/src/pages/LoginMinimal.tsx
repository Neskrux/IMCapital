import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
});

interface LoginProps {
  onLogin: () => void;
  onRegister?: () => void;
}

const LoginMinimal = ({ onLogin, onRegister }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Login será feito pelo AuthContext
      await loginUser(data.email, data.password);
    } catch (error) {
      // Erro já tratado no AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { 
      icon: 'M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z',
      title: 'Rentabilidade Superior',
      desc: 'CDI + spreads atrativos'
    },
    { 
      icon: 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z',
      title: 'Segurança Garantida',
      desc: 'Investimentos protegidos'
    },
    { 
      icon: 'M5,3A2,2 0 0,0 3,5V7A2,2 0 0,0 5,9H7V7H5V5H19V7H17V9H19A2,2 0 0,0 21,7V5A2,2 0 0,0 19,3H5M5,11V13H8V11H5M5,15V17H11V15H5M5,19V21H19V19H5M13,11V13H19V11H13M13,15V17H19V15H13Z',
      title: 'Acesso Exclusivo',
      desc: 'Oportunidades selecionadas'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#0a0a0b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        minHeight: '600px',
        margin: '2rem'
      }}>
        {/* Left Side - Login Form */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '3rem',
          background: '#0a0a0b'
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <img 
                src="/images/logo-full-horizontal-branco.png" 
                alt="IMCapital"
                style={{ 
                  width: '200px', 
                  height: 'auto', 
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
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
                {...register('email')}
                type="email"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#f7f7f8',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="seu@email.com"
                onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : '#27272a'}
              />
              {errors.email && (
                <p style={{ 
                  marginTop: '0.375rem',
                  fontSize: '0.75rem',
                  color: '#ef4444'
                }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#71717a',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '2.5rem',
                    background: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#f7f7f8',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? '#ef4444' : '#27272a'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#a1a1aa'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={showPassword 
                      ? 'M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z'
                      : 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z'
                    } />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p style={{ 
                  marginTop: '0.375rem',
                  fontSize: '0.75rem',
                  color: '#ef4444'
                }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox"
                  style={{ 
                    marginRight: '0.5rem',
                    width: '16px',
                    height: '16px',
                    accentColor: '#f0b429'
                  }}
                />
                <span style={{ 
                  fontSize: '0.875rem',
                  color: '#71717a'
                }}>
                  Lembrar de mim
                </span>
              </label>
              <a 
                href="#"
                style={{ 
                  fontSize: '0.875rem',
                  color: '#71717a',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f0b429'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '8px',
                background: '#f0b429',
                color: '#0a0a0b',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = '#de911d')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.background = '#f0b429')}
            >
              {isLoading ? (
                <>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    style={{ animation: 'spin 1s linear infinite' }}
                  >
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                  </svg>
                  Entrando...
                </>
              ) : 'Entrar'}
            </button>

            <div style={{ 
              textAlign: 'center',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid #27272a'
            }}>
              <p style={{ 
                fontSize: '0.875rem',
                color: '#71717a'
              }}>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={onRegister}
                  style={{ 
                    color: '#f0b429',
                    background: 'none',
                    border: 'none',
                    textDecoration: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#de911d'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#f0b429'}
                >
                  Solicite seu acesso
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side - Features */}
        <div style={{
          background: '#18181b',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderLeft: '1px solid #27272a',
          // '@media (max-width: 768px)': {
            display: 'none'
          }
        }}
        className="hidden lg:flex"
        >
          <div style={{ maxWidth: '400px' }}>
            <h2 style={{ 
              fontSize: '1.75rem',
              fontWeight: '300',
              color: '#f7f7f8',
              marginBottom: '0.5rem',
              letterSpacing: '-0.025em'
            }}>
              Invista com <span style={{ color: '#f0b429', fontWeight: '400' }}>Exclusividade</span>
            </h2>
            <p style={{ 
              color: '#71717a',
              fontSize: '0.875rem',
              marginBottom: '3rem',
              lineHeight: '1.6'
            }}>
              Acesso às melhores oportunidades em debêntures do mercado, com rentabilidade superior e segurança garantida.
            </p>

            {/* Features */}
            <div style={{ marginBottom: '3rem' }}>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  style={{ 
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(240, 180, 41, 0.1)',
                    border: '1px solid rgba(240, 180, 41, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f0b429">
                      <path d={feature.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#f7f7f8',
                      marginBottom: '0.25rem'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{ 
                      fontSize: '0.75rem',
                      color: '#71717a'
                    }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CDI Card */}
            <div style={{
              background: '#0a0a0b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <span style={{ 
                  color: '#52525b',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  CDI Atual
                </span>
                <span style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: '#f0b429'
                }}>
                  13.75%
                </span>
              </div>
              <div style={{ 
                width: '100%',
                height: '4px',
                background: '#27272a',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%',
                  width: '75%',
                  background: 'linear-gradient(90deg, #f0b429 0%, #de911d 100%)',
                  borderRadius: '2px'
                }}></div>
              </div>
              <p style={{ 
                fontSize: '0.625rem',
                color: '#52525b',
                marginTop: '0.5rem'
              }}>
                Meta SELIC: 13.75% a.a.
              </p>
            </div>

            {/* Stats */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <div>
                <p style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: '#f7f7f8'
                }}>
                  500+
                </p>
                <p style={{ 
                  fontSize: '0.625rem',
                  color: '#52525b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Investidores
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: '#f7f7f8'
                }}>
                  R$ 50M
                </p>
                <p style={{ 
                  fontSize: '0.625rem',
                  color: '#52525b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Sob Gestão
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: '#f7f7f8'
                }}>
                  98%
                </p>
                <p style={{ 
                  fontSize: '0.625rem',
                  color: '#52525b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Satisfação
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .hidden.lg\\:flex {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginMinimal;
