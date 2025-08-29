import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-simple';
import { useAuth } from '../contexts/AuthContext';

export interface PortfolioItem {
  id: string;
  name: string;
  value: number; // percentual
  amount: number; // valor em R$
  color: string;
  debenture_id?: string;
  company_name?: string;
  sector?: string;
  return_percentage?: number;
  maturity_date?: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalBalance: number;
  portfolioItems: PortfolioItem[];
  loading: boolean;
  error: string | null;
}

const PORTFOLIO_COLORS = [
  '#f0b429', // Dourado principal
  '#de911d', // Dourado escuro
  '#cb6e17', // Dourado mais escuro
  '#f59e0b', // Âmbar
  '#d97706', // Âmbar escuro
  '#92400e', // Âmbar muito escuro
  '#451a03', // Marrom escuro
  '#27272a'  // Cinza (para saldo em conta)
];

export const usePortfolio = (): PortfolioSummary => {
  const { user } = useAuth();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      if (!user?.id) {
        // Se não há usuário, mostrar dados mock
        const mockPortfolio: PortfolioItem[] = [
          {
            id: 'mock-1',
            name: 'Saldo Disponível',
            value: 100,
            amount: user?.balance || 100000,
            color: '#27272a'
          }
        ];
        
        setPortfolioItems(mockPortfolio);
        setTotalInvested(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Tentar buscar investimentos (pode falhar se tabela não existir)
      let investments: any[] = [];
      
      try {
        const { data: investmentsData, error: investmentsError } = await supabase
          .from('investments')
          .select(`
            *,
            debentures (
              id,
              name,
              annual_return_percentage,
              maturity_date,
              companies (
                name,
                sector
              )
            )
          `)
          .eq('investor_id', user.id); // Usar investor_id ao invés de user_id
          // Remover filtro por status até descobrir valores corretos

        if (investmentsError) {
          console.log('Tabela investments não existe ainda:', investmentsError.message);
          throw investmentsError;
        }

        investments = investmentsData || [];
      } catch (investmentError) {
        console.log('Usando dados mock - tabela investments não existe');
        // Fallback para dados mock até criar a tabela
        const mockPortfolio: PortfolioItem[] = [
          {
            id: 'balance-only',
            name: 'Saldo Disponível',
            value: 100,
            amount: user.balance || 100000,
            color: '#27272a'
          }
        ];
        
        setPortfolioItems(mockPortfolio);
        setTotalInvested(0);
        setLoading(false);
        return;
      }

      // Calcular portfólio baseado nos investimentos
      let totalInvestmentValue = 0;
      const investmentItems: PortfolioItem[] = [];

      if (investments && investments.length > 0) {
        // Agrupar investimentos por debênture
        const groupedInvestments = investments.reduce((acc: any, investment: any) => {
          const debentureId = investment.debenture_id;
          if (!acc[debentureId]) {
            acc[debentureId] = {
              totalAmount: 0,
              debenture: investment.debentures,
              investments: []
            };
          }
          acc[debentureId].totalAmount += investment.amount;
          acc[debentureId].investments.push(investment);
          return acc;
        }, {});

        // Converter grupos em items do portfólio
        Object.values(groupedInvestments).forEach((group: any, index: number) => {
          const debenture = group.debenture;
          const amount = group.totalAmount;
          totalInvestmentValue += amount;

          investmentItems.push({
            id: debenture.id,
            name: debenture.name,
            value: 0, // Será calculado depois
            amount: amount,
            color: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length],
            debenture_id: debenture.id,
            company_name: debenture.companies?.name || 'N/A',
            sector: debenture.companies?.sector || 'N/A',
            return_percentage: debenture.annual_return_percentage,
            maturity_date: debenture.maturity_date
          });
        });
      }

      // Adicionar saldo disponível
      const availableBalance = user.balance || 0;
      const totalPortfolioValue = totalInvestmentValue + availableBalance;

      // Calcular percentuais
      const portfolioWithPercentages = investmentItems.map(item => ({
        ...item,
        value: totalPortfolioValue > 0 ? (item.amount / totalPortfolioValue) * 100 : 0
      }));

      // Adicionar saldo disponível se > 0
      if (availableBalance > 0) {
        portfolioWithPercentages.push({
          id: 'available-balance',
          name: 'Saldo Disponível',
          value: totalPortfolioValue > 0 ? (availableBalance / totalPortfolioValue) * 100 : 100,
          amount: availableBalance,
          color: '#27272a'
        });
      }

      // Se não há investimentos, mostrar apenas saldo
      if (portfolioWithPercentages.length === 0) {
        portfolioWithPercentages.push({
          id: 'balance-only',
          name: 'Saldo Disponível',
          value: 100,
          amount: availableBalance,
          color: '#27272a'
        });
      }

      setPortfolioItems(portfolioWithPercentages);
      setTotalInvested(totalInvestmentValue);

    } catch (err: any) {
      console.error('Erro ao calcular portfólio:', err);
      setError(err.message || 'Erro ao carregar portfólio');
      
      // Fallback para saldo apenas
      setPortfolioItems([
        {
          id: 'error-fallback',
          name: 'Saldo Disponível',
          value: 100,
          amount: user?.balance || 100000,
          color: '#27272a'
        }
      ]);
      setTotalInvested(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user?.id, user?.balance]);

  const totalBalance = totalInvested + (user?.balance || 0);

  return {
    totalInvested,
    totalBalance,
    portfolioItems,
    loading,
    error
  };
};

export default usePortfolio;

