import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-simple';

interface Debenture {
  id: string;
  name: string;
  code: string;
  company_id: string;
  company_name: string;
  company_logo?: string;
  company_sector?: string;
  company_description?: string;
  company_founded?: number;
  company_employees?: string;
  company_revenue?: string;
  company_market?: string;
  company_highlights?: string[];
  company_website?: string;
  type: string;
  status: string;
  total_amount: number;
  available_amount: number;
  min_investment: number;
  unit_price: number;
  annual_return_percentage: number;
  return_description: string;
  issue_date: string;
  maturity_date: string;
  payment_frequency?: string;
  rating?: string;
  risk_level?: string;
  features?: string[];
  guarantees?: string[];
  prospectus_url?: string;
  contract_url?: string;
  created_at: string;
  updated_at: string;
}

export const useDebentures = () => {
  const [debentures, setDebentures] = useState<Debenture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebentures = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('debentures')
        .select(`
          *,
          companies (
            id,
            name,
            logo_url,
            sector,
            description,
            founded_year,
            employees_count,
            annual_revenue,
            market,
            highlights,
            website
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar debêntures:', error);
        setError(error.message);
        return;
      }

      // Formatar os dados para incluir informações da empresa
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        company_name: item.companies?.name || 'N/A',
        company_logo: item.companies?.logo_url,
        company_sector: item.companies?.sector,
        company_description: item.companies?.description,
        company_founded: item.companies?.founded_year,
        company_employees: item.companies?.employees_count?.toString(),
        company_revenue: item.companies?.annual_revenue?.toString(),
        company_market: item.companies?.market,
        company_highlights: item.companies?.highlights || [],
        company_website: item.companies?.website
      }));

      setDebentures(formattedData);
    } catch (err: any) {
      console.error('Erro ao buscar debêntures:', err);
      setError(err.message || 'Erro ao carregar debêntures');
    } finally {
      setLoading(false);
    }
  };

  const refreshDebentures = () => {
    fetchDebentures();
  };

  useEffect(() => {
    fetchDebentures();
  }, []);

  return {
    debentures,
    loading,
    error,
    refreshDebentures
  };
};

