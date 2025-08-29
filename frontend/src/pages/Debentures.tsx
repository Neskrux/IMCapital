import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar,
  Shield,
  Award,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Debenture {
  id: string;
  name: string;
  issuer: string;
  rating: string;
  minInvestment: number;
  annualReturn: string;
  maturity: string;
  type: string;
  available: number;
  total: number;
  features: string[];
  risk: 'low' | 'medium' | 'high';
}

const Debentures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDebenture, setSelectedDebenture] = useState<Debenture | null>(null);

  const debentures: Debenture[] = [
    {
      id: '1',
      name: 'Debênture Premium XYZ',
      issuer: 'XYZ Holdings',
      rating: 'AAA',
      minInvestment: 5000,
      annualReturn: 'CDI + 2.5%',
      maturity: '2029',
      type: 'Incentivada',
      available: 2500000,
      total: 5000000,
      features: ['Isenção de IR', 'Garantia Real', 'Rating AAA'],
      risk: 'low'
    },
    {
      id: '2',
      name: 'Debênture Growth ABC',
      issuer: 'ABC Energia',
      rating: 'AA+',
      minInvestment: 10000,
      annualReturn: 'CDI + 3.0%',
      maturity: '2028',
      type: 'Simples',
      available: 3000000,
      total: 10000000,
      features: ['Alta Liquidez', 'Setor Energia', 'Pagamento Semestral'],
      risk: 'medium'
    },
    {
      id: '3',
      name: 'Debênture Infra DEF',
      issuer: 'DEF Infraestrutura',
      rating: 'AA',
      minInvestment: 1000,
      annualReturn: 'CDI + 2.0%',
      maturity: '2027',
      type: 'Incentivada',
      available: 5000000,
      total: 15000000,
      features: ['Isenção de IR', 'Projeto Aprovado', 'Garantia BNDES'],
      risk: 'low'
    },
    {
      id: '4',
      name: 'Debênture Tech GHI',
      issuer: 'GHI Technology',
      rating: 'A+',
      minInvestment: 25000,
      annualReturn: 'CDI + 4.0%',
      maturity: '2026',
      type: 'Conversível',
      available: 1000000,
      total: 3000000,
      features: ['Conversível em Ações', 'Setor Tech', 'Alto Potencial'],
      risk: 'high'
    },
  ];

  const filteredDebentures = debentures.filter(deb => {
    const matchesSearch = deb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deb.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || deb.type.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return 'text-green-500 bg-green-600/20';
      case 'medium': return 'text-yellow-500 bg--600/20';
      case 'high': return 'text-red-500 bg-red-600/20';
      default: return 'text-gray-500 bg-gray-600/20';
    }
  };

  const handleInvest = (debenture: Debenture) => {
    setSelectedDebenture(debenture);
  };

  const confirmInvestment = (amount: number) => {
    toast.success(`Investimento de R$ ${amount.toLocaleString('pt-BR')} realizado com sucesso!`);
    setSelectedDebenture(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Debêntures Disponíveis</h1>
        <p className="text-gray-400">Explore oportunidades exclusivas de investimento</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800 rounded-xl p-6 border border-dark-700"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome ou emissor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg input-dark"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedFilter === 'all' 
                  ? 'bg-gold-600 text-dark-900 font-semibold' 
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedFilter('incentivada')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedFilter === 'incentivada' 
                  ? 'bg-gold-600 text-dark-900 font-semibold' 
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
            >
              Incentivadas
            </button>
            <button
              onClick={() => setSelectedFilter('simples')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedFilter === 'simples' 
                  ? 'bg-gold-600 text-dark-900 font-semibold' 
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
            >
              Simples
            </button>
            <button
              onClick={() => setSelectedFilter('conversível')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedFilter === 'conversível' 
                  ? 'bg-gold-600 text-dark-900 font-semibold' 
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
            >
              Conversíveis
            </button>
          </div>
        </div>
      </motion.div>

      {/* Debentures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDebentures.map((debenture, index) => (
          <motion.div
            key={debenture.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-dark-800 rounded-xl border border-dark-700 hover:border-gold-600/50 transition-all duration-300 overflow-hidden group"
          >
            {/* Card Header */}
            <div className="p-6 border-b border-dark-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{debenture.name}</h3>
                  <p className="text-gray-400 text-sm">{debenture.issuer}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-gold-600/20 text-gold-500 text-sm font-semibold">
                    {debenture.rating}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(debenture.risk)}`}>
                    {debenture.risk === 'low' ? 'Baixo' : debenture.risk === 'medium' ? 'Médio' : 'Alto'} Risco
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Retorno Anual</p>
                  <p className="text-2xl font-bold text-gradient-gold">{debenture.annualReturn}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Vencimento</p>
                  <p className="text-xl font-semibold text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {debenture.maturity}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Disponível</span>
                  <span className="text-white font-semibold">
                    R$ {debenture.available.toLocaleString('pt-BR')} / R$ {debenture.total.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className="h-full rounded-full gradient-gold"
                    style={{ width: `${(debenture.available / debenture.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {debenture.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-dark-700 text-gray-300 text-xs">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Investment Info */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <div>
                  <p className="text-gray-400 text-sm">Investimento Mínimo</p>
                  <p className="text-lg font-semibold text-white">
                    R$ {debenture.minInvestment.toLocaleString('pt-BR')}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInvest(debenture)}
                  className="px-6 py-3 rounded-lg btn-gold flex items-center space-x-2"
                >
                  <span>Investir</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedDebenture && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDebenture(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-dark-800 rounded-xl p-6 max-w-md w-full border border-gold-600/50"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Confirmar Investimento</h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Debênture</p>
                <p className="text-lg font-semibold text-white">{selectedDebenture.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Retorno Esperado</p>
                <p className="text-xl font-bold text-gradient-gold">{selectedDebenture.annualReturn}</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Valor do Investimento</label>
                <input
                  type="number"
                  min={selectedDebenture.minInvestment}
                  defaultValue={selectedDebenture.minInvestment}
                  className="w-full px-4 py-3 rounded-lg input-dark"
                  placeholder={`Mínimo: R$ ${selectedDebenture.minInvestment.toLocaleString('pt-BR')}`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDebenture(null)}
                className="flex-1 px-4 py-3 rounded-lg bg-dark-700 text-gray-300 hover:bg-dark-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmInvestment(selectedDebenture.minInvestment)}
                className="flex-1 px-4 py-3 rounded-lg btn-gold"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Debentures;

