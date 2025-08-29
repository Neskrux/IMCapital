-- Verificar tipo da coluna status
SELECT data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'debentures' 
AND column_name = 'status';
