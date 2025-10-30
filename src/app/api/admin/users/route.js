// /app/api/admin/users/route.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
    const { search } = Object.fromEntries(new URL(req.url).searchParams);

    // Only search if query is 2+ characters
    if (!search || search.length < 2) {
        return new Response(JSON.stringify([]), { status: 200 });
    }

    const q = search.toLowerCase();

    // Supabase `.or()` requires a single string, comma-separated, no line breaks
    const orQuery = `username.ilike.%${q}%,clerk_id.ilike.%${q}%,email.ilike.%${q}%`;

    const { data, error } = await supabase
        .from("users")
        .select("id, clerk_id, username, email") // select the fields you want
        .or(orQuery)
        .limit(10);

    if (error) {
        console.error("Supabase user search error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
}
