"use client";

import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import SiteLogo from "@/components/siteLogo/SiteLogo";

// --- Link data ---
// Moved links here for easier management
const navLinks = [
    { label: "Home", href: "#" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
];

// Added a second list for demonstration, this structure is more scalable
const legalLinks = [
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms of Service", href: "/legal/terms-of-use" },
];

const socialLinks = [
    { icon: Github, href: "#", name: "GitHub" },
    { icon: Linkedin, href: "#", name: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@mockstudio.com", name: "Email" },
];

// --- Reusable Link Component ---
const FooterLink = ({ href, children }) => (
    <a
        href={href}
        className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
    >
        {children}
    </a>
);

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-black text-gray-400 z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* --- Main Content Area --- */}
                <div className="py-16 flex flex-col lg:flex-row justify-between gap-12">

                    {/* Left: Logo + Tagline */}
                    <div className="flex flex-col gap-4 items-center lg:items-start">
                        <SiteLogo />
                        <p className="text-gray-500 max-w-xs text-center lg:text-left">
                            Crafting digital experiences that inspire.
                        </p>
                    </div>

                    {/* Right: Link Columns */}
                    <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-24 text-center sm:text-left">

                        {/* Navigation Column */}
                        <div>
                            <h3 className="font-semibold text-gray-200 mb-4">Navigation</h3>
                            <ul className="space-y-3">
                                {/* --- THIS LINE IS FIXED --- */}
                                {navLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <FooterLink href={href}>{label}</FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Column (Example) */}
                        <div>
                            <h3 className="font-semibold text-gray-200 mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {legalLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <FooterLink href={href}>{label}</FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Bar --- */}
                <div className="py-8 border-t border-gray-800 flex flex-col-reverse md:flex-row justify-between items-center gap-6">

                    {/* Copyright */}
                    <p className="text-xs text-gray-500 text-center md:text-left">
                        © {new Date().getFullYear()} Yaseen's MockStudio. All rights reserved.
                    </p>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-5">
                        {socialLinks.map(({ icon: Icon, href, name }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit our ${name} page`}
                                className="text-gray-400 hover:text-violet-400 transition transform hover:scale-110"
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}