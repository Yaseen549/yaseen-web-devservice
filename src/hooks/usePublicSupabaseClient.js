import { createPublicSupabaseClient } from "@/lib/supabasePublic";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function usePublicSupabaseClient() {
  const { getToken } = useAuth();
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = await getToken({ template: "supabase" }); // may be null
      const client = createPublicSupabaseClient(token);
      if (!cancelled) setSupabase(client);
    })();

    return () => { cancelled = true; };
  }, [getToken]);

  return supabase;
}
