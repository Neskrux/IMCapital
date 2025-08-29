import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  time: string;
  debentures: number;
  cdi: number;
  ibovespa: number;
}

const RealtimeChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [currentValues, setCurrentValues] = useState({
    debentures: 15.6,
    cdi: 13.75,
    ibovespa: 12.8
  });

  // Inicializar com dados
  useEffect(() => {
    const initialData: ChartData[] = [];
    const now = new Date();
    
    // Criar 20 pontos de dados iniciais
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3000);
      initialData.push({
        time: time.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }),
        debentures: 15.6 + (Math.random() - 0.5) * 0.5,
        cdi: 13.75 + (Math.random() - 0.5) * 0.1,
        ibovespa: 12.8 + (Math.random() - 0.5) * 0.8
      });
    }
    
    setData(initialData);
  }, []);

  // Atualizar dados em tempo real
  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      
      // Atualizar valores atuais
      const newDebentures = currentValues.debentures + (Math.random() - 0.5) * 0.2;
      const newCdi = currentValues.cdi + (Math.random() - 0.5) * 0.05;
      const newIbovespa = currentValues.ibovespa + (Math.random() - 0.5) * 0.3;
      
      setCurrentValues({
        debentures: Math.max(14, Math.min(17, newDebentures)),
        cdi: Math.max(13.5, Math.min(14, newCdi)),
        ibovespa: Math.max(11, Math.min(14, newIbovespa))
      });
      
      // Adicionar novo ponto de dados
      setData(prevData => {
        const newData = [...prevData];
        
        // Remover o primeiro se tiver mais de 20 pontos
        if (newData.length >= 20) {
          newData.shift();
        }
        
        // Adicionar novo ponto
        newData.push({
          time: now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }),
          debentures: Math.max(14, Math.min(17, newDebentures)),
          cdi: Math.max(13.5, Math.min(14, newCdi)),
          ibovespa: Math.max(11, Math.min(14, newIbovespa))
        });
        
        return newData;
      });
    }, 2000); // Atualizar a cada 2 segundos

    return () => clearInterval(interval);
  }, [data.length, currentValues]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px'
        }}>
          <p style={{ color: '#f0b429', marginBottom: '5px' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, margin: '3px 0' }}>
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Se não há dados, mostrar loading
  if (data.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#71717a'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading" style={{ 
            width: '40px', 
            height: '40px',
            margin: '0 auto 1rem',
            border: '3px solid #27272a',
            borderTop: '3px solid #f0b429',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ 
          color: '#f0b429', 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          marginBottom: '0.5rem' 
        }}>
          Performance em Tempo Real
        </h3>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: '#f0b429', 
              borderRadius: '2px' 
            }}></div>
            <span style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>Debêntures</span>
            <span style={{ color: '#f0b429', fontWeight: '600' }}>
              {currentValues.debentures.toFixed(2)}%
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: '#3b82f6', 
              borderRadius: '2px' 
            }}></div>
            <span style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>CDI</span>
            <span style={{ color: '#3b82f6', fontWeight: '600' }}>
              {currentValues.cdi.toFixed(2)}%
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: '#10b981', 
              borderRadius: '2px' 
            }}></div>
            <span style={{ color: '#a8a8ad', fontSize: '0.875rem' }}>Ibovespa</span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>
              {currentValues.ibovespa.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorDebentures" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f0b429" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f0b429" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCDI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIbovespa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#27272a" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="time" 
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 11 }}
              interval="preserveStartEnd"
              tickLine={false}
              axisLine={false}
            />
            
            <YAxis 
              stroke="#52525b"
              tick={{ fill: '#71717a', fontSize: 11 }}
              domain={[10, 18]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey="debentures" 
              stroke="#f0b429" 
              fillOpacity={1}
              fill="url(#colorDebentures)"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
              name="Debêntures"
            />
            
            <Area 
              type="monotone" 
              dataKey="cdi" 
              stroke="#3b82f6" 
              fillOpacity={1}
              fill="url(#colorCDI)"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
              name="CDI"
            />
            
            <Area 
              type="monotone" 
              dataKey="ibovespa" 
              stroke="#10b981" 
              fillOpacity={1}
              fill="url(#colorIbovespa)"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
              name="Ibovespa"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealtimeChart;