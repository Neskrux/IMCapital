-- Corrigir RLS para a tabela companies também

-- Desabilitar RLS temporariamente
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Ou criar políticas permissivas (descomente se preferir)
-- DROP POLICY IF EXISTS "Permitir leitura pública" ON companies;
-- DROP POLICY IF EXISTS "Permitir criação autenticada" ON companies;

-- CREATE POLICY "Permitir leitura pública"
--   ON companies FOR SELECT
--   USING (true);

-- CREATE POLICY "Permitir criação para usuários autenticados"
--   ON companies FOR INSERT
--   WITH CHECK (auth.uid() IS NOT NULL);

-- Verificar status
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('companies', 'debentures');
