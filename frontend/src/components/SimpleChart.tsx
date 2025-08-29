import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SimpleChart = () => {
  const [data, setData] = useState([
    { name: '00:00', debentures: 15.2, cdi: 13.75, ibovespa: 12.5 },
    { name: '00:01', debentures: 15.4, cdi: 13.76, ibovespa: 12.8 },
    { name: '00:02', debentures: 15.6, cdi: 13.75, ibovespa: 12.6 },
    { name: '00:03', debentures: 15.8, cdi: 13.77, ibovespa: 13.0 },
    { name: '00:04', debentures: 15.5, cdi: 13.75, ibovespa: 12.7 },
    { name: '00:05', debentures: 15.9, cdi: 13.78, ibovespa: 12.9 },
    { name: '00:06', debentures: 16.1, cdi: 13.75, ibovespa: 13.2 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        newData.shift();
        
        const lastTime = newData[newData.length - 1].name;
        const [hours, minutes] = lastTime.split(':').map(Number);
        const newMinutes = (minutes + 1) % 60;
        const newHours = minutes === 59 ? (hours + 1) % 24 : hours;
        const newTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
        
        newData.push({
          name: newTime,
          debentures: 15.6 + Math.random() * 1,
          cdi: 13.75 + Math.random() * 0.1,
          ibovespa: 12.8 + Math.random() * 0.8
        });
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: '350px', padding: '20px' }}>
      <h3 style={{ color: '#f0b429', marginBottom: '20px' }}>Performance em Tempo Real</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" domain={[10, 18]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333' 
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="debentures" 
            stroke="#f0b429" 
            strokeWidth={2}
            dot={false}
            name="Debêntures"
          />
          <Line 
            type="monotone" 
            dataKey="cdi" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            name="CDI"
          />
          <Line 
            type="monotone" 
            dataKey="ibovespa" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            name="Ibovespa"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleChart;

