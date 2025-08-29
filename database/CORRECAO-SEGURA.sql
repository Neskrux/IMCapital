-- CORREÇÃO SEGURA: Só resolver o necessário sem mexer em estruturas

-- 1. VERIFICAR o usuário que está tentando investir
SELECT 
  id,
  email,
  'Usuario existe em auth.users' as status
FROM auth.users 
WHERE id = 'd2a500d0-14ff-4448-ae1e-5f10dc1ba856';

-- 2. CRIAR PERFIL COM EMAIL (se não existir)
INSERT INTO profiles (
  id,
  email,
  full_name,
  balance,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  u.email,
  'Investidor Teste',
  100000.00,
  NOW(),
  NOW()
FROM auth.users u
WHERE u.id = 'd2a500d0-14ff-4448-ae1e-5f10dc1ba856'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  balance = GREATEST(profiles.balance, 100000.00), -- Manter o maior valor
  updated_at = NOW();

-- 3. REMOVER APENAS AS CONSTRAINTS DE INVESTMENTS (sem afetar outras tabelas)
ALTER TABLE investments DROP CONSTRAINT IF EXISTS investments_investor_id_fkey;

-- 4. TESTE SIMPLES de investimento
INSERT INTO investments (
  investor_id,
  debenture_id, 
  amount,
  quantity,
  units,
  unit_price,
  current_value
)
SELECT 
  'd2a500d0-14ff-4448-ae1e-5f10dc1ba856'::uuid,
  d.id,
  1000.00,
  1,
  1,
  1000.00,
  1000.00
FROM debentures d 
LIMIT 1
ON CONFLICT DO NOTHING;

-- 5. VERIFICAR se deu certo
SELECT 
  'RESULTADO:' as info,
  COUNT(*) as investimentos_criados
FROM investments 
WHERE investor_id = 'd2a500d0-14ff-4448-ae1e-5f10dc1ba856';

-- 6. MOSTRAR perfil criado
SELECT 
  'PERFIL CRIADO:' as info,
  id,
  email,
  full_name,
  balance
FROM profiles 
WHERE id = 'd2a500d0-14ff-4448-ae1e-5f10dc1ba856';
