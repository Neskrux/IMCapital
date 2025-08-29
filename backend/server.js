const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));

// Para webhooks do Stripe, precisamos do raw body
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stripe: !!process.env.STRIPE_SECRET_KEY,
    supabase: !!process.env.SUPABASE_URL
  });
});

// Criar PIX Payment com Stripe
app.post('/api/payments/pix', async (req, res) => {
  try {
    const { amount, userId, userEmail, description } = req.body;

    if (!amount || amount < 10) {
      return res.status(400).json({ 
        error: 'Valor mínimo é R$ 10,00' 
      });
    }

    // Criar Payment Intent com PIX no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'brl',
      payment_method_types: ['pix'],
      description: description || `Depósito IMCapital - ${new Date().toLocaleDateString('pt-BR')}`,
      receipt_email: userEmail,
      metadata: {
        user_id: userId,
        type: 'deposit'
      }
    });

    // Salvar transação no Supabase
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        id: uuidv4(),
        user_id: userId,
        amount: amount,
        payment_method: 'pix',
        status: 'pending',
        provider: 'stripe',
        provider_payment_id: paymentIntent.id,
        metadata: {
          client_secret: paymentIntent.client_secret
        }
      });

    if (dbError) {
      console.error('Erro ao salvar transação:', dbError);
    }

    // Retornar dados do PIX
    res.json({
      success: true,
      payment: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: amount
      }
    });

  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      details: error.message 
    });
  }
});

// Criar Card Payment com Stripe
app.post('/api/payments/card', async (req, res) => {
  try {
    const { amount, userId, userEmail, description } = req.body;

    if (!amount || amount < 10) {
      return res.status(400).json({ 
        error: 'Valor mínimo é R$ 10,00' 
      });
    }

    // Criar Payment Intent para cartão
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'brl',
      payment_method_types: ['card'],
      description: description || `Depósito IMCapital - ${new Date().toLocaleDateString('pt-BR')}`,
      receipt_email: userEmail,
      metadata: {
        user_id: userId,
        type: 'deposit'
      }
    });

    // Salvar transação no Supabase
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        id: uuidv4(),
        user_id: userId,
        amount: amount,
        payment_method: 'card',
        status: 'pending',
        provider: 'stripe',
        provider_payment_id: paymentIntent.id,
        metadata: {
          client_secret: paymentIntent.client_secret
        }
      });

    if (dbError) {
      console.error('Erro ao salvar transação:', dbError);
    }

    res.json({
      success: true,
      payment: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: amount
      }
    });

  } catch (error) {
    console.error('Erro ao criar pagamento com cartão:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      details: error.message 
    });
  }
});

// Confirmar pagamento PIX
app.post('/api/payments/:paymentIntentId/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method_types: ['pix']
    });

    res.json({
      success: true,
      payment: paymentIntent
    });

  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).json({ 
      error: 'Erro ao confirmar pagamento',
      details: error.message 
    });
  }
});

// Verificar status do pagamento
app.get('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Converter de centavos
      payment_method: paymentIntent.payment_method_types[0]
    });

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

// Webhook do Stripe
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erro na validação do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Buscar transação no banco
      const { data: transaction, error: fetchError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('provider_payment_id', paymentIntent.id)
        .single();

      if (fetchError) {
        console.error('Transação não encontrada:', fetchError);
        break;
      }

      // Atualizar status da transação
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      // Atualizar saldo do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', transaction.user_id)
        .single();

      const newBalance = (profile?.balance || 0) + transaction.amount;

      await supabase
        .from('profiles')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.user_id);

      console.log(`✅ Pagamento aprovado: ${paymentIntent.id} - Usuário: ${transaction.user_id} - Valor: R$ ${transaction.amount}`);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('provider_payment_id', failedPayment.id);
      
      console.log(`❌ Pagamento falhou: ${failedPayment.id}`);
      break;

    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  res.json({ received: true });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💳 Stripe configurado: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`🗄️  Supabase configurado: ${!!process.env.SUPABASE_URL}`);
});