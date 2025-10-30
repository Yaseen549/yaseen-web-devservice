// components/admin_components/WebsiteList.js
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Trash,
    Pencil,
    ExternalLink,
    Search,
    Plus,
    Check,
} from "lucide-react";
import {
    Modal,
    FormInput,
    FormSelect,
    Button,
    StatusPill,
    StagePill,
    LoadingSpinner,
    STATUS_OPTIONS,
    STAGE_OPTIONS
} from "./ui";
import UserSearchInput from "./UserSearchInput";

export default function WebsiteList({ setParentWebsites }) {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // Form States
    const [newProject, setNewProject] = useState({
        label: "",
        url: "",
        clerk_id: "",
        status: "pending",
        development_stage: "planning",
    });
    const [editingProject, setEditingProject] = useState(null);

    // --- API Handlers ---
    const fetchWebsites = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/websites");
            const json = await res.json();
            if (json.error) {
                console.error(json.error);
                setWebsites([]);
                setParentWebsites([]); // Update parent
            } else {
                setWebsites(json.data || []);
                setParentWebsites(json.data || []); // Update parent
            }
        } catch (error) {
            console.error("Failed to fetch websites:", error);
            setWebsites([]);
            setParentWebsites([]); // Update parent
        }
        setLoading(false);
    };

    const createWebsite = async (e) => {
        e.preventDefault();
        if (!newProject.clerk_id) {
            alert("Please select a user.");
            return;
        }
        try {
            const res = await fetch("/api/admin/websites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProject),
            });
            const json = await res.json();
            if (json.error) {
                console.error(json.error);
                alert(`Error: ${json.error}`);
            } else {
                fetchWebsites(); // Refreshes state for this component AND parent
                setShowCreateModal(false);
                setNewProject({
                    label: "", url: "", clerk_id: "",
                    status: "pending", development_stage: "planning",
                });
            }
        } catch (error) {
            console.error("Failed to create website:", error);
            alert("An unexpected error occurred.");
        }
    };

    const updateWebsite = async (e) => {
        e.preventDefault();
        if (!editingProject) return;
        if (!editingProject.clerk_id) {
            alert("Please select a user.");
            return;
        }
        const { id, user, ...updates } = editingProject;
        try {
            const res = await fetch("/api/admin/websites", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, updates }),
            });
            const json = await res.json();
            if (json.error) {
                console.error(json.error);
                alert(`Error: ${json.error}`);
            } else {
                fetchWebsites(); // Refreshes state for this component AND parent
                setShowEditModal(null);
                setEditingProject(null);
            }
        } catch (error) {
            console.error("Failed to update website:", error);
            alert("An unexpected error occurred.");
        }
    };

    const deleteWebsite = async () => {
        if (!showDeleteConfirm) return;
        const { id } = showDeleteConfirm;
        try {
            const res = await fetch("/api/admin/websites", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const json = await res.json();
            if (json.error) {
                console.error(json.error);
                alert(`Error: ${json.error}`);
            } else {
                fetchWebsites(); // Refreshes state for this component AND parent
                setShowDeleteConfirm(null);
            }
        } catch (error) {
            console.error("Failed to delete website:", error);
            alert("An unexpected error occurred.");
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchWebsites();
    }, []); // Runs once on mount

    const filteredProjects = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        if (!lowerSearch) return websites;
        return websites.filter(
            (p) =>
                (p.label && p.label.toLowerCase().includes(lowerSearch)) ||
                (p.url && p.url.toLowerCase().includes(lowerSearch)) ||
                (p.user && p.user.username && p.user.username.toLowerCase().includes(lowerSearch)) ||
                (p.clerk_id && p.clerk_id.toLowerCase().includes(lowerSearch))
        );
    }, [websites, searchTerm]);

    const handleNewProjectChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    const openEditModal = (project) => {
        setEditingProject({ ...project });
        setShowEditModal(project);
    };

    const handleEditProjectChange = (e) => {
        const { name, value } = e.target;
        setEditingProject((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* --- Header: Search Bar + New Project Button --- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name, URL, user, or Clerk ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setNewProject({
                                label: "", url: "", clerk_id: "",
                                status: "pending", development_stage: "planning"
                            });
                            setShowCreateModal(true);
                        }}
                        variant="primary"
                        className="w-full md:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </Button>
                </div>

                {/* --- Projects Table --- */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">URL</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Clerk ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <LoadingSpinner text="Loading projects..." />
                            ) : filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{project.label}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-500 hover:underline">
                                                {project.url.replace(/^https?:\/\//, '')}
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{project.user?.username || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono truncate max-w-xs">{project.clerk_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusPill status={project.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StagePill stage={project.development_stage} /></td>
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
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        No websites found. Add a new project!
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
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={!newProject.clerk_id}>
                                Create Project
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
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                            <Button type="button" variant="secondary" onClick={() => setShowEditModal(null)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={!editingProject.clerk_id}>
                                <Check className="w-4 h-4" /> Save Changes
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {showDeleteConfirm && (
                <Modal title="Confirm Deletion" onClose={() => setShowDeleteConfirm(null)}>
                    <p className="text-slate-600">
                        Are you sure you want to delete the project: <strong className="text-slate-900">{showDeleteConfirm.label}</strong>?
                    </p>
                    <p className="text-sm text-slate-500 mt-2">This action cannot be undone.</p>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                        <Button type="button" variant="secondary" onClick={() => setShowDeleteConfirm(null)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="danger" onClick={deleteWebsite}>
                            <Trash className="w-4 h-4" /> Delete
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
}