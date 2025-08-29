import { createClient } from '@supabase/supabase-js';

// Configurações básicas do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Cliente Supabase básico
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interface básica para Profile
export interface ProfileData {
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

// Funções básicas de autenticação
export const authHelpers = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
};

// Funções básicas para perfis
export const profileHelpers = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as ProfileData;
  },

  updateProfile: async (userId: string, updates: Partial<ProfileData>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as ProfileData;
  }
};

export default supabase;
