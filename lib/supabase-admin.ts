import { createClient } from "@supabase/supabase-js";

type SupabaseAdminClient = {
  rpc: (...args: any[]) => Promise<any>;
  from: <T = any>(table: string) => any;
};

let cachedSupabaseAdmin: SupabaseAdminClient | null = null;

export function getSupabaseAdmin(): SupabaseAdminClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  if (!cachedSupabaseAdmin) {
    cachedSupabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }) as unknown as SupabaseAdminClient;
  }

  return cachedSupabaseAdmin;
}
