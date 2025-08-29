# 🔧 Configurar Backend - PIX Stripe

## 📋 Passo a Passo

### 1️⃣ Criar arquivo `.env` no backend

Crie o arquivo `backend/.env` com o seguinte conteúdo:

```env
# Servidor
PORT=3001

# Supabase (copiar do seu .env.local do frontend)
SUPABASE_URL=https://wckbhvszhoeg1xq1jvxt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indja2JodnN6aG9lZzF4cTFqdnh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4NzI3NDQsImV4cCI6MjA0MDQ0ODc0NH0.TuBa1Zj9k7X8QwY0xH2gJ5kFvL3mN9pR6sC4eD8fA2I
SUPABASE_SERVICE_KEY=SUA_SERVICE_KEY_AQUI

# Stripe (copiar do seu .env.local do frontend)
STRIPE_PUBLISHABLE_KEY=pk_live_SUA_CHAVE_PUBLICA_AQUI
STRIPE_SECRET_KEY=sk_live_SUA_CHAVE_SECRETA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# URLs
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:3001
```

### 2️⃣ Obter SUPABASE_SERVICE_KEY

1. Acesse: https://supabase.com/dashboard
2. Vá no seu projeto IMCapital
3. Settings → API
4. Copie a **service_role key** (não a anon key)

### 3️⃣ Configurar Webhook no Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. URL: `http://localhost:3001/webhooks/stripe`
4. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copie o **Signing secret** (whsec_...)

### 4️⃣ Instalar e Rodar Backend

```bash
cd backend
npm install
npm run dev
```

### 5️⃣ Adicionar VITE_API_URL no frontend

No seu `.env.local` do frontend, adicione:

```env
VITE_API_URL=http://localhost:3001
```

## ✅ Verificar se está funcionando

1. Backend rodando em: http://localhost:3001
2. Teste: http://localhost:3001/health
3. Deve retornar: `{"status":"OK","timestamp":"...","stripe":true,"supabase":true}`

## 🚨 IMPORTANTE

- **NÃO** commite o arquivo `.env`
- **USE** as chaves de **teste** do Stripe primeiro
- **TESTE** com valores pequenos (R$ 10,00)

---

**Depois de configurar, rode o backend e teste o PIX!** 🎉
