import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, authHelpers, profileHelpers } from '../lib/supabase-simple';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Interface para ProfileData (definida localmente para evitar import errors)
interface ProfileData {
  id: string;
  email: string;
  full_name?: string;
  balance: number;
  total_invested: number;
  total_earnings: number;
  investor_profile: 'conservador' | 'moderado' | 'arrojado';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  investedAmount: number;
  profile?: ProfileData;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  updateBalance: (amount: number) => void;
  supabaseUser: SupabaseUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Iniciando verificação de sessão...');
    checkInitialSession();
  }, []);

  const checkInitialSession = async () => {
    try {
      console.log('📡 Verificando sessão existente...');
      const session = await authHelpers.getSession();
      
      if (session?.user) {
        console.log('✅ Sessão encontrada, carregando perfil...');
        await loadUserProfile(session.user);
      } else {
        console.log('ℹ️ Nenhuma sessão encontrada');
      }
    } catch (error: any) {
      console.error('❌ Erro ao verificar sessão:', error);
      toast.error('Erro de conexão com o banco de dados');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      setSupabaseUser(supabaseUser);
      
      // Tentar carregar perfil
      const profile = await profileHelpers.getProfile(supabaseUser.id);
      
      const user: User = {
        id: supabaseUser.id,
        name: profile.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
        email: supabaseUser.email || '',
        balance: profile.balance || 0,
        investedAmount: profile.total_invested || 0,
        profile
      };
      
      setUser(user);
      console.log('✅ Perfil carregado com sucesso');
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar perfil:', error);
      
      // Se perfil não existe, usar dados básicos do usuário
      const basicUser: User = {
        id: supabaseUser.id,
        name: supabaseUser.email?.split('@')[0] || 'Usuário',
        email: supabaseUser.email || '',
        balance: 100000, // Saldo padrão
        investedAmount: 0,
        profile: undefined
      };
      
      setUser(basicUser);
      toast.success(`Bem-vindo, ${basicUser.name}!`);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Tentando fazer login...', email);
      
      const { user: supabaseUser } = await authHelpers.signIn(email, password);
      
      if (supabaseUser) {
        console.log('✅ Login realizado com sucesso');
        await loadUserProfile(supabaseUser);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Por favor, confirme seu email');
      } else {
        toast.error('Erro ao fazer login: ' + error.message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      console.log('📝 Criando conta...', email);
      
      const { user: supabaseUser } = await authHelpers.signUp(email, password, fullName);
      
      if (supabaseUser) {
        toast.success('Conta criada! Verifique seu email para confirmar.');
      }
    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
      
      if (error.message.includes('User already registered')) {
        toast.error('Este email já está cadastrado');
      } else {
        toast.error('Erro ao criar conta: ' + error.message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      await authHelpers.signOut();
      setUser(null);
      setSupabaseUser(null);
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      // Mesmo com erro, limpar usuário local
      setUser(null);
      setSupabaseUser(null);
      toast.success('Logout realizado');
    }
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        balance: newBalance 
      };
      setUser(updatedUser);
      
      // Atualizar no Supabase em background
      if (user.profile) {
        profileHelpers.updateProfile(user.id, { 
          balance: newBalance 
        }).catch(error => {
          console.error('Erro ao atualizar saldo:', error);
        });
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    updateBalance,
    supabaseUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};