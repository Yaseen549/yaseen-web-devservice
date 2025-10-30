// src/lib/supabasePrivate.js
import { createClient } from "@supabase/supabase-js";

export function createPrivateSupabaseClient(token) {
  if (!token) {
    console.warn("⛔ No token provided for secured Supabase client.");
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      // realtime: {
      //   params: {
      //     eventsPerSecond: 10, // Optional throttling (you can remove or tweak this)
      //   },
      // },
    }
  );
}
