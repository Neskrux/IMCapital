-- ====================================================
-- SCHEMA COMPLETO DO BANCO DE DADOS - IMCAPITAL
-- ====================================================
-- 
-- INSTRUÇÕES DE EXECUÇÃO:
-- 1. Acesse seu projeto no Supabase
-- 2. Vá para SQL Editor
-- 3. Cole e execute TODO este script
-- 4. Execute também os scripts de storage em separado
-- 
-- ====================================================

-- Limpar tabelas existentes (apenas para desenvolvimento)
-- DESCOMENTE AS LINHAS ABAIXO APENAS SE QUISER RESETAR TUDO
-- DROP SCHEMA IF EXISTS public CASCADE;
-- CREATE SCHEMA public;
-- GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
-- GRANT ALL ON SCHEMA public TO postgres, service_role;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
-- GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- ====================================================
-- 1. EXTENSÕES
-- ====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================
-- 2. TIPOS CUSTOMIZADOS (ENUMS)
-- ====================================================

-- Tipo de perfil de investidor
CREATE TYPE investor_profile_type AS ENUM (
  'conservador',
  'moderado',
  'arrojado'
);

-- Status do investimento
CREATE TYPE investment_status AS ENUM (
  'pendente',
  'confirmado',
  'cancelado',
  'resgatado'
);

-- Tipo de debênture
CREATE TYPE debenture_type AS ENUM (
  'incentivada',
  'simples',
  'conversivel'
);

-- Nível de risco
CREATE TYPE risk_level AS ENUM (
  'baixo',
  'medio',
  'alto'
);

-- Rating
CREATE TYPE rating_type AS ENUM (
  'AAA',
  'AA+',
  'AA',
  'AA-',
  'A+',
  'A',
  'A-',
  'BBB+',
  'BBB',
  'BBB-'
);

-- Status da debênture
CREATE TYPE debenture_status AS ENUM (
  'ativa',
  'encerrada',
  'suspensa'
);

-- Tipo de transação
CREATE TYPE transaction_type AS ENUM (
  'deposito',
  'saque',
  'investimento',
  'resgate',
  'rendimento',
  'taxa'
);

-- ====================================================
-- 3. TABELAS
-- ====================================================

-- Tabela de perfis de usuários (estende auth.users do Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  cpf TEXT UNIQUE,
  phone TEXT,
  birth_date DATE,
  
  -- Endereço
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  
  -- Informações financeiras
  balance DECIMAL(15,2) DEFAULT 0.00,
  total_invested DECIMAL(15,2) DEFAULT 0.00,
  total_earnings DECIMAL(15,2) DEFAULT 0.00,
  
  -- Perfil de investidor
  investor_profile investor_profile_type DEFAULT 'conservador',
  investor_profile_updated_at TIMESTAMPTZ,
  
  -- Metadados
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de empresas emissoras
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  logo_url TEXT,
  description TEXT,
  founded_year INTEGER,
  employees_count TEXT,
  annual_revenue TEXT,
  market TEXT,
  sector TEXT,
  website TEXT,
  
  -- Informações adicionais
  highlights JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Metadados
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de debêntures
CREATE TABLE debentures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Informações básicas
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- Ex: XYZ001
  type debenture_type NOT NULL,
  status debenture_status DEFAULT 'ativa',
  
  -- Informações financeiras
  total_amount DECIMAL(15,2) NOT NULL,
  available_amount DECIMAL(15,2) NOT NULL,
  min_investment DECIMAL(15,2) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  
  -- Rentabilidade
  annual_return_percentage DECIMAL(5,2), -- Ex: 2.5 para CDI + 2.5%
  return_description TEXT, -- Ex: "CDI + 2.5%"
  
  -- Datas
  issue_date DATE NOT NULL,
  maturity_date DATE NOT NULL,
  payment_frequency TEXT, -- Ex: "Semestral", "Anual"
  
  -- Classificação
  rating rating_type,
  risk_level risk_level NOT NULL,
  
  -- Features e garantias
  features JSONB DEFAULT '[]'::jsonb,
  guarantees JSONB DEFAULT '[]'::jsonb,
  
  -- Documentos
  prospectus_url TEXT,
  contract_url TEXT,
  
  -- Metadados
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de investimentos
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  debenture_id UUID REFERENCES debentures(id) ON DELETE CASCADE,
  
  -- Informações do investimento
  amount DECIMAL(15,2) NOT NULL,
  units INTEGER NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  status investment_status DEFAULT 'pendente',
  
  -- Rentabilidade
  total_earnings DECIMAL(15,2) DEFAULT 0.00,
  current_value DECIMAL(15,2),
  
  -- Datas
  invested_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  
  -- Metadados
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
  
  -- Informações da transação
  type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2),
  balance_after DECIMAL(15,2),
  
  -- Descrição e referências
  description TEXT,
  reference_code TEXT,
  
  -- Status
  status TEXT DEFAULT 'completed',
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de rendimentos
CREATE TABLE earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
  
  -- Informações do rendimento
  amount DECIMAL(15,2) NOT NULL,
  rate DECIMAL(5,4), -- Taxa aplicada
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Status
  paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Conteúdo
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Ação (opcional)
  action_url TEXT,
  action_label TEXT,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informações do documento
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- RG, CPF, Comprovante de Residência, etc
  file_url TEXT NOT NULL,
  file_size INTEGER,
  
  -- Status
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  
  -- Metadados
  expires_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de questionário do perfil de investidor
CREATE TABLE investor_questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Respostas do questionário
  answers JSONB NOT NULL,
  score INTEGER,
  result_profile investor_profile_type,
  
  -- Metadados
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================
-- 4. ÍNDICES PARA PERFORMANCE
-- ====================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_cpf ON profiles(cpf);
CREATE INDEX idx_debentures_company ON debentures(company_id);
CREATE INDEX idx_debentures_status ON debentures(status);
CREATE INDEX idx_investments_investor ON investments(investor_id);
CREATE INDEX idx_investments_debenture ON investments(debenture_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ====================================================
-- 5. FUNÇÕES E TRIGGERS
-- ====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at nas tabelas
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_debentures_updated_at BEFORE UPDATE ON debentures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Função para atualizar saldo após transação
CREATE OR REPLACE FUNCTION update_balance_after_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type IN ('deposito', 'rendimento', 'resgate') THEN
    UPDATE profiles 
    SET balance = balance + NEW.amount 
    WHERE id = NEW.user_id;
  ELSIF NEW.type IN ('saque', 'investimento', 'taxa') THEN
    UPDATE profiles 
    SET balance = balance - NEW.amount 
    WHERE id = NEW.user_id;
  END IF;
  
  -- Atualizar balance_after
  SELECT balance INTO NEW.balance_after 
  FROM profiles 
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_balance
  BEFORE INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_balance_after_transaction();

-- Função para atualizar total investido
CREATE OR REPLACE FUNCTION update_total_invested()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmado' AND OLD.status != 'confirmado' THEN
    UPDATE profiles 
    SET total_invested = total_invested + NEW.amount 
    WHERE id = NEW.investor_id;
    
    -- Atualizar amount disponível da debênture
    UPDATE debentures 
    SET available_amount = available_amount - NEW.amount 
    WHERE id = NEW.debenture_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_total_invested
  AFTER UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_total_invested();

-- Função para criar perfil automaticamente ao registrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE debentures ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_questionnaires ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Criar perfil ao registrar" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para companies (todos podem ver)
CREATE POLICY "Todos podem ver empresas ativas" ON companies
  FOR SELECT USING (is_active = true);

-- Políticas para debentures (todos podem ver)
CREATE POLICY "Todos podem ver debêntures ativas" ON debentures
  FOR SELECT USING (status = 'ativa');

-- Políticas para investments
CREATE POLICY "Usuários podem ver seus investimentos" ON investments
  FOR SELECT USING (auth.uid() = investor_id);

CREATE POLICY "Usuários podem criar investimentos" ON investments
  FOR INSERT WITH CHECK (auth.uid() = investor_id);

CREATE POLICY "Usuários podem atualizar seus investimentos pendentes" ON investments
  FOR UPDATE USING (auth.uid() = investor_id AND status = 'pendente');

-- Políticas para transactions
CREATE POLICY "Usuários podem ver suas transações" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode criar transações" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para notifications
CREATE POLICY "Usuários podem ver suas notificações" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas notificações" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para documents
CREATE POLICY "Usuários podem ver seus documentos" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem enviar documentos" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para investor_questionnaires
CREATE POLICY "Usuários podem ver seus questionários" ON investor_questionnaires
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar questionários" ON investor_questionnaires
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ====================================================
-- 7. DADOS INICIAIS (SEED DATA)
-- ====================================================

-- Inserir empresas de exemplo
INSERT INTO companies (name, cnpj, sector, description, founded_year, employees_count, annual_revenue, market, website, logo_url, highlights) VALUES
  ('XYZ Holdings', '12.345.678/0001-90', 'Energia', 'XYZ Holdings é uma das principais empresas de energia renovável do Brasil, com mais de 20 anos de atuação no mercado.', 2003, '5.000+', 'R$ 2.5 bilhões', 'Energia Solar e Eólica', 'www.xyzholdings.com.br', 'https://via.placeholder.com/200x100/f0b429/0a0a0b?text=XYZ+Holdings',
   '["Líder em energia solar no Nordeste", "Certificação ISO 14001", "15 usinas em operação", "Redução de 2M toneladas de CO2/ano"]'::jsonb),
  
  ('ABC Energia', '98.765.432/0001-10', 'Energia', 'ABC Energia atua na geração e distribuição de energia elétrica, com foco em fontes renováveis e sustentabilidade.', 1998, '8.500+', 'R$ 4.2 bilhões', 'Geração e Distribuição', 'www.abcenergia.com.br', 'https://via.placeholder.com/200x100/10b981/0a0a0b?text=ABC+Energia',
   '["3° maior distribuidora do Sul", "98% de energia limpa", "Presente em 5 estados", "Nota máxima em ESG"]'::jsonb),
  
  ('DEF Infraestrutura', '11.222.333/0001-44', 'Infraestrutura', 'DEF Infraestrutura é especializada em projetos de mobilidade urbana e rodovias, com forte presença no desenvolvimento de PPPs.', 2010, '3.200+', 'R$ 1.8 bilhões', 'Infraestrutura e Mobilidade', 'www.definfra.com.br', 'https://via.placeholder.com/200x100/6366f1/0a0a0b?text=DEF+Infra',
   '["12 concessões rodoviárias", "500km de rodovias administradas", "Projetos de metrô em 3 capitais", "Parceria com BNDES"]'::jsonb);

-- Inserir debêntures de exemplo
DO $$
DECLARE
  xyz_id UUID;
  abc_id UUID;
  def_id UUID;
BEGIN
  -- Obter IDs das empresas
  SELECT id INTO xyz_id FROM companies WHERE name = 'XYZ Holdings';
  SELECT id INTO abc_id FROM companies WHERE name = 'ABC Energia';
  SELECT id INTO def_id FROM companies WHERE name = 'DEF Infraestrutura';
  
  -- Inserir debêntures
  INSERT INTO debentures (
    company_id, name, code, type, total_amount, available_amount, min_investment, unit_price,
    annual_return_percentage, return_description, issue_date, maturity_date, payment_frequency,
    rating, risk_level, features, guarantees
  ) VALUES
  (
    xyz_id, 'Debênture Premium XYZ', 'XYZ001', 'incentivada', 5000000.00, 2500000.00, 5000.00, 1000.00,
    2.5, 'CDI + 2.5%', '2024-01-15', '2029-01-15', 'Semestral',
    'AAA', 'baixo', 
    '["Isenção de IR", "Garantia Real", "Rating AAA"]'::jsonb,
    '["Garantia fiduciária sobre recebíveis", "Seguro garantia"]'::jsonb
  ),
  (
    abc_id, 'Debênture Growth ABC', 'ABC001', 'simples', 10000000.00, 7000000.00, 10000.00, 1000.00,
    3.0, 'CDI + 3.0%', '2024-02-01', '2028-02-01', 'Semestral',
    'AA+', 'medio',
    '["Alta Liquidez", "Setor Energia", "Pagamento Semestral"]'::jsonb,
    '["Garantia real sobre ativos", "Coobrigação da controladora"]'::jsonb
  ),
  (
    def_id, 'Debênture Infra DEF', 'DEF001', 'incentivada', 15000000.00, 10000000.00, 1000.00, 1000.00,
    2.0, 'CDI + 2.0%', '2024-03-01', '2027-03-01', 'Anual',
    'AA', 'baixo',
    '["Isenção de IR", "Projeto Aprovado", "Garantia BNDES"]'::jsonb,
    '["Garantia do BNDES", "Garantia real sobre infraestrutura"]'::jsonb
  );
END $$;

-- ====================================================
-- 8. VIEWS ÚTEIS
-- ====================================================

-- View de resumo de investimentos por usuário
CREATE OR REPLACE VIEW investment_summary AS
SELECT 
  i.investor_id,
  d.name as debenture_name,
  c.name as company_name,
  i.amount,
  i.units,
  i.status,
  i.total_earnings,
  i.current_value,
  d.maturity_date,
  d.annual_return_percentage,
  i.created_at
FROM investments i
JOIN debentures d ON i.debenture_id = d.id
JOIN companies c ON d.company_id = c.id;

-- View de performance do portfólio
CREATE OR REPLACE VIEW portfolio_performance AS
SELECT 
  investor_id,
  COUNT(*) as total_investments,
  SUM(amount) as total_invested,
  SUM(total_earnings) as total_returns,
  AVG(total_earnings / NULLIF(amount, 0) * 100) as avg_return_percentage
FROM investments
WHERE status = 'confirmado'
GROUP BY investor_id;

-- ====================================================
-- FIM DO SCHEMA
-- ====================================================
