-- Se a tabela existe mas tem estrutura diferente, vamos corrigir

-- 1. Primeiro, desabilitar RLS
ALTER TABLE investments DISABLE ROW LEVEL SECURITY;

-- 2. Adicionar colunas que podem estar faltando (se não existirem)
DO $$ 
BEGIN
    -- Adicionar quantity se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'quantity') THEN
        ALTER TABLE investments ADD COLUMN quantity INTEGER DEFAULT 1;
    END IF;
    
    -- Adicionar unit_price se não existir  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'unit_price') THEN
        ALTER TABLE investments ADD COLUMN unit_price DECIMAL(10,2) DEFAULT 1000.00;
    END IF;
    
    -- Adicionar status se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'status') THEN
        ALTER TABLE investments ADD COLUMN status TEXT DEFAULT 'ativa';
    END IF;
    
    -- Adicionar invested_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investments' AND column_name = 'invested_at') THEN
        ALTER TABLE investments ADD COLUMN invested_at TIMESTAMP DEFAULT NOW();
    END IF;
END $$;

-- 3. Verificar se agora está tudo OK
SELECT 'Tabela investments corrigida!' as resultado;

-- 4. Mostrar estrutura final
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'investments' 
ORDER BY ordinal_position;
