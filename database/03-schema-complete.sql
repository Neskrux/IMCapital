-- ============================================
-- SCHEMA COMPLETO CORRIGIDO - IMCapital
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TIPOS ENUM
-- ============================================

-- Tipo de perfil de investidor
CREATE TYPE investor_profile_type AS ENUM ('conservador', 'moderado', 'arrojado');

-- Nível de risco
CREATE TYPE risk_level_type AS ENUM ('baixo', 'medio', 'alto');

-- Tipo de debênture
CREATE TYPE debenture_type AS ENUM ('simples', 'conversivel', 'permutavel', 'incentivada');

-- Frequência de pagamento
CREATE TYPE payment_frequency_type AS ENUM ('mensal', 'trimestral', 'semestral', 'anual', 'vencimento');

-- Status do investimento
CREATE TYPE investment_status AS ENUM ('pendente', 'confirmado', 'cancelado', 'resgatado');

-- Tipo de transação
CREATE TYPE transaction_type AS ENUM ('deposito', 'saque', 'investimento', 'resgate', 'rendimento', 'taxa');

-- Tipo de notificação
CREATE TYPE notification_type AS ENUM ('info', 'sucesso', 'alerta', 'erro');

-- Tipo de documento
CREATE TYPE document_type AS ENUM ('contrato', 'termo', 'relatorio', 'comprovante', 'outro');

-- ============================================
-- TABELAS PRINCIPAIS
-- ============================================

-- Tabela de perfis de usuários (estende auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  cpf TEXT UNIQUE,
  
  -- Informações financeiras
  balance DECIMAL(15,2) DEFAULT 0.00,
  total_invested DECIMAL(15,2) DEFAULT 0.00,
  total_earnings DECIMAL(15,2) DEFAULT 0.00,
  
  -- Perfil de investidor
  investor_profile investor_profile_type DEFAULT 'conservador',
  risk_accepted risk_level_type DEFAULT 'baixo',
  
  -- Status e metadados
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Datas
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de perfis detalhados de investidor
CREATE TABLE investor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informações pessoais adicionais
  birth_date DATE,
  occupation TEXT,
  monthly_income DECIMAL(15,2),
  net_worth DECIMAL(15,2),
  
  -- Experiência em investimentos
  investment_experience_years INTEGER DEFAULT 0,
  has_fixed_income_experience BOOLEAN DEFAULT false,
  has_variable_income_experience BOOLEAN DEFAULT false,
  has_derivatives_experience BOOLEAN DEFAULT false,
  
  -- Objetivos
  investment_goals TEXT[],
  investment_horizon TEXT, -- 'curto', 'medio', 'longo'
  
  -- Preferências
  preferred_liquidity TEXT, -- 'diaria', 'mensal', 'anual', 'vencimento'
  accepts_loss BOOLEAN DEFAULT false,
  
  -- Documentação
  is_qualified_investor BOOLEAN DEFAULT false,
  qualification_date DATE,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de empresas emissoras
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Informações básicas
  name TEXT NOT NULL,
  legal_name TEXT,
  cnpj TEXT UNIQUE,
  logo_url TEXT,
  website TEXT,
  
  -- Informações de contato
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Informações financeiras
  sector TEXT,
  revenue DECIMAL(15,2),
  employees INTEGER,
  founded_year INTEGER,
  
  -- Ratings e avaliações
  credit_rating TEXT,
  risk_level risk_level_type DEFAULT 'medio',
  
  -- Descrições
  description TEXT,
  highlights TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de debêntures
CREATE TABLE debentures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Informações básicas
  code TEXT UNIQUE NOT NULL,
  series TEXT,
  type debenture_type DEFAULT 'simples',
  
  -- Valores e quantidades
  total_amount DECIMAL(15,2) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  minimum_investment DECIMAL(15,2) NOT NULL,
  available_units INTEGER NOT NULL,
  total_units INTEGER NOT NULL,
  
  -- Taxas e rentabilidade
  interest_rate DECIMAL(5,2),
  index_type TEXT, -- 'CDI', 'IPCA', 'IGP-M', 'PRE'
  index_percentage DECIMAL(5,2), -- Ex: 120% do CDI
  
  -- Prazos e pagamentos
  issue_date DATE NOT NULL,
  maturity_date DATE NOT NULL,
  payment_frequency payment_frequency_type DEFAULT 'semestral',
  
  -- Garantias e riscos
  has_guarantee BOOLEAN DEFAULT false,
  guarantee_type TEXT,
  guarantee_value DECIMAL(15,2),
  risk_level risk_level_type DEFAULT 'medio',
  credit_rating TEXT,
  
  -- Descrições
  description TEXT,
  investment_terms TEXT,
  risks TEXT,
  
  -- Status
  status TEXT DEFAULT 'disponivel',
  is_active BOOLEAN DEFAULT true,
  
  -- Metadados
  prospectus_url TEXT,
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

-- Tabela de notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Conteúdo
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'info',
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Ação relacionada
  action_url TEXT,
  action_label TEXT,
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relacionamentos
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  debenture_id UUID REFERENCES debentures(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
  
  -- Informações do documento
  type document_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  -- Status
  is_public BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  
  -- Metadados
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_cpf ON profiles(cpf);
CREATE INDEX idx_companies_cnpj ON companies(cnpj);
CREATE INDEX idx_debentures_company ON debentures(company_id);
CREATE INDEX idx_debentures_status ON debentures(status);
CREATE INDEX idx_investments_investor ON investments(investor_id);
CREATE INDEX idx_investments_debenture ON investments(debenture_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_investment ON transactions(investment_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_debenture ON documents(debenture_id);
CREATE INDEX idx_investor_profiles_user ON investor_profiles(user_id);

-- ============================================
-- FUNÇÕES
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar saldo após transação
CREATE OR REPLACE FUNCTION update_profile_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type IN ('deposito', 'resgate', 'rendimento') THEN
    UPDATE profiles 
    SET balance = balance + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSIF NEW.type IN ('saque', 'investimento', 'taxa') THEN
    UPDATE profiles 
    SET balance = balance - NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  -- Atualizar balance_after
  UPDATE transactions 
  SET balance_after = (SELECT balance FROM profiles WHERE id = NEW.user_id)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar total investido
CREATE OR REPLACE FUNCTION update_total_invested()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmado' AND OLD.status != 'confirmado' THEN
    UPDATE profiles 
    SET total_invested = total_invested + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.investor_id;
  ELSIF OLD.status = 'confirmado' AND NEW.status != 'confirmado' THEN
    UPDATE profiles 
    SET total_invested = total_invested - OLD.amount,
        updated_at = NOW()
    WHERE id = NEW.investor_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_debentures_updated_at BEFORE UPDATE ON debentures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_profiles_updated_at BEFORE UPDATE ON investor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar saldo
CREATE TRIGGER update_profile_balance_on_transaction
  AFTER INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_profile_balance();

-- Trigger para atualizar total investido
CREATE TRIGGER update_total_invested_on_investment
  AFTER UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_total_invested();

-- Trigger para criar perfil ao criar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- VIEWS
-- ============================================

-- View de performance do portfólio
CREATE VIEW portfolio_performance AS
SELECT 
    investor_id,
    COUNT(*) as total_investments,
    SUM(amount) as total_invested,
    SUM(total_earnings) as total_returns,
    AVG(total_earnings / NULLIF(amount, 0) * 100) as avg_return_percentage
FROM investments
WHERE status = 'confirmado'
GROUP BY investor_id;

-- View de debêntures com detalhes
CREATE VIEW debentures_with_details AS
SELECT 
    d.*,
    c.name as company_name,
    c.logo_url as company_logo,
    c.sector as company_sector,
    COUNT(DISTINCT i.id) as total_investors,
    SUM(i.amount) as total_invested_amount
FROM debentures d
LEFT JOIN companies c ON d.company_id = c.id
LEFT JOIN investments i ON d.id = i.debenture_id AND i.status = 'confirmado'
GROUP BY d.id, c.name, c.logo_url, c.sector;

-- View de resumo de investimentos
CREATE VIEW investment_summary AS
SELECT 
    p.id as investor_id,
    p.email,
    p.full_name,
    p.balance,
    p.total_invested,
    p.total_earnings,
    COUNT(DISTINCT i.id) as active_investments,
    COUNT(DISTINCT i.debenture_id) as unique_debentures
FROM profiles p
LEFT JOIN investments i ON p.id = i.investor_id AND i.status = 'confirmado'
GROUP BY p.id, p.email, p.full_name, p.balance, p.total_invested, p.total_earnings;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE debentures ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY profiles_select ON profiles FOR SELECT USING (
  auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_verified = true
  )
);

CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para companies (público para leitura)
CREATE POLICY companies_select ON companies FOR SELECT USING (true);

-- Políticas para debentures (público para leitura)
CREATE POLICY debentures_select ON debentures FOR SELECT USING (true);

-- Políticas para investments
CREATE POLICY investments_select ON investments FOR SELECT USING (
  auth.uid() = investor_id
);

CREATE POLICY investments_insert ON investments FOR INSERT WITH CHECK (
  auth.uid() = investor_id
);

-- Políticas para transactions
CREATE POLICY transactions_select ON transactions FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY transactions_insert ON transactions FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Políticas para notifications
CREATE POLICY notifications_select ON notifications FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY notifications_update ON notifications FOR UPDATE USING (
  auth.uid() = user_id
);

-- Políticas para documents
CREATE POLICY documents_select ON documents FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() = uploaded_by OR 
  is_public = true
);

CREATE POLICY documents_insert ON documents FOR INSERT WITH CHECK (
  auth.uid() = uploaded_by
);

-- Políticas para investor_profiles
CREATE POLICY investor_profiles_select ON investor_profiles FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY investor_profiles_insert ON investor_profiles FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY investor_profiles_update ON investor_profiles FOR UPDATE USING (
  auth.uid() = user_id
);

-- ============================================
-- MENSAGEM DE CONCLUSÃO
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ SCHEMA CRIADO COM SUCESSO!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Próximos passos:';
  RAISE NOTICE '1. storage-setup.sql';
  RAISE NOTICE '2. admin-setup.sql';
  RAISE NOTICE '3. seed-data.sql';
  RAISE NOTICE '';
END $$;
