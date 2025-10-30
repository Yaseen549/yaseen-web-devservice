// components/admin_components/UserManagement.js
"use client";

import React, { useState, useEffect } from "react";
import { CopyButton, LoadingSpinner } from "./ui";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/all-users");
            const json = await res.json();
            if (json.error) {
                console.error(json.error);
                setUsers([]);
            } else {
                setUsers(json.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch all users:", error);
            setUsers([]);
        }
        setLoading(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchAllUsers();
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
};