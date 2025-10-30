// src/lib/supabasePublic.js
import { createClient } from "@supabase/supabase-js";

export function createPublicSupabaseClient(token) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      // realtime: {
      //   params: {
      //     eventsPerSecond: 10, // Optional: throttle events if needed
      //   },
      // },
    }
  );
}
