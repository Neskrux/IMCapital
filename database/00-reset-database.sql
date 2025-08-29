-- ============================================
-- SCRIPT DE RESET - LIMPA E RECRIA O BANCO
-- ============================================
-- ⚠️ ATENÇÃO: Este script REMOVE TODOS OS DADOS!
-- Execute apenas se quiser resetar completamente o banco

-- Desabilitar RLS temporariamente
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.debentures DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.investor_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs DISABLE ROW LEVEL SECURITY;

-- Remover políticas RLS existentes
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "companies_select" ON public.companies;
DROP POLICY IF EXISTS "companies_insert" ON public.companies;
DROP POLICY IF EXISTS "companies_update" ON public.companies;
DROP POLICY IF EXISTS "debentures_select" ON public.debentures;
DROP POLICY IF EXISTS "debentures_insert" ON public.debentures;
DROP POLICY IF EXISTS "debentures_update" ON public.debentures;
DROP POLICY IF EXISTS "investments_select" ON public.investments;
DROP POLICY IF EXISTS "investments_insert" ON public.investments;
DROP POLICY IF EXISTS "transactions_select" ON public.transactions;
DROP POLICY IF EXISTS "transactions_insert" ON public.transactions;
DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
DROP POLICY IF EXISTS "documents_select" ON public.documents;
DROP POLICY IF EXISTS "documents_insert" ON public.documents;
DROP POLICY IF EXISTS "investor_profiles_select" ON public.investor_profiles;
DROP POLICY IF EXISTS "investor_profiles_insert" ON public.investor_profiles;
DROP POLICY IF EXISTS "investor_profiles_update" ON public.investor_profiles;
DROP POLICY IF EXISTS "admin_levels_select" ON public.admin_levels;
DROP POLICY IF EXISTS "admin_levels_update" ON public.admin_levels;
DROP POLICY IF EXISTS "audit_logs_select" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;

-- Remover triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_debentures_updated_at ON public.debentures;
DROP TRIGGER IF EXISTS update_investments_updated_at ON public.investments;
DROP TRIGGER IF EXISTS update_investor_profiles_updated_at ON public.investor_profiles;
DROP TRIGGER IF EXISTS update_profile_balance_on_transaction ON public.transactions;
DROP TRIGGER IF EXISTS update_total_invested_on_investment ON public.investments;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS log_api_calls ON public.profiles;
DROP TRIGGER IF EXISTS log_api_calls ON public.companies;
DROP TRIGGER IF EXISTS log_api_calls ON public.debentures;
DROP TRIGGER IF EXISTS log_api_calls ON public.investments;
DROP TRIGGER IF EXISTS log_api_calls ON public.transactions;

-- Remover funções
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_profile_balance() CASCADE;
DROP FUNCTION IF EXISTS public.update_total_invested() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_admin_level() CASCADE;
DROP FUNCTION IF EXISTS public.promote_to_admin(text, admin_level_type) CASCADE;
DROP FUNCTION IF EXISTS public.log_api_call() CASCADE;

-- Remover views
DROP VIEW IF EXISTS public.portfolio_performance CASCADE;
DROP VIEW IF EXISTS public.debentures_with_details CASCADE;
DROP VIEW IF EXISTS public.investment_summary CASCADE;

-- Remover tabelas (na ordem correta devido às foreign keys)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.admin_levels CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.investments CASCADE;
DROP TABLE IF EXISTS public.debentures CASCADE;
DROP TABLE IF EXISTS public.investor_profiles CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Remover tipos ENUM
DROP TYPE IF EXISTS public.investor_profile_type CASCADE;
DROP TYPE IF EXISTS public.risk_level_type CASCADE;
DROP TYPE IF EXISTS public.debenture_type CASCADE;
DROP TYPE IF EXISTS public.payment_frequency_type CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;
DROP TYPE IF EXISTS public.notification_type CASCADE;
DROP TYPE IF EXISTS public.document_type CASCADE;
DROP TYPE IF EXISTS public.admin_level_type CASCADE;

-- Remover buckets de storage (se existirem)
DELETE FROM storage.buckets WHERE name IN ('avatars', 'documents', 'company-logos', 'debenture-docs');

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE '✅ Banco de dados resetado com sucesso!';
  RAISE NOTICE 'Agora execute os scripts na ordem:';
  RAISE NOTICE '1. supabase-schema.sql';
  RAISE NOTICE '2. storage-setup.sql';
  RAISE NOTICE '3. admin-setup.sql';
  RAISE NOTICE '4. seed-data.sql';
END $$;
