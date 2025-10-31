"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";
import { CopyButton, LoadingSpinner, Modal, Button } from "./ui";
import {
    Eye,
    Trash,
    Loader2,
    Search,
    Inbox,
    Check,
    RefreshCw,
    AlertTriangle,
    Hourglass,
    ThumbsUp,
    ThumbsDown,
    Archive,
} from "lucide-react";

// Assuming you have this component from your previous requests
import ConfirmWithInputDialog from "./dialogBoxes/ConfirmWithInputDialog";

// --- CONSTANTS ---
const CONFIRMATION_TEXT_SINGLE = "DELETE";
const CONFIRMATION_TEXT_BULK = "DELETE ALL";
const STATUS_ALL = "all";
const STATUS_PENDING = "pending";
const STATUS_IN_REVIEW = "in_review";
const STATUS_APPROVED = "approved";
const STATUS_REJECTED = "rejected";

// --- COMPONENT: Reusable row for modal details ---
const DetailRow = ({ label, value, children, isBlock = false }) => (
    <div className={isBlock ? "" : "flex justify-between items-start"}>
        <p className="text-sm font-medium text-slate-500">{label}:</p>
        <div className="text-right">
            {children || (
                <p
                    className={`text-sm text-slate-900 ${isBlock ? "mt-2" : "ml-4"
                        }`}
                >
                    {value}
                </p>
            )}
        </div>
    </div>
);

// --- COMPONENT: Status Pill ---
const StatusPill = ({ status }) => {
    const colors = {
        approved: "bg-green-100 text-green-700",
        in_review: "bg-yellow-100 text-yellow-700",
        rejected: "bg-red-100 text-red-700",
        pending: "bg-slate-100 text-slate-700",
    };
    return (
        <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.pending
                }`}
        >
            {status.replace("_", " ")}
        </span>
    );
};

// --- COMPONENT: Stats Card ---
function StatsCard({ title, value, icon, colorClass }) {
    const Icon = icon;
    return (
        <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200 flex items-center gap-4">
            <div className={`p-3 rounded-full ${colorClass}`}>
                <Icon size={22} />
            </div>
            <div>
                <div className="text-sm font-medium text-gray-500">{title}</div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
            </div>
        </div>
    );
}

// --- COMPONENT: Main Requirements Panel ---
export default function RequirementManagement() {
    const { getToken } = useAuth();
    const [supabase, setSupabase] = useState(null);

    // Data State
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState(STATUS_ALL);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [showViewModal, setShowViewModal] = useState(null);

    // Modal State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

    // --- 1. Optimized API Client Initialization ---
    useEffect(() => {
        const initSupabase = async () => {
            try {
                const token = await getToken({ template: "supabase" });
                if (token) {
                    const client = createPrivateSupabaseClient(token);
                    setSupabase(client);
                } else {
                    throw new Error("No token found");
                }
            } catch (err) {
                console.error("Error initializing Supabase client:", err);
                setLoading(false);
            }
        };
        initSupabase();
    }, [getToken]);

    // --- 2. Data Fetching ---
    const fetchRequirements = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("yms_requirements")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRequirements(data || []);
        } catch (err) {
            console.error("❌ Fetch error:", err.message);
            setRequirements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (supabase) fetchRequirements();
    }, [supabase]);

    // --- 3. Memoized Filtering and Stats ---
    const stats = useMemo(() => {
        return {
            total: requirements.length,
            pending: requirements.filter((r) => r.status === STATUS_PENDING)
                .length,
            in_review: requirements.filter(
                (r) => r.status === STATUS_IN_REVIEW
            ).length,
            approved: requirements.filter((r) => r.status === STATUS_APPROVED)
                .length,
            rejected: requirements.filter((r) => r.status === STATUS_REJECTED)
                .length,
        };
    }, [requirements]);

    const filteredRequirements = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return requirements
            .filter((req) => {
                // Filter by status
                if (filterStatus === STATUS_ALL) return true;
                return req.status === filterStatus;
            })
            .filter(
                (req) =>
                    // Filter by search term
                    !searchTerm ||
                    req.name.toLowerCase().includes(lowerSearch) ||
                    req.email.toLowerCase().includes(lowerSearch) ||
                    req.project_type.toLowerCase().includes(lowerSearch)
            );
    }, [requirements, searchTerm, filterStatus]);

    // --- 4. Selection Logic ---
    const handleSelectOne = (id) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
        } else {
            newSelectedIds.add(id);
        }
        setSelectedIds(newSelectedIds);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allFilteredIds = filteredRequirements.map((r) => r.id);
            setSelectedIds(new Set(allFilteredIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    const isAllFilteredSelected =
        filteredRequirements.length > 0 &&
        selectedIds.size === filteredRequirements.length;
    const isIndeterminate =
        selectedIds.size > 0 && !isAllFilteredSelected;

    // --- 5. CRUD and Bulk Operations ---
    const updateStatus = async (id, status) => {
        if (!supabase) return;
        setUpdating(id);
        try {
            const { error } = await supabase
                .from("yms_requirements")
                .update({ status, updated_at: new Date().toISOString() })
                .eq("id", id);
            if (error) throw error;
            // Refetch to ensure data consistency
            await fetchRequirements();
        } catch (err) {
            console.error("❌ Supabase update error:", err.message);
            alert("Something went wrong updating the status.");
        } finally {
            setUpdating(null);
        }
    };

    const deleteRequirement = async () => {
        if (!showDeleteConfirm || !supabase) return;
        setDeleting(true);
        try {
            const { error } = await supabase
                .from("yms_requirements")
                .delete()
                .eq("id", showDeleteConfirm.id);
            if (error) throw error;
            await fetchRequirements();
        } catch (err) {
            console.error("❌ Supabase delete error:", err.message);
            alert("Something went wrong deleting the requirement.");
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(null);
        }
    };

    const handleBulkUpdate = async (status) => {
        if (!supabase || selectedIds.size === 0) return;
        setUpdating(true); // Use boolean for bulk
        try {
            const idsToUpdate = Array.from(selectedIds);
            const { error } = await supabase
                .from("yms_requirements")
                .update({ status, updated_at: new Date().toISOString() })
                .in("id", idsToUpdate);
            if (error) throw error;
            await fetchRequirements();
            setSelectedIds(new Set());
        } catch (err) {
            console.error("❌ Supabase bulk update error:", err.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!supabase || selectedIds.size === 0) return;
        setDeleting(true);
        try {
            const idsToDelete = Array.from(selectedIds);
            const { error } = await supabase
                .from("yms_requirements")
                .delete()
                .in("id", idsToDelete);
            if (error) throw error;
            await fetchRequirements();
            setSelectedIds(new Set());
        } catch (err) {
            console.error("❌ Supabase bulk delete error:", err.message);
        } finally {
            setDeleting(false);
            setShowBulkDeleteConfirm(false);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    <StatsCard
                        title="Total"
                        value={stats.total}
                        icon={Archive}
                        colorClass="bg-indigo-100 text-indigo-600"
                    />
                    <StatsCard
                        title="Pending"
                        value={stats.pending}
                        icon={Inbox}
                        colorClass="bg-slate-100 text-slate-600"
                    />
                    <StatsCard
                        title="In Review"
                        value={stats.in_review}
                        icon={Hourglass}
                        colorClass="bg-yellow-100 text-yellow-700"
                    />
                    <StatsCard
                        title="Approved"
                        value={stats.approved}
                        icon={ThumbsUp}
                        colorClass="bg-green-100 text-green-700"
                    />
                    <StatsCard
                        title="Rejected"
                        value={stats.rejected}
                        icon={ThumbsDown}
                        colorClass="bg-red-100 text-red-700"
                    />
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {[
                            STATUS_ALL,
                            STATUS_PENDING,
                            STATUS_IN_REVIEW,
                            STATUS_APPROVED,
                            STATUS_REJECTED,
                        ].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize ${filterStatus === status
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border"
                                    }`}
                            >
                                {status.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Bulk Action Bar */}
                {selectedIds.size > 0 && (
                    <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-lg border border-indigo-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <span className="font-medium">
                            {selectedIds.size} item
                            {selectedIds.size > 1 ? "s" : ""} selected
                        </span>
                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                onClick={() => handleBulkUpdate(STATUS_IN_REVIEW)}
                                className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
                            >
                                <Hourglass size={14} /> Mark as In Review
                            </button>
                            <button
                                onClick={() => handleBulkUpdate(STATUS_APPROVED)}
                                className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md text-green-800 bg-green-100 hover:bg-green-200"
                            >
                                <ThumbsUp size={14} /> Approve
                            </button>
                            <button
                                onClick={() => handleBulkUpdate(STATUS_REJECTED)}
                                className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md text-red-800 bg-red-100 hover:bg-red-200"
                            >
                                <ThumbsDown size={14} /> Reject
                            </button>
                            <button
                                onClick={() => setShowBulkDeleteConfirm(true)}
                                className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md text-red-100 bg-red-600 hover:bg-red-700"
                            >
                                <Trash size={14} /> Delete
                            </button>
                        </div>
                    </div>
                )}

                {/* Requirements Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-4 text-left">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        onChange={handleSelectAll}
                                        checked={isAllFilteredSelected}
                                        ref={(el) =>
                                            el &&
                                            (el.indeterminate = isIndeterminate)
                                        }
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Project Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <LoadingSpinner
                                    text="Loading requirements..."
                                    colSpan={7}
                                />
                            ) : filteredRequirements.length > 0 ? (
                                filteredRequirements.map((req) => (
                                    <tr
                                        key={req.id}
                                        className={`${selectedIds.has(req.id)
                                                ? "bg-indigo-100"
                                                : "bg-white"
                                            } hover:bg-slate-50/50 transition-colors`}
                                    >
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                onChange={() => handleSelectOne(req.id)}
                                                checked={selectedIds.has(req.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {req.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                                            {req.email}
                                            <CopyButton textToCopy={req.email} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {req.project_type}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-sm truncate">
                                            {req.details}
                                        </td>
                                        <td className="px-6 py-4 text-sm capitalize">
                                            <StatusPill status={req.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex justify-end items-center gap-2">
                                                {/* --- FIX 1: "In Review" Button Added --- */}
                                                {req.status !== STATUS_IN_REVIEW && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                req.id,
                                                                STATUS_IN_REVIEW
                                                            )
                                                        }
                                                        disabled={updating === req.id}
                                                        className="p-2 rounded-md text-yellow-600 hover:bg-yellow-100 disabled:opacity-50"
                                                        title="Mark as In Review"
                                                    >
                                                        <Hourglass className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {req.status !== STATUS_APPROVED && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                req.id,
                                                                STATUS_APPROVED
                                                            )
                                                        }
                                                        disabled={updating === req.id}
                                                        className="p-2 rounded-md text-green-600 hover:bg-green-100 disabled:opacity-50"
                                                        title="Approve"
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {req.status !== STATUS_REJECTED && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                req.id,
                                                                STATUS_REJECTED
                                                            )
                                                        }
                                                        disabled={updating === req.id}
                                                        className="p-2 rounded-md text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        <ThumbsDown className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {/* View / Delete */}
                                                <button
                                                    onClick={() => setShowViewModal(req)}
                                                    className="p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setShowDeleteConfirm(req)
                                                    }
                                                    className="p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        No requirements found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- View Details Modal --- */}
            {showViewModal && (
                <Modal
                    title="Requirement Details"
                    onClose={() => setShowViewModal(null)}
                >
                    {/* --- FIX 2: Added max-h and overflow-y-auto to this div --- */}
                    <div className="flex flex-col gap-5 max-h-[calc(80vh-150px)]">
                        <div className="flex-grow overflow-y-auto pr-2 space-y-5">
                            <DetailRow label="Name" value={showViewModal.name} />
                            <DetailRow label="Email">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-900">
                                        {showViewModal.email}
                                    </span>
                                    <CopyButton
                                        textToCopy={showViewModal.email}
                                    />
                                </div>
                            </DetailRow>
                            <DetailRow
                                label="Project Type"
                                value={showViewModal.project_type}
                            />
                            <DetailRow label="Status">
                                <StatusPill status={showViewModal.status} />
                            </DetailRow>
                            <DetailRow
                                label="Submitted On"
                                value={new Date(
                                    showViewModal.created_at
                                ).toLocaleString()}
                            />
                            <DetailRow label="Details" isBlock>
                                {/* Removed max-h from here,
									the parent div now scrolls 
								*/}
                                <p className="w-full mt-2 p-3 bg-slate-50 rounded-md border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                                    {showViewModal.details}
                                </p>
                            </DetailRow>
                        </div>

                        {/* Footer is now separate from scrollable content */}
                        <div className="flex-shrink-0 flex justify-between gap-3 pt-4 border-t border-slate-200">
                            {/* Quick Actions in Modal */}
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        updateStatus(
                                            showViewModal.id,
                                            STATUS_IN_REVIEW
                                        )
                                    }
                                    disabled={updating === showViewModal.id}
                                >
                                    Mark as In Review
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        updateStatus(
                                            showViewModal.id,
                                            STATUS_APPROVED
                                        )
                                    }
                                    disabled={updating === showViewModal.id}
                                >
                                    Approve
                                </Button>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => setShowViewModal(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* --- Single Delete Confirmation Modal --- */}
            {showDeleteConfirm && (
                <ConfirmWithInputDialog
                    open={!!showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(null)}
                    onConfirm={deleteRequirement}
                    username={CONFIRMATION_TEXT_SINGLE}
                    action="Delete Requirement"
                    description="This action cannot be undone. This requirement will be permanently removed."
                    isProcessing={deleting}
                />
            )}

            {/* --- Bulk Delete Confirmation Modal --- */}
            <ConfirmWithInputDialog
                open={showBulkDeleteConfirm}
                onClose={() => setShowBulkDeleteConfirm(false)}
                onConfirm={handleBulkDelete}
                username={CONFIRMATION_TEXT_BULK}
                action={`Delete ${selectedIds.size} Requirements`}
                description={`This will permanently delete ${selectedIds.size} requirements. This action cannot be undone.`}
                isProcessing={deleting}
            />

            {/* Global Loading Overlay */}
            {(updating === true || deleting === true) && (
                <div className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
            )}
        </>
    );
}