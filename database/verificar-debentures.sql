-- Verificar colunas da tabela debentures
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'debentures'
ORDER BY ordinal_position;
