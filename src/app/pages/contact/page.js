// app/contact/page.js
"use client";

import React from "react";
import StarsBackground from "@/components/StarsBackground";
import ContactForm from "@/components/ContactForm";
import Header from "@/app/partials/Header";

export default function ContactPage() {
    // Removed the handleSubmit logic, it's now in ContactForm.js

    return (
        <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
            <StarsBackground />
            <Header />

            {/* ===== Page Content ===== */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 pt-40">
                {/* Added pt-40 for header spacing */}
                <div className="max-w-3xl w-full">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 text-center">
                        Get In{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                            Touch
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 text-center">
                        Have a question, a project idea, or just want to say hello? Drop us a line!
                    </p>

                    {/* Container with the glass card styling */}
                    <div className="bg-gray-950/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-violet-900/10">
                        {/* Use the ContactForm component */}
                        <ContactForm />
                    </div>
                    {/* Removed the old form */}

                </div>
            </section>
        </main>
    );
}