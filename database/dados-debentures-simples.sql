-- ============================================
-- INSERIR DEBÊNTURES SIMPLES - IMCapital
-- ============================================
-- Script simplificado com valores que devem funcionar

-- ============================================
-- DEBÊNTURES (campos essenciais)
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
    risk_level
) VALUES
(
    '650e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001', -- Petrobras
    'Debênture Petrobras 2029',
    'PETR29',
    'simples',
    'ativa', -- Tentando 'ativa' em vez de 'disponivel'
    50000000.00,
    45000000.00,
    1000.00,
    1000.00,
    13.75,
    'CDI + 1,5% ao ano',
    '2024-01-01',
    '2029-01-01',
    'semestral',
    'BBB+',
    'medio'
),
(
    '650e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002', -- Vale
    'Debênture Verde Vale 2028',
    'VALE28',
    'incentivada',
    'ativa',
    100000000.00,
    90000000.00,
    5000.00,
    1000.00,
    8.50,
    'IPCA + 6% ao ano',
    '2024-03-01',
    '2028-03-01',
    'anual',
    'A-',
    'medio'
),
(
    '650e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003', -- Ambev
    'Debênture Ambev 2026',
    'AMBV26',
    'simples',
    'ativa',
    30000000.00,
    28000000.00,
    1000.00,
    1000.00,
    12.50,
    'CDI + 0,8% ao ano',
    '2024-02-01',
    '2026-02-01',
    'trimestral',
    'AAA',
    'baixo'
);

-- ============================================
-- MENSAGEM DE CONCLUSÃO
-- ============================================

-- Inserção concluída com sucesso
SELECT 'Debêntures inseridas com sucesso!' AS resultado;
