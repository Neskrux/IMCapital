import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../lib/stripe';
import PaymentForm from './PaymentForm';
import PixPayment from './PixPayment';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [step, setStep] = useState<'select' | 'payment'>('select');

  const predefinedAmounts = [100, 500, 1000, 2500, 5000, 10000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value) {
      const numValue = parseInt(value) / 100;
      setCustomAmount(numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
      setSelectedAmount(numValue);
    } else {
      setCustomAmount('');
      setSelectedAmount(null);
    }
  };

  const handleContinue = () => {
    if (selectedAmount && selectedAmount >= 10) {
      setStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    resetModal();
    onClose();
  };

  const resetModal = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setPaymentMethod('pix');
    setStep('select');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      <div 
        className="w-full max-w-md"
        style={{
          backgroundColor: '#0a0a0b',
          border: '1px solid #27272a',
          borderRadius: '16px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {step === 'select' ? (
          <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <div>
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
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#52525b',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#a1a1aa'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#52525b'}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Payment Method Selection */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ 
                fontSize: '11px',
                color: '#52525b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}>
                Método de Pagamento
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setPaymentMethod('pix')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#0f0f10',
                    border: paymentMethod === 'pix' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid #27272a',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(212, 175, 55, 0.05), transparent)',
                    opacity: paymentMethod === 'pix' ? 1 : 0,
                    transition: 'opacity 0.2s'
                  }}></div>
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <svg 
                      width="24" 
                      height="24" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ 
                        margin: '0 auto 8px',
                        color: paymentMethod === 'pix' ? '#d4af37' : '#52525b'
                      }}
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H9V10H15V14L13,18H16L10,19Z" />
                    </svg>
                    <p style={{ 
                      fontSize: '12px',
                      fontWeight: '500',
                      color: paymentMethod === 'pix' ? '#d4af37' : '#f7f7f8',
                      marginBottom: '2px'
                    }}>
                      PIX
                    </p>
                    <p style={{ fontSize: '10px', color: '#52525b' }}>Instantâneo</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#0f0f10',
                    border: paymentMethod === 'card' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid #27272a',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(212, 175, 55, 0.05), transparent)',
                    opacity: paymentMethod === 'card' ? 1 : 0,
                    transition: 'opacity 0.2s'
                  }}></div>
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <svg 
                      width="24" 
                      height="24" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ 
                        margin: '0 auto 8px',
                        color: paymentMethod === 'card' ? '#d4af37' : '#52525b'
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p style={{ 
                      fontSize: '12px',
                      fontWeight: '500',
                      color: paymentMethod === 'card' ? '#d4af37' : '#f7f7f8',
                      marginBottom: '2px'
                    }}>
                      Cartão
                    </p>
                    <p style={{ fontSize: '10px', color: '#52525b' }}>Stripe</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Predefined Amounts */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ 
                fontSize: '11px',
                color: '#52525b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}>
                Valores Sugeridos
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '8px' 
              }}>
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    style={{
                      padding: '12px 8px',
                      background: selectedAmount === amount ? 'rgba(212, 175, 55, 0.1)' : '#0f0f10',
                      border: selectedAmount === amount ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid #27272a',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAmount !== amount) {
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAmount !== amount) {
                        e.currentTarget.style.borderColor = '#27272a';
                      }
                    }}
                  >
                    <p style={{ 
                      fontSize: '14px',
                      color: selectedAmount === amount ? '#d4af37' : '#f7f7f8',
                      fontWeight: '400'
                    }}>
                      R$ {amount.toLocaleString('pt-BR')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div style={{ marginBottom: '24px' }}>
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
                  pointerEvents: 'none'
                }}>
                  R$
                </span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="0,00"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 48px',
                    background: '#0f0f10',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#f7f7f8',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                />
              </div>
              <p style={{ 
                fontSize: '10px',
                color: '#52525b',
                marginTop: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Valor mínimo: R$ 10,00
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#71717a',
                  fontSize: '14px',
                  fontWeight: '300',
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
                Cancelar
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedAmount || selectedAmount < 10}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: selectedAmount && selectedAmount >= 10 ? '#d4af37' : '#52525b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0a0a0b',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: selectedAmount && selectedAmount >= 10 ? 'pointer' : 'not-allowed',
                  opacity: selectedAmount && selectedAmount >= 10 ? 1 : 0.5,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (selectedAmount && selectedAmount >= 10) {
                    e.currentTarget.style.background = '#b8941f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAmount && selectedAmount >= 10) {
                    e.currentTarget.style.background = '#d4af37';
                  }
                }}
              >
                <span>Continuar</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {paymentMethod === 'pix' ? (
              <PixPayment
                amount={selectedAmount || 0}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setStep('select')}
              />
            ) : (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={selectedAmount || 0}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setStep('select')}
                />
              </Elements>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositModal;