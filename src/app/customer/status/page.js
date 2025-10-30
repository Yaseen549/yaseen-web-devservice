"use client";

import React, { useState } from "react";
import { Search, Loader2, Circle, CheckCircle2, XCircle } from "lucide-react";
import Header from "@/app/partials/Header";

// --- Mock Data ---
// This is the data you would fetch from your API
const MOCK_SAMPLE_ID = 'PROJ-12345';
const mockProjectData = {
    id: 'PROJ-12345',
    title: 'E-commerce Platform Redevelopment',
    clientName: 'FutureGadget Labs',
    status: 'In Development',
    currentStage: 'Development',
    estimatedCompletion: '2025-12-15', // ISO date string
    stages: [
        { name: 'Project Kick-off', status: 'completed', date: '2025-10-01' },
        { name: 'Design & Prototyping', status: 'completed', date: '2025-10-15' },
        { name: 'Development', status: 'in-progress', date: '2025-10-16' },
        { name: 'Testing & QA', status: 'pending', date: null },
        { name: 'Final Launch', status: 'pending', date: null },
    ]
};

// --- Status Timeline Icon Component ---
// A helper to determine which icon to show in the timeline
const StageIcon = ({ status }) => {
    switch (status) {
        case 'completed':
            return <CheckCircle2 className="w-5 h-5 text-green-400" />;
        case 'in-progress':
            return <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />;
        case 'pending':
        default:
            return <Circle className="w-5 h-5 text-gray-500" />;
    }
};

// --- The New Status Preview Card ---
// This is the "preview" you asked for.
const StatusPreview = ({ project }) => {
    const { title, id, status, estimatedCompletion, stages } = project;
    const completionDate = new Date(estimatedCompletion).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl shadow-black/20 p-6 md:p-8 mt-10 text-left">
            {/* Header */}
            <div className="border-b border-gray-700 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-gray-400">Project ID: <span className="font-mono text-gray-300">{id}</span></p>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider">Status</p>
                    <p className="text-lg font-semibold text-violet-400">{status}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider">Est. Completion</p>
                    <p className="text-lg font-semibold text-white">{completionDate}</p>
                </div>
            </div>

            {/* Timeline */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Project Timeline</h3>
                <ul className="space-y-4">
                    {stages.map((stage, index) => (
                        <li key={stage.name} className="relative flex gap-x-4 group">
                            {/* Vertical line (hidden on last item) */}
                            {index !== stages.length - 1 && (
                                <div className="absolute left-3 top-7 h-full w-0.5 bg-gray-700" />
                            )}

                            {/* Icon */}
                            <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${stage.status === 'completed' ? 'bg-green-900/50' :
                                    stage.status === 'in-progress' ? 'bg-violet-900/50' :
                                        'bg-gray-800'
                                }`}>
                                <StageIcon status={stage.status} />
                            </div>

                            {/* Text */}
                            <div className="flex-auto pt-0.5">
                                <p className={`font-semibold ${stage.status === 'pending' ? 'text-gray-400' : 'text-white'
                                    }`}>
                                    {stage.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {stage.date ? new Date(stage.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Pending'}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


// --- Main Page Component ---
export default function StatusPage() {
    const [projectId, setProjectId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [projectStatus, setProjectStatus] = useState(null); // Will hold the found project object
    const [error, setError] = useState(null); // Will hold any error messages

    const handleCheckStatus = (e) => {
        e.preventDefault();
        if (!projectId.trim()) {
            setError("Please enter a Project ID.");
            return;
        }

        // 1. Reset state
        setIsLoading(true);
        setProjectStatus(null);
        setError(null);

        // 2. --- Simulate API call ---
        // In a real app, you would 'await fetch(...)' here.
        setTimeout(() => {
            if (projectId.trim().toUpperCase() === MOCK_SAMPLE_ID) {
                // 3a. Success
                setProjectStatus(mockProjectData);
            } else {
                // 3b. Not Found
                setError("Project ID not found. Please check the ID and try again.");
            }
            // 4. Finish loading
            setIsLoading(false);
        }, 1500); // 1.5 second delay
        // --- End Simulated API call ---
    };

    return (
        <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
            {/* <StarsBackground /> */}
            <Header />

            {/* ===== Page Content ===== */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 pt-40">
                <div className="max-w-2xl w-full text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
                        Project{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                            Status
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10">
                        Enter your unique Project ID below to check the current development status.
                    </p>

                    <form
                        onSubmit={handleCheckStatus}
                        className="flex flex-col sm:flex-row gap-4 mb-3"
                    >
                        <input
                            type="text"
                            name="project_id"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            placeholder="Enter Your Project ID"
                            required
                            className="flex-grow bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-6 py-3 rounded-lg text-md font-semibold text-white shadow-lg shadow-violet-800/30 transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            {isLoading ? "Checking..." : "Check Status"}
                        </button>
                    </form>

                    {/* --- Sample ID Prompt --- */}
                    <p className="text-sm text-gray-500">
                        Try a sample ID:{" "}
                        <button
                            onClick={() => setProjectId(MOCK_SAMPLE_ID)}
                            className="font-mono text-violet-400 hover:text-violet-300 transition"
                        >
                            {MOCK_SAMPLE_ID}
                        </button>
                    </p>
                </div>

                {/* ===== Results Section ===== */}
                <div className="w-full max-w-2xl">
                    {/* 1. Loading State */}
                    {isLoading && (
                        <div className="mt-10 flex justify-center items-center gap-3">
                            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                            <p className="text-lg text-gray-300">Fetching project details...</p>
                        </div>
                    )}

                    {/* 2. Error State */}
                    {error && (
                        <div className="mt-10 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 flex items-center gap-3">
                            <XCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* 3. Success State */}
                    {projectStatus && (
                        <StatusPreview project={projectStatus} />
                    )}
                </div>
            </section>
        </main>
    );
}
