import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface RegisterProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

const Register = ({ onRegister, onBackToLogin }: RegisterProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Simular cadastro
    setTimeout(() => {
      toast.success('Cadastro realizado com sucesso!');
      onRegister();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* Left Side - Register Form */}
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
              <h1>Criar Conta</h1>
              <p className="subtitle">Junte-se aos investidores premium</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input
                {...register('name', { required: 'Nome é obrigatório' })}
                type="text"
                className="form-input"
                placeholder="João Silva"
              />
              {errors.name && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.name.message as string}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
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
              <label className="form-label">CPF</label>
              <input
                {...register('cpf', { required: 'CPF é obrigatório' })}
                type="text"
                className="form-input"
                placeholder="123.456.789-00"
              />
              {errors.cpf && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.cpf.message as string}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                {...register('phone', { required: 'Telefone é obrigatório' })}
                type="tel"
                className="form-input"
                placeholder="(11) 99999-9999"
              />
              {errors.phone && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password', { 
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
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

            <div className="form-group">
              <label className="form-label">Confirmar Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('confirmPassword', { 
                    required: 'Confirmação de senha é obrigatória',
                    validate: (value) => value === password || 'Senhas não coincidem'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>

            <div className="checkbox-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
              <label className="checkbox-label">
                <input 
                  {...register('terms', { required: 'Você deve aceitar os termos' })}
                  type="checkbox" 
                />
                Aceito os <a href="#" className="text-gold">Termos de Uso</a> e <a href="#" className="text-gold">Política de Privacidade</a>
              </label>
              <label className="checkbox-label">
                <input 
                  {...register('newsletter')}
                  type="checkbox" 
                />
                Desejo receber informações sobre investimentos
              </label>
            </div>

            {errors.terms && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {errors.terms.message as string}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="loading" style={{ marginRight: '8px' }}></span>
                  Criando conta...
                </span>
              ) : 'Criar Conta'}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray">
                Já tem uma conta?{' '}
                <button 
                  type="button"
                  onClick={onBackToLogin}
                  className="text-gold"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Faça login
                </button>
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
            <span className="text-gold">Cadastre-se</span> e Comece a Investir
          </h2>
          <p className="features-subtitle">
            Faça parte do seleto grupo de investidores com acesso exclusivo às melhores debêntures do mercado.
          </p>

          <div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Cadastro Rápido</h3>
                <p>Processo simples e seguro</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Verificação Automática</h3>
                <p>Aprovação em minutos</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Sem Taxa de Cadastro</h3>
                <p>100% gratuito para começar</p>
              </div>
            </div>
          </div>

          <div className="cdi-display">
            <div className="cdi-header">
              <span className="text-gray">Investidores Ativos</span>
              <span className="cdi-rate">+2.500</span>
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

export default Register;

