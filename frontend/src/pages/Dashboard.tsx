import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Dados mockados para os gráficos
  const performanceData = [
    { month: 'Jan', debenture: 14.2, cdi: 13.75 },
    { month: 'Fev', debenture: 14.5, cdi: 13.75 },
    { month: 'Mar', debenture: 14.8, cdi: 13.65 },
    { month: 'Abr', debenture: 15.1, cdi: 13.65 },
    { month: 'Mai', debenture: 15.3, cdi: 13.75 },
    { month: 'Jun', debenture: 15.6, cdi: 13.75 },
  ];

  const portfolioData = [
    { name: 'Debênture A', value: 35, color: '#f0b429' },
    { name: 'Debênture B', value: 25, color: '#de911d' },
    { name: 'Debênture C', value: 20, color: '#cb6e17' },
    { name: 'Conta', value: 20, color: '#3f3f46' },
  ];

  const recentTransactions = [
    { id: 1, type: 'deposit', description: 'Depósito', amount: 5000, date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'investment', description: 'Debênture XYZ', amount: -10000, date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'earning', description: 'Rendimento Mensal', amount: 450, date: '2024-01-10', status: 'completed' },
    { id: 4, type: 'deposit', description: 'Depósito', amount: 15000, date: '2024-01-05', status: 'completed' },
  ];

  const stats = [
    {
      title: 'Saldo Total',
      value: `R$ ${user?.balance.toLocaleString('pt-BR')}`,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'gold'
    },
    {
      title: 'Investido',
      value: `R$ ${user?.investedAmount.toLocaleString('pt-BR')}`,
      change: '+8.2%',
      isPositive: true,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Rendimento Mensal',
      value: 'R$ 3.750',
      change: '+15.3%',
      isPositive: true,
      icon: PieChart,
      color: 'blue'
    },
    {
      title: 'Taxa Média',
      value: '15.6% a.a.',
      change: 'CDI + 1.85%',
      isPositive: true,
      icon: Activity,
      color: 'purple'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Acompanhe seus investimentos em tempo real</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-gold-600/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${
                stat.color === 'gold' ? 'bg-gold-600/20' :
                stat.color === 'green' ? 'bg-green-600/20' :
                stat.color === 'blue' ? 'bg-blue-600/20' :
                'bg-purple-600/20'
              } flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'gold' ? 'text-gold-500' :
                  stat.color === 'green' ? 'text-green-500' :
                  stat.color === 'blue' ? 'text-blue-500' :
                  'text-purple-500'
                }`} />
              </div>
              <div className={`flex items-center text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {stat.change}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-dark-800 rounded-xl p-6 border border-dark-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Performance vs CDI</h2>
              <p className="text-sm text-gray-400">Comparativo de rendimentos</p>
            </div>
            <select className="bg-dark-700 text-gray-300 px-3 py-1 rounded-lg text-sm border border-dark-600">
              <option>6 meses</option>
              <option>1 ano</option>
              <option>Tudo</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorDebenture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f0b429" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f0b429" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCDI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #de911d' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Area type="monotone" dataKey="debenture" stroke="#f0b429" fillOpacity={1} fill="url(#colorDebenture)" name="Debêntures" />
              <Area type="monotone" dataKey="cdi" stroke="#8884d8" fillOpacity={1} fill="url(#colorCDI)" name="CDI" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Portfolio Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-800 rounded-xl p-6 border border-dark-700"
        >
          <h2 className="text-xl font-bold text-white mb-6">Distribuição do Portfolio</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #de911d' }}
                labelStyle={{ color: '#fff' }}
              />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-dark-800 rounded-xl p-6 border border-dark-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Transações Recentes</h2>
          <button className="text-gold-500 hover:text-gold-400 text-sm font-semibold">
            Ver todas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-4">Tipo</th>
                <th className="pb-4">Descrição</th>
                <th className="pb-4">Data</th>
                <th className="pb-4 text-right">Valor</th>
                <th className="pb-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-dark-700">
                  <td className="py-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-green-600/20' :
                      transaction.type === 'investment' ? 'bg-blue-600/20' :
                      'bg-gold-600/20'
                    }`}>
                      {transaction.type === 'deposit' ? 
                        <ArrowDownRight className="w-4 h-4 text-green-500" /> :
                        transaction.type === 'investment' ?
                        <FileText className="w-4 h-4 text-blue-500" /> :
                        <TrendingUp className="w-4 h-4 text-gold-500" />
                      }
                    </div>
                  </td>
                  <td className="py-4">{transaction.description}</td>
                  <td className="py-4 text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className={`py-4 text-right font-semibold ${
                    transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}
                    R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-4 text-right">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-600/20 text-green-500">
                      Concluído
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
