import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function usePrivateSupabaseClient() {
  const { getToken } = useAuth();
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    let cancelled = false;

    (async () => {
      // const token = await getToken({ template: "supabase" });
      const token = await getToken({ template: "supabase" });
      // console.log("🔑 Supabase JWT:", JSON.parse(atob(token.split('.')[1])));

      if (!token) return;

      const client = createPrivateSupabaseClient(token);
      if (!cancelled && client) setSupabase(client);
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return supabase;
}
