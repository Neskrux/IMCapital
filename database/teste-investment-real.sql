-- TESTE: Inserir um investimento de teste com a estrutura correta

-- 1. Verificar se há usuários e debêntures
SELECT 'Usuários:' as tipo, COUNT(*) as total FROM auth.users
UNION ALL
SELECT 'Debêntures:', COUNT(*) FROM debentures;

-- 2. Inserir investimento de teste
INSERT INTO investments (
  investor_id,
  debenture_id, 
  amount,
  quantity,
  units,
  unit_price,
  current_value,
  status
)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  d.id,
  5000.00,
  5,
  5,
  1000.00,
  5000.00,
  'ativa'
FROM debentures d 
LIMIT 1
ON CONFLICT DO NOTHING;

-- 3. Verificar se funcionou
SELECT 
  i.*,
  d.name as debenture_name
FROM investments i
JOIN debentures d ON i.debenture_id = d.id
ORDER BY i.created_at DESC
LIMIT 3;
