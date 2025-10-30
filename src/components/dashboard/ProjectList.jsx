"use client";

import { useState } from "react";
import { Globe, ChevronLeft, ChevronRight, ExternalLink, Plus } from "lucide-react";
import Link from "next/link"; // Added for list item links

// --- New UI Component ---
// Added StatusPill here for a single-file solution
const StatusPill = ({ status }) => {
    const colors = {
        active: "bg-green-600/20 text-green-300 border-green-500/30",
        pending: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30",
        inactive: "bg-gray-600/20 text-gray-400 border-gray-500/30",
    };
    return (
        <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${colors[status] || colors.inactive
                }`}
        >
            {status}
        </span>
    );
};

// --- New List Item Component ---
// This replaces the old WebsiteCard component for a list-only view
const WebsiteListItem = ({ website }) => (
    <div className="flex items-center justify-between p-2.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
        <div className="flex items-center gap-3 overflow-hidden">
            <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <div className="overflow-hidden">
                <h4 className="font-medium text-sm text-white truncate">
                    {website.label}
                </h4>
                <p className="text-xs text-gray-400 truncate">
                    {website.url.replace(/^https?:\/\//, "")}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <StatusPill status={website.status} />
            <Link
                href={`/dashboard/projects/${website.id}`}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 text-gray-300 rounded-md text-xs font-medium hover:bg-gray-700 hover:text-white transition-colors"
            >
                View
                <ExternalLink className="w-3 h-3" />
            </Link>
        </div>
    </div>
);


export default function ProjectList({ websites }) {
    // const [view, setView] = useState("grid"); // Removed view state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // Increased page size for a more compact list

    const totalPages = Math.ceil(websites.length / pageSize);
    const paginatedWebsites = websites.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    const EmptyState = () => (
        <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-950/30">
            <Globe className="w-12 h-12 mx-auto text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-300">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">Your projects will appear here once you add them.</p>
            {/* Added a create button to the empty state */}
            <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-500 transition-colors">
                <Plus className="w-4 h-4" />
                Create Project
            </button>
        </div>
    );

    const PaginationControls = () => (
        <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-700/80 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            {/* Header - Shrunk and removed toggles */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-white">My Projects</h2>
                {/* Removed view toggle buttons */}
            </div>

            {websites.length > 0 ? (
                <>
                    {/* Always render list view */}
                    <div className="flex flex-col gap-3">
                        {paginatedWebsites.map((website) => (
                            <WebsiteListItem key={website.id} website={website} />
                        ))}
                    </div>
                    {totalPages > 1 && <PaginationControls />}
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
}