import { useState, useEffect } from 'react';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  time: string;
}

const MiniCandlestick = ({ symbol, name }: { symbol: string; name: string }) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [change, setChange] = useState(0);

  useEffect(() => {
    // Gerar dados iniciais
    const initialCandles: Candle[] = [];
    let lastPrice = 100;
    
    for (let i = 0; i < 20; i++) {
      const variation = (Math.random() - 0.5) * 2;
      const open = lastPrice;
      const close = lastPrice + variation;
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;
      
      initialCandles.push({
        open,
        close,
        high,
        low,
        time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString()
      });
      
      lastPrice = close;
    }
    
    setCandles(initialCandles);
    setCurrentPrice(lastPrice);
    setChange(((lastPrice - 100) / 100) * 100);
  }, []);

  // Atualizar em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prevCandles => {
        const newCandles = [...prevCandles];
        const lastCandle = newCandles[newCandles.length - 1];
        
        const variation = (Math.random() - 0.5) * 1;
        const newPrice = lastCandle.close + variation;
        
        // Adicionar nova vela a cada minuto simulado (a cada 3 segundos real)
        if (Math.random() > 0.7) {
          newCandles.shift();
          newCandles.push({
            open: lastCandle.close,
            close: newPrice,
            high: Math.max(lastCandle.close, newPrice) + Math.random() * 0.3,
            low: Math.min(lastCandle.close, newPrice) - Math.random() * 0.3,
            time: new Date().toLocaleTimeString()
          });
        } else {
          // Atualizar última vela
          newCandles[newCandles.length - 1] = {
            ...lastCandle,
            close: newPrice,
            high: Math.max(lastCandle.high, newPrice),
            low: Math.min(lastCandle.low, newPrice)
          };
        }
        
        setCurrentPrice(newPrice);
        setChange(((newPrice - 100) / 100) * 100);
        
        return newCandles;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const maxPrice = Math.max(...candles.map(c => c.high));
  const minPrice = Math.min(...candles.map(c => c.low));
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div style={{
      background: '#18181b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      padding: '1rem',
      height: '120px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{symbol}</div>
          <div style={{ fontSize: '0.875rem', color: '#f0b429', fontWeight: '600' }}>{name}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', color: '#d0d0d3', fontWeight: '600' }}>
            R$ {currentPrice.toFixed(2)}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: change >= 0 ? '#10b981' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d={change >= 0 ? 'M7,14L12,9L17,14H7Z' : 'M7,10L12,15L17,10H7Z'} />
            </svg>
            {Math.abs(change).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <svg width="100%" height="50" style={{ display: 'block' }}>
        {candles.map((candle, index) => {
          const x = (index / candles.length) * 100 + '%';
          const candleWidth = 100 / candles.length * 0.6;
          const isGreen = candle.close >= candle.open;
          
          const highY = ((maxPrice - candle.high) / priceRange) * 50;
          const lowY = ((maxPrice - candle.low) / priceRange) * 50;
          const openY = ((maxPrice - candle.open) / priceRange) * 50;
          const closeY = ((maxPrice - candle.close) / priceRange) * 50;
          
          return (
            <g key={index}>
              {/* Wick */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={isGreen ? '#10b981' : '#ef4444'}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={`${(index / candles.length) * 100 - candleWidth / 2}%`}
                y={Math.min(openY, closeY)}
                width={`${candleWidth}%`}
                height={Math.abs(openY - closeY) || 1}
                fill={isGreen ? '#10b981' : '#ef4444'}
                opacity="0.8"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MiniCandlestick;

