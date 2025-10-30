// app/customer/requirements/page.js
"use client";

import React from "react";
// import Header from "@/components/Header"; // Adjust path if needed
import StarsBackground from "@/components/StarsBackground"; // Adjust path if needed
import { createPublicSupabaseClient } from "@/lib/supabasePublic"; // Assuming path
import Header from "@/app/partials/Header";

export default function RequirementsPage() {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const supabase = createPublicSupabaseClient();
        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const projectType = e.target.project_type.value; // Get selected type
        const details = e.target.details.value.trim();

        // Basic validation
        if (!name || !email || !details || !projectType) {
            alert("Please fill in your name, email, select a project type, and provide details!");
            return;
        }

        // Insert into a Supabase table (e.g., 'yms_requirements')
        const { error } = await supabase
            .from("yms_requirements") // Ensure this table exists
            .insert([{ name, email, project_type: projectType, details }]);

        if (error) {
            console.error("❌ Supabase Insert Error:", error);
            alert("Something went wrong while submitting your requirements. Please try again!");
        } else {
            alert("✅ Requirements submitted successfully! We'll review them and get back to you soon.");
            e.target.reset(); // Clear the form
        }
    };


    return (
        <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
            <StarsBackground />
            <Header />

            {/* ===== Page Content ===== */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 pt-40"> {/* Added pt-40 */}
                <div className="max-w-3xl w-full">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 text-center">
                        Submit Your{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                            Requirements
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 text-center">
                        Ready to start a new project or add features to an existing one? Let us know the details!
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col gap-4 bg-gray-950/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-violet-900/10"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                        />
                        <select
                            name="project_type"
                            defaultValue="" // Add a default empty value
                            required
                            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition cursor-pointer appearance-none" // Added appearance-none
                        >
                            <option value="" disabled>Select Project Type...</option>
                            <option value="New Website">New Website</option>
                            <option value="Web App / SaaS">Web App / SaaS</option>
                            <option value="E-Commerce">E-Commerce Store</option>
                            <option value="Feature Addition">Add Feature to Existing Project</option>
                            <option value="Maintenance Request">Maintenance Request</option>
                            <option value="Other">Other (Describe below)</option>
                        </select>
                        <textarea
                            name="details"
                            rows={8}
                            placeholder="Please provide as much detail as possible about your requirements..."
                            required
                            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                        />
                        <button
                            type="submit"
                            className="mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-6 py-3 rounded-lg text-lg font-semibold text-white shadow-lg shadow-violet-800/30 transition-all transform hover:scale-105 cursor-pointer"
                        >
                            Submit Requirements
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}