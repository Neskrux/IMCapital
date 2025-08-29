import { useState, useEffect } from 'react';

const BasicChart = () => {
  const [data, setData] = useState([
    { time: '00:00', debentures: 15.6, cdi: 13.75, ibovespa: 12.8 },
    { time: '00:05', debentures: 15.8, cdi: 13.76, ibovespa: 12.9 },
    { time: '00:10', debentures: 16.1, cdi: 13.75, ibovespa: 13.1 },
    { time: '00:15', debentures: 15.9, cdi: 13.77, ibovespa: 12.7 },
    { time: '00:20', debentures: 16.2, cdi: 13.75, ibovespa: 13.0 },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        // Atualizar valores com pequenas variações
        newData.forEach(point => {
          point.debentures += (Math.random() - 0.5) * 0.1;
          point.cdi += (Math.random() - 0.5) * 0.02;
          point.ibovespa += (Math.random() - 0.5) * 0.15;
        });
        return newData;
      });
      setCurrentIndex(prev => (prev + 1) % 5);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Calcular min e max para escala
  const allValues = data.flatMap(d => [d.debentures, d.cdi, d.ibovespa]);
  const minValue = Math.min(...allValues) - 1;
  const maxValue = Math.max(...allValues) + 1;
  const range = maxValue - minValue;

  // Função para converter valor em posição Y
  const getY = (value: number) => {
    return 250 - ((value - minValue) / range) * 230;
  };

  // Criar path SVG para cada linha
  const createPath = (dataKey: 'debentures' | 'cdi' | 'ibovespa') => {
    return data.map((point, index) => {
      const x = 50 + (index * 150);
      const y = getY(point[dataKey]);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      padding: '1rem'
    }}>
      <h3 style={{ 
        color: '#f0b429', 
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        Performance em Tempo Real
      </h3>

      {/* Legenda */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginBottom: '1rem',
        fontSize: '0.875rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '3px', background: '#f0b429' }}></div>
          <span style={{ color: '#a8a8ad' }}>Debêntures</span>
          <span style={{ color: '#f0b429', fontWeight: '600' }}>
            {data[currentIndex].debentures.toFixed(2)}%
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '3px', background: '#3b82f6' }}></div>
          <span style={{ color: '#a8a8ad' }}>CDI</span>
          <span style={{ color: '#3b82f6', fontWeight: '600' }}>
            {data[currentIndex].cdi.toFixed(2)}%
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '3px', background: '#10b981' }}></div>
          <span style={{ color: '#a8a8ad' }}>Ibovespa</span>
          <span style={{ color: '#10b981', fontWeight: '600' }}>
            {data[currentIndex].ibovespa.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Gráfico SVG */}
      <svg 
        width="100%" 
        height="280" 
        viewBox="0 0 800 280"
        style={{ 
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          border: '1px solid #27272a'
        }}
      >
        {/* Grid horizontal */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={`grid-h-${i}`}
            x1="50"
            y1={20 + i * 57.5}
            x2="750"
            y2={20 + i * 57.5}
            stroke="#27272a"
            strokeDasharray="2,4"
          />
        ))}

        {/* Grid vertical */}
        {data.map((_, index) => (
          <line
            key={`grid-v-${index}`}
            x1={50 + index * 150}
            y1="20"
            x2={50 + index * 150}
            y2="250"
            stroke="#27272a"
            strokeDasharray="2,4"
          />
        ))}

        {/* Labels X */}
        {data.map((point, index) => (
          <text
            key={`label-x-${index}`}
            x={50 + index * 150}
            y="270"
            fill="#71717a"
            fontSize="12"
            textAnchor="middle"
          >
            {point.time}
          </text>
        ))}

        {/* Labels Y */}
        {[0, 1, 2, 3, 4].map(i => {
          const value = minValue + (range * (4 - i)) / 4;
          return (
            <text
              key={`label-y-${i}`}
              x="35"
              y={25 + i * 57.5}
              fill="#71717a"
              fontSize="12"
              textAnchor="end"
            >
              {value.toFixed(0)}%
            </text>
          );
        })}

        {/* Linha Debêntures */}
        <path
          d={createPath('debentures')}
          fill="none"
          stroke="#f0b429"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Linha CDI */}
        <path
          d={createPath('cdi')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Linha Ibovespa */}
        <path
          d={createPath('ibovespa')}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pontos animados */}
        {data.map((point, index) => (
          <g key={`points-${index}`}>
            <circle
              cx={50 + index * 150}
              cy={getY(point.debentures)}
              r={currentIndex === index ? "5" : "3"}
              fill="#f0b429"
              opacity={currentIndex === index ? 1 : 0.6}
            />
            <circle
              cx={50 + index * 150}
              cy={getY(point.cdi)}
              r={currentIndex === index ? "5" : "3"}
              fill="#3b82f6"
              opacity={currentIndex === index ? 1 : 0.6}
            />
            <circle
              cx={50 + index * 150}
              cy={getY(point.ibovespa)}
              r={currentIndex === index ? "5" : "3"}
              fill="#10b981"
              opacity={currentIndex === index ? 1 : 0.6}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default BasicChart;

