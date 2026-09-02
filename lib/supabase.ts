import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

type SupabaseFallbackAuth = {
  getSession: () => Promise<{ data: { session: null }; error: null }>;
  signInWithOtp: () => Promise<{ error: { message: string } }>;
  verifyOtp: () => Promise<{ data?: { user?: { id?: string } }; error?: { message: string } }>;
  signOut: () => Promise<{ error: null }>;
  getUser: () => Promise<{ data: { user: null }; error: null }>;
};

type SupabaseFallbackClient = {
  auth: SupabaseFallbackAuth;
  from: () => {
    select: () => Promise<{ data: null; error: { message: string } }>;
  };
};

const fallbackAuth: SupabaseFallbackAuth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  signInWithOtp: async () => ({ error: { message: "Supabase is not configured in this local environment." } }),
  verifyOtp: async () => ({ error: { message: "Supabase is not configured in this local environment." } }),
  signOut: async () => ({ error: null }),
  getUser: async () => ({ data: { user: null }, error: null }),
};

const fallbackClient: SupabaseFallbackClient = {
  auth: fallbackAuth,
  from: () => ({
    select: async () => ({
      data: null,
      error: { message: "Supabase is not configured in this local environment." },
    }),
  }),
};

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : (fallbackClient as unknown as ReturnType<typeof createClient>);
