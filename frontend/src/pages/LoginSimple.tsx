import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onRegister?: () => void;
}

const LoginSimple = ({ onLogin, onRegister }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      toast.success('Login realizado com sucesso!');
      onLogin(data.email, data.password);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* Left Side - Login Form */}
      <div className="login-form">
        <div className="login-card">
          <div className="text-center mb-4">
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 1rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f0b429 0%, #de911d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              boxShadow: '0 10px 30px rgba(240, 180, 41, 0.3)'
            }}>
              <img 
                src="/images/logo-brasao-branco.png" 
                alt="IMCapital"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
            <div className="title">
              <h1>IMCapital</h1>
              <p className="subtitle">Investimentos Premium em Debêntures</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                {...register('email', { required: 'Email é obrigatório' })}
                type="email"
                className="form-input"
                placeholder="joao@email.com"
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password', { required: 'Senha é obrigatória' })}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="123456"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#a8a8ad',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                Lembrar de mim
              </label>
              <a href="#" className="text-gold">Esqueceu a senha?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="loading" style={{ marginRight: '8px' }}></span>
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray">
                Não tem uma conta?{' '}
                {onRegister ? (
                  <button 
                    type="button"
                    onClick={onRegister}
                    className="text-gold"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Cadastre-se agora
                  </button>
                ) : (
                  <a href="#" className="text-gold">
                    Solicite seu acesso
                  </a>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="features-section">
        <div className="features-content">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <img 
              src="/images/logo-full-horizontal-branco.png" 
              alt="IMCapital"
              style={{ 
                height: '50px', 
                maxWidth: '100%', 
                objectFit: 'contain',
                filter: 'brightness(1.1)',
                opacity: 0.9
              }}
            />
          </div>
          <h2 className="features-title">
            <span className="text-gold">Invista</span> com Exclusividade
          </h2>
          <p className="features-subtitle">
            Acesso às melhores oportunidades em debêntures do mercado, com rentabilidade superior e segurança garantida.
          </p>

          <div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Rentabilidade Superior</h3>
                <p>Retornos acima do CDI</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Segurança Total</h3>
                <p>Investimentos protegidos</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Exclusividade</h3>
                <p>Oportunidades únicas</p>
              </div>
            </div>
          </div>

          <div className="cdi-display">
            <div className="cdi-header">
              <span className="text-gray">CDI Atual</span>
              <span className="cdi-rate">13.75%</span>
            </div>
            <div className="cdi-bar">
              <div className="cdi-progress"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSimple;
