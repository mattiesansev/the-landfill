import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — backend calls will fail.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Ensure user has an anonymous session.
// Call this once at app startup; resolves to the user object.
let authPromise = null;
export function ensureAnonymousUser() {
  if (authPromise) return authPromise;

  authPromise = (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw new Error('Anonymous sign-in failed: ' + error.message);
    return data.user;
  })();

  return authPromise;
}

// Get the current user's ID (must call ensureAnonymousUser first)
export async function getUserId() {
  const user = await ensureAnonymousUser();
  return user.id;
}
