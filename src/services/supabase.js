import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO CRÍTICO: Credenciais do Supabase não encontradas! Verifique as variáveis de ambiente na Vercel.')
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      auth: { 
        getSession: () => Promise.resolve({ data: { session: null } }), 
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve()
      },
      from: () => ({ 
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) })
      }),
      rpc: () => Promise.resolve({ data: null, error: null })
    };
