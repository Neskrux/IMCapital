-- Criar usuário de teste diretamente no profiles
-- (O usuário precisa ser criado via Authentication do Supabase primeiro)

-- Inserir perfil de teste caso não exista
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
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'teste@imcapital.com',
    'Usuário Teste',
    100000.00,
    0.00,
    0.00,
    'moderado',
    true,
    true
) ON CONFLICT (id) DO UPDATE SET
    balance = 100000.00,
    full_name = 'Usuário Teste',
    email = 'teste@imcapital.com';

SELECT 'Usuário de teste criado/atualizado!' AS resultado;
