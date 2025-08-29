-- Script simples para criar perfil após criar usuário na interface
-- Execute DEPOIS de criar o usuário via Authentication > Users

-- Verificar se existe usuário com email teste@imcapital.com
SELECT id, email FROM auth.users WHERE email = 'teste@imcapital.com';

-- Se retornar um ID, então use este script para criar o perfil:
-- (substitua o ID abaixo pelo ID real que apareceu na consulta acima)

-- Exemplo de insert (você precisa pegar o ID real):
-- INSERT INTO profiles (
--     id,
--     email,
--     full_name,
--     balance,
--     total_invested,
--     total_earnings,
--     investor_profile,
--     is_active,
--     is_verified
-- ) VALUES (
--     'ID_REAL_DO_USUARIO_AQUI',
--     'teste@imcapital.com',
--     'Usuário Teste',
--     100000.00,
--     0.00,
--     0.00,
--     'moderado',
--     true,
--     true
-- );
