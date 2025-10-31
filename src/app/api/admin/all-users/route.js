// /app/api/admin/all-users/route.js
import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

// Create Supabase client without service role
function createSupabaseClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}

export async function GET() {
    try {
        // 1️⃣ Get the currently logged-in Clerk user (server-side)
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }

        // 2️⃣ Create a Supabase client
        const supabase = createSupabaseClient();

        // 3️⃣ Fetch users — RLS will enforce access based on the logged-in user
        const { data, error } = await supabase
            .from("users")
            .select("id, clerk_id, username, email, image_url, company, phone, location")
            .order("username", { ascending: true });

        if (error) {
            console.error("Supabase fetch error:", error.message);
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500 }
            );
        }

        return new Response(JSON.stringify({ data }), { status: 200 });
    } catch (err) {
        console.error("Unexpected error:", err);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
