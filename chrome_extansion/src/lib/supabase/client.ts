import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Singleton instance
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

/**
 * Create a Supabase client for Chrome Extension (Singleton)
 * Uses local storage for session persistence
 */
export function createClient() {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: {
                getItem: (key: string) => {
                    return localStorage.getItem(key);
                },
                setItem: (key: string, value: string) => {
                    localStorage.setItem(key, value);
                },
                removeItem: (key: string) => {
                    localStorage.removeItem(key);
                },
            },
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });

    return supabaseInstance;
}
