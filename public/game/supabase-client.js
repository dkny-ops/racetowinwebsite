// Supabase client for in-game use - DO NOT include service_role keys here.
// This file is intentionally a template. Use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
// injected at build time. Do NOT commit secrets to the repo.

if (typeof window !== "undefined") {
  (function () {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

      if (!supabaseUrl || !supabaseKey) {
        // In production builds, these should be provided via environment variables.
        // Keep window.supabaseClient undefined to avoid accidental leaked keys.
        return;
      }

      // `supabase` namespace is expected to be available (e.g. via CDN) in the game HTML.
      if (typeof supabase === "undefined" || !supabase.createClient) return;

      window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    } catch (e) {
      // fail silently in client if env variables aren't present
    }
  })();
}
