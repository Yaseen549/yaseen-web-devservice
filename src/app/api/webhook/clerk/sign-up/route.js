// app/api/webhook/clerk/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
    const body = await req.json();
    const { type, data } = body;

    const clerkUser = data;
    const email = clerkUser.email_addresses[0]?.email_address || null;
    const username = clerkUser.username || null;
    const image_url = clerkUser.image_url || null;
    const clerk_id = clerkUser.id;

    if (!email || !username) {
        return NextResponse.json({ error: "Email or username missing" }, { status: 400 });
    }

    if (type === "user.created") {
        // Insert new user
        const { error } = await supabase.from("users").insert({
            clerk_id,
            username,
            email,
            image_url,
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true });
    }

    if (type === "user.updated") {
        // Update existing user
        const { error } = await supabase
            .from("users")
            .update({
                email,
                image_url,
            })
            .eq("clerk_id", clerk_id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ ok: true });
}
