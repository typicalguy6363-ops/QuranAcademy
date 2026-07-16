const SUPABASE_URL =
    "https://oovjvffmzphwksbvsoyd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_bohSHjn_0eZTWPHn2tR3dg_7nmoB65A";

if (!window.supabase) {
    throw new Error(
        "Supabase did not load. Check your internet connection."
    );
}

window.quranAcademySupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );
