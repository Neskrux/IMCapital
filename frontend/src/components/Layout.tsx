import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  User, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/debentures', icon: FileText, label: 'Debêntures' },
    { path: '/wallet', icon: Wallet, label: 'Carteira' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar Desktop */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-dark-700"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-dark-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-gold">IMCapital</h1>
              <p className="text-xs text-gray-500">Investimentos Premium</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gold-600/20 text-gold-500 border-l-4 border-gold-500'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-gray-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700">
          <div className="bg-gradient-to-r from-gold-600/20 to-gold-500/20 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-400 mb-1">Saldo Total</p>
            <p className="text-2xl font-bold text-gold-500">
              R$ {user?.balance.toLocaleString('pt-BR')}
            </p>
            <div className="flex items-center mt-2 text-green-500 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12.5% este mês</span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-gray-400 hover:bg-dark-700 hover:text-red-500 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        >
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            className="w-64 h-full bg-dark-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-dark-900" />
                </div>
                <h1 className="text-xl font-bold text-gradient-gold">IMCapital</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <nav className="px-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gold-600/20 text-gold-500 border-l-4 border-gold-500'
                      : 'text-gray-400 hover:bg-dark-700 hover:text-gray-200'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.aside>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-right">
                <p className="text-sm text-gray-400">Bem-vindo,</p>
                <p className="text-gold-500 font-semibold">{user?.name}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 flex items-center justify-center">
                <span className="text-dark-900 font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

