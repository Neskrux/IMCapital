import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface InvestorProfileProps {
  onComplete: (email: string, password: string) => void;
}

const InvestorProfile = ({ onComplete }: InvestorProfileProps) => {
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

  return (
    <div className="login-container">
      <div className="login-form" style={{ flex: 1, maxWidth: 'none' }}>
        <div className="login-card" style={{ maxWidth: '800px', width: '100%' }}>
          {/* Header */}
          <div className="text-center mb-6">
            <div style={{ 
              width: '60px', 
              height: '60px', 
              margin: '0 auto 1rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f0b429 0%, #de911d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
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
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f7f7f8', marginBottom: '0.5rem' }}>
              Perfil de Investidor
            </h1>
            <p style={{ color: '#a8a8ad', marginBottom: '1rem' }}>
              {currentStep === 1 ? 'Página obrigatória para preenchimento do perfil dos investidores.' : 'Defina seu perfil de risco para investimentos.'}
            </p>
            
            {/* Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= 1 ? 'linear-gradient(135deg, #f0b429 0%, #de911d 100%)' : '#27272a',
                  color: currentStep >= 1 ? '#0a0a0b' : '#a8a8ad',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  1
                </div>
                <div style={{ width: '40px', height: '2px', background: currentStep >= 2 ? '#f0b429' : '#27272a' }} />
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= 2 ? 'linear-gradient(135deg, #f0b429 0%, #de911d 100%)' : '#27272a',
                  color: currentStep >= 2 ? '#0a0a0b' : '#a8a8ad',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  2
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <p style={{ 
                    background: 'rgba(240, 180, 41, 0.1)', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    color: '#f0b429',
                    fontSize: '0.875rem',
                    marginBottom: '1.5rem'
                  }}>
                    **Obs. Precisa ter um campo onde o cliente afirma que as informações que ele colocou são verdadeiras e ele se responsabiliza por isso.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Qual sua renda anual estimada? <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    {...register('annualIncome', { required: 'Campo obrigatório' })}
                    className="form-input"
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
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.annualIncome.message as string}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Qual o valor total estimado de seus investimentos financeiros? <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <p style={{ color: '#a8a8ad', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Considere o somatório de todos os produtos investidos em corretoras e bancos
                  </p>
                  <select
                    {...register('totalInvestments', { required: 'Campo obrigatório' })}
                    className="form-input"
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
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {errors.totalInvestments.message as string}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary"
                  >
                    Próxima →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <p style={{ 
                    color: '#f7f7f8', 
                    fontSize: '1.125rem', 
                    fontWeight: '600',
                    marginBottom: '1rem'
                  }}>
                    As próximas 3 questões são essenciais para que a AmFi possa entender o seu Perfil de Investidor e exibir os melhores produtos adequados ao seu perfil de risco.
                  </p>
                  <p style={{ 
                    color: '#f0b429', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem'
                  }}>
                    O que for respondido também afetará seus limites de investimento para ofertas públicas segundo a Resolução CVM 88.
                  </p>
                  <p style={{ color: '#a8a8ad', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Reiteramos que as informações que você compartilhar não serão abertas a terceiros, a não ser que isso seja explicitamente informado e autorizado.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Com relação aos riscos existentes no tipo de investimento oferecido, como reagiria ao verificar que, após o período de 6 meses, este apresentou retorno negativo? <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        {...register('riskReaction', { required: 'Campo obrigatório' })}
                        type="radio"
                        value="vender-imediato"
                        style={{ marginTop: '0.25rem' }}
                      />
                      <span style={{ color: '#d0d0d3', fontSize: '0.875rem' }}>
                        Venderia imediatamente, não quero me expor ao risco de ativos muito inconstantes no curto prazo.
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        {...register('riskReaction', { required: 'Campo obrigatório' })}
                        type="radio"
                        value="risco-determinados"
                        style={{ marginTop: '0.25rem' }}
                      />
                      <span style={{ color: '#d0d0d3', fontSize: '0.875rem' }}>
                        Entendo que corro risco para determinados ativos, mas não para todo meu patrimônio.
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        {...register('riskReaction', { required: 'Campo obrigatório' })}
                        type="radio"
                        value="flutuacao-patrimonio"
                        style={{ marginTop: '0.25rem' }}
                      />
                      <span style={{ color: '#d0d0d3', fontSize: '0.875rem' }}>
                        Entendendo que meu patrimônio está sujeito a flutuação dessa magnitude e não está...
                      </span>
                    </label>
                  </div>
                  {errors.riskReaction && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      Preencha este campo obrigatório.
                    </p>
                  )}
                </div>

                <div style={{
                  background: '#27272a',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #3f3f46'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        {...register('dataAccuracy', { required: 'Você deve confirmar a veracidade das informações' })}
                        type="checkbox"
                        style={{ marginTop: '0.25rem' }}
                      />
                      <span style={{ color: '#d0d0d3', fontSize: '0.875rem' }}>
                        Confirmo ter compreendido as informações e perguntas acima, bem como o processo de Perfil do Investidor AmFi. Declaro que as informações por mim prestadas neste questionário são expressão da verdade e reconheço que as minhas respostas serão utilizadas para identificar o meu perfil de investimento.
                      </span>
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        {...register('signatureAccept', { required: 'Você deve aceitar a assinatura eletrônica' })}
                        type="checkbox"
                        style={{ marginTop: '0.25rem' }}
                      />
                      <span style={{ color: '#d0d0d3', fontSize: '0.875rem' }}>
                        Declaro e reconheço que é admitida como válida e verdadeira a assinatura deste formulário por meio deste aceite.
                      </span>
                    </label>
                  </div>
                  {(errors.dataAccuracy || errors.signatureAccept) && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      Você deve aceitar todos os termos para continuar.
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-outline"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="loading" style={{ marginRight: '8px' }}></span>
                        Processando...
                      </span>
                    ) : 'Finalizar Cadastro'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvestorProfile;
