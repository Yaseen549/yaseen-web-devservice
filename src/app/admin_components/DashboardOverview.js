"use client";

import React from "react";
import { Globe, Check, Loader2 } from "lucide-react";

// StatCard is now an internal component for the Dashboard
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-sm hover:border-indigo-300 transition-colors **cursor-pointer**">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        {icon}
    </div>
);

export default function DashboardOverview({ websites }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Websites" value={websites.length} icon={<Globe className="w-6 h-6 text-indigo-500" />} />
            <StatCard title="Active" value={websites.filter(w => w.status === 'active').length} icon={<Check className="w-6 h-6 text-green-500" />} />
            <StatCard title="Pending" value={websites.filter(w => w.status === 'pending').length} icon={<Loader2 className="w-6 h-6 text-yellow-500" />} />

            <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Recent Activity</h3>
                <p className="text-slate-600">Dashboard activity log placeholder...</p>
            </div>
        </div>
    );
}