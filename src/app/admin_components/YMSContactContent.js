"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Mail,
    Trash2,
    Eye,
    X,
    Loader2,
    Search,
    Inbox,
    Archive,
    ExternalLink,
    MessageSquare,
    Check,
    RefreshCw, // New icon
    AlertTriangle, // New icon
    Book, // New icon for "Mark as Read"
    BookOpen, // New icon for "Mark as Unread"
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";
import ConfirmWithInputDialog from "./dialogBoxes/ConfirmWithInputDialog";

// --- CONSTANTS ---
const CONFIRMATION_TEXT_SINGLE = "DELETE";
const CONFIRMATION_TEXT_BULK = "DELETE ALL";
const FILTER_ALL = "all";
const FILTER_UNREAD = "unread";
const FILTER_READ = "read";

// --- HELPER: Time Ago Function ---
function timeAgo(dateString) {
    // ... (Your existing timeAgo function)
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

// --- COMPONENT: Message View Modal ---
function ContactFormModal({ message, onClose, onToggleRead, onOpenDeleteConfirm }) {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Contact Form Message</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-grow p-6 space-y-5 overflow-y-auto text-gray-700">
                    {/* ... (Your existing modal content) ... */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                            <span className="text-sm font-semibold text-gray-500 w-16">Name:</span>
                            <span className="text-base text-gray-900">{message.name}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                            <span className="text-sm font-semibold text-gray-500 w-16">Email:</span>
                            <a href={`mailto:${message.email}`} className="text-base text-indigo-600 hover:underline flex items-center gap-1">
                                {message.email} <ExternalLink size={14} />
                            </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                            <span className="text-sm font-semibold text-gray-500 w-16">Date:</span>
                            <span className="text-base text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="space-y-1 pt-4 border-t border-gray-200">
                        <label className="text-sm font-semibold text-gray-700">Message:</label>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[150px]">
                            <p className="text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{message.message}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center gap-3 p-4 border-t border-gray-200 bg-gray-50">
                    {/* NEW: Mark as Unread/Read Button */}
                    <button
                        onClick={() => onToggleRead(message, !message.read)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
                    >
                        {message.read ? <BookOpen size={16} /> : <Book size={16} />}
                        {message.read ? "Mark as Unread" : "Mark as Read"}
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 border border-gray-300">
                            Close
                        </button>
                        <button onClick={() => onOpenDeleteConfirm(message)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700">
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

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

// --- COMPONENT: Main Contact Panel ---
export default function YMSContactContent() {
    const { getToken } = useAuth();
    const [supabase, setSupabase] = useState(null);

    // Data State
    const [contactMessages, setContactMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // UI State
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState(FILTER_ALL);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Modal State
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSingleDeleteOpen, setIsSingleDeleteOpen] = useState(false);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

    // Initialize Supabase client
    useEffect(() => {
        async function initSupabase() {
            const token = await getToken({ template: "supabase" });
            const client = createPrivateSupabaseClient(token);
            setSupabase(client);
        }
        initSupabase();
    }, [getToken]);

    // Fetch messages
    const fetchMessages = async () => {
        if (!supabase) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from("yms_contact_form")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching contact messages:", error.message);
        } else {
            setContactMessages(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, [supabase]);

    // --- Filtering and Stats ---
    const filteredMessages = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return contactMessages
            .filter(msg => {
                // Filter by status
                if (filterStatus === FILTER_UNREAD) return !msg.read;
                if (filterStatus === FILTER_READ) return msg.read;
                return true; // FILTER_ALL
            })
            .filter(msg =>
                // Filter by search term
                !searchTerm ||
                msg.name.toLowerCase().includes(lowerSearch) ||
                msg.email.toLowerCase().includes(lowerSearch) ||
                msg.message.toLowerCase().includes(lowerSearch)
            );
    }, [contactMessages, searchTerm, filterStatus]);

    const stats = useMemo(() => ({
        total: contactMessages.length,
        unread: contactMessages.filter(m => !m.read).length
    }), [contactMessages]);

    // --- Selection Logic ---
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
            // Select all IDs from the *currently filtered* list
            const allFilteredIds = filteredMessages.map(m => m.id);
            setSelectedIds(new Set(allFilteredIds));
        } else {
            // Clear all selections
            setSelectedIds(new Set());
        }
    };

    const isAllFilteredSelected = filteredMessages.length > 0 && selectedIds.size === filteredMessages.length;
    const isIndeterminate = selectedIds.size > 0 && !isAllFilteredSelected;

    // --- Data Update Logic (Single & Bulk) ---
    const updateMessageStatus = async (ids, readStatus) => {
        if (!supabase) return;

        const idsToUpdate = Array.isArray(ids) ? ids : [ids];
        if (idsToUpdate.length === 0) return;

        setIsProcessing(true);
        const { data, error } = await supabase
            .from("yms_contact_form")
            .update({ read: readStatus })
            .in("id", idsToUpdate)
            .select();

        if (error) {
            console.error("Failed to update status:", error.message);
        } else {
            // Update local state to match DB
            setContactMessages(currentMessages =>
                currentMessages.map(msg =>
                    idsToUpdate.includes(msg.id) ? { ...msg, read: readStatus } : msg
                )
            );
        }
        setIsProcessing(false);
        return data; // Return updated data
    };

    // --- Event Handlers ---
    const handleViewMessage = async (msg) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            // Automatically mark as read
            await updateMessageStatus(msg.id, true);
        }
    };

    const handleToggleRead = async (msg, readStatus) => {
        await updateMessageStatus(msg.id, readStatus);
        // Close the modal
        setSelectedMessage(null);
    };

    // --- Single Delete Handlers ---
    const handleOpenDeleteConfirm = (msg) => {
        setItemToDelete(msg);
        setIsSingleDeleteOpen(true);
    };

    const handleCancelDelete = () => {
        setIsSingleDeleteOpen(false);
        setItemToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete || !supabase) return;
        setIsProcessing(true);

        const { error } = await supabase.from("yms_contact_form").delete().eq("id", itemToDelete.id);
        if (error) {
            console.error("Failed to delete message:", error.message);
        } else {
            setContactMessages(msgs => msgs.filter(m => m.id !== itemToDelete.id));
        }

        setSelectedMessage(null);
        setItemToDelete(null);
        setIsSingleDeleteOpen(false);
        setIsProcessing(false);
    };

    // --- Bulk Action Handlers ---
    const handleBulkUpdate = async (readStatus) => {
        await updateMessageStatus(Array.from(selectedIds), readStatus);
        setSelectedIds(new Set()); // Clear selection
    };

    const handleOpenBulkDelete = () => {
        setIsBulkDeleteOpen(true);
    };

    const handleConfirmBulkDelete = async () => {
        if (selectedIds.size === 0 || !supabase) return;
        setIsProcessing(true);

        const idsToDelete = Array.from(selectedIds);
        const { error } = await supabase.from("yms_contact_form").delete().in("id", idsToDelete);
        if (error) {
            console.error("Failed to bulk delete messages:", error.message);
        } else {
            setContactMessages(msgs => msgs.filter(m => !idsToDelete.includes(m.id)));
        }

        setSelectedIds(new Set());
        setIsBulkDeleteOpen(false);
        setIsProcessing(false);
    };

    // --- Render Loading State ---
    if (isLoading && !supabase) {
        return (
            <div className="text-gray-800 space-y-6 p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="text-gray-800 space-y-6"> {/* Main container with padding */}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatsCard title="Total Messages" value={stats.total} icon={Archive} colorClass="bg-indigo-100 text-indigo-600" />
                <StatsCard title="Unread" value={stats.unread} icon={MessageSquare} colorClass="bg-yellow-100 text-yellow-700" />
                <StatsCard title="All Read" value={stats.total - stats.unread} icon={Check} colorClass="bg-green-100 text-green-700" />
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    {/* Filter Buttons */}
                    <button
                        onClick={() => setFilterStatus(FILTER_ALL)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${filterStatus === FILTER_ALL ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus(FILTER_UNREAD)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${filterStatus === FILTER_UNREAD ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                    >
                        Unread ({stats.unread})
                    </button>
                    <button
                        onClick={() => setFilterStatus(FILTER_READ)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${filterStatus === FILTER_READ ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                    >
                        Read
                    </button>
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
                    <span className="font-medium">{selectedIds.size} message{selectedIds.size > 1 ? 's' : ''} selected</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleBulkUpdate(true)} className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                            <Book size={14} /> Mark as Read
                        </button>
                        <button onClick={() => handleBulkUpdate(false)} className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                            <BookOpen size={14} /> Mark as Unread
                        </button>
                        <button onClick={handleOpenBulkDelete} className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md text-red-100 bg-red-600 hover:bg-red-700">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                {isLoading ? (
                    <div className="text-center py-24 text-gray-500">
                        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-indigo-600" />
                        <p className="text-lg font-medium">Loading Messages...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-24 text-gray-500">
                        <Inbox className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg font-medium">No Messages Found</p>
                        <p className="text-sm">Your inbox is clear.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={handleSelectAll}
                                            checked={isAllFilteredSelected}
                                            ref={el => el && (el.indeterminate = isIndeterminate)}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredMessages.map(msg => (
                                    <tr
                                        key={msg.id}
                                        className={`${!msg.read ? 'bg-indigo-50' : 'bg-white'} hover:bg-gray-50 ${selectedIds.has(msg.id) ? '!bg-indigo-100' : ''}`}
                                    >
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                onChange={() => handleSelectOne(msg.id)}
                                                checked={selectedIds.has(msg.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {!msg.read && (
                                                    <span className="w-2 h-2 bg-indigo-500 rounded-full" title="Unread"></span>
                                                )}
                                                <div className="text-sm font-medium text-gray-900" style={{ fontWeight: !msg.read ? 'bold' : 'normal' }}>
                                                    {msg.name}
                                                </div>
                                                {!msg.read && (
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">New</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">{msg.email}</div>
                                        </td>
                                        <td
                                            onClick={() => handleViewMessage(msg)}
                                            className="px-4 py-3 text-sm text-gray-600 truncate max-w-sm cursor-pointer"
                                            style={{ fontWeight: !msg.read ? 'bold' : 'normal' }}
                                        >
                                            {msg.message}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{timeAgo(msg.created_at)}</td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            <button onClick={() => handleViewMessage(msg)} className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </button>
                                            <button onClick={() => handleOpenDeleteConfirm(msg)} className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- Modals --- */}
            {selectedMessage && (
                <ContactFormModal
                    message={selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                    onToggleRead={handleToggleRead}
                    onOpenDeleteConfirm={handleOpenDeleteConfirm}
                />
            )}

            <ConfirmWithInputDialog
                open={isSingleDeleteOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                username={CONFIRMATION_TEXT_SINGLE}
                action="Delete Message"
                description="This action cannot be undone. This message will be permanently removed."
            />

            <ConfirmWithInputDialog
                open={isBulkDeleteOpen}
                onClose={() => setIsBulkDeleteOpen(false)}
                onConfirm={handleConfirmBulkDelete}
                username={CONFIRMATION_TEXT_BULK}
                action={`Delete ${selectedIds.size} Messages`}
                description={`This will permanently delete ${selectedIds.size} messages. This action cannot be undone.`}
            />

            {isProcessing && (
                <div className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
            )}
        </div>
    );
}