import Stripe from 'stripe';

// Stripe é opcional — só inicializa se a chave existir
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
