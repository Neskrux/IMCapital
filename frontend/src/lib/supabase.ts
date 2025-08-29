import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase - Você precisará substituir com suas próprias credenciais
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-anon-key-aqui';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Tipos TypeScript para as tabelas
export interface ProfileData {
  id: string;
  email: string;
  full_name?: string;
  cpf?: string;
  phone?: string;
  birth_date?: string;
  balance: number;
  total_invested: number;
  total_earnings: number;
  investor_profile: 'conservador' | 'moderado' | 'arrojado';
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  logo_url?: string;
  description?: string;
  founded_year?: number;
  employees_count?: string;
  annual_revenue?: string;
  market?: string;
  sector?: string;
  website?: string;
  highlights: string[];
  certifications: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Debenture {
  id: string;
  company_id: string;
  name: string;
  code: string;
  type: 'incentivada' | 'simples' | 'conversivel';
  status: 'ativa' | 'encerrada' | 'suspensa';
  total_amount: number;
  available_amount: number;
  min_investment: number;
  unit_price: number;
  annual_return_percentage?: number;
  return_description?: string;
  issue_date: string;
  maturity_date: string;
  payment_frequency?: string;
  rating?: string;
  risk_level: 'baixo' | 'medio' | 'alto';
  features: string[];
  guarantees: string[];
  prospectus_url?: string;
  contract_url?: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Investment {
  id: string;
  investor_id: string;
  debenture_id: string;
  amount: number;
  units: number;
  unit_price: number;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'resgatado';
  total_earnings: number;
  current_value?: number;
  invested_at?: string;
  confirmed_at?: string;
  redeemed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  debenture?: Debenture;
}

export interface Transaction {
  id: string;
  user_id: string;
  investment_id?: string;
  type: 'deposito' | 'saque' | 'investimento' | 'resgate' | 'rendimento' | 'taxa';
  amount: number;
  balance_before?: number;
  balance_after?: number;
  description?: string;
  reference_code?: string;
  status: string;
  processed_at: string;
  metadata?: any;
  created_at: string;
}

// Funções auxiliares de autenticação
export const authHelpers = {
  // Registrar novo usuário
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Login
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Logout
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obter usuário atual
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Obter sessão
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Resetar senha
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  // Atualizar senha
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }
};

// Funções para trabalhar com perfis
export const profileHelpers = {
  // Obter perfil do usuário
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as ProfileData;
  },

  // Atualizar perfil
  updateProfile: async (userId: string, updates: Partial<ProfileData>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as ProfileData;
  },

  // Obter saldo
  getBalance: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('balance, total_invested, total_earnings')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Funções para trabalhar com debêntures
export const debentureHelpers = {
  // Listar todas as debêntures ativas
  listDebentures: async () => {
    const { data, error } = await supabase
      .from('debentures')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('status', 'ativa')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Debenture[];
  },

  // Obter debênture por ID
  getDebenture: async (id: string) => {
    const { data, error } = await supabase
      .from('debentures')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Debenture;
  },

  // Criar nova debênture (admin)
  createDebenture: async (debenture: Partial<Debenture>) => {
    const { data, error } = await supabase
      .from('debentures')
      .insert(debenture)
      .select()
      .single();
    
    if (error) throw error;
    return data as Debenture;
  }
};

// Funções para trabalhar com investimentos
export const investmentHelpers = {
  // Listar investimentos do usuário
  listUserInvestments: async (userId: string) => {
    const { data, error } = await supabase
      .from('investments')
      .select(`
        *,
        debenture:debentures(
          *,
          company:companies(*)
        )
      `)
      .eq('investor_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Investment[];
  },

  // Criar novo investimento
  createInvestment: async (investment: {
    debenture_id: string;
    amount: number;
    units: number;
    unit_price: number;
  }) => {
    const user = await authHelpers.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('investments')
      .insert({
        ...investment,
        investor_id: user.id,
        status: 'pendente'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Investment;
  },

  // Confirmar investimento
  confirmInvestment: async (investmentId: string) => {
    const { data, error } = await supabase
      .from('investments')
      .update({
        status: 'confirmado',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', investmentId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Investment;
  }
};

// Funções para trabalhar com transações
export const transactionHelpers = {
  // Listar transações do usuário
  listUserTransactions: async (userId: string, limit = 50) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as Transaction[];
  },

  // Criar depósito
  createDeposit: async (amount: number, description?: string) => {
    const user = await authHelpers.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'deposito',
        amount,
        description: description || 'Depósito via PIX',
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Transaction;
  },

  // Criar saque
  createWithdrawal: async (amount: number, description?: string) => {
    const user = await authHelpers.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'saque',
        amount,
        description: description || 'Saque para conta bancária',
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Transaction;
  }
};

// Funções de notificação
export const notificationHelpers = {
  // Listar notificações do usuário
  listNotifications: async (userId: string, unreadOnly = false) => {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (unreadOnly) {
      query = query.eq('read', false);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Marcar notificação como lida
  markAsRead: async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);
    
    if (error) throw error;
  },

  // Marcar todas como lidas
  markAllAsRead: async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
  }
};

// Subscrições em tempo real
export const realtimeSubscriptions = {
  // Escutar mudanças no saldo
  subscribeToBalance: (userId: string, callback: (balance: number) => void) => {
    return supabase
      .channel(`balance-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          if (payload.new && 'balance' in payload.new) {
            callback(payload.new.balance as number);
          }
        }
      )
      .subscribe();
  },

  // Escutar novas notificações
  subscribeToNotifications: (userId: string, callback: (notification: any) => void) => {
    return supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  },

  // Escutar mudanças nos investimentos
  subscribeToInvestments: (userId: string, callback: (investment: Investment) => void) => {
    return supabase
      .channel(`investments-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'investments',
          filter: `investor_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Investment);
        }
      )
      .subscribe();
  }
};

export default supabase;
