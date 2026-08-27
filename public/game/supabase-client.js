const { createClient } = supabase;

const supabaseUrl = "TU_SUPABASE_URL";
const supabaseKey = "TU_SUPABASE_PUBLISHABLE_KEY";

window.supabaseClient = createClient(
    supabaseUrl,
    supabaseKey
);