-- SOLUÇÃO: Adicionar o valor "ativa" ao enum ou descobrir o valor correto

-- Opção 1: Adicionar "ativa" ao enum existente
DO $$ 
BEGIN
    -- Verificar se o valor "ativa" já existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'ativa' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'investment_status')
    ) THEN
        -- Adicionar "ativa" ao enum
        ALTER TYPE investment_status ADD VALUE 'ativa';
    END IF;
END $$;

-- Opção 2: Se der erro, tentar outros valores comuns
-- Teste com diferentes valores:

-- Ver quais valores existem
SELECT 'Valores do enum investment_status:' as info;
SELECT enumlabel as valores_existentes 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'investment_status');

-- Teste de insert com valor padrão do enum
INSERT INTO investments (
  investor_id,
  debenture_id, 
  amount,
  quantity,
  units,
  unit_price,
  current_value
  -- Não especificar status, deixar usar o padrão
)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  d.id,
  1000.00,
  1,
  1,
  1000.00,
  1000.00
FROM debentures d 
LIMIT 1
ON CONFLICT DO NOTHING;

SELECT 'Teste de insert realizado!' as resultado;
