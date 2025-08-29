import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

interface PixPaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PixPayment: React.FC<PixPaymentProps> = ({ amount, onSuccess, onCancel }) => {
  const { user, updateBalance } = useAuth();
  const [pixCode, setPixCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePixCode();
  }, [amount]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExpired(true);
    }
  }, [timeLeft]);

  const generatePixCode = async () => {
    // Simulando geração de código PIX
    const randomCode = `00020126580014BR.GOV.BCB.PIX0136${Date.now()}520400005303986540${amount.toFixed(2)}5802BR5913IMCAPITAL6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setPixCode(randomCode);
    
    try {
      // Gerando QR Code localmente
      const qrDataUrl = await QRCode.toDataURL(randomCode, {
        width: 256,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simular delay de processamento PIX
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Atualizar saldo do usuário
      const newBalance = (user?.balance || 0) + amount;
      updateBalance(newBalance);
      
      toast.success(`💰 PIX de R$ ${amount.toLocaleString('pt-BR')} confirmado!`);
      onSuccess();
    } catch (error) {
      toast.error('Erro ao processar PIX');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              padding: '12px',
              background: '#ffffff',
              borderRadius: '12px',
              marginBottom: '12px'
            }}>
              {qrCodeUrl && (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code PIX" 
                  style={{ 
                    display: 'block',
                    width: '200px',
                    height: '200px'
                  }} 
                />
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

          {/* Botões de Ação */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button
              onClick={onCancel}
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
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              onClick={simulatePayment}
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: '10px',
                background: '#d4af37',
                border: 'none',
                borderRadius: '8px',
                color: '#0a0a0b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.7 : 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.background = '#b8941f';
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.background = '#d4af37';
                }
              }}
            >
              {isProcessing ? (
                <>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid transparent',
                    borderTopColor: '#0a0a0b',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Confirmar Pagamento</span>
                </>
              )}
            </button>
          </div>

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
              setTimeLeft(300);
              generatePixCode();
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

export default PixPayment;