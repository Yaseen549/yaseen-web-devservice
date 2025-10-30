// app/components/sections/ClientLogosSection.js
"use client";

import React from "react";

// Data specific to this section
const clientLogos = [
    // --- THIS IS YOUR LOCAL LOGO ---
    // { name: "pullingoo", logo: "/clients/pullingoo.png" },
    // { name: "shariffpharmacy", logo: "/clients/shariffpharmacy.png" },

    // --- These are the remaining placeholders ---
    // { name: "Client 3", logo: "https://placehold.co/150x60/171717/333333?text=Client+3" },
    // { name: "Client 4", logo: "https://placehold.co/150x60/171717/333333?text=Client+4" },
    // { name: "Client 5", logo: "https://placehold.co/150x60/171717/333333?text=Client+5" },
    // { name: "Client 6", logo: "https://placehold.co/150x60/171717/333333?text=Client+6" },
];

export default function ClientLogosSection() {

    if(clientLogos >= 0) return ;
    
    return (
        <section id="clients" className="max-w-7xl mx-auto px-6 py-24 z-10">
            <h3 className="text-center text-gray-400 text-sm font-semibold uppercase tracking-wider mb-8">
                Trusted by leading companies
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                {clientLogos.map((client) => (
                    <img
                        key={client.name}
                        src={client.logo}
                        alt={client.name}
                        className="h-8 md:h-10 filter grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                    />
                ))}
            </div>
        </section>
    );
}