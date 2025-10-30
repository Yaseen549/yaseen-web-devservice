import { createClient } from "@supabase/supabase-js";

// Ensure your environment variables are set up in your .env.local file
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
    // Selects all websites and joins the username from the users table
    const { data, error } = await supabase
        .from("websites")
        .select("*, user:clerk_id(username)") // Correctly joins user table on clerk_id
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase GET Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
}

export async function POST(req) {
    const newWebsiteData = await req.json();

    // Do not allow client to set id, created_at, or updated_at
    const { label, url, status, description, development_stage, clerk_id } = newWebsiteData;
    const insertData = { label, url, status, description, development_stage, clerk_id };

    const { data, error } = await supabase
        .from("websites")
        .insert(insertData)
        .select("*, user:clerk_id(username)") // Return the new record with the username joined
        .single(); // Expecting a single object back

    if (error) {
        console.error("Supabase POST Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data }), { status: 201 }); // 201 Created
}


export async function PATCH(req) {
    const { id, updates } = await req.json();

    // Ensure id is present
    if (!id) {
        return new Response(JSON.stringify({ error: "Website ID is required" }), { status: 400 });
    }

    const { data, error } = await supabase
        .from("websites")
        .update(updates)
        .eq("id", id)
        .select("*, user:clerk_id(username)") // Return the updated record with username
        .single(); // Expecting a single object back

    if (error) {
        console.error("Supabase PATCH Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
}

export async function DELETE(req) {
    const { id } = await req.json();

    // Ensure id is present
    if (!id) {
        return new Response(JSON.stringify({ error: "Website ID is required" }), { status: 400 });
    }

    const { error } = await supabase
        .from("websites")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Supabase DELETE Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
