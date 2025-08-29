-- ============================================
-- INSERIR APENAS EMPRESAS - IMCapital
-- ============================================
-- Script simplificado apenas com empresas

-- ============================================
-- EMPRESAS (campos confirmados)
-- ============================================

INSERT INTO companies (
    id, 
    name, 
    cnpj, 
    sector, 
    market,
    logo_url, 
    website, 
    description, 
    annual_revenue, 
    employees_count, 
    founded_year,
    highlights,
    is_active
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001', 
    'Petrobras', 
    '33.000.167/0001-01', 
    'Energia',
    'Óleo e Gás',
    'https://logodownload.org/wp-content/uploads/2014/05/petrobras-logo-2.png',
    'https://petrobras.com.br', 
    'Maior empresa de energia do Brasil', 
    500000000000, 
    45000, 
    1953,
    '["Líder em exploração de pré-sal", "Maior empresa do Brasil", "Forte presença internacional"]'::jsonb,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440002', 
    'Vale', 
    '33.592.510/0001-54', 
    'Mineração',
    'Commodities',
    'https://upload.wikimedia.org/wikipedia/pt/c/cf/Vale_logo_2017.png',
    'https://vale.com', 
    'Líder global em mineração', 
    300000000000, 
    120000, 
    1942,
    '["Maior produtora de minério de ferro", "Presença em 30 países", "Líder em sustentabilidade"]'::jsonb,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440003', 
    'Ambev', 
    '07.526.557/0001-00', 
    'Bebidas',
    'Consumo',
    'https://logodownload.org/wp-content/uploads/2014/05/ambev-logo-1.png',
    'https://www.ambev.com.br',
    'Maior cervejaria da América Latina', 
    70000000000, 
    35000, 
    1999,
    '["Portfolio com mais de 100 marcas", "Líder de mercado", "Inovação constante"]'::jsonb,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    'Itaú Unibanco',
    '60.701.190/0001-04',
    'Financeiro',
    'Bancos',
    'https://logodownload.org/wp-content/uploads/2014/05/itau-logo-2.png',
    'https://www.itau.com.br',
    'Maior banco privado do Brasil',
    150000000000,
    100000,
    1945,
    '["Maior banco privado da América Latina", "Transformação digital", "Liderança em inovação"]'::jsonb,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    'JBS',
    '02.916.265/0001-60',
    'Alimentos',
    'Proteína Animal',
    'https://logodownload.org/wp-content/uploads/2018/09/jbs-logo.png',
    'https://www.jbs.com.br',
    'Maior empresa de proteína animal do mundo',
    350000000000,
    250000,
    1953,
    '["Líder global em proteína", "Presença em 190 países", "Sustentabilidade na produção"]'::jsonb,
    true
);

-- ============================================
-- MENSAGEM DE CONCLUSÃO
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ EMPRESAS INSERIDAS COM SUCESSO!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Empresas criadas:';
  RAISE NOTICE '   1. Petrobras (Energia)';
  RAISE NOTICE '   2. Vale (Mineração)';
  RAISE NOTICE '   3. Ambev (Bebidas)';
  RAISE NOTICE '   4. Itaú Unibanco (Financeiro)';
  RAISE NOTICE '   5. JBS (Alimentos)';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANTE:';
  RAISE NOTICE '   Execute verificar-debentures.sql';
  RAISE NOTICE '   para ver os campos da tabela debentures';
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
END $$;
