"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import {
    Trash, Pencil, ExternalLink, Search, Plus, Check,
    Archive, // For Stats
    CheckCircle, // For Stats
    Loader2, // For Stats & Loading
    PauseCircle, // For Stats
    Wrench, // For Stats
    AlertTriangle, // For Bulk Delete
} from "lucide-react";
import {
    Modal, FormInput, FormSelect, Button, StatusPill, StagePill,
    LoadingSpinner, STATUS_OPTIONS, STAGE_OPTIONS, MaintenancePill
} from "./ui";
import UserSearchInput from "./UserSearchInput";
import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";
// Assuming you have this component from your previous requests
import ConfirmWithInputDialog from "./dialogBoxes/ConfirmWithInputDialog";

// --- CONSTANTS ---
const CONFIRMATION_TEXT_SINGLE = "DELETE";
const CONFIRMATION_TEXT_BULK = "DELETE ALL";
const FILTER_ALL = "all";

// --- COMPONENT: Form Toggle ---
const FormToggle = ({ label, id, name, checked, onChange, helpText }) => (
    <div>
        <label htmlFor={id} className="text-sm font-medium text-slate-700 block mb-2">{label}</label>
        <div className="flex items-center space-x-3">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange({ target: { name, checked: !checked, type: 'checkbox' } })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 
					border-transparent transition-colors duration-200 ease-in-out focus:outline-none 
					focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
                <span
                    aria-hidden="true"
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
						transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
            <span className={`text-sm ${checked ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                {checked ? "Active" : "Inactive"}
            </span>
        </div>
        {helpText && <p className="mt-1 text-xs text-slate-500">{helpText}</p>}
    </div>
);

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

// --- COMPONENT: Main Website List ---
export default function WebsiteList({ setParentWebsites }) {
    const [supabase, setSupabase] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false); // For bulk actions

    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState(FILTER_ALL);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

    // Form States
    const [newProject, setNewProject] = useState({
        label: "", url: "", clerk_id: "", status: "pending", development_stage: "planning",
        logo: "", maintenance: false
    });
    const [editingProject, setEditingProject] = useState(null);

    const { getToken } = useAuth();

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
    const fetchWebsites = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("websites")
                .select(`
					id, label, url, clerk_id, status, development_stage, logo, maintenance,
					user:users(username)
				`)
                .order("label", { ascending: true });

            if (error) throw error;

            setWebsites(data || []);
            setParentWebsites(data || []);
        } catch (err) {
            console.error("Failed to fetch websites:", err);
            setWebsites([]);
            setParentWebsites([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (supabase) {
            fetchWebsites();
        }
    }, [supabase]);

    // --- 3. CRUD Operations (Optimized) ---
    const createWebsite = async (e) => {
        e.preventDefault();
        if (!newProject.clerk_id) return alert("Please select a user.");
        if (!supabase) return;

        setIsProcessing(true);
        try {
            const { data, error } = await supabase
                .from("websites")
                .insert([newProject]);

            if (error) throw error;

            await fetchWebsites(); // Refetch
            setShowCreateModal(false);
            setNewProject({ label: "", url: "", clerk_id: "", status: "pending", development_stage: "planning", logo: "", maintenance: false });
        } catch (err) {
            console.error("Failed to create website:", err);
            alert("An unexpected error occurred.");
        }
        setIsProcessing(false);
    };

    const updateWebsite = async (e) => {
        e.preventDefault();
        if (!editingProject || !supabase) return;

        setIsProcessing(true);
        try {
            const { id, user, ...updates } = editingProject;
            const safeUpdates = { ...updates };
            delete safeUpdates.user; // remove relational field

            const { data, error } = await supabase
                .from("websites")
                .update(safeUpdates)
                .eq("id", id);

            if (error) throw error;

            await fetchWebsites(); // Refetch
            setShowEditModal(null);
            setEditingProject(null);
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred.");
        }
        setIsProcessing(false);
    };

    const deleteWebsite = async () => {
        if (!showDeleteConfirm || !supabase) return;

        setIsProcessing(true);
        try {
            const { error } = await supabase.from("websites").delete().eq("id", showDeleteConfirm.id);
            if (error) throw error;

            await fetchWebsites(); // Refetch
            setShowDeleteConfirm(null);
        } catch (err) {
            console.error("Failed to delete website:", err);
            alert("An unexpected error occurred.");
        }
        setIsProcessing(false);
    };

    // --- 4. Memoized Filtering and Stats ---
    const stats = useMemo(() => {
        return {
            total: websites.length,
            active: websites.filter(w => w.status === 'active').length,
            pending: websites.filter(w => w.status === 'pending').length,
            maintenance: websites.filter(w => w.maintenance).length,
        }
    }, [websites]);

    const filteredProjects = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return websites
            .filter(p => {
                // Filter by status
                if (filterStatus === FILTER_ALL) return true;
                return p.status === filterStatus;
            })
            .filter(p =>
                // Filter by search term
                !searchTerm ||
                (p.label?.toLowerCase().includes(lowerSearch)) ||
                (p.url?.toLowerCase().includes(lowerSearch)) ||
                (p.user?.username?.toLowerCase().includes(lowerSearch)) ||
                (p.clerk_id?.toLowerCase().includes(lowerSearch))
            );
    }, [websites, searchTerm, filterStatus]);

    // --- 5. Selection Logic ---
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
            const allFilteredIds = filteredProjects.map(p => p.id);
            setSelectedIds(new Set(allFilteredIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    const isAllFilteredSelected = filteredProjects.length > 0 && selectedIds.size === filteredProjects.length;
    const isIndeterminate = selectedIds.size > 0 && !isAllFilteredSelected;

    // --- 6. Bulk Action Handlers ---
    const handleBulkUpdate = async (updates) => {
        if (!supabase || selectedIds.size === 0) return;
        setIsProcessing(true);
        try {
            const idsToUpdate = Array.from(selectedIds);
            const { error } = await supabase
                .from("websites")
                .update(updates)
                .in("id", idsToUpdate);
            if (error) throw error;
            await fetchWebsites();
            setSelectedIds(new Set());
        } catch (err) {
            console.error("❌ Supabase bulk update error:", err.message);
        }
        setIsProcessing(false);
    };

    const handleBulkDelete = async () => {
        if (!supabase || selectedIds.size === 0) return;
        setIsProcessing(true);
        try {
            const idsToDelete = Array.from(selectedIds);
            const { error } = await supabase
                .from("websites")
                .delete()
                .in("id", idsToDelete);
            if (error) throw error;
            await fetchWebsites();
            setSelectedIds(new Set());
        } catch (err) {
            console.error("❌ Supabase bulk delete error:", err.message);
        }
        setIsProcessing(false);
        setShowBulkDeleteConfirm(false);
    };

    // --- 7. Form Handlers ---
    const handleNewProjectChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewProject(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleEditProjectChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingProject(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const openEditModal = (project) => {
        setEditingProject({ ...project, maintenance: !!project.maintenance, logo: project.logo || "" });
        setShowEditModal(project);
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatsCard title="Total Projects" value={stats.total} icon={Archive} colorClass="bg-indigo-100 text-indigo-600" />
                    <StatsCard title="Active" value={stats.active} icon={CheckCircle} colorClass="bg-green-100 text-green-700" />
                    <StatsCard title="Pending" value={stats.pending} icon={Loader2} colorClass="bg-yellow-100 text-yellow-700" />
                    <StatsCard title="Maintenance Plan" value={stats.maintenance} icon={Wrench} colorClass="bg-slate-100 text-slate-600" />
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {[FILTER_ALL, ...STATUS_OPTIONS].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize ${filterStatus === status
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name, URL, user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Bulk Action Bar */}
                {selectedIds.size > 0 && (
                    <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-lg border border-indigo-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <span className="font-medium">
                            {selectedIds.size} project{selectedIds.size > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm">Set Status:</span>
                            <button onClick={() => handleBulkUpdate({ status: 'active' })} className="px-3 py-1 text-xs font-medium rounded-md text-green-800 bg-green-100 hover:bg-green-200">
                                Active
                            </button>
                            <button onClick={() => handleBulkUpdate({ status: 'pending' })} className="px-3 py-1 text-xs font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200">
                                Pending
                            </button>
                            <button onClick={() => handleBulkUpdate({ status: 'inactive' })} className="px-3 py-1 text-xs font-medium rounded-md text-slate-800 bg-slate-100 hover:bg-slate-200">
                                Inactive
                            </button>
                            <span className="text-sm ml-2">Maint:</span>
                            <button onClick={() => handleBulkUpdate({ maintenance: true })} className="px-3 py-1 text-xs font-medium rounded-md text-indigo-800 bg-indigo-100 hover:bg-indigo-200">
                                On
                            </button>
                            <button onClick={() => handleBulkUpdate({ maintenance: false })} className="px-3 py-1 text-xs font-medium rounded-md text-slate-800 bg-slate-100 hover:bg-slate-200">
                                Off
                            </button>
                            <button onClick={() => setShowBulkDeleteConfirm(true)} className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md text-red-100 bg-red-600 hover:bg-red-700 ml-4">
                                <Trash size={14} /> Delete
                            </button>
                        </div>
                    </div>
                )}

                {/* --- Projects Table --- */}
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
                                        ref={el => el && (el.indeterminate = isIndeterminate)}
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">URL</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Maintenance Plan</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <LoadingSpinner text="Loading projects..." colSpan={8} />
                            ) : filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className={`${selectedIds.has(project.id) ? "bg-indigo-100" : "bg-white"} hover:bg-slate-50/50 transition-colors`}
                                    >
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                onChange={() => handleSelectOne(project.id)}
                                                checked={selectedIds.has(project.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                            <div className="flex items-center gap-2">
                                                {project.logo ? (
                                                    <img src={project.logo} alt="logo" className="w-6 h-6 rounded-full border border-slate-200" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-500">
                                                        {project.label ? project.label[0] : '?'}
                                                    </div>
                                                )}
                                                {project.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-500 hover:underline">
                                                {project.url.replace(/^https?:\/\//, '')}
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{project.user?.username || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusPill status={project.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StagePill stage={project.development_stage} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><MaintenancePill maintenance={project.maintenance} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center gap-2">
                                                <button onClick={() => openEditModal(project)} className="flex items-center gap-1.5 px-3 py-1 rounded-md text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button onClick={() => setShowDeleteConfirm(project)} className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                        No websites found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Modals --- */}
            {showCreateModal && (
                <Modal title="Create New Project" onClose={() => setShowCreateModal(false)}>
                    <form onSubmit={createWebsite} className="flex flex-col gap-5">
                        <FormInput label="Project Name" id="label" name="label" value={newProject.label} onChange={handleNewProjectChange} required />
                        <FormInput label="Project URL" id="url" name="url" type="url" placeholder="https://example.com" value={newProject.url} onChange={handleNewProjectChange} required />
                        <FormInput label="Logo URL" id="logo" name="logo" type="url" placeholder="https://example.com/logo.png" value={newProject.logo} onChange={handleNewProjectChange} />
                        <UserSearchInput
                            label="User"
                            id="clerk_id"
                            value={newProject.clerk_id}
                            onChange={handleNewProjectChange}
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Status" id="status" name="status" value={newProject.status} onChange={handleNewProjectChange}>
                                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FormSelect>
                            <FormSelect label="Development Stage" id="development_stage" name="development_stage" value={newProject.development_stage} onChange={handleNewProjectChange}>
                                {STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FormSelect>
                        </div>
                        <FormToggle
                            label="Maintenance Plan"
                            id="maintenance"
                            name="maintenance"
                            checked={newProject.maintenance}
                            onChange={handleNewProjectChange}
                            helpText="If active, this project has an ongoing maintenance plan."
                        />
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={isProcessing || !newProject.clerk_id}>
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {showEditModal && editingProject && (
                <Modal title="Edit Project" onClose={() => setShowEditModal(null)}>
                    <form onSubmit={updateWebsite} className="flex flex-col gap-5">
                        <FormInput label="Project Name" id="label" name="label" value={editingProject.label} onChange={handleEditProjectChange} required />
                        <FormInput label="Project URL" id="url" name="url" type="url" placeholder="https://example.com" value={editingProject.url} onChange={handleEditProjectChange} required />
                        <FormInput label="Logo URL" id="logo" name="logo" type="url" placeholder="https://example.com/logo.png" value={editingProject.logo} onChange={handleEditProjectChange} />
                        <UserSearchInput
                            key={showEditModal.id}
                            label="User"
                            id="clerk_id"
                            value={editingProject.clerk_id}
                            initialUsername={showEditModal.user?.username}
                            onChange={handleEditProjectChange}
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Status" id="status" name="status" value={editingProject.status} onChange={handleEditProjectChange}>
                                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FormSelect>
                            <FormSelect label="Development Stage" id="development_stage" name="development_stage" value={editingProject.development_stage} onChange={handleEditProjectChange}>
                                {STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FormSelect>
                        </div>
                        <FormToggle
                            label="Maintenance Plan"
                            id="maintenance"
                            name="maintenance"
                            checked={editingProject.maintenance}
                            onChange={handleEditProjectChange}
                            helpText="If active, this project has an ongoing maintenance plan."
                        />
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                            <Button type="button" variant="secondary" onClick={() => setShowEditModal(null)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={isProcessing || !editingProject.clerk_id}>
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                {isProcessing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Single Delete Modal */}
            {showDeleteConfirm && (
                <ConfirmWithInputDialog
                    open={!!showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(null)}
                    onConfirm={deleteWebsite}
                    username={showDeleteConfirm.label} // Use project label for confirmation
                    confirmationText={showDeleteConfirm.label}
                    action="Delete Project"
                    description="This action cannot be undone. This project will be permanently removed."
                    isProcessing={isProcessing}
                />
            )}

            {/* Bulk Delete Modal */}
            <ConfirmWithInputDialog
                open={showBulkDeleteConfirm}
                onClose={() => setShowBulkDeleteConfirm(false)}
                onConfirm={handleBulkDelete}
                username={CONFIRMATION_TEXT_BULK}
                confirmationText={CONFIRMATION_TEXT_BULK} // Require typing "DELETE ALL"
                action={`Delete ${selectedIds.size} Projects`}
                description={`This will permanently delete ${selectedIds.size} projects. This action cannot be undone.`}
                isProcessing={isProcessing}
            />

            {/* Global Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
            )}
        </>
    );
}
