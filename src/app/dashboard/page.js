// /app/dashboard/page.js
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import {
    Mail,
    Phone,
    Building,
    MapPin,
    Home, // Added Home Icon
} from "lucide-react";

// Import the new client-side ProjectList
import ProjectList from "@/components/dashboard/ProjectList";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- 1. User Header Component (Server Component) ---
function UserHeader({ user }) {
    return (
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <Image
                    src={user.image_url || "/default-avatar.png"}
                    alt={user.display_name || "Profile Picture"}
                    width={32}  // Shrunk
                    height={32} // Shrunk
                    className="rounded-full border-2 border-gray-800"
                />
                <div>
                    <h1 className="text-lg font-semibold text-white"> {/* Shrunk */}
                        Welcome, {user.username || "User"} 👋
                    </h1>
                </div>
            </div>
        </div>
    );
}

// --- 2. Profile Details Component (Server Component) ---
function ProfileDetails({ user }) {
    return (
        // Removed card styles for a minimal look
        <aside className="self-start">
            <h3 className="text-base font-semibold text-white mb-3"> {/* Shrunk */}
                Profile Details
            </h3>

            {/* Redesigned with a compact Definition List (<dl>) */}
            <dl className="divide-y divide-gray-800 text-sm">
                <div className="flex justify-between items-center py-2.5"> {/* Shrunk */}
                    <dt className="text-gray-400 flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                    </dt>
                    <dd className="font-medium text-gray-300 truncate">
                        <a href={`mailto:${user.email}`} className="hover:text-violet-400">
                            {user.email}
                        </a>
                    </dd>
                </div>
                <div className="flex justify-between items-center py-2.5"> {/* Shrunk */}
                    <dt className="text-gray-400 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Phone
                    </dt>
                    <dd className="font-medium text-gray-300">{user.phone || "-"}</dd>
                </div>
                <div className="flex justify-between items-center py-2.5"> {/* Shrunk */}
                    <dt className="text-gray-400 flex items-center gap-2">
                        <Building className="w-4 h-4" /> Company
                    </dt>
                    <dd className="font-medium text-gray-300">{user.company || "-"}</dd>
                </div>
                <div className="flex justify-between items-center py-2.5"> {/* Shrunk */}
                    <dt className="text-gray-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Location
                    </dt>
                    <dd className="font-medium text-gray-300">{user.location || "-"}</dd>
                </div>
            </dl>
        </aside>
    );
}


// --- Main Page Component (Server Component) ---
export default async function Dashboard() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-4">
                <p>Loading user data...</p>
            </div>
        );
    }

    const { data: userData, error } = await supabase
        .from("users")
        .select("*, websites(*)")
        .eq("clerk_id", clerkUser.id)
        .single();

    if (error) {
        console.error("Supabase query error:", error.message);
    }

    const user = {
        clerk_id: clerkUser.id,
        display_name: userData?.display_name || clerkUser.fullName,
        username: userData?.username || clerkUser.username,
        email: userData?.email || clerkUser.emailAddresses[0]?.emailAddress,
        image_url: userData?.image_url || clerkUser.imageUrl,
        company: userData?.company || null,
        phone: userData?.phone || null,
        location: userData?.location || null,
        websites: userData?.websites || [],
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-20"> {/* Adjusted padding */}
            <div className="max-w-6xl mx-auto px-4">

                {/* --- Home Button --- */}
                <div className="mb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-violet-400 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <UserHeader user={user} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Adjusted gap */}
                    <div className="lg:col-span-2">
                        {/* ProjectList is now a client component */}
                        <ProjectList websites={user.websites} />
                    </div>

                    <div className="lg:col-span-1">
                        <ProfileDetails user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}