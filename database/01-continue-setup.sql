-- ============================================
-- SCRIPT PARA CONTINUAR A CONFIGURAÇÃO
-- ============================================
-- Use este script se já executou parte do schema
-- e quer continuar sem perder dados

-- Verificar e criar apenas o que falta

-- ============================================
-- VERIFICAR E CRIAR VIEWS (se não existirem)
-- ============================================

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

-- View de debêntures com detalhes
CREATE OR REPLACE VIEW debentures_with_details AS
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
CREATE OR REPLACE VIEW investment_summary AS
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
-- VERIFICAR E HABILITAR RLS (se necessário)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE debentures ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CRIAR POLÍTICAS RLS (se não existirem)
-- ============================================

-- Profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_select') THEN
        CREATE POLICY profiles_select ON profiles FOR SELECT USING (
            auth.uid() = id OR 
            EXISTS (SELECT 1 FROM admin_levels WHERE user_id = auth.uid())
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_update') THEN
        CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Companies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'companies_select') THEN
        CREATE POLICY companies_select ON companies FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'companies_insert') THEN
        CREATE POLICY companies_insert ON companies FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM admin_levels WHERE user_id = auth.uid())
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'companies' AND policyname = 'companies_update') THEN
        CREATE POLICY companies_update ON companies FOR UPDATE USING (
            EXISTS (SELECT 1 FROM admin_levels WHERE user_id = auth.uid())
        );
    END IF;
END $$;

-- Debentures
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'debentures' AND policyname = 'debentures_select') THEN
        CREATE POLICY debentures_select ON debentures FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'debentures' AND policyname = 'debentures_insert') THEN
        CREATE POLICY debentures_insert ON debentures FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM admin_levels WHERE user_id = auth.uid())
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'debentures' AND policyname = 'debentures_update') THEN
        CREATE POLICY debentures_update ON debentures FOR UPDATE USING (
            EXISTS (SELECT 1 FROM admin_levels WHERE user_id = auth.uid())
        );
    END IF;
END $$;

-- Investments
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investments' AND policyname = 'investments_select') THEN
        CREATE POLICY investments_select ON investments FOR SELECT USING (
            auth.uid() = investor_id OR 
            EXISTS (SELECT 1 FROM admin_levels WHERE user_id = auth.uid())
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investments' AND policyname = 'investments_insert') THEN
        CREATE POLICY investments_insert ON investments FOR INSERT WITH CHECK (auth.uid() = investor_id);
    END IF;
END $$;

-- Transactions
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'transactions_select') THEN
        CREATE POLICY transactions_select ON transactions FOR SELECT USING (
            auth.uid() = user_id OR 
            EXISTS (SELECT 1 FROM admin_levels WHERE user_id = auth.uid())
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'transactions_insert') THEN
        CREATE POLICY transactions_insert ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Notifications
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'notifications_select') THEN
        CREATE POLICY notifications_select ON notifications FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'notifications_update') THEN
        CREATE POLICY notifications_update ON notifications FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Documents
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'documents_select') THEN
        CREATE POLICY documents_select ON documents FOR SELECT USING (
            auth.uid() = uploaded_by OR 
            EXISTS (SELECT 1 FROM admin_levels WHERE user_id = auth.uid())
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'documents_insert') THEN
        CREATE POLICY documents_insert ON documents FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
    END IF;
END $$;

-- Investor Profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_profiles' AND policyname = 'investor_profiles_select') THEN
        CREATE POLICY investor_profiles_select ON investor_profiles FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_profiles' AND policyname = 'investor_profiles_insert') THEN
        CREATE POLICY investor_profiles_insert ON investor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_profiles' AND policyname = 'investor_profiles_update') THEN
        CREATE POLICY investor_profiles_update ON investor_profiles FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE '✅ Configuração continuada com sucesso!';
  RAISE NOTICE 'Agora execute os scripts restantes:';
  RAISE NOTICE '1. storage-setup.sql (se ainda não executou)';
  RAISE NOTICE '2. admin-setup.sql (se ainda não executou)';
  RAISE NOTICE '3. seed-data.sql (para dados de teste)';
END $$;
