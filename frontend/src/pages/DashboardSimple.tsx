import { useAuth } from '../contexts/AuthContext';
import MarketTicker from '../components/MarketTicker';
import BasicChart from '../components/BasicChart';
import MiniCandlestick from '../components/MiniCandlestick';

const DashboardSimple = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Saldo Total',
      value: `R$ ${user?.balance?.toLocaleString('pt-BR') || '0'}`,
      change: '+12.5%',
      isPositive: true,
      icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z',
      color: 'gold'
    },
    {
      title: 'Investido',
      value: `R$ ${user?.investedAmount?.toLocaleString('pt-BR') || '0'}`,
      change: '+8.2%',
      isPositive: true,
      icon: 'M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z',
      color: 'green'
    },
    {
      title: 'Rendimento Mensal',
      value: 'R$ 3.750',
      change: '+15.3%',
      isPositive: true,
      icon: 'M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z',
      color: 'blue'
    },
    {
      title: 'Taxa Média',
      value: '15.6% a.a.',
      change: 'CDI + 1.85%',
      isPositive: true,
      icon: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z',
      color: 'purple'
    },
  ];

  const transactions = [
    { id: 1, type: 'deposit', description: 'Depósito', amount: 5000, date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'investment', description: 'Debênture XYZ', amount: -10000, date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'earning', description: 'Rendimento Mensal', amount: 450, date: '2024-01-10', status: 'completed' },
    { id: 4, type: 'deposit', description: 'Depósito', amount: 15000, date: '2024-01-05', status: 'completed' },
  ];

  return (
    <div className="fade-in">
      {/* Market Ticker */}
      <div className="ticker-container" style={{ marginBottom: '2rem' }}>
        <MarketTicker />
      </div>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Acompanhe seus investimentos em tempo real</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className={`stat-icon ${stat.color}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d={stat.icon} />
                </svg>
              </div>
              <div className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d={stat.isPositive ? 'M7,14L12,9L17,14H7Z' : 'M7,10L12,15L17,10H7Z'} />
                </svg>
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="stat-label">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Performance Chart */}
        <div className="chart-container">
          <BasicChart />
        </div>

        {/* Portfolio Distribution */}
        <div className="chart-container">
          <h2 className="card-title mb-4">Distribuição do Portfolio</h2>
          
          {/* Mock Pie Chart */}
          <div style={{ 
            height: '200px', 
            background: 'linear-gradient(135deg, rgba(240, 180, 41, 0.1) 0%, rgba(240, 180, 41, 0.05) 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(240, 180, 41, 0.2)',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center', color: '#a8a8ad' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--primary-gold)">
                <path d="M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C22,6.8 18.1,2.5 13,2Z" />
              </svg>
              <p>Portfolio</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f0b429' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#a8a8ad' }}>Debênture A</span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f7f7f8' }}>35%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#de911d' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#a8a8ad' }}>Debênture B</span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f7f7f8' }}>25%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#cb6e17' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#a8a8ad' }}>Debênture C</span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f7f7f8' }}>20%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3f3f46' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#a8a8ad' }}>Conta</span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f7f7f8' }}>20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">Transações Recentes</h2>
          <button className="text-gold" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            Ver todas
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Data</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: transaction.type === 'deposit' ? 'rgba(34, 197, 94, 0.1)' :
                                 transaction.type === 'investment' ? 'rgba(59, 130, 246, 0.1)' :
                                 'rgba(240, 180, 41, 0.1)'
                    }}>
                      {transaction.type === 'deposit' ? '⬇️' :
                       transaction.type === 'investment' ? '📄' : '📈'}
                    </div>
                  </td>
                  <td>{transaction.description}</td>
                  <td style={{ color: '#a8a8ad' }}>
                    📅 {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ 
                    textAlign: 'right', 
                    fontWeight: '600',
                    color: transaction.amount > 0 ? '#22c55e' : '#ef4444'
                  }}>
                    {transaction.amount > 0 ? '+' : ''}
                    R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="badge success">
                      Concluído
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mini Charts Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2 className="card-title mb-4">Mercado em Tempo Real</h2>
        <div className="mini-charts-grid">
          <MiniCandlestick symbol="PETR4" name="Petrobras" />
          <MiniCandlestick symbol="VALE3" name="Vale" />
          <MiniCandlestick symbol="ITUB4" name="Itaú" />
          <MiniCandlestick symbol="BBDC4" name="Bradesco" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSimple;
