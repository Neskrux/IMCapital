-- Desabilitar RLS temporariamente para testes
-- ATENÇÃO: Em produção, você deve configurar políticas apropriadas

-- Opção 1: Desabilitar RLS na tabela debentures (APENAS PARA TESTES)
ALTER TABLE debentures DISABLE ROW LEVEL SECURITY;

-- Opção 2: Criar política que permite tudo para usuários autenticados
-- (Comente a linha acima e descomente as linhas abaixo se preferir manter RLS)

-- -- Primeiro, remover políticas existentes
-- DROP POLICY IF EXISTS "Usuários podem ver todas debêntures" ON debentures;
-- DROP POLICY IF EXISTS "Usuários autenticados podem criar debêntures" ON debentures;
-- DROP POLICY IF EXISTS "Usuários podem atualizar próprias debêntures" ON debentures;
-- DROP POLICY IF EXISTS "Usuários podem deletar próprias debêntures" ON debentures;

-- -- Criar novas políticas mais permissivas
-- CREATE POLICY "Permitir leitura pública de debêntures"
--   ON debentures FOR SELECT
--   USING (true);

-- CREATE POLICY "Permitir criação para usuários autenticados"
--   ON debentures FOR INSERT
--   WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Permitir atualização para criadores"
--   ON debentures FOR UPDATE
--   USING (auth.uid() = created_by)
--   WITH CHECK (auth.uid() = created_by);

-- CREATE POLICY "Permitir deleção para criadores"
--   ON debentures FOR DELETE
--   USING (auth.uid() = created_by);

-- Verificar status do RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'debentures';

-- Listar políticas existentes
SELECT 
  pol.polname as policy_name,
  pol.polcmd as command,
  pg_get_expr(pol.polqual, pol.polrelid) as using_expression,
  pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
WHERE cls.relname = 'debentures';
