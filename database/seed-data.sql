-- ====================================================
-- DADOS DE TESTE REALISTAS - IMCAPITAL
-- ====================================================
-- 
-- INSTRUÇÕES:
-- 1. Execute após schema principal, storage e admin
-- 2. Popula com dados realistas para desenvolvimento
-- 3. NUNCA execute em produção!
-- 
-- ====================================================

-- ====================================================
-- 1. EMPRESAS ADICIONAIS
-- ====================================================

INSERT INTO companies (name, cnpj, sector, description, founded_year, employees_count, annual_revenue, market, website, logo_url, highlights, certifications) VALUES

-- Setor Financeiro
('Banco Futuro SA', '15.987.654/0001-32', 'Financeiro', 'Banco digital focado em soluções inovadoras para empresas e pessoas físicas.', 2018, '2.300+', 'R$ 890 milhões', 'Serviços Financeiros Digitais', 'www.bancofuturo.com.br', 'https://via.placeholder.com/200x100/3b82f6/ffffff?text=Banco+Futuro',
 '["100% digital", "Crescimento de 200% ao ano", "5 milhões de clientes", "Autorização do Banco Central"]'::jsonb,
 '["ISO 27001", "PCI DSS", "Certificação FEBRABAN"]'::jsonb),

-- Setor Imobiliário
('Construir Desenvolvimento', '22.456.789/0001-85', 'Imobiliário', 'Construtora e incorporadora com foco em empreendimentos sustentáveis e inovadores.', 2008, '1.800+', 'R$ 1.2 bilhões', 'Construção e Incorporação', 'www.construirdev.com.br', 'https://via.placeholder.com/200x100/f59e0b/ffffff?text=Construir',
 '["20 empreendimentos entregues", "Certificação LEED", "Presença em 8 cidades", "VGV de R$ 3 bilhões"]'::jsonb,
 '["ISO 9001", "PBQP-H", "Green Building Council"]'::jsonb),

-- Setor Tecnologia
('TechSolutions Brasil', '33.789.456/0001-27', 'Tecnologia', 'Empresa de desenvolvimento de software e soluções em nuvem para grandes corporações.', 2015, '850+', 'R$ 320 milhões', 'Tecnologia da Informação', 'www.techsolutions.com.br', 'https://via.placeholder.com/200x100/8b5cf6/ffffff?text=TechSolutions',
 '["Clientes Fortune 500", "Crescimento 150% ao ano", "Escritórios em 5 países", "300 produtos desenvolvidos"]'::jsonb,
 '["ISO 27001", "CMMI Nível 5", "Microsoft Gold Partner"]'::jsonb),

-- Setor Logística
('LogFast Transportes', '44.123.789/0001-63', 'Logística', 'Empresa de logística integrada com foco em e-commerce e distribuição nacional.', 2012, '4.200+', 'R$ 780 milhões', 'Logística e Distribuição', 'www.logfast.com.br', 'https://via.placeholder.com/200x100/10b981/ffffff?text=LogFast',
 '["Cobertura nacional", "1 milhão de entregas/mês", "Frota própria de 800 veículos", "Centro de distribuição robotizado"]'::jsonb,
 '["ISO 14001", "ANTT", "Certificação IATA"]'::jsonb),

-- Setor Saúde
('MedTech Inovação', '55.654.321/0001-74', 'Saúde', 'Empresa de tecnologia médica especializada em dispositivos e softwares para hospitais.', 2017, '680+', 'R$ 245 milhões', 'Tecnologia Médica', 'www.medtech.com.br', 'https://via.placeholder.com/200x100/ef4444/ffffff?text=MedTech',
 '["Produtos em 200 hospitais", "3 patentes internacionais", "Aprovação FDA", "Redução 40% custos hospitalares"]'::jsonb,
 '["ISO 13485", "ANVISA", "FDA", "CE Mark"]'::jsonb)

ON CONFLICT (cnpj) DO NOTHING;

-- ====================================================
-- 2. DEBÊNTURES ADICIONAIS
-- ====================================================

DO $$
DECLARE
  banco_id UUID;
  construir_id UUID;
  tech_id UUID;
  log_id UUID;
  med_id UUID;
BEGIN
  -- Obter IDs das novas empresas
  SELECT id INTO banco_id FROM companies WHERE name = 'Banco Futuro SA';
  SELECT id INTO construir_id FROM companies WHERE name = 'Construir Desenvolvimento';
  SELECT id INTO tech_id FROM companies WHERE name = 'TechSolutions Brasil';
  SELECT id INTO log_id FROM companies WHERE name = 'LogFast Transportes';
  SELECT id INTO med_id FROM companies WHERE name = 'MedTech Inovação';
  
  -- Inserir debêntures
  INSERT INTO debentures (
    company_id, name, code, type, total_amount, available_amount, min_investment, unit_price,
    annual_return_percentage, return_description, issue_date, maturity_date, payment_frequency,
    rating, risk_level, features, guarantees
  ) VALUES
  
  -- Banco Futuro
  (
    banco_id, 'Debênture Digital Banco Futuro', 'BF001', 'simples', 50000000.00, 35000000.00, 25000.00, 1000.00,
    4.2, 'CDI + 4.2%', '2024-01-10', '2026-01-10', 'Trimestral',
    'A+', 'medio', 
    '["Setor em crescimento", "Liquidez trimestral", "Garantia bancária"]'::jsonb,
    '["Garantia corporativa", "Coobrigação de controladas", "Seguro de crédito"]'::jsonb
  ),
  
  -- Construir
  (
    construir_id, 'Debênture Imobiliária Construir', 'CD001', 'incentivada', 25000000.00, 18000000.00, 10000.00, 1000.00,
    3.8, 'CDI + 3.8%', '2024-02-15', '2030-02-15', 'Semestral',
    'A', 'medio',
    '["Isenção de IR", "Setor aquecido", "Garantia real"]'::jsonb,
    '["Garantia real sobre imóveis", "Fiança bancária", "Seguro garantia obra"]'::jsonb
  ),
  
  -- TechSolutions
  (
    tech_id, 'Debênture Inovação TechSolutions', 'TS001', 'simples', 15000000.00, 12000000.00, 5000.00, 1000.00,
    5.5, 'CDI + 5.5%', '2024-03-01', '2027-03-01', 'Semestral',
    'BBB+', 'alto',
    '["Alta rentabilidade", "Setor tecnologia", "Crescimento exponencial"]'::jsonb,
    '["Garantia patrimonial", "Aval dos sócios", "Seguro de responsabilidade"]'::jsonb
  ),
  
  -- LogFast
  (
    log_id, 'Debênture Logística LogFast', 'LF001', 'simples', 35000000.00, 20000000.00, 15000.00, 1000.00,
    3.2, 'CDI + 3.2%', '2024-01-20', '2028-01-20', 'Anual',
    'AA-', 'baixo',
    '["Setor essencial", "Demanda crescente", "Contratos de longo prazo"]'::jsonb,
    '["Garantia sobre frota", "Recebíveis como garantia", "Seguro de frota"]'::jsonb
  ),
  
  -- MedTech
  (
    med_id, 'Debênture Saúde MedTech', 'MT001', 'incentivada', 12000000.00, 8000000.00, 8000.00, 1000.00,
    2.8, 'CDI + 2.8%', '2024-04-01', '2029-04-01', 'Anual',
    'A-', 'medio',
    '["Isenção de IR", "Setor saúde", "Produtos inovadores", "Mercado internacional"]'::jsonb,
    '["Patentes como garantia", "Seguro de responsabilidade", "Garantia corporativa"]'::jsonb
  );
  
END $$;

-- ====================================================
-- 3. USUÁRIOS DE TESTE
-- ====================================================

-- Esta parte será executada automaticamente quando usuários se registrarem
-- Mas podemos criar alguns perfis de exemplo para testes

-- Inserir alguns perfis de exemplo (sem senhas, apenas para demonstração)
INSERT INTO profiles (id, email, full_name, cpf, balance, total_invested, investor_profile, is_verified, is_active) VALUES
(uuid_generate_v4(), 'maria.silva@email.com', 'Maria Silva Santos', '123.456.789-01', 75000.00, 50000.00, 'moderado', true, true),
(uuid_generate_v4(), 'joao.oliveira@email.com', 'João Oliveira Costa', '234.567.890-12', 120000.00, 85000.00, 'arrojado', true, true),
(uuid_generate_v4(), 'ana.pereira@email.com', 'Ana Pereira Lima', '345.678.901-23', 45000.00, 25000.00, 'conservador', true, true),
(uuid_generate_v4(), 'carlos.santos@email.com', 'Carlos Santos Almeida', '456.789.012-34', 200000.00, 150000.00, 'arrojado', true, true),
(uuid_generate_v4(), 'lucia.costa@email.com', 'Lúcia Costa Ferreira', '567.890.123-45', 60000.00, 35000.00, 'moderado', true, true)
ON CONFLICT (email) DO NOTHING;

-- ====================================================
-- 4. TRANSAÇÕES DE EXEMPLO
-- ====================================================

-- Inserir algumas transações de exemplo para os usuários
DO $$
DECLARE
  user_rec RECORD;
BEGIN
  FOR user_rec IN SELECT id FROM profiles WHERE email LIKE '%@email.com' LOOP
    -- Depósitos
    INSERT INTO transactions (user_id, type, amount, description, status, processed_at) VALUES
    (user_rec.id, 'deposito', 10000.00, 'Depósito inicial via PIX', 'completed', NOW() - INTERVAL '30 days'),
    (user_rec.id, 'deposito', 25000.00, 'Transferência bancária', 'completed', NOW() - INTERVAL '15 days'),
    (user_rec.id, 'deposito', 15000.00, 'Depósito via TED', 'completed', NOW() - INTERVAL '5 days');
    
    -- Algumas taxas
    INSERT INTO transactions (user_id, type, amount, description, status, processed_at) VALUES
    (user_rec.id, 'taxa', 15.00, 'Taxa de manutenção mensal', 'completed', NOW() - INTERVAL '30 days');
  END LOOP;
END $$;

-- ====================================================
-- 5. INVESTIMENTOS DE EXEMPLO
-- ====================================================

-- Criar alguns investimentos para simular atividade
DO $$
DECLARE
  user_rec RECORD;
  debenture_rec RECORD;
  investment_amount DECIMAL;
BEGIN
  -- Para cada usuário de teste
  FOR user_rec IN SELECT id FROM profiles WHERE email LIKE '%@email.com' LOOP
    
    -- Criar 1-3 investimentos aleatórios
    FOR debenture_rec IN 
      SELECT id, min_investment 
      FROM debentures 
      WHERE available_amount > 0 
      ORDER BY RANDOM() 
      LIMIT (1 + FLOOR(RANDOM() * 3)::INT)
    LOOP
      
      investment_amount := debenture_rec.min_investment * (1 + FLOOR(RANDOM() * 5));
      
      INSERT INTO investments (
        investor_id, debenture_id, amount, units, unit_price, status, 
        invested_at, confirmed_at
      ) VALUES (
        user_rec.id, 
        debenture_rec.id, 
        investment_amount,
        (investment_amount / 1000)::INT,
        1000.00,
        'confirmado',
        NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30),
        NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 29)
      );
      
      -- Atualizar debênture disponível
      UPDATE debentures 
      SET available_amount = available_amount - investment_amount 
      WHERE id = debenture_rec.id;
      
    END LOOP;
  END LOOP;
END $$;

-- ====================================================
-- 6. NOTIFICAÇÕES DE EXEMPLO
-- ====================================================

-- Inserir notificações para os usuários de teste
DO $$
DECLARE
  user_rec RECORD;
BEGIN
  FOR user_rec IN SELECT id FROM profiles WHERE email LIKE '%@email.com' LOOP
    INSERT INTO notifications (user_id, title, message, type, created_at) VALUES
    (user_rec.id, 'Bem-vindo à IMCapital!', 'Sua conta foi criada com sucesso. Comece investindo em debêntures selecionadas.', 'success', NOW() - INTERVAL '30 days'),
    (user_rec.id, 'Investimento Confirmado', 'Seu investimento foi confirmado e já está gerando rendimentos.', 'success', NOW() - INTERVAL '15 days'),
    (user_rec.id, 'Nova Oportunidade', 'Uma nova debênture com rentabilidade de CDI + 4.5% está disponível.', 'info', NOW() - INTERVAL '3 days'),
    (user_rec.id, 'Rendimento Creditado', 'O rendimento do seu investimento foi creditado em sua conta.', 'success', NOW() - INTERVAL '1 day');
  END LOOP;
END $$;

-- ====================================================
-- 7. DOCUMENTOS DE EXEMPLO
-- ====================================================

-- Simular alguns documentos enviados
DO $$
DECLARE
  user_rec RECORD;
BEGIN
  FOR user_rec IN SELECT id FROM profiles WHERE email LIKE '%@email.com' LIMIT 3 LOOP
    INSERT INTO documents (user_id, name, type, file_url, verified, verified_at) VALUES
    (user_rec.id, 'RG - Frente e Verso', 'RG', '/storage/documents/' || user_rec.id || '/rg.pdf', true, NOW() - INTERVAL '25 days'),
    (user_rec.id, 'CPF', 'CPF', '/storage/documents/' || user_rec.id || '/cpf.pdf', true, NOW() - INTERVAL '25 days'),
    (user_rec.id, 'Comprovante de Residência', 'Comprovante de Residência', '/storage/documents/' || user_rec.id || '/comprovante.pdf', true, NOW() - INTERVAL '20 days');
  END LOOP;
END $$;

-- ====================================================
-- 8. QUESTIONÁRIOS DE PERFIL
-- ====================================================

-- Inserir questionários preenchidos
DO $$
DECLARE
  user_rec RECORD;
  profile_type investor_profile_type;
  answers_json JSONB;
BEGIN
  FOR user_rec IN SELECT id, investor_profile FROM profiles WHERE email LIKE '%@email.com' LOOP
    
    -- Criar respostas baseadas no perfil
    CASE user_rec.investor_profile
      WHEN 'conservador' THEN
        answers_json := '{
          "experiencia": "iniciante",
          "objetivo": "preservacao",
          "prazo": "curto",
          "risco": "baixo",
          "percentual_renda": "ate_30",
          "conhecimento_mercado": "basico",
          "reacao_perdas": "muito_conservador"
        }'::jsonb;
      WHEN 'moderado' THEN
        answers_json := '{
          "experiencia": "intermediario",
          "objetivo": "crescimento_moderado",
          "prazo": "medio",
          "risco": "medio",
          "percentual_renda": "ate_50",
          "conhecimento_mercado": "intermediario",
          "reacao_perdas": "moderado"
        }'::jsonb;
      ELSE
        answers_json := '{
          "experiencia": "avancado",
          "objetivo": "crescimento_agressivo",
          "prazo": "longo",
          "risco": "alto",
          "percentual_renda": "acima_50",
          "conhecimento_mercado": "avancado",
          "reacao_perdas": "arrojado"
        }'::jsonb;
    END CASE;
    
    INSERT INTO investor_questionnaires (user_id, answers, score, result_profile, completed_at) VALUES
    (user_rec.id, answers_json, 
     CASE user_rec.investor_profile 
       WHEN 'conservador' THEN 25
       WHEN 'moderado' THEN 55
       ELSE 85
     END,
     user_rec.investor_profile,
     NOW() - INTERVAL '20 days'
    );
  END LOOP;
END $$;

-- ====================================================
-- 9. ATUALIZAR ESTATÍSTICAS
-- ====================================================

-- Atualizar saldos dos perfis baseado nos investimentos
UPDATE profiles SET 
  total_invested = COALESCE((
    SELECT SUM(amount) 
    FROM investments 
    WHERE investor_id = profiles.id AND status = 'confirmado'
  ), 0),
  total_earnings = COALESCE((
    SELECT SUM(total_earnings) 
    FROM investments 
    WHERE investor_id = profiles.id AND status = 'confirmado'
  ), 0);

-- Simular alguns rendimentos nos investimentos
UPDATE investments SET 
  total_earnings = ROUND((amount * 0.12 * EXTRACT(days FROM (NOW() - COALESCE(confirmed_at, created_at))) / 365)::NUMERIC, 2),
  current_value = amount + ROUND((amount * 0.12 * EXTRACT(days FROM (NOW() - COALESCE(confirmed_at, created_at))) / 365)::NUMERIC, 2)
WHERE status = 'confirmado';

-- ====================================================
-- 10. VERIFICAÇÃO FINAL
-- ====================================================

-- Mostrar estatísticas dos dados criados
SELECT 
  'Dados de teste inseridos com sucesso!' as status,
  (SELECT COUNT(*) FROM companies) as total_empresas,
  (SELECT COUNT(*) FROM debentures) as total_debentures,
  (SELECT COUNT(*) FROM profiles WHERE email LIKE '%@email.com') as usuarios_teste,
  (SELECT COUNT(*) FROM investments) as total_investimentos,
  (SELECT COUNT(*) FROM transactions) as total_transacoes,
  (SELECT COUNT(*) FROM notifications) as total_notificacoes;

-- ====================================================
-- FIM DOS DADOS DE TESTE
-- ====================================================
