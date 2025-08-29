import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateDebenture = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    rating: '',
    type: '',
    annualReturn: '',
    maturity: '',
    minInvestment: '',
    total: '',
    risk: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/debentures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Debênture criada com sucesso!');
        setFormData({
          name: '',
          issuer: '',
          rating: '',
          type: '',
          annualReturn: '',
          maturity: '',
          minInvestment: '',
          total: '',
          risk: ''
        });
        
        setTimeout(() => {
          window.location.href = '/debentures';
        }, 2000);
      } else {
        toast.error(result.message || 'Erro ao criar debênture');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao comunicar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    background: '#18181b',
    border: '1px solid #3f3f46',
    borderRadius: '0.375rem',
    color: 'white',
    fontSize: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#f0b429',
    fontWeight: '500'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  return (
    <div style={{ padding: '2rem', background: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link
            to="/debentures"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#f0b429',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ← Voltar para Debêntures
          </Link>
        </div>
        <h1 style={{ color: '#f0b429', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Criar Nova Debênture
        </h1>
        <p style={{ color: '#a0a0a0', fontSize: '1rem' }}>
          Configure uma nova oportunidade de investimento
        </p>
      </div>

      <div style={{ background: '#27272a', borderRadius: '8px', padding: '2rem', border: '1px solid #3f3f46' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Nome */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Nome da Debênture <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Ex: Debênture Premium XYZ"
                required
              />
            </div>

            {/* Emissor */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Emissor <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                name="issuer"
                type="text"
                value={formData.issuer}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Ex: XYZ Holdings"
                required
              />
            </div>

            {/* Rating */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Rating <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                style={inputStyle}
                required
              >
                <option value="">Selecione o rating</option>
                <option value="AAA">AAA</option>
                <option value="AA+">AA+</option>
                <option value="AA">AA</option>
                <option value="AA-">AA-</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="BBB+">BBB+</option>
                <option value="BBB">BBB</option>
                <option value="BBB-">BBB-</option>
              </select>
            </div>

            {/* Tipo */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Tipo de Debênture <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                style={inputStyle}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="Incentivada">Incentivada</option>
                <option value="Simples">Simples</option>
                <option value="Conversível">Conversível</option>
              </select>
            </div>

            {/* Retorno Anual */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Retorno Anual <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                name="annualReturn"
                type="text"
                value={formData.annualReturn}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Ex: CDI + 2.5%"
                required
              />
            </div>

            {/* Vencimento */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Vencimento <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                name="maturity"
                type="text"
                value={formData.maturity}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Ex: 2029"
                required
              />
            </div>

            {/* Investimento Mínimo */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Investimento Mínimo (R$) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                name="minInvestment"
                type="number"
                value={formData.minInvestment}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Ex: 5000"
                step="1000"
                min="1000"
                required
              />
            </div>

            {/* Valor Total */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Valor Total da Emissão (R$) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                name="total"
                type="number"
                value={formData.total}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Ex: 5000000"
                step="100000"
                min="100000"
                required
              />
            </div>

            {/* Nível de Risco */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Nível de Risco <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="risk"
                value={formData.risk}
                onChange={handleInputChange}
                style={inputStyle}
                required
              >
                <option value="">Selecione o risco</option>
                <option value="low">Baixo Risco</option>
                <option value="medium">Médio Risco</option>
                <option value="high">Alto Risco</option>
              </select>
            </div>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                issuer: '',
                rating: '',
                type: '',
                annualReturn: '',
                maturity: '',
                minInvestment: '',
                total: '',
                risk: ''
              })}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '1px solid #f0b429',
                color: '#f0b429',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Limpar Formulário
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f0b429',
                border: 'none',
                color: '#1a1a1a',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                minWidth: '150px'
              }}
            >
{isLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                  </svg>
                  Criando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                  Criar Debênture
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDebenture;