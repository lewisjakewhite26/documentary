import { describe, expect, it } from 'vitest';
import { validateSupabaseEnvValues } from './env';

describe('validateSupabaseEnvValues', () => {
  const validKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

  it('rejects missing values', () => {
    expect(validateSupabaseEnvValues('', '')).toEqual({ ok: false, issue: 'missing' });
  });

  it('rejects non-https URLs', () => {
    expect(validateSupabaseEnvValues('http://example.com', validKey)).toEqual({
      ok: false,
      issue: 'invalid_url',
    });
  });

  it('rejects malformed URLs', () => {
    expect(validateSupabaseEnvValues('not-a-url', validKey)).toEqual({
      ok: false,
      issue: 'invalid_url',
    });
  });

  it('rejects short keys', () => {
    expect(validateSupabaseEnvValues('https://abc.supabase.co', 'short')).toEqual({
      ok: false,
      issue: 'invalid_key',
    });
  });

  it('accepts valid https URL and key', () => {
    expect(validateSupabaseEnvValues('https://abc.supabase.co', validKey)).toEqual({ ok: true });
  });
});
