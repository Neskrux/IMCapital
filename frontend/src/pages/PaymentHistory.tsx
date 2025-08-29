import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-simple';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  stripe_payment_intent_id?: string;
}

const PaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar transações:', error);
        toast.error('Erro ao carregar histórico de pagamentos');
        return;
      }

      setTransactions(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar histórico de pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return '#10b981';
      case 'failed':
        return '#ef4444';
      case 'canceled':
        return '#f59e0b';
      default:
        return '#71717a';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'Concluído';
      case 'failed':
        return 'Falhou';
      case 'canceled':
        return 'Cancelado';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
        </div>
      </div>
    );
  }

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
          Histórico de Pagamentos
        </h1>
        <p style={{ 
          color: '#71717a',
          fontSize: '0.875rem',
          marginTop: '0.25rem'
        }}>
          Acompanhe suas transações e depósitos
        </p>
      </div>

      {transactions.length === 0 ? (
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#d4af37">
              <path d="M20,8H4V6C4,4.89 4.89,4 6,4H18A2,2 0 0,1 20,6V8M20,8V18A2,2 0 0,1 18,20H6C4.89,20 4,19.1 4,18V8H20M16,11V13H14V11H16M19,11V13H17V11H19Z" />
            </svg>
          </div>
          <h3 style={{ color: '#f7f7f8', marginBottom: '0.5rem' }}>
            Nenhuma transação encontrada
          </h3>
          <p style={{ color: '#71717a' }}>
            Suas transações de pagamento aparecerão aqui
          </p>
        </div>
      ) : (
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 100px 120px 60px',
            gap: '1rem',
            padding: '1rem',
            borderBottom: '1px solid #27272a',
            background: '#0f0f10'
          }}>
            <div style={{ color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Data/Hora
            </div>
            <div style={{ color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Valor
            </div>
            <div style={{ color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Método
            </div>
            <div style={{ color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status
            </div>
            <div></div>
          </div>

          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 100px 120px 60px',
                gap: '1rem',
                padding: '1rem',
                borderBottom: '1px solid #27272a',
                alignItems: 'center'
              }}
            >
              <div>
                <p style={{ color: '#f7f7f8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                </p>
                <p style={{ color: '#71717a', fontSize: '0.75rem' }}>
                  {new Date(transaction.created_at).toLocaleTimeString('pt-BR')}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '500' }}>
                  +R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <p style={{ color: '#f7f7f8', fontSize: '0.875rem' }}>
                  {transaction.payment_method === 'card' ? 'Cartão' : transaction.payment_method}
                </p>
              </div>

              <div>
                <span style={{
                  color: getStatusColor(transaction.status),
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  padding: '0.25rem 0.5rem',
                  background: `${getStatusColor(transaction.status)}20`,
                  borderRadius: '4px'
                }}>
                  {getStatusText(transaction.status)}
                </span>
              </div>

              <div>
                {transaction.stripe_payment_intent_id && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.stripe_payment_intent_id!);
                      toast.success('ID copiado!');
                    }}
                    style={{
                      color: '#71717a',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                    title="Copiar ID da transação"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
