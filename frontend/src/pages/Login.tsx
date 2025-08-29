import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, DollarSign, TrendingUp, Shield, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
});

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      toast.success('Login realizado com sucesso!');
      onLogin();
      setIsLoading(false);
    }, 1500);
  };

  const features = [
    { icon: TrendingUp, title: 'Rentabilidade Superior', desc: 'Retornos acima do CDI' },
    { icon: Shield, title: 'Segurança Total', desc: 'Investimentos protegidos' },
    { icon: Award, title: 'Exclusividade', desc: 'Oportunidades únicas' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center"
            >
              <DollarSign className="w-10 h-10 text-dark-900" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient-gold mb-2">IMCapital</h1>
            <p className="text-gray-400">Investimentos Premium em Debêntures</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 rounded-lg input-dark"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-lg input-dark pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-600 text-gold-600 focus:ring-gold-500" />
                <span className="ml-2 text-sm text-gray-400">Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm text-gold-500 hover:text-gold-400">
                Esqueceu a senha?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg btn-gold font-semibold text-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : 'Entrar'}
            </motion.button>

            <div className="text-center">
              <p className="text-gray-400">
                Não tem uma conta?{' '}
                <a href="#" className="text-gold-500 hover:text-gold-400 font-semibold">
                  Solicite seu acesso
                </a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark-800 to-dark-900 p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-lg"
        >
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-gradient-gold">Invista</span> com Exclusividade
          </h2>
          <p className="text-gray-400 mb-12 text-lg">
            Acesso às melhores oportunidades em debêntures do mercado, com rentabilidade superior e segurança garantida.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 rounded-lg bg-gold-600/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 p-6 rounded-lg glass-effect"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">CDI Atual</span>
              <span className="text-2xl font-bold text-gold-500">13.75%</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ delay: 1.2, duration: 1 }}
                className="h-full rounded-full gradient-gold"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

