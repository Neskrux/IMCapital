-- ============================================
-- SCRIPT DE CORREÇÃO - RESET COMPLETO FORÇADO
-- ============================================
-- Este script força a limpeza completa do banco

-- 1. Primeiro, dropar todas as views (não tabelas)
DROP VIEW IF EXISTS public.portfolio_performance CASCADE;
DROP VIEW IF EXISTS public.debentures_with_details CASCADE;
DROP VIEW IF EXISTS public.investment_summary CASCADE;

-- 2. Desabilitar todas as triggers
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT schemaname, tablename, triggername 
             FROM pg_trigger 
             JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid 
             JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
             WHERE pg_namespace.nspname = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I CASCADE', 
                      r.triggername, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- 3. Dropar todas as funções do schema public
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT routine_name, routine_schema
             FROM information_schema.routines
             WHERE routine_schema = 'public'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I CASCADE', 
                      r.routine_schema, r.routine_name);
    END LOOP;
END $$;

-- 4. Dropar todas as tabelas do schema public
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Desabilitar foreign key checks temporariamente
    SET session_replication_role = 'replica';
    
    FOR r IN SELECT tablename 
             FROM pg_tables 
             WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', r.tablename);
    END LOOP;
    
    -- Reabilitar foreign key checks
    SET session_replication_role = 'origin';
END $$;

-- 5. Dropar todos os tipos ENUM
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT typname 
             FROM pg_type 
             WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
             AND typtype = 'e'
    LOOP
        EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', r.typname);
    END LOOP;
END $$;

-- 6. Limpar storage buckets
DELETE FROM storage.buckets WHERE name IN ('avatars', 'documents', 'company-logos', 'debenture-docs');

-- 7. Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ BANCO TOTALMENTE LIMPO!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Agora execute NA ORDEM:';
  RAISE NOTICE '';
  RAISE NOTICE '1. supabase-schema.sql';
  RAISE NOTICE '2. storage-setup.sql';
  RAISE NOTICE '3. admin-setup.sql';
  RAISE NOTICE '4. seed-data.sql';
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
END $$;
