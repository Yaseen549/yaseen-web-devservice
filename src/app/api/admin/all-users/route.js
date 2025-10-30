// /app/api/admin/all-users/route.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fetch all users for admin management
export async function GET(req) {
    const { data, error } = await supabase
        .from("users")
        .select("id, clerk_id, username, email, image_url, company, phone, location") // select the fields you need
        .order("username", { ascending: true }); // order alphabetically

    if (error) {
        console.error("Supabase all users fetch error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
}
