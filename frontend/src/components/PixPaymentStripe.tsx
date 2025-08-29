import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import paymentService from '../services/payment.service';
import { loadStripe } from '@stripe/stripe-js';

interface PixPaymentStripeProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PixPaymentStripe: React.FC<PixPaymentStripeProps> = ({ amount, onSuccess, onCancel }) => {
  const { user, updateBalance } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pixCode, setPixCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    createPixPayment();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
    }
  }, [timeLeft, isExpired]);

  const createPixPayment = async () => {
    setIsProcessing(true);
    
    try {
      const response = await paymentService.createPixPayment(
        amount, 
        user?.id || '', 
        user?.email || ''
      );

      setPaymentIntent(response.payment);
      
      // Confirmar o pagamento PIX para gerar QR Code
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe não carregado');

      const { error, paymentIntent: confirmedPI } = await stripe.confirmPixPayment(
        response.payment.client_secret,
        {
          payment_method: {
            pix: {},
          }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Extrair dados do PIX
      if (confirmedPI?.next_action?.pix_display_qr_code) {
        const pixData = confirmedPI.next_action.pix_display_qr_code;
        setQrCodeUrl(pixData.image_url_svg || '');
        setPixCode(pixData.data || '');
        
        // Iniciar polling para verificar pagamento
        startPolling(confirmedPI.id);
      }

    } catch (error: any) {
      console.error('Erro ao criar PIX:', error);
      toast.error(error.message || 'Erro ao gerar PIX');
    } finally {
      setIsProcessing(false);
    }
  };

  const startPolling = (paymentId: string) => {
    const stopPolling = paymentService.startPaymentStatusPolling(
      paymentId,
      (status) => {
        if (status.status === 'succeeded') {
          toast.success(`💰 PIX de R$ ${amount.toLocaleString('pt-BR')} confirmado!`);
          stopPolling();
          onSuccess();
        }
      },
      3000 // Verificar a cada 3 segundos
    );

    // Parar polling após 30 minutos
    setTimeout(() => {
      stopPolling();
      setIsExpired(true);
    }, 1800000);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isProcessing) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #27272a',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 24px'
        }}></div>
        <h3 style={{ 
          fontSize: '18px',
          fontWeight: '400',
          color: '#f7f7f8',
          marginBottom: '8px'
        }}>
          Gerando PIX...
        </h3>
        <p style={{ 
          fontSize: '14px',
          color: '#71717a'
        }}>
          Aguarde enquanto criamos seu código PIX
        </p>
      </div>
    );
  }

  return (
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
            Pagamento PIX
          </h2>
          <p style={{ 
            fontSize: '11px', 
            color: '#71717a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Escaneie o código para pagar
          </p>
        </div>
        <button
          onClick={onCancel}
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

      {/* Valor */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <p style={{ 
          fontSize: '11px',
          color: '#52525b',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px'
        }}>
          Valor Total
        </p>
        <p style={{ 
          fontSize: '28px',
          fontWeight: '300',
          color: '#d4af37'
        }}>
          R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {!isExpired ? (
        <>
          {/* QR Code */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '16px',
              background: '#ffffff',
              borderRadius: '12px',
              marginBottom: '12px'
            }}>
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code PIX" 
                  style={{ 
                    display: 'block',
                    width: '200px',
                    height: '200px'
                  }} 
                />
              ) : (
                <div style={{
                  width: '200px',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f5f5f5'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #d4af37',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
              )}
            </div>
            <p style={{ 
              fontSize: '11px',
              color: '#52525b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Escaneie com seu app bancário
            </p>
          </div>

          {/* Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#52525b' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontSize: '12px', color: '#71717a' }}>
              Expira em {formatTime(timeLeft)}
            </span>
          </div>

          {/* Código PIX */}
          {pixCode && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ 
                fontSize: '11px',
                color: '#52525b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}>
                Código PIX Copia e Cola
              </p>
              <div style={{
                background: '#0f0f10',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <p style={{
                  fontSize: '11px',
                  color: '#52525b',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  lineHeight: '1.4',
                  opacity: 0.7
                }}>
                  {pixCode.substring(0, 60)}...
                </p>
              </div>
              <button
                onClick={copyPixCode}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: copied ? '#10b981' : '#a1a1aa',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.borderColor = '#3f3f46';
                    e.currentTarget.style.color = '#f7f7f8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.borderColor = '#27272a';
                    e.currentTarget.style.color = '#a1a1aa';
                  }
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {copied ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  )}
                </svg>
                {copied ? 'Copiado!' : 'Copiar código'}
              </button>
            </div>
          )}

          {/* Instruções */}
          <div style={{
            background: '#0f0f10',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <p style={{ 
              fontSize: '11px',
              color: '#52525b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px'
            }}>
              Como pagar
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Abra o app do seu banco',
                'Escaneie o QR Code ou copie o código',
                'Confirme e finalize o pagamento'
              ].map((step, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '10px', color: '#d4af37', fontWeight: '500' }}>
                      {index + 1}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#71717a' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <svg width="32" height="32" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 style={{ 
            fontSize: '18px',
            fontWeight: '400',
            color: '#f7f7f8',
            marginBottom: '8px'
          }}>
            PIX Expirado
          </h3>
          <p style={{ 
            fontSize: '13px',
            color: '#71717a',
            marginBottom: '24px'
          }}>
            O código PIX expirou. Gere um novo código para continuar.
          </p>
          <button
            onClick={() => {
              setIsExpired(false);
              setTimeLeft(1800);
              createPixPayment();
            }}
            style={{
              padding: '10px 24px',
              background: '#d4af37',
              border: 'none',
              borderRadius: '8px',
              color: '#0a0a0b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#b8941f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#d4af37'}
          >
            Gerar Novo PIX
          </button>
        </div>
      )}
    </div>
  );
};

export default PixPaymentStripe;
