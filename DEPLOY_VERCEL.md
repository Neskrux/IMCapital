# 🚀 Deploy IMCapital na Vercel - Fullstack

## 📋 Pré-requisitos

1. **Conta na Vercel** (https://vercel.com)
2. **Repositório GitHub** conectado
3. **Credenciais configuradas** (Stripe + Supabase)

---

## 🚀 Passo a Passo

### 1️⃣ Conectar Repositório na Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique em **"New Project"**
3. **Import** o repositório: `Neskrux/IMCapital`
4. **Framework Preset:** Vite
5. **Root Directory:** deixe vazio (/)

### 2️⃣ Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```env
# Supabase
SUPABASE_URL=https://wckbhvszhoeg1xq1jvxt.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_KEY=sua_chave_service_aqui

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# Frontend (para build)
VITE_SUPABASE_URL=https://wckbhvszhoeg1xq1jvxt.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica

# URLs
FRONTEND_URL=https://seu-projeto.vercel.app
BACKEND_URL=https://seu-projeto.vercel.app
```

### 3️⃣ Build Settings

- **Build Command:** `npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `npm run install:all`

### 4️⃣ Deploy!

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. Seu projeto estará live em: `https://seu-projeto.vercel.app`

---

## 🔧 Configurações Pós-Deploy

### 1️⃣ Atualizar Webhook do Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. **Edite seu webhook** ou crie um novo
3. **URL:** `https://seu-projeto.vercel.app/webhooks/stripe`
4. **Eventos:** `payment_intent.succeeded`, `payment_intent.payment_failed`

### 2️⃣ Configurar CORS no Supabase

1. Acesse: https://supabase.com/dashboard
2. Vá em **Settings → API**
3. **CORS origins:** adicione `https://seu-projeto.vercel.app`

### 3️⃣ Testar PIX em Produção

1. Acesse sua URL da Vercel
2. Faça login no sistema
3. Teste um depósito PIX
4. Verifique se o webhook funciona

---

## 📊 Estrutura do Deploy

```
IMCapital/
├── vercel.json          ← Configuração Vercel
├── package.json         ← Scripts fullstack
├── frontend/            ← React build
│   ├── dist/           ← Output do build
│   └── ...
├── backend/            ← API serverless
│   ├── server.js       ← Função Vercel
│   └── ...
└── database/           ← Scripts SQL
```

---

## 🎯 URLs da Aplicação

- **Frontend:** `https://seu-projeto.vercel.app`
- **API:** `https://seu-projeto.vercel.app/api/*`
- **Webhooks:** `https://seu-projeto.vercel.app/webhooks/*`

---

## 🐛 Troubleshooting

### Erro: "Build failed"
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme que o `npm run build` funciona localmente

### Erro: "API not working"
- Verifique se as variáveis de ambiente do backend estão corretas
- Confirme que o webhook do Stripe aponta para a URL da Vercel

### Erro: "CORS"
- Adicione sua URL da Vercel nas configurações CORS do Supabase
- Verifique se `FRONTEND_URL` está correto no backend

---

## ⚡ Performance

- **Frontend:** Servido via CDN global da Vercel
- **Backend:** Funções serverless com cold start ~200ms
- **Database:** Supabase com conexões otimizadas
- **Pagamentos:** Stripe com webhooks em tempo real

---

## 🔒 Segurança

- ✅ **HTTPS** automático
- ✅ **Environment Variables** seguras
- ✅ **Webhook validation** implementada
- ✅ **CORS** configurado
- ✅ **Rate limiting** via Vercel

---

## 💰 Custos

- **Vercel:** Grátis até 100GB bandwidth/mês
- **Supabase:** Grátis até 500MB database
- **Stripe:** 3.99% por transação PIX
- **Total:** ~R$ 0 para começar!

---

## 🎉 Resultado Final

Após o deploy, você terá:

- ✅ **Aplicação fullstack** funcionando
- ✅ **PIX real** com QR codes
- ✅ **Cartão de crédito** funcionando
- ✅ **Dashboard** com dados reais
- ✅ **Autenticação** segura
- ✅ **Design** profissional
- ✅ **Performance** otimizada

**Sua plataforma de investimentos estará LIVE! 🚀**

---

**Desenvolvido com 💛 por IMCapital**
