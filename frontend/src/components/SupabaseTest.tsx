import { useState } from 'react';
import { supabase } from '../lib/supabase-simple';
import toast from 'react-hot-toast';

const SupabaseTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      // Teste 1: Verificar conexão básica
      console.log('🔍 Testando conexão com Supabase...');
      
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      console.log('✅ Conexão com Supabase funcionando!');
      console.log('📊 Dados de teste:', data);
      
      setResult({
        success: true,
        message: 'Conexão com Supabase estabelecida com sucesso!',
        data: data
      });
      
      toast.success('✅ Supabase conectado!');
      
    } catch (error: any) {
      console.error('❌ Erro na conexão com Supabase:', error);
      
      setResult({
        success: false,
        message: error.message || 'Erro desconhecido',
        error: error
      });
      
      // Diferentes tipos de erro
      if (error.message?.includes('JWT')) {
        toast.error('❌ Erro de autenticação - verifique a ANON_KEY');
      } else if (error.message?.includes('network')) {
        toast.error('❌ Erro de rede - verifique a URL do Supabase');
      } else {
        toast.error('❌ Erro na conexão com Supabase');
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: '#18181b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      padding: '1rem',
      minWidth: '300px',
      maxWidth: '400px'
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        color: '#f0b429',
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        🧪 Teste Supabase
      </h3>
      
      <button
        onClick={testConnection}
        disabled={testing}
        style={{
          width: '100%',
          padding: '0.5rem',
          background: testing ? '#27272a' : '#f0b429',
          color: testing ? '#71717a' : '#0a0a0b',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: testing ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {testing ? '⏳ Testando...' : '🔄 Testar Conexão'}
      </button>
      
      {result && (
        <div style={{
          padding: '0.75rem',
          background: result.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${result.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '6px',
          fontSize: '0.75rem'
        }}>
          <div style={{
            color: result.success ? '#10b981' : '#ef4444',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            {result.success ? '✅ Sucesso' : '❌ Erro'}
          </div>
          
          <div style={{ color: '#a1a1aa', marginBottom: '0.5rem' }}>
            {result.message}
          </div>
          
          {result.data && (
            <details style={{ marginTop: '0.5rem' }}>
              <summary style={{ 
                color: '#71717a', 
                cursor: 'pointer',
                fontSize: '0.6875rem'
              }}>
                Ver dados retornados
              </summary>
              <pre style={{
                margin: '0.5rem 0 0 0',
                padding: '0.5rem',
                background: '#0a0a0b',
                borderRadius: '4px',
                fontSize: '0.625rem',
                color: '#a1a1aa',
                overflow: 'auto',
                maxHeight: '100px'
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          )}
          
          {result.error && (
            <details style={{ marginTop: '0.5rem' }}>
              <summary style={{ 
                color: '#ef4444', 
                cursor: 'pointer',
                fontSize: '0.6875rem'
              }}>
                Ver erro completo
              </summary>
              <pre style={{
                margin: '0.5rem 0 0 0',
                padding: '0.5rem',
                background: '#0a0a0b',
                borderRadius: '4px',
                fontSize: '0.625rem',
                color: '#ef4444',
                overflow: 'auto',
                maxHeight: '100px'
              }}>
                {JSON.stringify(result.error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
      
      <div style={{
        marginTop: '1rem',
        padding: '0.5rem',
        background: '#0a0a0b',
        borderRadius: '6px',
        fontSize: '0.625rem',
        color: '#52525b'
      }}>
        💡 <strong>Dica:</strong> Abra o console (F12) para ver logs detalhados
      </div>
    </div>
  );
};

export default SupabaseTest;
