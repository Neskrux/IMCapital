import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface RegisterProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

const RegisterMinimal = ({ onRegister, onBackToLogin }: RegisterProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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

  const benefits = [
    {
      icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z',
      title: 'Acesso Imediato',
      desc: 'Comece a investir hoje mesmo'
    },
    {
      icon: 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z',
      title: 'Conta Protegida',
      desc: 'Segurança de nível bancário'
    },
    {
      icon: 'M19,8L15,12H18C18,15.31 15.31,18 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20C16.42,20 20,16.42 20,12H23L19,8M6,12C6,8.69 8.69,6 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4C7.58,4 4,7.58 4,12H1L5,16L9,12H6Z',
      title: 'Suporte Dedicado',
      desc: 'Atendimento personalizado'
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
        {/* Left Side - Register Form */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '3rem',
          background: '#0a0a0b'
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={onBackToLogin}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#71717a',
                background: 'none',
                border: 'none',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                cursor: 'pointer',
                transition: 'color 0.2s',
                padding: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#a1a1aa'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
              </svg>
              Voltar ao login
            </button>

            <div style={{ marginBottom: '1rem' }}>
              <img 
                src="/images/logo-full-horizontal-branco.png" 
                alt="IMCapital"
                style={{ 
                  width: '180px', 
                  height: 'auto', 
                  objectFit: 'contain'
                }}
              />
            </div>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: '300',
              color: '#f7f7f8',
              letterSpacing: '-0.025em',
              marginBottom: '0.5rem'
            }}>
              Criar Conta
            </h2>
          </div>

          {/* Progress Steps */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            {[1, 2].map((step) => (
              <div
                key={step}
                style={{
                  flex: 1,
                  height: '2px',
                  background: currentStep >= step ? '#f0b429' : '#27272a',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '400px' }}>
            {currentStep === 1 ? (
              <>
                {/* Step 1: Basic Info */}
                <div style={{ marginBottom: '1.5rem' }}>
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
                    {...register('name', { required: 'Nome é obrigatório' })}
                    type="text"
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
                    placeholder="João Silva"
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : '#27272a'}
                  />
                  {errors.name && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.name.message as string}
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
                    Email
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
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
                    placeholder="joao@email.com"
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : '#27272a'}
                  />
                  {errors.email && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
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
                      {...register('cpf', { required: 'CPF é obrigatório' })}
                      type="text"
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
                      placeholder="123.456.789-00"
                      onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                      onBlur={(e) => e.target.style.borderColor = errors.cpf ? '#ef4444' : '#27272a'}
                    />
                    {errors.cpf && (
                      <p style={{ 
                        marginTop: '0.375rem',
                        fontSize: '0.75rem',
                        color: '#ef4444'
                      }}>
                        {errors.cpf.message as string}
                      </p>
                    )}
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
                      {...register('phone', { required: 'Telefone é obrigatório' })}
                      type="tel"
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
                      placeholder="(11) 99999-9999"
                      onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                      onBlur={(e) => e.target.style.borderColor = errors.phone ? '#ef4444' : '#27272a'}
                    />
                    {errors.phone && (
                      <p style={{ 
                        marginTop: '0.375rem',
                        fontSize: '0.75rem',
                        color: '#ef4444'
                      }}>
                        {errors.phone.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
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
                  Próximo
                </button>
              </>
            ) : (
              <>
                {/* Step 2: Security */}
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
                      {...register('password', { 
                        required: 'Senha é obrigatória',
                        minLength: {
                          value: 6,
                          message: 'Senha deve ter pelo menos 6 caracteres'
                        }
                      })}
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
                      {errors.password.message as string}
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
                    Confirmar Senha
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      {...register('confirmPassword', { 
                        required: 'Confirmação de senha é obrigatória',
                        validate: (value) => value === password || 'Senhas não coincidem'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
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
                      onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#27272a'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                        <path d={showConfirmPassword 
                          ? 'M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z'
                          : 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z'
                        } />
                      </svg>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.confirmPassword.message as string}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    marginBottom: '0.75rem'
                  }}>
                    <input 
                      {...register('terms', { required: 'Você deve aceitar os termos' })}
                      type="checkbox"
                      style={{ 
                        marginRight: '0.5rem',
                        marginTop: '0.125rem',
                        width: '16px',
                        height: '16px',
                        accentColor: '#f0b429'
                      }}
                    />
                    <span style={{ 
                      fontSize: '0.75rem',
                      color: '#71717a',
                      lineHeight: '1.4'
                    }}>
                      Aceito os{' '}
                      <a 
                        href="#"
                        style={{ 
                          color: '#f0b429',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Termos de Uso
                      </a>{' '}
                      e{' '}
                      <a 
                        href="#"
                        style={{ 
                          color: '#f0b429',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Política de Privacidade
                      </a>
                    </span>
                  </label>
                  
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input 
                      {...register('newsletter')}
                      type="checkbox"
                      style={{ 
                        marginRight: '0.5rem',
                        width: '16px',
                        height: '16px',
                        accentColor: '#f0b429'
                      }}
                    />
                    <span style={{ 
                      fontSize: '0.75rem',
                      color: '#71717a'
                    }}>
                      Desejo receber informações sobre investimentos
                    </span>
                  </label>
                  
                  {errors.terms && (
                    <p style={{ 
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.terms.message as string}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: '#71717a',
                      border: '1px solid #27272a',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
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
                    Voltar
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      flex: 2,
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
                        Criando conta...
                      </>
                    ) : 'Criar Conta'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Right Side - Benefits */}
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
              Benefícios <span style={{ color: '#f0b429', fontWeight: '400' }}>Exclusivos</span>
            </h2>
            <p style={{ 
              color: '#71717a',
              fontSize: '0.875rem',
              marginBottom: '3rem',
              lineHeight: '1.6'
            }}>
              Ao criar sua conta, você terá acesso a uma plataforma completa de investimentos em debêntures.
            </p>

            {/* Benefits */}
            <div style={{ marginBottom: '3rem' }}>
              {benefits.map((benefit, index) => (
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
                      <path d={benefit.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#f7f7f8',
                      marginBottom: '0.25rem'
                    }}>
                      {benefit.title}
                    </h3>
                    <p style={{ 
                      fontSize: '0.75rem',
                      color: '#71717a'
                    }}>
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Badge */}
            <div style={{
              background: '#0a0a0b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5.3L19,8.5V11C19,15.83 15.92,20.16 12,21.18C8.08,20.16 5,15.83 5,11V8.5L12,5.3M12,6.5L7,9V11C7,14.41 9.07,17.57 12,18.59C14.93,17.57 17,14.41 17,11V9L12,6.5Z" />
                </svg>
              </div>
              <div>
                <p style={{ 
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#f7f7f8',
                  marginBottom: '0.125rem'
                }}>
                  Plataforma Segura
                </p>
                <p style={{ 
                  fontSize: '0.75rem',
                  color: '#71717a'
                }}>
                  Criptografia de ponta a ponta
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid #27272a'
            }}>
              <div>
                <p style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: '#f7f7f8'
                }}>
                  100%
                </p>
                <p style={{ 
                  fontSize: '0.625rem',
                  color: '#52525b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Seguro
                </p>
              </div>
              <div>
                <p style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: '#f7f7f8'
                }}>
                  24/7
                </p>
                <p style={{ 
                  fontSize: '0.625rem',
                  color: '#52525b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Suporte
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

export default RegisterMinimal;
