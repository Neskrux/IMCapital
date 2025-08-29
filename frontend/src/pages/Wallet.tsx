import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  CreditCard, 
  Building,
  Smartphone,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Wallet = () => {
  const { user, updateBalance } = useAuth();
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const [copied, setCopied] = useState(false);

  const paymentMethods = [
    { id: 'pix', name: 'PIX', icon: QrCode, time: 'Instantâneo' },
    { id: 'ted', name: 'TED/DOC', icon: Building, time: '1 dia útil' },
    { id: 'boleto', name: 'Boleto', icon: CreditCard, time: '2 dias úteis' },
  ];

  const transactions = [
    { id: 1, type: 'deposit', amount: 5000, date: '2024-01-15', method: 'PIX', status: 'completed' },
    { id: 2, type: 'withdraw', amount: 2000, date: '2024-01-14', method: 'TED', status: 'completed' },
    { id: 3, type: 'deposit', amount: 10000, date: '2024-01-10', method: 'PIX', status: 'completed' },
    { id: 4, type: 'deposit', amount: 3000, date: '2024-01-08', method: 'Boleto', status: 'pending' },
    { id: 5, type: 'withdraw', amount: 1500, date: '2024-01-05', method: 'PIX', status: 'completed' },
  ];

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    
    // Simular depósito
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
    
    // Simular saque
    const withdrawAmount = parseFloat(amount);
    updateBalance(-withdrawAmount);
    toast.success(`Saque de R$ ${withdrawAmount.toLocaleString('pt-BR')} realizado com sucesso!`);
    setAmount('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 3000);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Carteira</h1>
        <p className="text-gray-400">Gerencie seus depósitos e saques</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-gold-600 to-gold-500 rounded-xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-dark-900/70 text-sm font-medium mb-1">Saldo Disponível</p>
            <p className="text-4xl font-bold text-dark-900">
              R$ {user?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-16 h-16 bg-dark-900/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-dark-900" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-900/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-900/70 text-sm">Investido</span>
              <ArrowUpRight className="w-4 h-4 text-dark-900" />
            </div>
            <p className="text-xl font-bold text-dark-900 mt-1">
              R$ {user?.investedAmount.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="bg-dark-900/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-900/70 text-sm">Rendimento</span>
              <TrendingUp className="w-4 h-4 text-dark-900" />
            </div>
            <p className="text-xl font-bold text-dark-900 mt-1">
              +R$ 3.750
            </p>
          </div>
        </div>
      </motion.div>

      {/* Deposit/Withdraw Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-800 rounded-xl border border-dark-700"
      >
        {/* Tabs */}
        <div className="flex border-b border-dark-700">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'deposit'
                ? 'bg-gold-600/20 text-gold-500 border-b-2 border-gold-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Depositar</span>
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-4 px-6 flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'withdraw'
                ? 'bg-gold-600/20 text-gold-500 border-b-2 border-gold-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Minus className="w-5 h-5" />
            <span className="font-semibold">Sacar</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'deposit' ? (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Método de Pagamento
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === method.id
                          ? 'border-gold-500 bg-gold-600/10'
                          : 'border-dark-700 hover:border-dark-600'
                      }`}
                    >
                      <method.icon className={`w-6 h-6 mb-2 ${
                        selectedMethod === method.id ? 'text-gold-500' : 'text-gray-400'
                      }`} />
                      <p className={`font-semibold ${
                        selectedMethod === method.id ? 'text-white' : 'text-gray-300'
                      }`}>
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{method.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Valor do Depósito
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    R$
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-lg input-dark"
                    placeholder="0,00"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[1000, 5000, 10000, 50000].map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value.toString())}
                      className="px-4 py-2 rounded-lg bg-dark-700 text-gray-300 hover:bg-dark-600 transition-all"
                    >
                      R$ {value.toLocaleString('pt-BR')}
                    </button>
                  ))}
                </div>
              </div>

              {/* PIX QR Code (if PIX selected) */}
              {selectedMethod === 'pix' && (
                <div className="bg-dark-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Chave PIX</h3>
                    <button
                      onClick={() => copyToClipboard('00020126580014BR.GOV.BCB.PIX')}
                      className="flex items-center space-x-2 text-gold-500 hover:text-gold-400"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="text-sm">Copiar</span>
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-dark-900" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 text-center">
                    Escaneie o QR Code ou copie a chave PIX
                  </p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeposit}
                className="w-full py-4 rounded-lg btn-gold font-semibold text-lg"
              >
                Confirmar Depósito
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Withdraw Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Valor do Saque
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    R$
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-lg input-dark"
                    placeholder="0,00"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Saldo disponível: R$ {user?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Bank Account */}
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Conta para saque</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Banco do Brasil</p>
                    <p className="text-gray-400 text-sm">Ag: 1234-5 | CC: 12345-6</p>
                  </div>
                  <button className="text-gold-500 hover:text-gold-400 text-sm">
                    Alterar
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWithdraw}
                className="w-full py-4 rounded-lg btn-gold font-semibold text-lg"
              >
                Confirmar Saque
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-800 rounded-xl p-6 border border-dark-700"
      >
        <h2 className="text-xl font-bold text-white mb-6">Histórico de Transações</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-dark-700 hover:bg-dark-600 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' ? 'bg-green-600/20' : 'bg-red-600/20'
                }`}>
                  {transaction.type === 'deposit' ? (
                    <ArrowDownRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {transaction.type === 'deposit' ? 'Depósito' : 'Saque'}
                  </p>
                  <p className="text-gray-400 text-sm">{transaction.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  R$ {transaction.amount.toLocaleString('pt-BR')}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Wallet;

