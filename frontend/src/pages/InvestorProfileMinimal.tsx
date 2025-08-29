import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface InvestorProfileProps {
  onComplete: (email: string, password: string) => void;
}

const InvestorProfileMinimal = ({ onComplete }: InvestorProfileProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Simular processamento
    setTimeout(() => {
      toast.success('Perfil de investidor criado com sucesso!');
      onComplete('investidor@email.com', '123456'); // Dados mockados
      setIsLoading(false);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, name: 'Informações Financeiras', desc: 'Dados sobre sua situação financeira' },
    { id: 2, name: 'Perfil de Risco', desc: 'Defina sua tolerância ao risco' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#0a0a0b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid #27272a',
          background: '#0a0a0b'
        }}>
          {/* Logo */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(240, 180, 41, 0.1) 0%, rgba(240, 180, 41, 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(240, 180, 41, 0.2)',
            margin: '0 auto 1.5rem',
            padding: '10px'
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

          <h1 style={{ 
            fontSize: '1.75rem',
            fontWeight: '300',
            color: '#f7f7f8',
            textAlign: 'center',
            letterSpacing: '-0.025em',
            marginBottom: '0.5rem'
          }}>
            Perfil de Investidor
          </h1>
          <p style={{ 
            color: '#71717a',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            Complete seu perfil para começar a investir
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          padding: '1.5rem 2rem',
          background: '#0a0a0b',
          borderBottom: '1px solid #27272a'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {/* Progress Line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '15%',
              right: '15%',
              height: '2px',
              background: '#27272a',
              zIndex: 0
            }}>
              <div style={{
                height: '100%',
                width: currentStep === 2 ? '100%' : '0%',
                background: '#f0b429',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {/* Step Indicators */}
            {steps.map((step) => (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  zIndex: 1,
                  flex: 1
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: currentStep >= step.id ? '#f0b429' : '#18181b',
                  border: `2px solid ${currentStep >= step.id ? '#f0b429' : '#27272a'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: currentStep >= step.id ? '#0a0a0b' : '#71717a'
                }}>
                  {step.id}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: currentStep >= step.id ? '#f7f7f8' : '#71717a',
                    fontWeight: currentStep === step.id ? '500' : '400'
                  }}>
                    {step.name}
                  </p>
                  <p style={{
                    fontSize: '0.625rem',
                    color: '#52525b',
                    marginTop: '0.125rem'
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Info Alert */}
                <div style={{
                  padding: '1rem',
                  background: 'rgba(240, 180, 41, 0.05)',
                  border: '1px solid rgba(240, 180, 41, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '0.75rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f0b429" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                  <p style={{ 
                    color: '#f0b429',
                    fontSize: '0.75rem',
                    lineHeight: '1.4'
                  }}>
                    As informações fornecidas são confidenciais e serão utilizadas exclusivamente para adequar os produtos ao seu perfil de investimento.
                  </p>
                </div>

                {/* Annual Income */}
                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Renda Anual Estimada
                  </label>
                  <select
                    {...register('annualIncome', { required: 'Campo obrigatório' })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = errors.annualIncome ? '#ef4444' : '#27272a'}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="ate-50k">Até R$ 50.000</option>
                    <option value="50k-100k">R$ 50.001 a R$ 100.000</option>
                    <option value="100k-200k">R$ 100.001 a R$ 200.000</option>
                    <option value="200k-500k">R$ 200.001 a R$ 500.000</option>
                    <option value="500k-1m">R$ 500.001 a R$ 1.000.000</option>
                    <option value="acima-1m">Acima de R$ 1.000.000</option>
                  </select>
                  {errors.annualIncome && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.annualIncome.message as string}
                    </p>
                  )}
                </div>

                {/* Total Investments */}
                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Valor Total de Investimentos
                  </label>
                  <p style={{ 
                    color: '#52525b',
                    fontSize: '0.625rem',
                    marginBottom: '0.5rem'
                  }}>
                    Considere o somatório de todos os produtos investidos
                  </p>
                  <select
                    {...register('totalInvestments', { required: 'Campo obrigatório' })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = errors.totalInvestments ? '#ef4444' : '#27272a'}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="ate-10k">Até R$ 10.000</option>
                    <option value="10k-50k">R$ 10.001 a R$ 50.000</option>
                    <option value="50k-100k">R$ 50.001 a R$ 100.000</option>
                    <option value="100k-300k">R$ 100.001 a R$ 300.000</option>
                    <option value="300k-1m">R$ 300.001 a R$ 1.000.000</option>
                    <option value="acima-1m">Acima de R$ 1.000.000</option>
                  </select>
                  {errors.totalInvestments && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.totalInvestments.message as string}
                    </p>
                  )}
                </div>

                {/* Investment Experience */}
                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Experiência com Investimentos
                  </label>
                  <select
                    {...register('experience', { required: 'Campo obrigatório' })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = errors.experience ? '#ef4444' : '#27272a'}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="nenhuma">Nenhuma experiência</option>
                    <option value="basica">Experiência básica (até 2 anos)</option>
                    <option value="intermediaria">Experiência intermediária (2 a 5 anos)</option>
                    <option value="avancada">Experiência avançada (mais de 5 anos)</option>
                  </select>
                  {errors.experience && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.experience.message as string}
                    </p>
                  )}
                </div>

                {/* Investment Objective */}
                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Objetivo Principal dos Investimentos
                  </label>
                  <select
                    {...register('objective', { required: 'Campo obrigatório' })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = errors.objective ? '#ef4444' : '#27272a'}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="preservacao">Preservação de capital</option>
                    <option value="renda">Geração de renda</option>
                    <option value="crescimento">Crescimento do patrimônio</option>
                    <option value="especulacao">Especulação</option>
                  </select>
                  {errors.objective && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.objective.message as string}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={nextStep}
                    style={{
                      padding: '0.875rem 2rem',
                      borderRadius: '8px',
                      background: '#f0b429',
                      color: '#0a0a0b',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#de911d'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f0b429'}
                  >
                    Próximo
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Risk Profile Header */}
                <div style={{
                  padding: '1rem',
                  background: '#0a0a0b',
                  borderRadius: '8px',
                  border: '1px solid #27272a'
                }}>
                  <h3 style={{ 
                    fontSize: '1rem',
                    fontWeight: '400',
                    color: '#f7f7f8',
                    marginBottom: '0.5rem'
                  }}>
                    Análise de Perfil de Risco
                  </h3>
                  <p style={{ 
                    color: '#71717a',
                    fontSize: '0.75rem',
                    lineHeight: '1.4'
                  }}>
                    As próximas questões são essenciais para entender seu perfil de investidor e recomendar os melhores produtos adequados ao seu perfil de risco.
                  </p>
                  <p style={{ 
                    color: '#f0b429',
                    fontSize: '0.625rem',
                    marginTop: '0.5rem'
                  }}>
                    Suas respostas afetarão seus limites de investimento conforme Resolução CVM 88.
                  </p>
                </div>

                {/* Risk Reaction Question */}
                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem'
                  }}>
                    Reação a Volatilidade
                  </label>
                  <p style={{ 
                    color: '#a1a1aa',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                  }}>
                    Como reagiria ao verificar que, após 6 meses, seu investimento apresentou retorno negativo?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      {
                        value: 'conservador',
                        label: 'Venderia imediatamente, não quero me expor ao risco de ativos inconstantes.',
                        color: '#10b981'
                      },
                      {
                        value: 'moderado',
                        label: 'Entendo que corro risco para determinados ativos, mas não para todo meu patrimônio.',
                        color: '#f0b429'
                      },
                      {
                        value: 'agressivo',
                        label: 'Entendo que meu patrimônio está sujeito a flutuações e mantenho a estratégia de longo prazo.',
                        color: '#ef4444'
                      }
                    ].map((option) => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '1rem',
                          background: '#0a0a0b',
                          border: '1px solid #27272a',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#3f3f46';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#27272a';
                          e.currentTarget.style.background = '#0a0a0b';
                        }}
                      >
                        <input
                          {...register('riskReaction', { required: 'Campo obrigatório' })}
                          type="radio"
                          value={option.value}
                          style={{ 
                            marginTop: '0.125rem',
                            accentColor: option.color
                          }}
                        />
                        <span style={{ 
                          color: '#a1a1aa',
                          fontSize: '0.875rem',
                          lineHeight: '1.4'
                        }}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.riskReaction && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.riskReaction.message as string}
                    </p>
                  )}
                </div>

                {/* Time Horizon */}
                <div>
                  <label style={{
                    display: 'block',
                    color: '#71717a',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Horizonte de Investimento
                  </label>
                  <select
                    {...register('timeHorizon', { required: 'Campo obrigatório' })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = errors.timeHorizon ? '#ef4444' : '#27272a'}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="curto">Curto prazo (até 1 ano)</option>
                    <option value="medio">Médio prazo (1 a 3 anos)</option>
                    <option value="longo">Longo prazo (mais de 3 anos)</option>
                  </select>
                  {errors.timeHorizon && (
                    <p style={{ 
                      marginTop: '0.375rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      {errors.timeHorizon.message as string}
                    </p>
                  )}
                </div>

                {/* Terms and Confirmations */}
                <div style={{
                  background: '#0a0a0b',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #27272a'
                }}>
                  <h4 style={{ 
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#f7f7f8',
                    marginBottom: '1rem'
                  }}>
                    Declarações e Confirmações
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      cursor: 'pointer'
                    }}>
                      <input
                        {...register('dataAccuracy', { required: 'Você deve confirmar a veracidade das informações' })}
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
                        Confirmo ter compreendido as informações e perguntas acima. Declaro que as informações prestadas são verdadeiras e reconheço que serão utilizadas para identificar meu perfil de investimento.
                      </span>
                    </label>
                    
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      cursor: 'pointer'
                    }}>
                      <input
                        {...register('signatureAccept', { required: 'Você deve aceitar a assinatura eletrônica' })}
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
                        Declaro e reconheço que é admitida como válida e verdadeira a assinatura deste formulário por meio deste aceite eletrônico.
                      </span>
                    </label>
                  </div>
                  
                  {(errors.dataAccuracy || errors.signatureAccept) && (
                    <p style={{ 
                      marginTop: '0.75rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}>
                      Você deve aceitar todos os termos para continuar.
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  <button
                    type="button"
                    onClick={prevStep}
                    style={{
                      padding: '0.875rem 1.5rem',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: '#71717a',
                      border: '1px solid #27272a',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
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
                      <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                    </svg>
                    Anterior
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      padding: '0.875rem 2rem',
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
                        Finalizando...
                      </>
                    ) : (
                      <>
                        Finalizar
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InvestorProfileMinimal;
