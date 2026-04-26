import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config.js';

export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
  };
}
