const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export type EnvValidationIssue = 'missing' | 'invalid_url' | 'invalid_key';

export function validateSupabaseEnvValues(
  url: string,
  key: string
): { ok: true } | { ok: false; issue: EnvValidationIssue } {
  if (!url || !key) {
    return { ok: false, issue: 'missing' };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return { ok: false, issue: 'invalid_url' };
    }
  } catch {
    return { ok: false, issue: 'invalid_url' };
  }

  if (key.length < 20) {
    return { ok: false, issue: 'invalid_key' };
  }

  return { ok: true };
}

export function validateSupabaseEnv(): { ok: true } | { ok: false; issue: EnvValidationIssue } {
  return validateSupabaseEnvValues(supabaseUrl, supabaseAnonKey);
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const isSupabaseEnvValid = isSupabaseConfigured && validateSupabaseEnv().ok;

export function getSupabaseConfigMessage(issue?: EnvValidationIssue): string {
  if (issue === 'invalid_url') {
    return 'VITE_SUPABASE_URL must be a valid https:// URL (check Project Settings → API in Supabase).';
  }
  if (issue === 'invalid_key') {
    return 'VITE_SUPABASE_ANON_KEY looks too short — use the anon public key from Supabase → Project Settings → API.';
  }

  if (import.meta.env.PROD) {
    return 'Videos are unavailable: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your host (e.g. Vercel → Environment Variables), then redeploy.';
  }

  return 'Videos need Supabase: copy .env.example to .env, add your project URL and anon key, then restart the dev server.';
}

export function getSupabaseEnvBannerMessage(): string | null {
  if (!isSupabaseConfigured) {
    return getSupabaseConfigMessage('missing');
  }
  const validation = validateSupabaseEnv();
  if (!validation.ok) {
    return getSupabaseConfigMessage(validation.issue);
  }
  return null;
}
