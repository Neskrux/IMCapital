import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase-simple';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from '../components/ImageUpload';

const CreateDebentureMinimal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Empresa
    companyName: '',
    cnpj: '',
    sector: '',
    description: '',
    foundedYear: '',
    website: '',
    
    // Debênture
    name: '',
    code: '',
    type: 'simples',
    totalAmount: '',
    minInvestment: '',
    unitPrice: '1000',
    annualReturn: '',
    returnDescription: '',
    issueDate: new Date().toISOString().split('T')[0],
    maturityDate: '',
    rating: 'AAA',
    riskLevel: 'baixo',
    image_url: '',
    logo_url: ''
  });

  // Buscar empresas existentes
  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  useState(() => {
    fetchCompanies();
  }, []);

  const handleCompanySelect = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(companyId);
      setFormData(prev => ({
        ...prev,
        companyName: company.name,
        cnpj: company.cnpj || '',
        sector: company.sector || '',
        description: company.description || '',
        foundedYear: company.founded_year?.toString() || '',
        website: company.website || '',
        logo_url: company.logo_url || ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Você precisa estar autenticado');
      return;
    }

    setIsSubmitting(true);

    try {
      let companyId = selectedCompany;

      // Se não selecionou empresa existente, criar nova
      if (!companyId) {
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: formData.companyName,
            cnpj: formData.cnpj,
            sector: formData.sector,
            description: formData.description,
            founded_year: formData.foundedYear ? parseInt(formData.foundedYear) : null,
            website: formData.website,
            logo_url: formData.logo_url,
            is_active: true
          })
          .select()
          .single();

        if (companyError) {
          console.error('Erro ao criar empresa:', companyError);
          toast.error('Erro ao criar empresa');
          return;
        }

        companyId = newCompany.id;
      }

      // Criar debênture
      const debentureData: any = {
        company_id: companyId,
        name: formData.name,
        code: formData.code,
        type: formData.type,
        status: 'ativa',
        total_amount: parseFloat(formData.totalAmount),
        available_amount: parseFloat(formData.totalAmount),
        min_investment: parseFloat(formData.minInvestment),
        unit_price: parseFloat(formData.unitPrice),
        annual_return_percentage: parseFloat(formData.annualReturn),
        return_description: formData.returnDescription,
        issue_date: formData.issueDate,
        maturity_date: formData.maturityDate,
        rating: formData.rating,
        risk_level: formData.riskLevel,
        features: ['Pagamento semestral', 'Garantia real'],
        guarantees: ['Garantia da empresa', 'Fiança bancária']
      };

      // Adicionar URLs de imagem se existirem
      if (formData.image_url) {
        debentureData.image_url = formData.image_url;
      }
      if (formData.logo_url) {
        debentureData.logo_url = formData.logo_url;
      }

      // Adicionar created_by apenas se o usuário existir
      if (user?.id) {
        debentureData.created_by = user.id;
      }

      const { error: debentureError } = await supabase
        .from('debentures')
        .insert(debentureData);

      if (debentureError) {
        console.error('Erro ao criar debênture:', debentureError);
        
        // Mensagens de erro específicas
        if (debentureError.message?.includes('row-level security')) {
          toast.error('Erro de permissão. Execute o script SQL de correção de RLS.');
        } else if (debentureError.message?.includes('foreign key constraint')) {
          toast.error('Erro de chave estrangeira. Execute o script SQL de correção.');
        } else {
          toast.error(`Erro ao criar debênture: ${debentureError.message}`);
        }
        return;
      }

      toast.success('Debênture criada com sucesso!');
      navigate('/debentures');
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error('Erro ao criar debênture');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.companyName || !formData.sector) {
        toast.error('Preencha os campos obrigatórios');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Estilos ultra minimalistas e profissionais
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000',
      padding: '3rem 2rem',
      position: 'relative' as const,
    },
    wrapper: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '3rem',
      borderBottom: '1px solid rgba(240, 180, 41, 0.1)',
      paddingBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '300',
      color: '#f0b429',
      marginBottom: '0.5rem',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      color: '#71717a',
      fontSize: '0.875rem',
      fontWeight: '400',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    stepsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '3rem',
      padding: '0 2rem',
    },
    step: (isActive: boolean, isCompleted: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      opacity: isActive || isCompleted ? 1 : 0.3,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
    stepNumber: (isActive: boolean, isCompleted: boolean) => ({
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: isActive ? '2px solid #f0b429' : isCompleted ? 'none' : '1px solid #27272a',
      backgroundColor: isCompleted ? '#f0b429' : 'transparent',
      color: isCompleted ? '#000' : isActive ? '#f0b429' : '#71717a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: '600',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
    stepLabel: {
      color: '#f7f7f8',
      fontSize: '0.875rem',
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
    stepLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#27272a',
      margin: '0 2rem',
    },
    form: {
      backgroundColor: 'rgba(9, 9, 11, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(39, 39, 42, 0.5)',
      borderRadius: '16px',
      padding: '3rem',
      minHeight: '500px',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '300',
      color: '#f0b429',
      marginBottom: '2rem',
      letterSpacing: '-0.01em',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '2rem',
      marginBottom: '2rem',
    },
    gridFull: {
      gridColumn: 'span 2',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
    },
    label: {
      color: '#a1a1aa',
      fontSize: '0.75rem',
      fontWeight: '500',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    input: {
      backgroundColor: 'rgba(24, 24, 27, 0.5)',
      border: '1px solid rgba(39, 39, 42, 0.5)',
      borderRadius: '8px',
      padding: '0.875rem 1rem',
      color: '#f7f7f8',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: '300',
    },
    select: {
      backgroundColor: 'rgba(24, 24, 27, 0.5)',
      border: '1px solid rgba(39, 39, 42, 0.5)',
      borderRadius: '8px',
      padding: '0.875rem 1rem',
      color: '#f7f7f8',
      fontSize: '0.875rem',
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: '300',
    },
    textarea: {
      backgroundColor: 'rgba(24, 24, 27, 0.5)',
      border: '1px solid rgba(39, 39, 42, 0.5)',
      borderRadius: '8px',
      padding: '0.875rem 1rem',
      color: '#f7f7f8',
      fontSize: '0.875rem',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical' as const,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: '300',
    },
    companyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    companyCard: (isSelected: boolean) => ({
      padding: '1.5rem',
      borderRadius: '12px',
      border: `1px solid ${isSelected ? '#f0b429' : 'rgba(39, 39, 42, 0.5)'}`,
      backgroundColor: isSelected ? 'rgba(240, 180, 41, 0.05)' : 'rgba(24, 24, 27, 0.3)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
    }),
    companyName: {
      color: '#f0b429',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.25rem',
    },
    companySector: {
      color: '#71717a',
      fontSize: '0.75rem',
      fontWeight: '300',
    },
    divider: {
      borderTop: '1px solid rgba(39, 39, 42, 0.3)',
      margin: '2rem 0',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(39, 39, 42, 0.3)',
    },
    button: {
      padding: '0.875rem 2.5rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none',
      outline: 'none',
      letterSpacing: '0.02em',
    },
    primaryButton: {
      backgroundColor: '#f0b429',
      color: '#000',
      '&:hover': {
        backgroundColor: '#de911d',
      }
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#f0b429',
      border: '1px solid rgba(240, 180, 41, 0.3)',
      '&:hover': {
        borderColor: '#f0b429',
        backgroundColor: 'rgba(240, 180, 41, 0.05)',
      }
    },
    reviewSection: {
      display: 'grid',
      gap: '2rem',
    },
    reviewCard: {
      backgroundColor: 'rgba(24, 24, 27, 0.3)',
      border: '1px solid rgba(39, 39, 42, 0.3)',
      borderRadius: '12px',
      padding: '2rem',
    },
    reviewTitle: {
      color: '#f0b429',
      fontSize: '1rem',
      fontWeight: '400',
      marginBottom: '1.5rem',
      letterSpacing: '0.02em',
    },
    reviewItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      borderBottom: '1px solid rgba(39, 39, 42, 0.2)',
    },
    reviewLabel: {
      color: '#71717a',
      fontSize: '0.875rem',
      fontWeight: '300',
    },
    reviewValue: {
      color: '#f7f7f8',
      fontSize: '0.875rem',
      fontWeight: '400',
      textAlign: 'right' as const,
    },
  };

  // Botão de voltar
  const backButtonStyle = {
    position: 'absolute' as const,
    top: '2rem',
    left: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(240, 180, 41, 0.2)',
    borderRadius: '8px',
    color: '#f0b429',
    fontSize: '0.875rem',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    letterSpacing: '0.02em',
  };

  return (
    <div style={styles.container}>
      {/* Botão de Voltar */}
      <button
        onClick={() => navigate('/debentures')}
        style={backButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(240, 180, 41, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(240, 180, 41, 0.5)';
          e.currentTarget.style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(240, 180, 41, 0.2)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Voltar
      </button>

      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Nova Debênture</h1>
          <p style={styles.subtitle}>Estruture uma nova oportunidade de investimento</p>
        </div>

        {/* Steps Progress */}
        <div style={styles.stepsContainer}>
          <div style={styles.step(currentStep === 1, false)}>
            <div style={styles.stepNumber(currentStep === 1, false)}>1</div>
            <span style={styles.stepLabel}>Empresa</span>
          </div>
          <div style={styles.stepLine} />
          <div style={styles.step(currentStep === 2, currentStep > 2)}>
            <div style={styles.stepNumber(currentStep === 2, currentStep > 2)}>2</div>
            <span style={styles.stepLabel}>Estrutura</span>
          </div>
          <div style={styles.stepLine} />
          <div style={styles.step(currentStep === 3, false)}>
            <div style={styles.stepNumber(currentStep === 3, false)}>3</div>
            <span style={styles.stepLabel}>Confirmação</span>
          </div>
        </div>

        <div style={styles.form}>
          {currentStep === 1 && (
            <>
              <h2 style={styles.sectionTitle}>Informações da Empresa Emissora</h2>

              {/* Empresas existentes */}
              {!loadingCompanies && companies.length > 0 && (
                <>
                  <p style={{ ...styles.label, marginBottom: '1rem' }}>
                    Selecione uma empresa existente
                  </p>
                  <div style={styles.companyGrid}>
                    {companies.map(company => (
                      <div
                        key={company.id}
                        style={styles.companyCard(selectedCompany === company.id)}
                        onClick={() => handleCompanySelect(company.id)}
                      >
                        <div style={styles.companyName}>{company.name}</div>
                        <div style={styles.companySector}>{company.sector}</div>
                      </div>
                    ))}
                  </div>
                  <div style={styles.divider} />
                  <p style={{ ...styles.label, marginBottom: '2rem' }}>
                    Ou cadastre uma nova empresa
                  </p>
                </>
              )}

              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nome da Empresa *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    style={styles.input}
                    placeholder="Nome completo da empresa"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>CNPJ</label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                    style={styles.input}
                    placeholder="00.000.000/0000-00"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Setor de Atuação *</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    style={styles.select}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  >
                    <option value="">Selecione o setor</option>
                    <option value="Energia">Energia</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Varejo">Varejo</option>
                    <option value="Indústria">Indústria</option>
                    <option value="Agronegócio">Agronegócio</option>
                    <option value="Imobiliário">Imobiliário</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ano de Fundação</label>
                  <input
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({...formData, foundedYear: e.target.value})}
                    style={styles.input}
                    placeholder="1990"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={{ ...styles.inputGroup, ...styles.gridFull }}>
                  <label style={styles.label}>Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    style={styles.input}
                    placeholder="https://www.empresa.com.br"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={{ ...styles.inputGroup, ...styles.gridFull }}>
                  <label style={styles.label}>Descrição da Empresa</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={styles.textarea}
                    placeholder="Breve descrição das atividades e histórico da empresa..."
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={{ ...styles.inputGroup, ...styles.gridFull }}>
                  <label style={styles.label}>Logo da Empresa</label>
                  <ImageUpload
                    onImageUploaded={(url) => setFormData({...formData, logo_url: url})}
                    currentImage={formData.logo_url}
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 style={styles.sectionTitle}>Estrutura da Debênture</h2>

              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nome da Debênture *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={styles.input}
                    placeholder="Ex: Debênture Série A 2029"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Código de Negociação *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    style={styles.input}
                    placeholder="Ex: EMPR29"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Tipo de Debênture</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={styles.select}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  >
                    <option value="simples">Simples</option>
                    <option value="conversivel">Conversível</option>
                    <option value="permutavel">Permutável</option>
                    <option value="incentivada">Incentivada</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Valor Total da Emissão *</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                    style={styles.input}
                    placeholder="50000000"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Investimento Mínimo *</label>
                  <input
                    type="number"
                    value={formData.minInvestment}
                    onChange={(e) => setFormData({...formData, minInvestment: e.target.value})}
                    style={styles.input}
                    placeholder="1000"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Valor Unitário</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                    style={styles.input}
                    placeholder="1000"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Taxa de Retorno Anual (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.annualReturn}
                    onChange={(e) => setFormData({...formData, annualReturn: e.target.value})}
                    style={styles.input}
                    placeholder="13.75"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Indexador *</label>
                  <input
                    type="text"
                    value={formData.returnDescription}
                    onChange={(e) => setFormData({...formData, returnDescription: e.target.value})}
                    style={styles.input}
                    placeholder="CDI + 1.5%"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Data de Emissão</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Data de Vencimento *</label>
                  <input
                    type="date"
                    value={formData.maturityDate}
                    onChange={(e) => setFormData({...formData, maturityDate: e.target.value})}
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    style={styles.select}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  >
                    <option value="AAA">AAA</option>
                    <option value="AA">AA</option>
                    <option value="A">A</option>
                    <option value="BBB">BBB</option>
                    <option value="BB">BB</option>
                    <option value="B">B</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nível de Risco</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({...formData, riskLevel: e.target.value})}
                    style={styles.select}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(240, 180, 41, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(39, 39, 42, 0.5)'}
                  >
                    <option value="baixo">Baixo</option>
                    <option value="moderado">Moderado</option>
                    <option value="alto">Alto</option>
                  </select>
                </div>

                <div style={{ ...styles.inputGroup, ...styles.gridFull }}>
                  <label style={styles.label}>Imagem de Destaque</label>
                  <ImageUpload
                    onImageUploaded={(url) => setFormData({...formData, image_url: url})}
                    currentImage={formData.image_url}
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 style={styles.sectionTitle}>Confirmação dos Dados</h2>

              <div style={styles.reviewSection}>
                <div style={styles.reviewCard}>
                  <h3 style={styles.reviewTitle}>Dados da Empresa</h3>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Empresa</span>
                    <span style={styles.reviewValue}>{formData.companyName}</span>
                  </div>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Setor</span>
                    <span style={styles.reviewValue}>{formData.sector}</span>
                  </div>
                  {formData.cnpj && (
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>CNPJ</span>
                      <span style={styles.reviewValue}>{formData.cnpj}</span>
                    </div>
                  )}
                  {formData.website && (
                    <div style={{ ...styles.reviewItem, borderBottom: 'none' }}>
                      <span style={styles.reviewLabel}>Website</span>
                      <span style={styles.reviewValue}>{formData.website}</span>
                    </div>
                  )}
                </div>

                <div style={styles.reviewCard}>
                  <h3 style={styles.reviewTitle}>Estrutura da Debênture</h3>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Nome</span>
                    <span style={styles.reviewValue}>{formData.name}</span>
                  </div>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Código</span>
                    <span style={styles.reviewValue}>{formData.code}</span>
                  </div>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Valor Total</span>
                    <span style={styles.reviewValue}>
                      R$ {parseFloat(formData.totalAmount || '0').toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Investimento Mínimo</span>
                    <span style={styles.reviewValue}>
                      R$ {parseFloat(formData.minInvestment || '0').toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Retorno</span>
                    <span style={styles.reviewValue}>
                      {formData.annualReturn}% a.a. ({formData.returnDescription})
                    </span>
                  </div>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Vencimento</span>
                    <span style={styles.reviewValue}>
                      {formData.maturityDate ? new Date(formData.maturityDate).toLocaleDateString('pt-BR') : 'N/A'}
                    </span>
                  </div>
                  <div style={styles.reviewItem}>
                    <span style={styles.reviewLabel}>Rating</span>
                    <span style={styles.reviewValue}>{formData.rating}</span>
                  </div>
                  <div style={{ ...styles.reviewItem, borderBottom: 'none' }}>
                    <span style={styles.reviewLabel}>Risco</span>
                    <span style={styles.reviewValue}>{formData.riskLevel}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div style={styles.buttonGroup}>
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                style={{ ...styles.button, ...styles.secondaryButton }}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f0b429';
                  e.currentTarget.style.backgroundColor = 'rgba(240, 180, 41, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(240, 180, 41, 0.3)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Voltar
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                style={{ ...styles.button, ...styles.primaryButton, marginLeft: 'auto' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#de911d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0b429'}
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{ ...styles.button, ...styles.primaryButton, marginLeft: 'auto' }}
                disabled={isSubmitting}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#de911d')}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#f0b429')}
              >
                {isSubmitting ? 'Criando...' : 'Confirmar e Criar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDebentureMinimal;