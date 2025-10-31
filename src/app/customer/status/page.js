"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, XCircle } from "lucide-react";
import Header from "@/app/partials/Header";

export default function StatusPage() {
    const [projectId, setProjectId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleCheckStatus = (e) => {
        e.preventDefault();

        if (!projectId.trim()) {
            setError("Please enter a Project ID.");
            return;
        }

        setError(null);
        setIsLoading(true);

        // ✅ Navigate directly to the project page
        setTimeout(() => {
            router.push(`/dashboard/projects/${projectId.trim()}`);
            setIsLoading(false);
        }, 500); // small delay for smoother UX (optional)
    };

    return (
        <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
            <Header />
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

                    {error && (
                        <div className="mt-10 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 flex items-center gap-3">
                            <XCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
