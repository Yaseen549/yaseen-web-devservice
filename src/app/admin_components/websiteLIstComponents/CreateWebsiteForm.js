"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Plus, Loader2 } from "lucide-react";
import {
    Modal,
    FormInput,
    FormSelect,
    Button,
    STATUS_OPTIONS,
    STAGE_OPTIONS,
} from "../ui"; // Assuming these are available at './ui'
// import UserSearchInput from "./UserSearchInput";
import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";
import UserSearchInput from "../UserSearchInput";
// Assuming FormToggle is either made global or you can import it from the WebsiteList file path
// import { FormToggle } from "../components/WebsiteList";

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

// Set default values for the new website object
const DEFAULT_NEW_PROJECT = {
    label: "",
    url: "",
    clerk_id: "",
    status: "pending",
    development_stage: "planning",
    logo: "",
    maintenance: false,
};

/**
 * Renders a button that, when clicked, opens a modal to create a new website/project.
 * It manages its own state and handles the API call.
 * @param {object} props
 * @param {() => void} props.onSuccess - Callback function to run after successful creation (e.g., to refresh the parent list).
 */
export default function CreateWebsiteForm({ onSuccess }) {
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState(DEFAULT_NEW_PROJECT);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const { getToken } = useAuth();

    // --- Form Handlers ---
    const handleProjectChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewProject(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const resetForm = () => {
        setNewProject(DEFAULT_NEW_PROJECT);
        setError(null);
    };

    // --- API Call ---
    const createWebsite = async (e) => {
        e.preventDefault();
        setError(null);
        if (!newProject.clerk_id) {
            setError("Please select a user to assign the project to.");
            return;
        }

        setIsProcessing(true);
        try {
            const token = await getToken({ template: "supabase" });
            const supabase = createPrivateSupabaseClient(token);

            const { error: apiError } = await supabase
                .from("websites")
                .insert([newProject]);

            if (apiError) throw apiError;

            // Success
            resetForm();
            setShowModal(false);
            if (onSuccess) {
                onSuccess(); // Tell the parent component to refresh the list
            }
        } catch (err) {
            console.error("Failed to create website:", err);
            setError("An unexpected error occurred. Check console for details.");
        }
        setIsProcessing(false);
    };

    // Use a separate handler for opening the modal to ensure state reset
    const handleOpenModal = () => {
        resetForm();
        setShowModal(true);
    }

    return (
        <>
            {/* Main Action Button */}
            <Button
                variant="primary"
                onClick={handleOpenModal}
                className="flex items-center gap-2"
            >
                <Plus className="w-5 h-5" /> Create New Project
            </Button>

            {/* Create Modal */}
            {showModal && (
                <Modal title="Create New Project" onClose={() => setShowModal(false)}>
                    <form onSubmit={createWebsite} className="flex flex-col gap-5">
                        <FormInput
                            label="Project Name"
                            id="label"
                            name="label"
                            value={newProject.label}
                            onChange={handleProjectChange}
                            required
                            disabled={isProcessing}
                        />
                        <FormInput
                            label="Project URL"
                            id="url"
                            name="url"
                            type="url"
                            placeholder="https://example.com"
                            value={newProject.url}
                            onChange={handleProjectChange}
                            required
                            disabled={isProcessing}
                        />
                        <FormInput
                            label="Logo URL"
                            id="logo"
                            name="logo"
                            type="url"
                            placeholder="https://example.com/logo.png"
                            value={newProject.logo}
                            onChange={handleProjectChange}
                            disabled={isProcessing}
                        />
                        {/* UserSearchInput is assumed to correctly update clerk_id */}
                        <UserSearchInput
                            label="User"
                            id="clerk_id"
                            value={newProject.clerk_id}
                            onChange={handleProjectChange}
                            required
                            disabled={isProcessing}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                label="Status"
                                id="status"
                                name="status"
                                value={newProject.status}
                                onChange={handleProjectChange}
                                disabled={isProcessing}
                            >
                                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FormSelect>
                            <FormSelect
                                label="Development Stage"
                                id="development_stage"
                                name="development_stage"
                                value={newProject.development_stage}
                                onChange={handleProjectChange}
                                disabled={isProcessing}
                            >
                                {STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </FormSelect>
                        </div>
                        <FormToggle
                            label="Maintenance Plan"
                            id="maintenance"
                            name="maintenance"
                            checked={newProject.maintenance}
                            onChange={handleProjectChange}
                            helpText="If active, this project has an ongoing maintenance plan."
                        />

                        {error && (
                            <p className="text-sm text-red-600 flex items-center gap-2 pt-2">
                                <span className="font-semibold">Error:</span> {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isProcessing || !newProject.clerk_id}
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}