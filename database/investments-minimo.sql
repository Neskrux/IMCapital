-- VERSÃO MÍNIMA: Apenas criar tabela investments

CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  debenture_id UUID NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'ativa',
  invested_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Desabilitar RLS
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;

-- Testar se funciona
SELECT 'Tabela investments criada com sucesso!' as resultado;
