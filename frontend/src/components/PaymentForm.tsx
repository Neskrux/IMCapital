import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, updateBalance } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '14px',
        color: '#f7f7f8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#52525b',
        },
        iconColor: '#d4af37',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: false,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      toast.error('Erro na configuração do pagamento');
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error('Erro ao carregar formulário do cartão');
      setIsProcessing(false);
      return;
    }

    try {
      // Para demonstração, vamos simular um pagamento bem-sucedido
      console.log('Simulando pagamento bem-sucedido...');
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar saldo do usuário
      const newBalance = (user.balance || 0) + amount;
      updateBalance(newBalance);
      
      toast.success(`💰 Depósito de R$ ${amount.toLocaleString('pt-BR')} realizado com sucesso!`);
      onSuccess();
      return;
    } catch (error: any) {
      console.error('Erro no pagamento:', error);
      toast.error('Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
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
            Pagamento com Cartão
          </h2>
          <p style={{ 
            fontSize: '11px', 
            color: '#71717a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Preencha os dados do cartão
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
          Valor do Depósito
        </p>
        <p style={{ 
          fontSize: '28px',
          fontWeight: '300',
          color: '#d4af37'
        }}>
          R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Campo do Cartão */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '11px',
            color: '#52525b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            Dados do Cartão
          </label>
          <div style={{
            background: '#0f0f10',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <CardElement options={cardElementOptions} />
          </div>
          <p style={{ 
            fontSize: '10px',
            color: '#52525b',
            marginTop: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Use o cartão de teste: 4242 4242 4242 4242
          </p>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            type="button"
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
            type="submit"
            disabled={!stripe || isProcessing}
            style={{
              flex: 1,
              padding: '10px',
              background: !stripe || isProcessing ? '#52525b' : '#d4af37',
              border: 'none',
              borderRadius: '8px',
              color: '#0a0a0b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: !stripe || isProcessing ? 'not-allowed' : 'pointer',
              opacity: !stripe || isProcessing ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (stripe && !isProcessing) {
                e.currentTarget.style.background = '#b8941f';
              }
            }}
            onMouseLeave={(e) => {
              if (stripe && !isProcessing) {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Pagar R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Segurança */}
      <div style={{
        background: '#0f0f10',
        border: '1px solid #27272a',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <svg width="14" height="14" fill="none" stroke="#52525b" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span style={{ 
          fontSize: '10px',
          color: '#52525b',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Pagamento seguro processado pelo Stripe
        </span>
      </div>
    </div>
  );
};

export default PaymentForm;