import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe (substituir pela sua chave real)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export default stripePromise;
