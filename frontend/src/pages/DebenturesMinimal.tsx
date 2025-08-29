import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDebentures } from '../hooks/useDebentures';
import { supabase } from '../lib/supabase-simple';
import { useAuth } from '../contexts/AuthContext';

const DebenturesMinimal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDebenture, setSelectedDebenture] = useState<any>(null);
  const [showCompanyInfo, setShowCompanyInfo] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [isInvesting, setIsInvesting] = useState(false);
  
  const { debentures: dbDebentures, loading, refreshDebentures } = useDebentures();
  const { user, updateBalance } = useAuth();

  // Mapear dados do banco para o formato esperado pelo frontend
  const debentures = dbDebentures.map(d => ({
    id: d.id,
    name: d.name,
    issuer: d.company_name,
    rating: d.rating || 'AA',
    minInvestment: d.min_investment,
    min_investment: d.min_investment,
    annualReturn: d.annual_return_percentage,
    returnText: d.return_description,
    maturity: d.maturity_date ? new Date(d.maturity_date).getFullYear().toString() : '2029',
    maturityYears: d.maturity_date ? Math.ceil((new Date(d.maturity_date).getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000)) : 5,
    type: d.type === 'incentivada' ? 'Incentivada' : d.type === 'simples' ? 'Simples' : 'Conversível',
    available: d.available_amount,
    available_amount: d.available_amount,
    total: d.total_amount,
    features: d.features || ['Garantia Real', 'Pagamento Semestral'],
    risk: d.risk_level === 'baixo' ? 'low' : d.risk_level === 'moderado' ? 'medium' : 'high',
    sector: d.company_sector || 'Diversos',
    unit_price: d.unit_price,
    companyInfo: {
      logo: d.company_logo || d.logo_url || `https://via.placeholder.com/200x100/f0b429/0a0a0b?text=${encodeURIComponent(d.company_name || 'Logo')}`,
      description: d.company_description || `${d.company_name} é uma empresa líder em seu setor.`,
      founded: d.company_founded?.toString() || 'N/A',
      employees: d.company_employees || 'N/A',
      revenue: d.company_revenue || 'N/A',
      market: d.company_market || d.company_sector || 'N/A',
      highlights: d.company_highlights || ['Empresa sólida', 'Boa governança'],
      website: d.company_website || '#'
    }
  }));

  const mockDebentures = [
    {
      id: '1',
      name: 'Debênture Premium XYZ',
      issuer: 'XYZ Holdings',
      rating: 'AAA',
      minInvestment: 5000,
      annualReturn: 2.5,
      returnText: 'CDI + 2.5%',
      maturity: '2029',
      maturityYears: 5,
      type: 'Incentivada',
      available: 2500000,
      total: 5000000,
      features: ['Isenção de IR', 'Garantia Real', 'Rating AAA'],
      risk: 'low',
      sector: 'Energia',
      companyInfo: {
        logo: 'https://via.placeholder.com/200x100/f0b429/0a0a0b?text=XYZ+Holdings',
        description: 'XYZ Holdings é uma das principais empresas de energia renovável do Brasil, com mais de 20 anos de atuação no mercado.',
        founded: '2003',
        employees: '5.000+',
        revenue: 'R$ 2.5 bilhões (2023)',
        market: 'Energia Solar e Eólica',
        highlights: [
          'Líder em energia solar no Nordeste',
          'Certificação ISO 14001',
          '15 usinas em operação',
          'Redução de 2M toneladas de CO2/ano'
        ],
        website: 'www.xyzholdings.com.br'
      }
    },
    {
      id: '2',
      name: 'Debênture Growth ABC',
      issuer: 'ABC Energia',
      rating: 'AA+',
      minInvestment: 10000,
      annualReturn: 3.0,
      returnText: 'CDI + 3.0%',
      maturity: '2028',
      maturityYears: 4,
      type: 'Simples',
      available: 3000000,
      total: 10000000,
      features: ['Alta Liquidez', 'Setor Energia', 'Pagamento Semestral'],
      risk: 'medium',
      sector: 'Energia',
      companyInfo: {
        logo: 'https://via.placeholder.com/200x100/10b981/0a0a0b?text=ABC+Energia',
        description: 'ABC Energia atua na geração e distribuição de energia elétrica, com foco em fontes renováveis e sustentabilidade.',
        founded: '1998',
        employees: '8.500+',
        revenue: 'R$ 4.2 bilhões (2023)',
        market: 'Geração e Distribuição',
        highlights: [
          '3° maior distribuidora do Sul',
          '98% de energia limpa',
          'Presente em 5 estados',
          'Nota máxima em ESG'
        ],
        website: 'www.abcenergia.com.br'
      }
    },
    {
      id: '3',
      name: 'Debênture Infra DEF',
      issuer: 'DEF Infraestrutura',
      rating: 'AA',
      minInvestment: 1000,
      annualReturn: 2.0,
      returnText: 'CDI + 2.0%',
      maturity: '2027',
      maturityYears: 3,
      type: 'Incentivada',
      available: 5000000,
      total: 15000000,
      features: ['Isenção de IR', 'Projeto Aprovado', 'Garantia BNDES'],
      risk: 'low',
      sector: 'Infraestrutura',
      companyInfo: {
        logo: 'https://via.placeholder.com/200x100/6366f1/0a0a0b?text=DEF+Infra',
        description: 'DEF Infraestrutura é especializada em projetos de mobilidade urbana e rodovias, com forte presença no desenvolvimento de PPPs.',
        founded: '2010',
        employees: '3.200+',
        revenue: 'R$ 1.8 bilhões (2023)',
        market: 'Infraestrutura e Mobilidade',
        highlights: [
          '12 concessões rodoviárias',
          '500km de rodovias administradas',
          'Projetos de metrô em 3 capitais',
          'Parceria com BNDES'
        ],
        website: 'www.definfra.com.br'
      }
    },
  ];

  const filteredDebentures = debentures.filter(deb => {
    const matchesSearch = deb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deb.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || deb.type.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleInvest = (debenture: any) => {
    setSelectedDebenture(debenture);
    setInvestmentAmount(debenture.minInvestment || debenture.min_investment || 1000);
  };

  const confirmInvestment = async () => {
    if (!user || !selectedDebenture || !investmentAmount) {
      toast.error('Dados inválidos para investimento');
      return;
    }

    if (investmentAmount < (selectedDebenture.minInvestment || selectedDebenture.min_investment || 1000)) {
      toast.error(`Investimento mínimo: R$ ${(selectedDebenture.minInvestment || selectedDebenture.min_investment || 1000).toLocaleString('pt-BR')}`);
      return;
    }

    if (investmentAmount > (user.balance || 0)) {
      toast.error('Saldo insuficiente');
      return;
    }

    setIsInvesting(true);

    try {
      const quantity = Math.floor(investmentAmount / (selectedDebenture.unit_price || 1000));
      const actualAmount = quantity * (selectedDebenture.unit_price || 1000);

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        toast.error('Usuário não autenticado');
        return;
      }

      const { error: investmentError } = await supabase
        .from('investments')
        .insert({
          investor_id: authUser.id,
          debenture_id: selectedDebenture.id,
          amount: actualAmount,
          quantity: quantity,
          units: quantity,
          unit_price: selectedDebenture.unit_price || 1000,
          current_value: actualAmount
        });

      if (investmentError) {
        console.error('Erro ao criar investimento:', investmentError);
        toast.error('Erro ao processar investimento');
        return;
      }

      const newBalance = (user.balance || 0) - actualAmount;
      await updateBalance(newBalance);

      const newAvailableAmount = (selectedDebenture.available_amount || selectedDebenture.available || 0) - actualAmount;
      
      const { error: debentureError } = await supabase
        .from('debentures')
        .update({ available_amount: newAvailableAmount })
        .eq('id', selectedDebenture.id);

      if (debentureError) {
        console.error('Erro ao atualizar debênture:', debentureError);
      }

      toast.success(`💰 Investimento de R$ ${actualAmount.toLocaleString('pt-BR')} realizado com sucesso!`);
      
      refreshDebentures();
      setSelectedDebenture(null);
      setInvestmentAmount(0);

    } catch (error: any) {
      console.error('Erro no investimento:', error);
      toast.error('Erro ao processar investimento');
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '300',
              color: '#f7f7f8',
              letterSpacing: '-0.025em'
            }}>
              Debêntures
            </h1>
            <p style={{ 
              color: '#71717a',
              fontSize: '0.875rem',
              marginTop: '0.25rem'
            }}>
              Oportunidades selecionadas de renda fixa
            </p>
          </div>
          <Link
            to="/create-debenture"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              textDecoration: 'none',
              background: 'transparent',
              border: '1px solid #27272a',
              color: '#71717a',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f0b429';
              e.currentTarget.style.color = '#f0b429';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#27272a';
              e.currentTarget.style.color = '#71717a';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Nova Debênture
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <p style={{ 
            color: '#71717a',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Total Disponível
          </p>
          <p style={{ 
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#f7f7f8'
          }}>
            R$ <span style={{ fontWeight: '400' }}>25.5M</span>
          </p>
        </div>
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <p style={{ 
            color: '#71717a',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Rentabilidade Média
          </p>
          <p style={{ 
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#10b981'
          }}>
            CDI + <span style={{ fontWeight: '400' }}>2.5%</span>
          </p>
        </div>
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <p style={{ 
            color: '#71717a',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Prazo Médio
          </p>
          <p style={{ 
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#f7f7f8'
          }}>
            <span style={{ fontWeight: '400' }}>4</span> anos
          </p>
        </div>
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <p style={{ 
            color: '#71717a',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            Oportunidades
          </p>
          <p style={{ 
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#f7f7f8'
          }}>
            <span style={{ fontWeight: '400' }}>{debentures.length}</span> ativos
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="#71717a"
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome ou emissor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                background: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#f7f7f8',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'incentivada', 'simples'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: selectedFilter === filter ? 'rgba(240, 180, 41, 0.1)' : 'transparent',
                  border: `1px solid ${selectedFilter === filter ? '#f0b429' : '#27272a'}`,
                  color: selectedFilter === filter ? '#f0b429' : '#71717a',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {filter === 'all' ? 'Todas' : filter === 'incentivada' ? 'Incentivadas' : 'Simples'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Debentures Grid - Minimal Cards */}
      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          color: '#71717a'
        }}>
          <div style={{
            display: 'inline-block',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem',
            fontSize: '2rem'
          }}>
            ⏳
          </div>
          <p>Carregando debêntures...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredDebentures.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          backgroundColor: '#09090b',
          borderRadius: '12px',
          border: '1px solid #27272a'
        }}>
          <h3 style={{ color: '#f0b429', marginBottom: '1rem', fontSize: '1.5rem' }}>
            {searchTerm || selectedFilter !== 'all' 
              ? 'Nenhuma debênture encontrada' 
              : 'Ainda não há debêntures disponíveis'}
          </h3>
          <p style={{ color: '#71717a', marginBottom: '2rem' }}>
            {searchTerm || selectedFilter !== 'all'
              ? 'Tente ajustar seus filtros de busca'
              : 'Seja o primeiro a criar uma oportunidade de investimento'}
          </p>
          {!searchTerm && selectedFilter === 'all' && (
            <Link
              to="/create-debenture"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                backgroundColor: '#f0b429',
                color: '#000',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              + Nova Debênture
            </Link>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredDebentures.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredDebentures.map((debenture) => (
          <div 
            key={debenture.id}
            style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3f3f46';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#27272a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Risk Indicator Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: debenture.risk === 'low' 
                ? 'linear-gradient(90deg, #10b981 0%, transparent 100%)'
                : debenture.risk === 'medium'
                ? 'linear-gradient(90deg, #f0b429 0%, transparent 100%)'
                : 'linear-gradient(90deg, #ef4444 0%, transparent 100%)'
            }}></div>

            <div style={{ padding: '1.5rem' }}>
              {/* Header */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.125rem',
                      fontWeight: '500',
                      color: '#f7f7f8',
                      marginBottom: '0.25rem'
                    }}>
                      {debenture.name}
                    </h3>
                    <p style={{ 
                      color: '#71717a',
                      fontSize: '0.75rem'
                    }}>
                      {debenture.issuer} • {debenture.sector}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCompanyInfo(debenture);
                      }}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(240, 180, 41, 0.1)',
                        border: '1px solid rgba(240, 180, 41, 0.3)',
                        color: '#f0b429',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(240, 180, 41, 0.2)';
                        e.currentTarget.style.borderColor = '#f0b429';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(240, 180, 41, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(240, 180, 41, 0.3)';
                      }}
                      title="Ver informações da empresa"
                    >
                      !
                    </button>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      color: '#6366f1',
                      fontSize: '0.625rem',
                      fontWeight: '600'
                    }}>
                      {debenture.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Metrics - Minimal Grid */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <p style={{ 
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem'
                  }}>
                    Rentabilidade
                  </p>
                  <p style={{ 
                    fontSize: '1.25rem',
                    fontWeight: '400',
                    color: '#10b981'
                  }}>
                    {debenture.returnText}
                  </p>
                </div>
                <div>
                  <p style={{ 
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem'
                  }}>
                    Vencimento
                  </p>
                  <p style={{ 
                    fontSize: '1.25rem',
                    fontWeight: '400',
                    color: '#f7f7f8'
                  }}>
                    {debenture.maturity}
                  </p>
                </div>
              </div>

              {/* Progress Bar - Minimal */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ 
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Captação
                  </span>
                  <span style={{ 
                    color: '#71717a',
                    fontSize: '0.75rem'
                  }}>
                    {((debenture.total - debenture.available) / debenture.total * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ 
                  width: '100%',
                  height: '4px',
                  background: '#0a0a0b',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%',
                    background: 'linear-gradient(90deg, #f0b429 0%, #de911d 100%)',
                    width: `${((debenture.total - debenture.available) / debenture.total) * 100}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ 
                  color: '#52525b',
                  fontSize: '0.625rem',
                  marginTop: '0.5rem'
                }}>
                  R$ {debenture.available.toLocaleString('pt-BR')} disponível de R$ {debenture.total.toLocaleString('pt-BR')}
                </p>
              </div>

              {/* Features - Minimal Tags */}
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.375rem',
                marginBottom: '1.5rem'
              }}>
                {debenture.features.slice(0, 3).map((feature, idx) => (
                  <span 
                    key={idx}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      color: '#71717a',
                      fontSize: '0.625rem',
                      fontWeight: '500'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Footer - Investment Action */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #27272a'
              }}>
                <div>
                  <p style={{ 
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.125rem'
                  }}>
                    Aplicação mínima
                  </p>
                  <p style={{ 
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#f7f7f8'
                  }}>
                    R$ {debenture.minInvestment.toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => handleInvest(debenture)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    background: '#f0b429',
                    color: '#0a0a0b',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#de911d'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f0b429'}
                >
                  Investir
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Company Info Modal */}
      {showCompanyInfo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#18181b',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #27272a',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowCompanyInfo(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#71717a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                zIndex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#f7f7f8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              ✕
            </button>

            {/* Company Logo Section */}
            <div style={{
              background: 'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
              padding: '2rem',
              borderBottom: '1px solid #27272a',
              textAlign: 'center'
            }}>
              <img
                src={showCompanyInfo.companyInfo.logo}
                alt={showCompanyInfo.issuer}
                style={{
                  maxWidth: '200px',
                  height: '100px',
                  objectFit: 'contain',
                  margin: '0 auto',
                  borderRadius: '8px'
                }}
              />
            </div>

            {/* Company Details */}
            <div style={{ padding: '2rem' }}>
              {/* Header */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  color: '#f7f7f8',
                  marginBottom: '0.5rem'
                }}>
                  {showCompanyInfo.issuer}
                </h2>
                <p style={{
                  color: '#71717a',
                  fontSize: '0.875rem',
                  lineHeight: '1.6'
                }}>
                  {showCompanyInfo.companyInfo.description}
                </p>
              </div>

              {/* Key Info Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <p style={{
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Fundação
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#f7f7f8'
                  }}>
                    {showCompanyInfo.companyInfo.founded}
                  </p>
                </div>
                <div style={{
                  background: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <p style={{
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Funcionários
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#f7f7f8'
                  }}>
                    {showCompanyInfo.companyInfo.employees}
                  </p>
                </div>
                <div style={{
                  background: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <p style={{
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    Faturamento
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#10b981'
                  }}>
                    {showCompanyInfo.companyInfo.revenue}
                  </p>
                </div>
              </div>

              {/* Market */}
              <div style={{
                background: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <p style={{
                  color: '#52525b',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Mercado de Atuação
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#f7f7f8'
                }}>
                  {showCompanyInfo.companyInfo.market}
                </p>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#f7f7f8',
                  marginBottom: '1rem'
                }}>
                  Destaques
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {showCompanyInfo.companyInfo.highlights.map((highlight: string, idx: number) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#f0b429',
                        flexShrink: 0
                      }}></div>
                      <p style={{
                        color: '#a1a1aa',
                        fontSize: '0.875rem'
                      }}>
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Website */}
              <div style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid #27272a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <a
                  href={`https://${showCompanyInfo.companyInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#f0b429',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                  {showCompanyInfo.companyInfo.website}
                </a>
                <button
                  onClick={() => {
                    const company = showCompanyInfo;
                    setShowCompanyInfo(null);
                    setTimeout(() => handleInvest(company), 100);
                  }}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    background: '#f0b429',
                    color: '#0a0a0b',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#de911d'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f0b429'}
                >
                  Investir Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Modal - Minimal */}
      {selectedDebenture && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#18181b',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '420px',
            width: '100%',
            border: '1px solid #27272a',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: '400',
                color: '#f7f7f8',
                marginBottom: '0.5rem'
              }}>
                Confirmar Investimento
              </h3>
              <div style={{ 
                width: '40px',
                height: '2px',
                background: '#f0b429'
              }}></div>
            </div>

            {/* Investment Details */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                background: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <p style={{ 
                  color: '#52525b',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Debênture Selecionada
                </p>
                <p style={{ 
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#f7f7f8',
                  marginBottom: '0.25rem'
                }}>
                  {selectedDebenture.name}
                </p>
                <p style={{ 
                  color: '#71717a',
                  fontSize: '0.75rem'
                }}>
                  {selectedDebenture.issuer}
                </p>
              </div>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '0.75rem'
                }}>
                  <p style={{ 
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem'
                  }}>
                    Rentabilidade
                  </p>
                  <p style={{ 
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#10b981'
                  }}>
                    {selectedDebenture.returnText}
                  </p>
                </div>
                <div style={{
                  background: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '0.75rem'
                }}>
                  <p style={{ 
                    color: '#52525b',
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.25rem'
                  }}>
                    Vencimento
                  </p>
                  <p style={{ 
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#f7f7f8'
                  }}>
                    {selectedDebenture.maturity}
                  </p>
                </div>
              </div>

              {/* Investment Input */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#71717a',
                  fontSize: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  Valor do Investimento
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#52525b',
                    fontSize: '0.875rem'
                  }}>
                    R$
                  </span>
                  <input
                    type="number"
                    min={selectedDebenture.minInvestment}
                    defaultValue={selectedDebenture.minInvestment}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      background: '#0a0a0b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#f7f7f8',
                      fontSize: '1rem',
                      fontWeight: '500',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3f3f46'}
                    onBlur={(e) => e.target.style.borderColor = '#27272a'}
                  />
                </div>
                <p style={{ 
                  color: '#52525b',
                  fontSize: '0.625rem',
                  marginTop: '0.375rem'
                }}>
                  Mínimo: R$ {selectedDebenture.minInvestment.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedDebenture(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#71717a',
                  border: '1px solid #27272a',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3f3f46';
                  e.currentTarget.style.color = '#a1a1aa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#27272a';
                  e.currentTarget.style.color = '#71717a';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmInvestment}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: '#f0b429',
                  color: '#0a0a0b',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#de911d'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f0b429'}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebenturesMinimal;

