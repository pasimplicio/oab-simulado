// js/supabase.js — cliente Supabase para browser
// Requer: js/env.js + CDN @supabase/supabase-js carregados antes
(function () {
  const { createClient } = window.supabase;
  window._supabase = createClient(
    window.OAB_ENV.SUPABASE_URL,
    window.OAB_ENV.SUPABASE_ANON_KEY,
    {
      auth: {
        storageKey:        'oab_auth',
        autoRefreshToken:  true,
        persistSession:    true,
        detectSessionInUrl: true,
      },
    }
  );
})();
