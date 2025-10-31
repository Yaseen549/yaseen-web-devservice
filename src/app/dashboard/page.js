"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import ProjectList from "@/components/dashboard/ProjectList";
import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";
import Footer from "../partials/Footer";

// --- User Header ---
function UserHeader({ user }) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
                <Image
                    src={user.image_url || "/default-avatar.png"}
                    alt={user.username || "Profile Picture"}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-gray-800"
                />
                <div>
                    <h1 className="text-2xl font-semibold text-white">
                        Welcome, {user.username || "User"} 👋
                    </h1>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
            </div>
        </div>
    );
}

// --- Profile Details ---
function ProfileDetails({ user }) {
    return (
        <aside className="bg-gray-900/30 rounded-lg p-6 sticky top-32">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Details</h3>
            <dl className="divide-y divide-gray-800 text-sm">
                <DetailRow label="Email" value={user.email} />
                <DetailRow label="Phone" value={user.phone || "-"} />
                <DetailRow label="Company" value={user.company || "-"} />
                <DetailRow label="Location" value={user.location || "-"} />
            </dl>
        </aside>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2.5">
            <dt className="text-gray-400">{label}</dt>
            <dd className="font-medium text-gray-300 truncate">{value}</dd>
        </div>
    );
}

// --- Main Dashboard Page ---
export default function DashboardPage() {
    const { getToken, userId } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);

            try {
                const token = await getToken({ template: "supabase" });
                const supabase = createPrivateSupabaseClient(token);

                const { data, error } = await supabase
                    .from("users")
                    .select("*, websites(*)")
                    .eq("clerk_id", userId)
                    .maybeSingle();

                if (error) console.error("Supabase query error:", error.message);
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [getToken, userId]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-white p-4">
                <p>Loading user data...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black text-white p-4">
                <p>No user data found.</p>
            </div>
        );
    }

    const user = {
        clerk_id: userData.clerk_id,
        display_name: userData.display_name,
        username: userData.username,
        email: userData.email,
        image_url: userData.image_url,
        company: userData.company,
        phone: userData.phone,
        location: userData.location,
        websites: userData.websites || [],
    };

    return (
        <>
            <div className="min-h-screen bg-black text-white pt-24">

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <UserHeader user={user} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Projects */}
                        <div className="lg:col-span-2">
                            <ProjectList websites={user.websites} />
                        </div>

                        {/* Profile Sidebar */}
                        <div className="lg:col-span-1">
                            <ProfileDetails user={user} />
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </>
    );
}
