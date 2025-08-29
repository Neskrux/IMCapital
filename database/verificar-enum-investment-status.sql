-- Verificar valores do enum investment_status

-- Ver todos os valores possíveis do enum
SELECT enumlabel as valor_aceito 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid 
  FROM pg_type 
  WHERE typname = 'investment_status'
);

-- Ver tipo da coluna status
SELECT 
  table_name,
  column_name,
  data_type,
  udt_name
FROM information_schema.columns 
WHERE table_name = 'investments' AND column_name = 'status';
