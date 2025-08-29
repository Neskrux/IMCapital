-- Verificar estrutura da tabela investments existente

-- 1. Ver colunas da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'investments' 
ORDER BY ordinal_position;

-- 2. Ver se há dados
SELECT COUNT(*) as total_investments FROM investments;

-- 3. Ver alguns registros se existirem
SELECT * FROM investments LIMIT 5;
