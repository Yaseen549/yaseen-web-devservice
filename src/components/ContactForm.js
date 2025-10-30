// app/components/ContactForm.js
"use client";

import React from "react";
import { createPublicSupabaseClient } from "@/lib/supabasePublic"; // Ensure this path is correct

export default function ContactForm() {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const supabase = createPublicSupabaseClient();
        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const message = e.target.message.value.trim();

        if (!name || !email || !message) {
            // Consider using a more user-friendly notification instead of alert
            alert("Please fill in all fields!");
            return;
        }

        // Insert into Supabase table
        const { error } = await supabase
            .from("yms_contact_form") // Ensure this table name is correct
            .insert([{ name, email, message }]);

        if (error) {
            console.error("❌ Supabase Insert Error:", error);
            // Consider using a more user-friendly notification
            alert("Something went wrong while sending your message. Please try again!");
        } else {
            // Consider using a success message UI element
            alert("✅ Message sent successfully! We'll get back to you soon.");
            e.target.reset(); // Clear the form fields
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4" // Use w-full to fill container
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
            <textarea
                name="message"
                rows={5} // Adjusted rows slightly
                placeholder="Your Message"
                required
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
            />
            <button
                type="submit"
                className="mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-6 py-3 rounded-lg text-lg font-semibold text-white shadow-lg shadow-violet-800/30 transition-all transform hover:scale-105 cursor-pointer"
            >
                Send Message
            </button>
        </form>
    );
}
