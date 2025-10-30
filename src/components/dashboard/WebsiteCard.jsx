// WebsiteCard.jsx
"use client";

import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

export default function WebsiteCard({ website }) {
    const router = useRouter();

    const statusColor =
        website.status === "active"
            ? "bg-green-500"
            : website.status === "pending"
                ? "bg-yellow-500"
                : "bg-gray-500";

    return (
        <div
            onClick={() => router.push(`/dashboard/projects/${website.id}`)}
            className="cursor-pointer bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex justify-between items-center transition-all hover:border-violet-500/50 hover:bg-gray-900/70"
        >
            <div className="flex flex-col gap-1">
                <p className="font-semibold text-white hover:text-violet-300 transition-colors">
                    {website.label || website.url}
                </p>

                {/* External link as a separate clickable element */}
                <span
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the card click
                        window.open(website.url, "_blank", "noopener,noreferrer");
                    }}
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1.5 cursor-pointer select-none"
                >
                    {website.url}
                    <ExternalLink className="w-3 h-3" />
                </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {/* --- STAGE BADGE (NEW) --- */}
                {website.development_stage && (
                    <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-violet-900/50 text-violet-300"
                    >
                        {website.development_stage}
                    </span>
                )}

                {/* --- STATUS BADGE --- */}
                <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor === "bg-green-500"
                            ? "bg-green-900/50 text-green-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                >
                    {website.status}
                </span>

                {/* --- STATUS DOT --- */}
                <span
                    className={`w-3 h-3 rounded-full ${statusColor}`}
                    title={`Status: ${website.status}`}
                />
            </div>
        </div>
    );
}