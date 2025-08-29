-- Inserir debêntures básicas
INSERT INTO debentures (
    id,
    company_id,
    name,
    code,
    type,
    total_amount,
    available_amount,
    min_investment,
    unit_price,
    annual_return_percentage,
    return_description,
    issue_date,
    maturity_date,
    risk_level
) VALUES
(
    '650e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Petrobras 2029',
    'PETR29',
    'simples',
    50000000,
    45000000,
    1000,
    1000,
    13.75,
    'CDI + 1.5%',
    '2024-01-01',
    '2029-01-01',
    'medio'
),
(
    '650e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'Vale Verde 2028',
    'VALE28',
    'incentivada',
    100000000,
    90000000,
    5000,
    1000,
    8.50,
    'IPCA + 6%',
    '2024-03-01',
    '2028-03-01',
    'baixo'
);

SELECT 'Sucesso!' AS resultado;
