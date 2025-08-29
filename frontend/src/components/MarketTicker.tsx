import { useState, useEffect } from 'react';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const MarketTicker = () => {
  const [tickerData, setTickerData] = useState<TickerItem[]>([
    { symbol: 'IBOV', name: 'Ibovespa', price: 128543.21, change: 1245.32, changePercent: 0.98 },
    { symbol: 'PETR4', name: 'Petrobras', price: 38.42, change: 0.85, changePercent: 2.26 },
    { symbol: 'VALE3', name: 'Vale', price: 71.23, change: -0.45, changePercent: -0.63 },
    { symbol: 'ITUB4', name: 'Itaú', price: 32.15, change: 0.28, changePercent: 0.88 },
    { symbol: 'BBDC4', name: 'Bradesco', price: 15.87, change: 0.12, changePercent: 0.76 },
    { symbol: 'ABEV3', name: 'Ambev', price: 13.45, change: -0.08, changePercent: -0.59 },
    { symbol: 'B3SA3', name: 'B3', price: 11.28, change: 0.15, changePercent: 1.35 },
    { symbol: 'MGLU3', name: 'Magazine Luiza', price: 2.87, change: 0.23, changePercent: 8.71 },
    { symbol: 'CDI', name: 'CDI', price: 13.75, change: 0.00, changePercent: 0.00 },
    { symbol: 'SELIC', name: 'Selic', price: 13.75, change: 0.00, changePercent: 0.00 },
  ]);

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prevData => 
        prevData.map(item => {
          // Não atualizar CDI e SELIC com tanta frequência
          if (item.symbol === 'CDI' || item.symbol === 'SELIC') {
            return item;
          }
          
          // Variação aleatória pequena
          const variation = (Math.random() - 0.5) * 0.5;
          const newPrice = item.price * (1 + variation / 100);
          const newChange = newPrice - item.price + item.change;
          const newChangePercent = (newChange / (item.price - item.change)) * 100;
          
          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0a0a0b 0%, #18181b 50%, #0a0a0b 100%)',
      borderBottom: '1px solid #27272a',
      overflow: 'hidden',
      position: 'relative',
      height: '40px',
      width: '100%',
      maxWidth: '100vw'
    }}>
      <div style={{
        display: 'flex',
        animation: 'scroll 30s linear infinite',
        whiteSpace: 'nowrap',
        willChange: 'transform'
      }}>
        {/* Duplicar os dados para criar loop infinito */}
        {[...tickerData, ...tickerData].map((item, index) => (
          <div
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 20px',
              borderRight: '1px solid #27272a',
              minWidth: '180px'
            }}
          >
            <span style={{
              fontWeight: '600',
              marginRight: '8px',
              color: '#f0b429',
              fontSize: '0.875rem'
            }}>
              {item.symbol}
            </span>
            <span style={{
              marginRight: '8px',
              color: '#d0d0d3',
              fontSize: '0.875rem'
            }}>
              {item.symbol === 'IBOV' 
                ? item.price.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
                : item.symbol === 'CDI' || item.symbol === 'SELIC'
                ? `${item.price.toFixed(2)}%`
                : `R$ ${item.price.toFixed(2)}`
              }
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: item.change >= 0 ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '2px' }}>
                <path d={item.change >= 0 ? 'M7,14L12,9L17,14H7Z' : 'M7,10L12,15L17,10H7Z'} />
              </svg>
              {Math.abs(item.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default MarketTicker;
