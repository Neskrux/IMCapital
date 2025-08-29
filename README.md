# 🏛️ IMCapital - Plataforma de Investimentos

> **Plataforma completa de investimentos em debêntures com PIX real, design minimalista e tecnologia moderna.**

[![Deploy na Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Neskrux/IMCapital)

---

## ✨ Características

### 💰 **Sistema Financeiro Completo**
- 🏦 **PIX Real** via Stripe com QR codes funcionais
- 💳 **Cartão de Crédito** com processamento seguro
- 📊 **Dashboard** com gráficos em tempo real
- 💼 **Carteira Digital** com histórico completo
- 📈 **Investimentos** em debêntures reais

### 🎨 **Design Profissional**
- 🌙 **Dark & Gold Theme** minimalista
- 📱 **Responsivo** para todos dispositivos
- ⚡ **Performance** otimizada
- 🎯 **UX/UI** focada no usuário

### 🔒 **Segurança Enterprise**
- 🔐 **Autenticação** via Supabase
- 🛡️ **Row Level Security** no banco
- 🔑 **JWT Tokens** seguros
- 🌐 **HTTPS** obrigatório

---

## 🚀 Deploy Rápido

### **1️⃣ Clone & Deploy**
```bash
git clone https://github.com/Neskrux/IMCapital.git
cd IMCapital
```

### **2️⃣ Deploy na Vercel**
1. Conecte seu repositório na [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático! 🎉

📖 **[Guia Completo de Deploy](./DEPLOY_VERCEL.md)**

---

## 🛠️ Stack Tecnológica

### **Frontend**
- ⚛️ **React 18** + TypeScript
- ⚡ **Vite** para build otimizado
- 🎨 **CSS Modules** customizado
- 📊 **Charts.js** para gráficos

### **Backend**
- 🟢 **Node.js** + Express
- 💳 **Stripe** para pagamentos
- 🗄️ **Supabase** (PostgreSQL)
- 🔄 **Webhooks** em tempo real

### **Infraestrutura**
- 🌐 **Vercel** (Frontend + API)
- 🏗️ **Supabase** (Database + Auth)
- 💰 **Stripe** (Payments + PIX)

---

## 📁 Estrutura do Projeto

```
IMCapital/
├── 🎨 frontend/          # React + TypeScript
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── contexts/     # Context API (Auth)
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # APIs e serviços
│   │   └── lib/          # Configurações
│   └── dist/             # Build de produção
├── 🔧 backend/           # Node.js API
│   ├── server.js         # Servidor Express
│   └── package.json      # Dependências backend
├── 🗄️ database/          # Scripts SQL
│   ├── supabase-schema.sql
│   └── seed-data.sql
├── 📋 vercel.json        # Configuração Vercel
└── 📖 docs/              # Documentação
```

---

## 🔧 Desenvolvimento Local

### **Pré-requisitos**
- Node.js 18+
- Conta Supabase
- Conta Stripe

### **Instalação**
```bash
# Instalar todas as dependências
npm run install:all

# Configurar variáveis de ambiente
cp frontend/.env.example frontend/.env.local
# Edite o .env.local com suas credenciais

# Rodar em desenvolvimento
npm run dev
```

### **URLs Locais**
- Frontend: http://localhost:5174
- Backend: http://localhost:3001

---

## 💳 Configuração de Pagamentos

### **PIX via Stripe**
1. Configure sua conta Stripe Brasil
2. Obtenha as chaves API
3. Configure webhook para confirmações
4. PIX funcionando! 🎉

### **Cartão de Crédito**
- Processamento via Stripe
- Suporte a todos cartões
- 3D Secure automático
- Webhooks de confirmação

📖 **[Guia de Configuração PIX](./CONFIGURACAO_PIX_REAL.md)**

---

## 📊 Funcionalidades

### **Para Investidores**
- ✅ Cadastro e autenticação
- ✅ Perfil de risco personalizado
- ✅ Dashboard com portfolio
- ✅ Investimentos em debêntures
- ✅ Carteira com PIX/Cartão
- ✅ Histórico de transações

### **Para Empresas**
- ✅ Cadastro de debêntures
- ✅ Upload de documentos
- ✅ Gestão de ofertas
- ✅ Relatórios financeiros

---

## 🎯 Roadmap

### **✅ Concluído**
- [x] Sistema de autenticação
- [x] Pagamentos PIX + Cartão
- [x] Dashboard interativo
- [x] Design minimalista
- [x] Deploy na Vercel

### **🚧 Em Desenvolvimento**
- [ ] App Mobile (React Native)
- [ ] Notificações push
- [ ] Relatórios avançados
- [ ] API para terceiros

### **📋 Planejado**
- [ ] Marketplace de investimentos
- [ ] IA para recomendações
- [ ] Programa de afiliados
- [ ] Multi-idiomas

---

## 📈 Performance

- ⚡ **Lighthouse Score:** 95+
- 🚀 **First Paint:** < 1.5s
- 📱 **Mobile Optimized:** 100%
- 🌐 **CDN Global:** Vercel Edge
- 🔄 **API Response:** < 200ms

---

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
3. **Commit** suas mudanças: `git commit -m 'Add nova funcionalidade'`
4. **Push** para a branch: `git push origin feature/nova-funcionalidade`
5. **Abra** um Pull Request

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE](./LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Desenvolvido por [Neskrux](https://github.com/Neskrux)**

- 🌐 Website: [Em breve]
- 💼 LinkedIn: [Em breve]
- 📧 Email: [Em breve]

---

## 🙏 Agradecimentos

- **Supabase** - Database e Auth
- **Stripe** - Pagamentos PIX/Cartão
- **Vercel** - Deploy e hosting
- **React Community** - Ferramentas incríveis

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

[![GitHub stars](https://img.shields.io/github/stars/Neskrux/IMCapital?style=social)](https://github.com/Neskrux/IMCapital/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Neskrux/IMCapital?style=social)](https://github.com/Neskrux/IMCapital/network)

**Feito com 💛 para revolucionar investimentos no Brasil**

</div>
