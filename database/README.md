# 🗄️ Database Setup - IMCapital

Este diretório contém todos os scripts SQL necessários para configurar completamente o banco de dados do IMCapital no Supabase.

## 📋 Ordem de Execução

Execute os scripts na seguinte ordem:

### 1️⃣ **Schema Principal** (OBRIGATÓRIO)
```sql
-- Arquivo: supabase-schema.sql
-- Descrição: Cria todas as tabelas, funções, triggers e políticas RLS
-- Tempo estimado: 2-3 minutos
```

### 2️⃣ **Storage** (OBRIGATÓRIO)
```sql
-- Arquivo: storage-setup.sql
-- Descrição: Configura buckets e políticas para upload de arquivos
-- Tempo estimado: 1 minuto
```

### 3️⃣ **Configuração Admin** (RECOMENDADO)
```sql
-- Arquivo: admin-setup.sql
-- Descrição: Adiciona funcionalidades administrativas e relatórios
-- Tempo estimado: 1 minuto
```

### 4️⃣ **Dados de Teste** (OPCIONAL - APENAS DESENVOLVIMENTO)
```sql
-- Arquivo: seed-data.sql
-- Descrição: Popula com dados realistas para desenvolvimento
-- ⚠️ NUNCA execute em produção!
-- Tempo estimado: 1 minuto
```

## 🚀 Como Executar

### No Supabase Dashboard:

1. **Acesse seu projeto** no [Supabase](https://app.supabase.com)
2. **Vá para SQL Editor** (ícone terminal na sidebar)
3. **Clique em "New Query"**
4. **Cole o conteúdo** de cada arquivo na ordem
5. **Clique em "Run"** ou pressione `Ctrl+Enter`

### Via CLI do Supabase:

```bash
# 1. Schema principal
supabase db reset --local
cat database/supabase-schema.sql | supabase db push --local

# 2. Storage
cat database/storage-setup.sql | supabase db push --local

# 3. Admin (opcional)
cat database/admin-setup.sql | supabase db push --local

# 4. Dados de teste (opcional)
cat database/seed-data.sql | supabase db push --local
```

## 📊 O que será criado

### 🏗️ **Tabelas Principais**
- `profiles` - Perfis de usuários
- `companies` - Empresas emissoras
- `debentures` - Debêntures disponíveis
- `investments` - Investimentos realizados
- `transactions` - Histórico financeiro
- `earnings` - Rendimentos
- `notifications` - Sistema de notificações
- `documents` - Documentos dos usuários
- `investor_questionnaires` - Questionários de perfil
- `admin_logs` - Logs de auditoria

### 📁 **Storage Buckets**
- `avatars` - Fotos de perfil (público)
- `documents` - Documentos pessoais (privado)
- `company-logos` - Logos das empresas (público)
- `debenture-docs` - Documentos das debêntures (privado)

### 👤 **Sistema Administrativo**
- Níveis de permissão
- Dashboard com métricas
- Relatórios automáticos
- Logs de auditoria
- Views para análise

### 🔒 **Segurança**
- Row Level Security (RLS) em todas as tabelas
- Políticas de acesso granulares
- Triggers automáticos
- Validações de dados

## 🧪 Dados de Teste Incluídos

Após executar `seed-data.sql`, você terá:

- **8 empresas** de setores diversos
- **8 debêntures** com diferentes características
- **5 usuários** de exemplo com perfis variados
- **Investimentos** simulados
- **Transações** de exemplo
- **Notificações** demonstrativas

### 👥 Usuários de Teste:
- `maria.silva@email.com` - Perfil Moderado
- `joao.oliveira@email.com` - Perfil Arrojado
- `ana.pereira@email.com` - Perfil Conservador
- `carlos.santos@email.com` - Perfil Arrojado
- `lucia.costa@email.com` - Perfil Moderado

## 🔧 Configurações Pós-Setup

### 1. Criar Primeiro Admin
```sql
-- Substitua pelo seu email
SELECT promote_to_admin('admin@imcapital.com.br');
```

### 2. Verificar Configuração
```sql
-- Dashboard administrativo
SELECT * FROM admin_dashboard;

-- Estatísticas de storage
SELECT * FROM storage_stats;

-- Verificar RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 3. Testar Funcionalidades
```sql
-- Listar debêntures ativas
SELECT d.name, c.name as empresa, d.return_description 
FROM debentures d 
JOIN companies c ON d.company_id = c.id 
WHERE d.status = 'ativa';

-- Ver investimentos recentes
SELECT * FROM admin_recent_investments LIMIT 5;
```

## 📈 Views Úteis Criadas

- `investment_summary` - Resumo de investimentos por usuário
- `portfolio_performance` - Performance do portfólio
- `admin_dashboard` - Dashboard administrativo
- `admin_top_users` - Usuários mais ativos
- `admin_recent_investments` - Investimentos recentes
- `admin_suspicious_transactions` - Transações suspeitas
- `user_files` - Arquivos por usuário
- `storage_stats` - Estatísticas de storage

## 🛠️ Funções Úteis

- `is_admin(user_id)` - Verifica se usuário é admin
- `has_admin_level(level, user_id)` - Verifica nível administrativo
- `has_permission(permission, user_id)` - Verifica permissão específica
- `promote_to_admin(email)` - Promove usuário a admin
- `admin_performance_report(start, end)` - Relatório de performance
- `generate_unique_filename()` - Gera nome único para arquivos
- `validate_file_type()` - Valida tipo de arquivo

## ⚠️ Importantes

### ✅ **Para Desenvolvimento:**
- Execute todos os scripts na ordem
- Use dados de teste para desenvolvimento
- Configure um usuário admin

### 🚨 **Para Produção:**
- **NÃO** execute `seed-data.sql`
- Configure backups automáticos
- Monitore logs de auditoria
- Configure alertas de segurança

### 🔐 **Segurança:**
- Todas as tabelas têm RLS habilitado
- Usuários só acessam seus próprios dados
- Admins têm acesso controlado por níveis
- Logs de auditoria para ações sensíveis

## 📞 Suporte

- **Documentação Supabase**: https://supabase.com/docs
- **SQL Reference**: https://supabase.com/docs/guides/database
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security

---

**🎯 Desenvolvido para IMCapital - Sistema completo de gestão de debêntures**
