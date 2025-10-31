"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { CopyButton, LoadingSpinner } from "./ui";
import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            // 1️⃣ Get the Clerk JWT for RLS
            const token = await getToken({ template: "supabase" });
            if (!token) throw new Error("Unable to get auth token");

            // 2️⃣ Create Supabase client with token
            const supabase = createPrivateSupabaseClient(token);

            // 3️⃣ Fetch users (RLS will enforce access)
            const { data, error } = await supabase
                .from("users")
                .select("id, clerk_id, username, email, image_url, company, phone, location")
                .order("username", { ascending: true });

            if (error) {
                console.error("Supabase fetch error:", error.message);
                setUsers([]);
            } else {
                setUsers(data || []);
            }
        } catch (err) {
            console.error("Failed to fetch all users:", err);
            setUsers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Clerk ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            <LoadingSpinner text="Loading users..." />
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        <div className="flex items-center gap-2">
                                            {user.username || "N/A"}
                                            <CopyButton textToCopy={user.username} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {user.fullname || (user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : "N/A")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            {user.email}
                                            <CopyButton textToCopy={user.email} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate max-w-xs">{user.clerk_id}</span>
                                            <CopyButton textToCopy={user.clerk_id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
