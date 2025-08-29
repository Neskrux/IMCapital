import { useAuth } from '../contexts/AuthContext';
import MarketTicker from '../components/MarketTicker';
import BasicChart from '../components/BasicChart';
import MiniCandlestick from '../components/MiniCandlestick';

const DashboardMinimal = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Patrimônio Total',
      value: user?.balance?.toLocaleString('pt-BR') || '0',
      prefix: 'R$',
      change: 12.5,
      icon: 'M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z'
    },
    {
      title: 'Total Investido',
      value: user?.investedAmount?.toLocaleString('pt-BR') || '0',
      prefix: 'R$',
      change: 8.2,
      icon: 'M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z'
    },
    {
      title: 'Rendimento Mensal',
      value: '3.750',
      prefix: 'R$',
      change: 15.3,
      icon: 'M22,12L18,8V11H3V13H18V16L22,12Z'
    },
    {
      title: 'Rentabilidade',
      value: '15.6',
      suffix: '% a.a.',
      change: 1.85,
      subtext: 'CDI +',
      icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z'
    }
  ];

  const transactions = [
    { id: 1, type: 'deposit', description: 'Depósito via PIX', amount: 5000, date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'investment', description: 'Debênture XYZ Holdings', amount: -10000, date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'earning', description: 'Rendimento Mensal', amount: 450, date: '2024-01-10', status: 'completed' },
    { id: 4, type: 'deposit', description: 'Depósito via TED', amount: 15000, date: '2024-01-05', status: 'completed' },
  ];

  const portfolio = [
    { name: 'Debênture Premium XYZ', value: 35, amount: 17500, color: '#f0b429' },
    { name: 'Debênture Growth ABC', value: 25, amount: 12500, color: '#de911d' },
    { name: 'Debênture Infra DEF', value: 20, amount: 10000, color: '#cb6e17' },
    { name: 'Conta Corrente', value: 20, amount: 10000, color: '#27272a' }
  ];

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'deposit': return 'M5,6.5L10,1.5L15,6.5H11V16.5H9V6.5H5M19,21.5H5V19.5H19V21.5Z';
      case 'investment': return 'M19,6H17C17,3.2 14.8,1 12,1S7,3.2 7,6H5C3.9,6 3,6.9 3,8V20C3,21.1 3.9,22 5,22H19C20.1,22 21,21.1 21,20V8C21,6.9 20.1,6 19,6M12,3C13.7,3 15,4.3 15,6H9C9,4.3 10.3,3 12,3M19,20H5V8H19V20Z';
      case 'earning': return 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z';
      default: return 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z';
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Market Ticker - Minimal */}
      <div style={{ 
        marginBottom: '2rem',
        padding: '0.75rem',
        background: '#18181b',
        borderRadius: '8px',
        border: '1px solid #27272a'
      }}>
        <MarketTicker />
      </div>

      {/* Header */}
      <div className="page-header">
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '300',
          color: '#f7f7f8',
          letterSpacing: '-0.025em'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          color: '#71717a',
          fontSize: '0.875rem',
          marginTop: '0.25rem'
        }}>
          Visão geral dos seus investimentos
        </p>
      </div>

      {/* Stats Grid - Minimal Design */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              padding: '1.25rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${
                stat.change > 10 ? '#10b981' : stat.change > 0 ? '#f0b429' : '#ef4444'
              } 0%, transparent 100%)`
            }}></div>

            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(240, 180, 41, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f0b429">
                  <path d={stat.icon} />
                </svg>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: stat.change > 0 ? '#10b981' : '#ef4444'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d={stat.change > 0 ? 'M7,14L12,9L17,14H7Z' : 'M7,10L12,15L17,10H7Z'} />
                </svg>
                <span>{stat.subtext}{Math.abs(stat.change)}%</span>
              </div>
            </div>

            <p style={{ 
              color: '#71717a',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.375rem'
            }}>
              {stat.title}
            </p>
            
            <p style={{ 
              fontSize: '1.5rem',
              fontWeight: '300',
              color: '#f7f7f8'
            }}>
              {stat.prefix && <span style={{ fontSize: '1rem', color: '#71717a' }}>{stat.prefix} </span>}
              <span style={{ fontWeight: '500' }}>{stat.value}</span>
              {stat.suffix && <span style={{ fontSize: '1rem', color: '#71717a' }}>{stat.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Performance Chart */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ 
              fontSize: '1rem',
              fontWeight: '400',
              color: '#f7f7f8',
              marginBottom: '0.25rem'
            }}>
              Performance
            </h2>
            <p style={{ 
              fontSize: '0.75rem',
              color: '#71717a'
            }}>
              Últimos 6 meses
            </p>
          </div>
          <BasicChart />
        </div>

        {/* Portfolio Distribution - Minimal */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1rem',
              fontWeight: '400',
              color: '#f7f7f8',
              marginBottom: '0.25rem'
            }}>
              Distribuição do Portfolio
            </h2>
            <p style={{ 
              fontSize: '0.75rem',
              color: '#71717a'
            }}>
              Alocação atual
            </p>
          </div>

          {/* Minimal Donut Chart Representation */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `conic-gradient(
                #f0b429 0deg ${portfolio[0].value * 3.6}deg,
                #de911d ${portfolio[0].value * 3.6}deg ${(portfolio[0].value + portfolio[1].value) * 3.6}deg,
                #cb6e17 ${(portfolio[0].value + portfolio[1].value) * 3.6}deg ${(portfolio[0].value + portfolio[1].value + portfolio[2].value) * 3.6}deg,
                #27272a ${(portfolio[0].value + portfolio[1].value + portfolio[2].value) * 3.6}deg 360deg
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#18181b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p style={{ 
                  fontSize: '0.625rem',
                  color: '#71717a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Total
                </p>
                <p style={{ 
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#f7f7f8'
                }}>
                  R$ 50k
                </p>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {portfolio.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        background: item.color
                      }}></div>
                      <span style={{ 
                        fontSize: '0.75rem',
                        color: '#71717a'
                      }}>
                        {item.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem',
                        color: '#52525b'
                      }}>
                        {item.value}%
                      </span>
                      <span style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#f7f7f8'
                      }}>
                        R$ {item.amount.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table - Minimal */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '1rem',
              fontWeight: '400',
              color: '#f7f7f8',
              marginBottom: '0.25rem'
            }}>
              Transações Recentes
            </h2>
            <p style={{ 
              fontSize: '0.75rem',
              color: '#71717a'
            }}>
              Últimas movimentações
            </p>
          </div>
          <button style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            background: 'transparent',
            border: '1px solid #27272a',
            color: '#71717a',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f0b429';
            e.currentTarget.style.color = '#f0b429';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#27272a';
            e.currentTarget.style.color = '#71717a';
          }}>
            Ver todas
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #27272a' }}>
                <th style={{ 
                  padding: '0.75rem 0.5rem',
                  textAlign: 'left',
                  color: '#52525b',
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Transação
                </th>
                <th style={{ 
                  padding: '0.75rem 0.5rem',
                  textAlign: 'left',
                  color: '#52525b',
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Data
                </th>
                <th style={{ 
                  padding: '0.75rem 0.5rem',
                  textAlign: 'right',
                  color: '#52525b',
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Valor
                </th>
                <th style={{ 
                  padding: '0.75rem 0.5rem',
                  textAlign: 'right',
                  color: '#52525b',
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  style={{ 
                    borderBottom: '1px solid #27272a',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: transaction.type === 'deposit' 
                          ? 'rgba(16, 185, 129, 0.1)'
                          : transaction.type === 'investment'
                          ? 'rgba(240, 180, 41, 0.1)'
                          : 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill={
                            transaction.type === 'deposit' ? '#10b981' :
                            transaction.type === 'investment' ? '#f0b429' : '#6366f1'
                          }
                        >
                          <path d={getTransactionIcon(transaction.type)} />
                        </svg>
                      </div>
                      <div>
                        <p style={{ 
                          fontSize: '0.875rem',
                          color: '#f7f7f8',
                          fontWeight: '500'
                        }}>
                          {transaction.description}
                        </p>
                        <p style={{ 
                          fontSize: '0.75rem',
                          color: '#52525b',
                          textTransform: 'capitalize'
                        }}>
                          {transaction.type === 'deposit' ? 'Depósito' :
                           transaction.type === 'investment' ? 'Investimento' : 'Rendimento'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ 
                    padding: '1rem 0.5rem',
                    color: '#71717a',
                    fontSize: '0.875rem'
                  }}>
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ 
                    padding: '1rem 0.5rem',
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: transaction.amount > 0 ? '#10b981' : '#ef4444'
                  }}>
                    {transaction.amount > 0 ? '+' : ''}
                    R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ 
                    padding: '1rem 0.5rem',
                    textAlign: 'right'
                  }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      fontSize: '0.625rem',
                      fontWeight: '500'
                    }}>
                      CONCLUÍDO
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Overview - Minimal */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1rem',
            fontWeight: '400',
            color: '#f7f7f8',
            marginBottom: '0.25rem'
          }}>
            Mercado em Tempo Real
          </h2>
          <p style={{ 
            fontSize: '0.75rem',
            color: '#71717a'
          }}>
            Principais ativos do mercado
          </p>
        </div>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <MiniCandlestick symbol="PETR4" name="Petrobras" />
          <MiniCandlestick symbol="VALE3" name="Vale" />
          <MiniCandlestick symbol="ITUB4" name="Itaú" />
          <MiniCandlestick symbol="BBDC4" name="Bradesco" />
        </div>
      </div>
    </div>
  );
};

export default DashboardMinimal;

