-- ============================================
-- INSERIR DEBÊNTURES - IMCapital
-- ============================================
-- Script com os campos corretos da tabela debentures

-- ============================================
-- DEBÊNTURES (estrutura correta)
-- ============================================

INSERT INTO debentures (
    id,
    company_id,
    name,
    code,
    type,
    status,
    total_amount,
    available_amount,
    min_investment,
    unit_price,
    annual_return_percentage,
    return_description,
    issue_date,
    maturity_date,
    payment_frequency,
    rating,
    risk_level,
    features,
    guarantees,
    prospectus_url,
    contract_url
) VALUES
(
    '650e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001', -- Petrobras
    'Debênture Petrobras 2029',
    'PETR29',
    'simples',
    'disponivel',
    50000000.00,
    45000000.00,
    1000.00,
    1000.00,
    13.75, -- CDI + 1.5% ≈ 13.75% a.a.
    'CDI + 1,5% ao ano',
    '2024-01-01',
    '2029-01-01',
    'semestral',
    'BBB+',
    'medio',
    '["Pagamento semestral de juros", "Resgate antecipado permitido após 2 anos", "Isenção de IR para PF"]'::jsonb,
    '["Garantia real", "Fluxo de recebíveis"]'::jsonb,
    'https://ri.petrobras.com.br/debentures/PETR29_prospecto.pdf',
    'https://ri.petrobras.com.br/debentures/PETR29_contrato.pdf'
),
(
    '650e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002', -- Vale
    'Debênture Verde Vale 2028',
    'VALE28',
    'incentivada',
    'disponivel',
    100000000.00,
    90000000.00,
    5000.00,
    1000.00,
    8.50, -- IPCA + 6% ≈ 8.5% a.a.
    'IPCA + 6% ao ano',
    '2024-03-01',
    '2028-03-01',
    'anual',
    'A-',
    'medio',
    '["Debênture incentivada (isenta de IR)", "Projeto sustentável", "Rating A-", "Pagamento anual"]'::jsonb,
    '["Garantia quirografária", "Covenants financeiros"]'::jsonb,
    'https://ri.vale.com/debentures/VALE28_prospecto.pdf',
    'https://ri.vale.com/debentures/VALE28_contrato.pdf'
),
(
    '650e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003', -- Ambev
    'Debênture Ambev 2026',
    'AMBV26',
    'simples',
    'disponivel',
    30000000.00,
    28000000.00,
    1000.00,
    1000.00,
    12.50, -- CDI + 0.8% ≈ 12.5% a.a.
    'CDI + 0,8% ao ano',
    '2024-02-01',
    '2026-02-01',
    'trimestral',
    'AAA',
    'baixo',
    '["Rating AAA", "Pagamento trimestral", "Liquidez diária", "Resgate a qualquer momento"]'::jsonb,
    '["Garantia quirografária", "Aval da controladora"]'::jsonb,
    'https://ri.ambev.com.br/debentures/AMBV26_prospecto.pdf',
    'https://ri.ambev.com.br/debentures/AMBV26_contrato.pdf'
),
(
    '650e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440004', -- Itaú
    'Debênture Subordinada Itaú 2034',
    'ITUB34',
    'simples',
    'disponivel',
    200000000.00,
    180000000.00,
    10000.00,
    1000.00,
    14.25, -- CDI + 2% ≈ 14.25% a.a.
    'CDI + 2% ao ano',
    '2024-01-15',
    '2034-01-15',
    'semestral',
    'AA+',
    'baixo',
    '["Debênture subordinada", "Compõe capital nível II", "Rating AA+", "10 anos de prazo"]'::jsonb,
    '["Subordinação", "Garantia do FGC até limite"]'::jsonb,
    'https://ri.itau.com.br/debentures/ITUB34_prospecto.pdf',
    'https://ri.itau.com.br/debentures/ITUB34_contrato.pdf'
),
(
    '650e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440005', -- JBS
    'Debênture JBS Sustentável 2027',
    'JBSS27',
    'simples',
    'disponivel',
    75000000.00,
    70000000.00,
    5000.00,
    1000.00,
    13.00, -- CDI + 1.2% ≈ 13% a.a.
    'CDI + 1,2% ao ano',
    '2024-02-15',
    '2027-02-15',
    'semestral',
    'BB+',
    'medio',
    '["Projeto sustentável", "Metas ESG", "Pagamento semestral", "3 anos de prazo"]'::jsonb,
    '["Garantia real", "Alienação fiduciária de recebíveis"]'::jsonb,
    'https://ri.jbs.com.br/debentures/JBSS27_prospecto.pdf',
    'https://ri.jbs.com.br/debentures/JBSS27_contrato.pdf'
);

-- ============================================
-- CRIAR ALGUNS INVESTIMENTOS DE EXEMPLO
-- ============================================

-- Primeiro, vamos criar um usuário de teste se não existir
DO $$
DECLARE
    test_user_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
    -- Criar perfil de teste se não existir
    INSERT INTO profiles (
        id,
        email,
        full_name,
        balance,
        total_invested,
        total_earnings,
        investor_profile,
        is_active,
        is_verified
    ) VALUES (
        test_user_id,
        'investidor@imcapital.com',
        'Investidor Teste',
        100000.00,
        0.00,
        0.00,
        'moderado',
        true,
        true
    ) ON CONFLICT (id) DO NOTHING;

    -- Criar alguns investimentos de exemplo
    INSERT INTO investments (
        id,
        investor_id,
        debenture_id,
        amount,
        units,
        unit_price,
        status,
        invested_at,
        confirmed_at
    ) VALUES
    (
        'inv-001',
        test_user_id,
        '650e8400-e29b-41d4-a716-446655440001', -- PETR29
        10000.00,
        10,
        1000.00,
        'confirmado',
        NOW(),
        NOW()
    ),
    (
        'inv-002',
        test_user_id,
        '650e8400-e29b-41d4-a716-446655440003', -- AMBV26
        5000.00,
        5,
        1000.00,
        'confirmado',
        NOW(),
        NOW()
    )
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- MENSAGEM DE CONCLUSÃO
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ DEBÊNTURES INSERIDAS COM SUCESSO!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE '📈 Debêntures disponíveis:';
  RAISE NOTICE '';
  RAISE NOTICE '1. PETR29 - Petrobras 2029';
  RAISE NOTICE '   • CDI + 1,5% a.a. (~13,75%)';
  RAISE NOTICE '   • Mínimo: R$ 1.000';
  RAISE NOTICE '   • Rating: BBB+';
  RAISE NOTICE '';
  RAISE NOTICE '2. VALE28 - Vale Verde 2028';
  RAISE NOTICE '   • IPCA + 6% a.a. (~8,5%)';
  RAISE NOTICE '   • Mínimo: R$ 5.000';
  RAISE NOTICE '   • Incentivada (isenta IR)';
  RAISE NOTICE '';
  RAISE NOTICE '3. AMBV26 - Ambev 2026';
  RAISE NOTICE '   • CDI + 0,8% a.a. (~12,5%)';
  RAISE NOTICE '   • Mínimo: R$ 1.000';
  RAISE NOTICE '   • Rating: AAA';
  RAISE NOTICE '';
  RAISE NOTICE '4. ITUB34 - Itaú Subordinada 2034';
  RAISE NOTICE '   • CDI + 2% a.a. (~14,25%)';
  RAISE NOTICE '   • Mínimo: R$ 10.000';
  RAISE NOTICE '   • Rating: AA+';
  RAISE NOTICE '';
  RAISE NOTICE '5. JBSS27 - JBS Sustentável 2027';
  RAISE NOTICE '   • CDI + 1,2% a.a. (~13%)';
  RAISE NOTICE '   • Mínimo: R$ 5.000';
  RAISE NOTICE '   • Projeto ESG';
  RAISE NOTICE '';
  RAISE NOTICE '👤 Usuário de teste criado:';
  RAISE NOTICE '   Email: investidor@imcapital.com';
  RAISE NOTICE '   Saldo: R$ 100.000';
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
END $$;
