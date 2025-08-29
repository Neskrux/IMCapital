import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const WalletSimple = () => {
  const { user, updateBalance } = useAuth();
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('pix');

  const paymentMethods = [
    { id: 'pix', name: 'PIX', icon: '🔄', time: 'Instantâneo' },
    { id: 'ted', name: 'TED/DOC', icon: '🏦', time: '1 dia útil' },
    { id: 'boleto', name: 'Boleto', icon: '💳', time: '2 dias úteis' },
  ];

  const transactions = [
    { id: 1, type: 'deposit', amount: 5000, date: '2024-01-15', method: 'PIX', status: 'completed' },
    { id: 2, type: 'withdraw', amount: 2000, date: '2024-01-14', method: 'TED', status: 'completed' },
    { id: 3, type: 'deposit', amount: 10000, date: '2024-01-10', method: 'PIX', status: 'completed' },
    { id: 4, type: 'deposit', amount: 3000, date: '2024-01-08', method: 'Boleto', status: 'pending' },
  ];

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    
    const depositAmount = parseFloat(amount);
    updateBalance(depositAmount);
    toast.success(`Depósito de R$ ${depositAmount.toLocaleString('pt-BR')} realizado com sucesso!`);
    setAmount('');
  };

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    
    if (parseFloat(amount) > (user?.balance || 0)) {
      toast.error('Saldo insuficiente');
      return;
    }
    
    const withdrawAmount = parseFloat(amount);
    updateBalance(-withdrawAmount);
    toast.success(`Saque de R$ ${withdrawAmount.toLocaleString('pt-BR')} realizado com sucesso!`);
    setAmount('');
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Carteira</h1>
        <p className="page-subtitle">Gerencie seus depósitos e saques</p>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #f0b429 0%, #de911d 100%)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ color: 'rgba(10, 10, 11, 0.7)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
              Saldo Disponível
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0a0a0b' }}>
              R$ {user?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </p>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(10, 10, 11, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            💰
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{
            background: 'rgba(10, 10, 11, 0.1)',
            borderRadius: '8px',
            padding: '0.75rem'
          }}>
            <div className="flex items-center justify-between">
              <span style={{ color: 'rgba(10, 10, 11, 0.7)', fontSize: '0.875rem' }}>Investido</span>
              <span style={{ fontSize: '1rem' }}>📈</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0a0a0b', marginTop: '0.25rem' }}>
              R$ {user?.investedAmount?.toLocaleString('pt-BR') || '0'}
            </p>
          </div>
          <div style={{
            background: 'rgba(10, 10, 11, 0.1)',
            borderRadius: '8px',
            padding: '0.75rem'
          }}>
            <div className="flex items-center justify-between">
              <span style={{ color: 'rgba(10, 10, 11, 0.7)', fontSize: '0.875rem' }}>Rendimento</span>
              <span style={{ fontSize: '1rem' }}>📊</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0a0a0b', marginTop: '0.25rem' }}>
              +R$ 3.750
            </p>
          </div>
        </div>
      </div>

      {/* Deposit/Withdraw Section */}
      <div className="card">
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #27272a' }}>
          <button
            onClick={() => setActiveTab('deposit')}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'deposit' ? '#f0b429' : '#a8a8ad',
              borderBottom: activeTab === 'deposit' ? '2px solid #f0b429' : 'none',
              fontWeight: '600'
            }}
          >
            <span>➕</span>
            <span>Depositar</span>
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'withdraw' ? '#f0b429' : '#a8a8ad',
              borderBottom: activeTab === 'withdraw' ? '2px solid #f0b429' : 'none',
              fontWeight: '600'
            }}
          >
            <span>➖</span>
            <span>Sacar</span>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 0' }}>
          {activeTab === 'deposit' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Payment Methods */}
              <div>
                <label className="form-label">Método de Pagamento</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        border: selectedMethod === method.id ? '2px solid #f0b429' : '2px solid #27272a',
                        background: selectedMethod === method.id ? 'rgba(240, 180, 41, 0.1)' : '#27272a',
                        color: selectedMethod === method.id ? '#f0b429' : '#a8a8ad',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{method.icon}</div>
                      <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{method.name}</p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{method.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="form-label">Valor do Depósito</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a8a8ad'
                  }}>
                    R$
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '3rem', fontSize: '1.25rem', fontWeight: 'bold' }}
                    placeholder="0,00"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  {[1000, 5000, 10000, 50000].map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value.toString())}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        background: '#27272a',
                        color: '#d0d0d3',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      R$ {value.toLocaleString('pt-BR')}
                    </button>
                  ))}
                </div>
              </div>

              {/* PIX QR Code */}
              {selectedMethod === 'pix' && (
                <div style={{
                  background: '#27272a',
                  borderRadius: '8px',
                  padding: '1.5rem'
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f7f7f8' }}>Chave PIX</h3>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#f0b429',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}>
                      📋 Copiar
                    </button>
                  </div>
                  <div style={{
                    background: '#f7f7f8',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '192px',
                      background: '#d0d0d3',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ fontSize: '4rem' }}>📱</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#a8a8ad', textAlign: 'center' }}>
                    Escaneie o QR Code ou copie a chave PIX
                  </p>
                </div>
              )}

              <button
                onClick={handleDeposit}
                className="btn btn-primary w-full"
                style={{ padding: '1rem', fontSize: '1.125rem' }}
              >
                Confirmar Depósito
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Withdraw Amount */}
              <div>
                <label className="form-label">Valor do Saque</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a8a8ad'
                  }}>
                    R$
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '3rem', fontSize: '1.25rem', fontWeight: 'bold' }}
                    placeholder="0,00"
                  />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#a8a8ad', marginTop: '0.5rem' }}>
                  Saldo disponível: R$ {user?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>

              {/* Bank Account */}
              <div style={{
                background: '#27272a',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#a8a8ad', marginBottom: '0.5rem' }}>Conta para saque</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ color: '#f7f7f8', fontWeight: '600' }}>Banco do Brasil</p>
                    <p style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>Ag: 1234-5 | CC: 12345-6</p>
                  </div>
                  <button style={{
                    color: '#f0b429',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    Alterar
                  </button>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                className="btn btn-primary w-full"
                style={{ padding: '1rem', fontSize: '1.125rem' }}
              >
                Confirmar Saque
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h2 className="card-title mb-4">Histórico de Transações</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: '8px',
                background: '#27272a',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: transaction.type === 'deposit' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  fontSize: '1.25rem'
                }}>
                  {transaction.type === 'deposit' ? '⬇️' : '⬆️'}
                </div>
                <div>
                  <p style={{ color: '#f7f7f8', fontWeight: '600' }}>
                    {transaction.type === 'deposit' ? 'Depósito' : 'Saque'}
                  </p>
                  <p style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>{transaction.method}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontWeight: 'bold',
                  color: transaction.type === 'deposit' ? '#22c55e' : '#ef4444'
                }}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  R$ {transaction.amount.toLocaleString('pt-BR')}
                </p>
                <p style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletSimple;

