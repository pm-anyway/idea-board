import { createBrowserClient } from '@supabase/ssr'

// HMR 시에도 클라이언트 인스턴스를 유지하기 위해 globalThis에 캐싱
const globalForSupabase = globalThis as typeof globalThis & {
  supabaseClient?: ReturnType<typeof createBrowserClient>
}

export function createClient() {
  if (globalForSupabase.supabaseClient) return globalForSupabase.supabaseClient
  globalForSupabase.supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        detectSessionInUrl: false,
      },
    }
  )
  return globalForSupabase.supabaseClient
}
