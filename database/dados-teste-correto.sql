-- ============================================
-- DADOS DE TESTE CORRETOS - IMCapital
-- ============================================
-- Script com os nomes corretos das colunas

-- ============================================
-- 1. EMPRESAS
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
);

-- ============================================
-- 2. DEBÊNTURES
-- ============================================

INSERT INTO debentures (
    id, 
    company_id, 
    code, 
    series, 
    type,
    total_amount, 
    unit_price, 
    minimum_investment,
    available_units, 
    total_units,
    index_type, 
    index_percentage,
    issue_date, 
    maturity_date, 
    payment_frequency,
    description, 
    status
) VALUES
(
    '650e8400-e29b-41d4-a716-446655440001', 
    '550e8400-e29b-41d4-a716-446655440001', 
    'PETR24', 
    '1ª Série', 
    'simples',
    50000000, 
    1000, 
    1000,
    45000, 
    50000,
    'CDI', 
    118,
    '2024-01-01', 
    '2029-01-01', 
    'semestral',
    'Debênture para expansão de refinarias e projetos de energia renovável', 
    'disponivel'
),
(
    '650e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'VALE28', 
    '2ª Série', 
    'incentivada',
    100000000, 
    1000, 
    5000,
    90000, 
    100000,
    'IPCA', 
    106,
    '2024-03-01', 
    '2028-03-01', 
    'anual',
    'Debênture incentivada para projetos sustentáveis e redução de emissões', 
    'disponivel'
),
(
    '650e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'AMBV26', 
    '1ª Série', 
    'simples',
    30000000, 
    1000, 
    1000,
    28000, 
    30000,
    'CDI', 
    112,
    '2024-02-01', 
    '2026-02-01', 
    'trimestral',
    'Debênture para capital de giro e expansão da capacidade produtiva', 
    'disponivel'
);

-- ============================================
-- 3. CRIAR USUÁRIOS DE TESTE (OPCIONAL)
-- ============================================
-- Para criar usuários de teste, use a interface do Supabase:
-- 1. Vá em Authentication > Users
-- 2. Clique em "Invite user"
-- 3. Use estes emails:
--    - teste@imcapital.com (senha: teste123)
--    - investidor@imcapital.com (senha: teste123)

-- ============================================
-- MENSAGEM DE CONCLUSÃO
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ DADOS INSERIDOS COM SUCESSO!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Empresas criadas:';
  RAISE NOTICE '   • Petrobras (Energia)';
  RAISE NOTICE '   • Vale (Mineração)';
  RAISE NOTICE '   • Ambev (Bebidas)';
  RAISE NOTICE '';
  RAISE NOTICE '📈 Debêntures disponíveis:';
  RAISE NOTICE '   • PETR24: CDI + 118% (5 anos)';
  RAISE NOTICE '   • VALE28: IPCA + 6% (4 anos)';
  RAISE NOTICE '   • AMBV26: CDI + 112% (2 anos)';
  RAISE NOTICE '';
  RAISE NOTICE '👤 Próximo passo:';
  RAISE NOTICE '   Crie usuários de teste no Supabase';
  RAISE NOTICE '   Authentication > Users > Invite';
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
END $$;
