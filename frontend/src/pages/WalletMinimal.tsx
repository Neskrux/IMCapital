import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../lib/stripe';
import PaymentForm from '../components/PaymentForm';
import PixPaymentStripe from '../components/PixPaymentStripe';

const WalletMinimal = () => {
  const { user, updateBalance } = useAuth();
  const [activeTab, setActiveTab] = useState('deposit');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'card' | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [step, setStep] = useState<'amount' | 'payment'>('amount');

  const suggestedAmounts = [100, 500, 1000, 2500, 5000, 10000];

  const transactions = [
    { id: 1, type: 'deposit', amount: 5000, date: '2024-01-15', method: 'PIX', status: 'completed' },
    { id: 2, type: 'withdraw', amount: 2000, date: '2024-01-14', method: 'TED', status: 'completed' },
    { id: 3, type: 'deposit', amount: 10000, date: '2024-01-10', method: 'PIX', status: 'completed' },
    { id: 4, type: 'deposit', amount: 3000, date: '2024-01-08', method: 'Boleto', status: 'pending' },
  ];

  const handleContinue = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount <= 0) {
      toast.error('Selecione ou digite um valor válido');
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSuccess = () => {
    toast.success('Depósito realizado com sucesso!');
    setStep('amount');
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedPaymentMethod(null);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    
    if (parseFloat(withdrawAmount) > (user?.balance || 0)) {
      toast.error('Saldo insuficiente');
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    updateBalance(-amount);
    toast.success(`Saque de R$ ${amount.toLocaleString('pt-BR')} realizado com sucesso!`);
    setWithdrawAmount('');
  };

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

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
          Carteira
        </h1>
        <p style={{ 
          color: '#71717a',
          fontSize: '0.875rem',
          marginTop: '0.25rem'
        }}>
          Gerencie seus recursos financeiros
        </p>
      </div>

      {/* Balance Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Main Balance */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #d4af37 0%, transparent 100%)'
          }}></div>
          
          <p style={{ 
            color: '#71717a',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Saldo Disponível
          </p>
          <p style={{ 
            fontSize: '2rem',
            fontWeight: '200',
            color: '#f7f7f8',
            marginBottom: '0.5rem'
          }}>
            R$ <span style={{ fontWeight: '400' }}>
              {user?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </span>
          </p>
          <p style={{ 
            color: '#10b981',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7,14L12,9L17,14H7Z" />
            </svg>
            +12.5% este mês
          </p>
        </div>

        {/* Invested */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <p style={{ 
            color: '#71717a',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Total Investido
          </p>
          <p style={{ 
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#f7f7f8'
          }}>
            R$ <span style={{ fontWeight: '400' }}>
              {user?.investedAmount?.toLocaleString('pt-BR') || '0,00'}
            </span>
          </p>
        </div>

        {/* Returns */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <p style={{ 
            color: '#71717a',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Rendimento Total
          </p>
          <p style={{ 
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#10b981'
          }}>
            +R$ <span style={{ fontWeight: '400' }}>3.750,00</span>
          </p>
        </div>
      </div>

      {/* Main Operations - Beautiful Design from Modal */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '16px',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex',
          borderBottom: '1px solid #27272a'
        }}>
          <button
            onClick={() => {
              setActiveTab('deposit');
              setStep('amount');
              setSelectedPaymentMethod(null);
              setSelectedAmount(null);
              setCustomAmount('');
            }}
            style={{
              flex: 1,
              padding: '1.25rem',
              background: activeTab === 'deposit' ? '#0a0a0b' : 'transparent',
              border: 'none',
              color: activeTab === 'deposit' ? '#f7f7f8' : '#71717a',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'deposit' ? '500' : '400',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            {activeTab === 'deposit' && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '2px',
                background: '#d4af37'
              }}></div>
            )}
            Adicionar Saldo
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            style={{
              flex: 1,
              padding: '1.25rem',
              background: activeTab === 'withdraw' ? '#0a0a0b' : 'transparent',
              border: 'none',
              color: activeTab === 'withdraw' ? '#f7f7f8' : '#71717a',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'withdraw' ? '500' : '400',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            {activeTab === 'withdraw' && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '2px',
                background: '#d4af37'
              }}></div>
            )}
            Sacar Fundos
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {activeTab === 'deposit' ? (
            step === 'amount' ? (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                  <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: '300',
                    color: '#f7f7f8',
                    marginBottom: '4px'
                  }}>
                    Adicionar Saldo
                  </h2>
                  <p style={{ 
                    fontSize: '11px', 
                    color: '#71717a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Escolha o método e valor do depósito
                  </p>
                </div>

                {/* Payment Method Selection */}
                <div style={{ marginBottom: '32px' }}>
                  <p style={{ 
                    fontSize: '11px',
                    color: '#52525b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '16px'
                  }}>
                    Método de Pagamento
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      onClick={() => setSelectedPaymentMethod('pix')}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: selectedPaymentMethod === 'pix' 
                          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))'
                          : '#0f0f10',
                        border: selectedPaymentMethod === 'pix'
                          ? '1px solid #d4af37'
                          : '1px solid #27272a',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedPaymentMethod !== 'pix') {
                          e.currentTarget.style.borderColor = '#3f3f46';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedPaymentMethod !== 'pix') {
                          e.currentTarget.style.borderColor = '#27272a';
                        }
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={selectedPaymentMethod === 'pix' ? '#d4af37' : '#71717a'}>
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H9V10H15V14L13,18H16L10,19Z" />
                      </svg>
                      <span style={{ 
                        fontSize: '13px',
                        fontWeight: '500',
                        color: selectedPaymentMethod === 'pix' ? '#f7f7f8' : '#a1a1aa'
                      }}>
                        PIX
                      </span>
                      <span style={{ 
                        fontSize: '10px',
                        color: '#52525b'
                      }}>
                        Instantâneo
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedPaymentMethod('card')}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: selectedPaymentMethod === 'card' 
                          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))'
                          : '#0f0f10',
                        border: selectedPaymentMethod === 'card'
                          ? '1px solid #d4af37'
                          : '1px solid #27272a',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedPaymentMethod !== 'card') {
                          e.currentTarget.style.borderColor = '#3f3f46';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedPaymentMethod !== 'card') {
                          e.currentTarget.style.borderColor = '#27272a';
                        }
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={selectedPaymentMethod === 'card' ? '#d4af37' : '#71717a'}>
                        <path d="M20 8H4V6H20M20 18H4V12H20M20 4H4C2.89 4 2 4.89 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6C22 4.89 21.1 4 20 4Z" />
                      </svg>
                      <span style={{ 
                        fontSize: '13px',
                        fontWeight: '500',
                        color: selectedPaymentMethod === 'card' ? '#f7f7f8' : '#a1a1aa'
                      }}>
                        Cartão
                      </span>
                      <span style={{ 
                        fontSize: '10px',
                        color: '#52525b'
                      }}>
                        Crédito/Débito
                      </span>
                    </button>
                  </div>
                </div>

                {/* Amount Selection */}
                <div style={{ marginBottom: '32px' }}>
                  <p style={{ 
                    fontSize: '11px',
                    color: '#52525b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '16px'
                  }}>
                    Valores Sugeridos
                  </p>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    {suggestedAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        style={{
                          padding: '16px',
                          borderRadius: '8px',
                          background: selectedAmount === amount 
                            ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))'
                            : '#0f0f10',
                          border: selectedAmount === amount
                            ? '1px solid #d4af37'
                            : '1px solid #27272a',
                          color: selectedAmount === amount ? '#f7f7f8' : '#a1a1aa',
                          fontSize: '14px',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedAmount !== amount) {
                            e.currentTarget.style.borderColor = '#3f3f46';
                            e.currentTarget.style.color = '#f7f7f8';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedAmount !== amount) {
                            e.currentTarget.style.borderColor = '#27272a';
                            e.currentTarget.style.color = '#a1a1aa';
                          }
                        }}
                      >
                        R$ {amount.toLocaleString('pt-BR')}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <p style={{ 
                      fontSize: '11px',
                      color: '#52525b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '12px'
                    }}>
                      Valor Personalizado
                    </p>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#52525b',
                        fontSize: '14px',
                        fontWeight: '400'
                      }}>
                        R$
                      </span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        placeholder="0,00"
                        style={{
                          width: '100%',
                          padding: '14px 16px 14px 48px',
                          background: '#0f0f10',
                          border: '1px solid #27272a',
                          borderRadius: '8px',
                          color: '#f7f7f8',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                        onBlur={(e) => e.target.style.borderColor = '#27272a'}
                      />
                    </div>
                    <p style={{ 
                      fontSize: '10px',
                      color: '#52525b',
                      marginTop: '8px'
                    }}>
                      Valor mínimo: R$ 10,00
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleContinue}
                  disabled={(!selectedAmount && !customAmount) || !selectedPaymentMethod}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    background: (!selectedAmount && !customAmount) || !selectedPaymentMethod 
                      ? '#27272a' 
                      : '#d4af37',
                    border: 'none',
                    color: (!selectedAmount && !customAmount) || !selectedPaymentMethod 
                      ? '#52525b' 
                      : '#0a0a0b',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (!selectedAmount && !customAmount) || !selectedPaymentMethod 
                      ? 'not-allowed' 
                      : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if ((selectedAmount || customAmount) && selectedPaymentMethod) {
                      e.currentTarget.style.background = '#b8941f';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if ((selectedAmount || customAmount) && selectedPaymentMethod) {
                      e.currentTarget.style.background = '#d4af37';
                    }
                  }}
                >
                  <span>Continuar</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {selectedPaymentMethod === 'pix' ? (
                  <PixPaymentStripe 
                    amount={finalAmount}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setStep('amount')}
                  />
                ) : (
                  <Elements stripe={stripePromise}>
                    <PaymentForm 
                      amount={finalAmount}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setStep('amount')}
                    />
                  </Elements>
                )}
              </div>
            )
          ) : (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              {/* Withdraw Form */}
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: '300',
                  color: '#f7f7f8',
                  marginBottom: '4px'
                }}>
                  Sacar Fundos
                </h2>
                <p style={{ 
                  fontSize: '11px', 
                  color: '#71717a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Transferir para sua conta bancária
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ 
                  color: '#71717a',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px'
                }}>
                  Valor do Saque
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#52525b',
                    fontSize: '14px'
                  }}>
                    R$
                  </span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      background: '#0f0f10',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '18px',
                      fontWeight: '300',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="0,00"
                    onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                    onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  />
                </div>
                <p style={{ 
                  fontSize: '11px',
                  color: '#52525b',
                  marginTop: '8px'
                }}>
                  Disponível: R$ {user?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>

              {/* Bank Account */}
              <div style={{
                background: '#0f0f10',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ 
                      color: '#52525b', 
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      Conta Cadastrada
                    </p>
                    <p style={{ color: '#f7f7f8', fontSize: '14px', fontWeight: '500' }}>
                      Banco do Brasil
                    </p>
                    <p style={{ color: '#71717a', fontSize: '12px' }}>
                      Ag: 0001 • Conta: ••••• 12345-6
                    </p>
                  </div>
                  <button style={{
                    color: '#d4af37',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '8px'
                  }}>
                    Alterar
                  </button>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  background: '#d4af37',
                  color: '#0a0a0b',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#b8941f'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#d4af37'}
              >
                Confirmar Saque
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ 
            fontSize: '1rem',
            fontWeight: '400',
            color: '#f7f7f8'
          }}>
            Histórico de Transações
          </h2>
          <button style={{
            color: '#71717a',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,11H5V13H3V11M7,11H21V13H7V11M3,7H5V9H3V7M7,7H21V9H7V7M3,15H5V17H3V15M7,15H21V17H7V15Z" />
            </svg>
            Filtrar
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: '8px',
                background: '#0a0a0b',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#111113'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0a0a0b'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: transaction.type === 'deposit' 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={transaction.type === 'deposit' ? '#10b981' : '#ef4444'}>
                    <path d={transaction.type === 'deposit' 
                      ? 'M7,10L12,15L17,10H7Z' 
                      : 'M7,14L12,9L17,14H7Z'} 
                    />
                  </svg>
                </div>
                <div>
                  <p style={{ 
                    color: '#f7f7f8',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {transaction.type === 'deposit' ? 'Depósito' : 'Saque'}
                  </p>
                  <p style={{ 
                    color: '#52525b',
                    fontSize: '0.75rem'
                  }}>
                    {transaction.method} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: transaction.type === 'deposit' ? '#10b981' : '#ef4444'
                }}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  R$ {transaction.amount.toLocaleString('pt-BR')}
                </p>
                {transaction.status === 'pending' && (
                  <p style={{ 
                    fontSize: '0.625rem',
                    color: '#eab308',
                    marginTop: '0.25rem'
                  }}>
                    Pendente
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button style={{
          width: '100%',
          padding: '0.75rem',
          marginTop: '1rem',
          background: 'transparent',
          border: '1px solid #27272a',
          borderRadius: '8px',
          color: '#71717a',
          fontSize: '0.75rem',
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
        }}>
          Ver mais transações
        </button>
      </div>
    </div>
  );
};

export default WalletMinimal;