-- ====================================================
-- CONFIGURAÇÃO ADMINISTRATIVA - IMCAPITAL
-- ====================================================
-- 
-- INSTRUÇÕES:
-- 1. Execute após o schema principal e storage
-- 2. Configure usuários administrativos
-- 3. Define permissões especiais
-- 
-- ====================================================

-- ====================================================
-- 1. ADICIONAR COLUNAS ADMINISTRATIVAS
-- ====================================================

-- Adicionar campo de administrador na tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_level INTEGER DEFAULT 0, -- 0=user, 1=moderator, 2=admin, 3=super_admin
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;

-- Criar índice para consultas rápidas de admin
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(is_admin) WHERE is_admin = true;

-- ====================================================
-- 2. FUNÇÕES ADMINISTRATIVAS
-- ====================================================

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar nível de permissão
CREATE OR REPLACE FUNCTION has_admin_level(min_level INTEGER, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND admin_level >= min_level
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar permissão específica
CREATE OR REPLACE FUNCTION has_permission(permission_name TEXT, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND (
      is_admin = true 
      OR permissions ? permission_name
      OR permissions ? 'all'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================
-- 3. POLÍTICAS ADMINISTRATIVAS
-- ====================================================

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

-- Admins podem atualizar qualquer perfil
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE TO authenticated
  USING (has_admin_level(2, auth.uid()));

-- Admins podem ver todas as transações
CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

-- Admins podem gerenciar empresas
CREATE POLICY "Admins can manage companies" ON companies
  FOR ALL TO authenticated
  USING (has_admin_level(2, auth.uid()));

-- Admins podem gerenciar debêntures
CREATE POLICY "Admins can manage debentures" ON debentures
  FOR ALL TO authenticated
  USING (has_admin_level(2, auth.uid()));

-- Admins podem confirmar investimentos
CREATE POLICY "Admins can confirm investments" ON investments
  FOR UPDATE TO authenticated
  USING (has_permission('manage_investments', auth.uid()));

-- ====================================================
-- 4. VIEWS ADMINISTRATIVAS
-- ====================================================

-- Dashboard administrativo - Estatísticas gerais
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE is_active = true) as total_users,
  (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_30d,
  (SELECT COUNT(*) FROM investments WHERE status = 'confirmado') as total_investments,
  (SELECT SUM(amount) FROM investments WHERE status = 'confirmado') as total_invested_amount,
  (SELECT COUNT(*) FROM debentures WHERE status = 'ativa') as active_debentures,
  (SELECT SUM(available_amount) FROM debentures WHERE status = 'ativa') as total_available_amount,
  (SELECT COUNT(*) FROM transactions WHERE created_at >= CURRENT_DATE) as transactions_today,
  (SELECT SUM(amount) FROM transactions WHERE type = 'deposito' AND created_at >= CURRENT_DATE) as deposits_today;

-- Usuários mais ativos
CREATE OR REPLACE VIEW admin_top_users AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.balance,
  p.total_invested,
  p.total_earnings,
  COUNT(i.id) as investment_count,
  COUNT(t.id) as transaction_count,
  p.created_at
FROM profiles p
LEFT JOIN investments i ON p.id = i.investor_id
LEFT JOIN transactions t ON p.id = t.user_id
WHERE p.is_active = true
GROUP BY p.id, p.email, p.full_name, p.balance, p.total_invested, p.total_earnings, p.created_at
ORDER BY p.total_invested DESC, investment_count DESC
LIMIT 50;

-- Investimentos recentes para moderação
CREATE OR REPLACE VIEW admin_recent_investments AS
SELECT 
  i.id,
  i.amount,
  i.status,
  i.created_at,
  p.email as investor_email,
  p.full_name as investor_name,
  d.name as debenture_name,
  c.name as company_name
FROM investments i
JOIN profiles p ON i.investor_id = p.id
JOIN debentures d ON i.debenture_id = d.id
JOIN companies c ON d.company_id = c.id
ORDER BY i.created_at DESC
LIMIT 100;

-- Transações suspeitas (valores altos ou muitas em pouco tempo)
CREATE OR REPLACE VIEW admin_suspicious_transactions AS
SELECT 
  t.id,
  t.user_id,
  t.type,
  t.amount,
  t.created_at,
  p.email,
  p.full_name,
  COUNT(*) OVER (PARTITION BY t.user_id, DATE(t.created_at)) as transactions_same_day
FROM transactions t
JOIN profiles p ON t.user_id = p.id
WHERE 
  t.amount > 100000 -- Transações acima de R$ 100.000
  OR (
    SELECT COUNT(*) 
    FROM transactions t2 
    WHERE t2.user_id = t.user_id 
    AND t2.created_at >= t.created_at - INTERVAL '1 hour'
  ) > 5 -- Mais de 5 transações na última hora
ORDER BY t.created_at DESC;

-- ====================================================
-- 5. FUNÇÕES DE RELATÓRIOS
-- ====================================================

-- Função para relatório de performance por período
CREATE OR REPLACE FUNCTION admin_performance_report(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  metric_name TEXT,
  metric_value NUMERIC,
  metric_change_pct NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT 
      COUNT(DISTINCT p.id) as users,
      COUNT(DISTINCT i.id) as investments,
      COALESCE(SUM(i.amount), 0) as total_invested,
      COUNT(DISTINCT t.id) as transactions,
      COALESCE(SUM(CASE WHEN t.type = 'deposito' THEN t.amount ELSE 0 END), 0) as deposits
    FROM profiles p
    LEFT JOIN investments i ON p.id = i.investor_id AND i.created_at BETWEEN start_date AND end_date
    LEFT JOIN transactions t ON p.id = t.user_id AND t.created_at BETWEEN start_date AND end_date
    WHERE p.created_at BETWEEN start_date AND end_date
  ),
  previous_period AS (
    SELECT 
      COUNT(DISTINCT p.id) as users,
      COUNT(DISTINCT i.id) as investments,
      COALESCE(SUM(i.amount), 0) as total_invested,
      COUNT(DISTINCT t.id) as transactions,
      COALESCE(SUM(CASE WHEN t.type = 'deposito' THEN t.amount ELSE 0 END), 0) as deposits
    FROM profiles p
    LEFT JOIN investments i ON p.id = i.investor_id AND i.created_at BETWEEN start_date - (end_date - start_date) AND start_date
    LEFT JOIN transactions t ON p.id = t.user_id AND t.created_at BETWEEN start_date - (end_date - start_date) AND start_date
    WHERE p.created_at BETWEEN start_date - (end_date - start_date) AND start_date
  )
  SELECT 'Novos Usuários'::TEXT, cp.users::NUMERIC, 
         CASE WHEN pp.users > 0 THEN ((cp.users - pp.users)::NUMERIC / pp.users * 100) ELSE 0 END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT 'Investimentos'::TEXT, cp.investments::NUMERIC,
         CASE WHEN pp.investments > 0 THEN ((cp.investments - pp.investments)::NUMERIC / pp.investments * 100) ELSE 0 END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT 'Volume Investido'::TEXT, cp.total_invested,
         CASE WHEN pp.total_invested > 0 THEN ((cp.total_invested - pp.total_invested) / pp.total_invested * 100) ELSE 0 END
  FROM current_period cp, previous_period pp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================
-- 6. CONFIGURAR PRIMEIRO ADMIN
-- ====================================================

-- Função para promover usuário a admin (execute manualmente após criar conta)
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_count INTEGER := 0;
BEGIN
  UPDATE profiles 
  SET 
    is_admin = true,
    admin_level = 3,
    permissions = '["all"]'::jsonb
  WHERE email = user_email;
  
  GET DIAGNOSTICS user_count = ROW_COUNT;
  
  IF user_count > 0 THEN
    INSERT INTO notifications (user_id, title, message, type)
    SELECT id, 'Parabéns!', 'Você foi promovido a administrador da plataforma.', 'success'
    FROM profiles WHERE email = user_email;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================
-- 7. LOGS DE AUDITORIA
-- ====================================================

-- Tabela para logs de ações administrativas
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created ON admin_logs(created_at);

-- Função para registrar ação administrativa
CREATE OR REPLACE FUNCTION log_admin_action(
  action_name TEXT,
  table_name TEXT DEFAULT NULL,
  record_id UUID DEFAULT NULL,
  old_data JSONB DEFAULT NULL,
  new_data JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_logs (admin_id, action, target_table, target_id, old_values, new_values)
  VALUES (auth.uid(), action_name, table_name, record_id, old_data, new_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================
-- 8. COMANDOS ÚTEIS PARA EXECUTAR APÓS SETUP
-- ====================================================

/*
-- Para promover um usuário a admin (substitua o email):
SELECT promote_to_admin('admin@imcapital.com.br');

-- Para ver dashboard administrativo:
SELECT * FROM admin_dashboard;

-- Para ver relatório de performance dos últimos 30 dias:
SELECT * FROM admin_performance_report();

-- Para ver usuários mais ativos:
SELECT * FROM admin_top_users LIMIT 10;

-- Para ver transações suspeitas:
SELECT * FROM admin_suspicious_transactions;
*/

-- ====================================================
-- FIM DA CONFIGURAÇÃO ADMINISTRATIVA
-- ====================================================

SELECT 'Configuração administrativa concluída!' as status;
