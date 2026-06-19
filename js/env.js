// js/env.js — variáveis públicas de configuração
// ATENÇÃO: substitua os valores com as credenciais do seu projeto antes do deploy
// Essas chaves são PÚBLICAS (anon key e publishable key são seguras para o browser)
window.OAB_ENV = {
  SUPABASE_URL:           'https://SEU-PROJETO.supabase.co',
  SUPABASE_ANON_KEY:      'sua-anon-key-aqui',
  STRIPE_PUBLISHABLE_KEY: 'pk_live_xxx',
  // Preços Stripe (IDs dos products/prices criados no painel Stripe)
  STRIPE_PRICE_MENSAL:      'price_xxx_mensal',
  STRIPE_PRICE_TRIMESTRAL:  'price_xxx_trimestral',
  STRIPE_PRICE_SEMESTRAL:   'price_xxx_semestral',
};
