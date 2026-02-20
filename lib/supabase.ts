import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazily-initialized singleton. The client is created the first time any
 * method is accessed at runtime, so the env-var check never runs during the
 * Next.js build phase (where NEXT_PUBLIC_* vars may not be injected yet).
 */
function makeLazyClient(): SupabaseClient {
  let _client: SupabaseClient | null = null;

  return new Proxy({} as SupabaseClient, {
    get(_target, prop, receiver) {
      if (!_client) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
        _client = createClient(url, key);
      }
      const val = (_client as unknown as Record<string | symbol, unknown>)[prop];
      return typeof val === "function"
        ? (val as (...args: unknown[]) => unknown).bind(_client)
        : val;
    },
  });
}

export const supabase = makeLazyClient();
