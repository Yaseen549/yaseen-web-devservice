"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, useUser, useClerk } from "@clerk/nextjs";
import {
    ChevronDown,
    LogOut,
    Settings,
    LayoutDashboard,
    Users, // Customer
    Server, // Status
    ClipboardList, // Requirements
    Info, // About Us
    UserPlus, // Join Us
    Mail, // Contact Us
} from "lucide-react";
import SiteLogo from "@/components/siteLogo/SiteLogo";

// --- Dropdown Item Components ---

// Standard Dropdown Item (Icon + Text)
const DropdownItem = ({ href, icon: Icon, children }) => (
    <Link
        href={href}
        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700/80 hover:text-white transition duration-150 cursor-pointer"
    >
        <Icon className="w-4 h-4 text-violet-300" />
        <span>{children}</span>
    </Link>
);

// Dropdown Item with Description - Used for Customer
const DropdownItemWithDescription = ({ href, icon: Icon, title, description }) => (
    <Link
        href={href}
        className="group flex items-start gap-3 p-3 rounded-md hover:bg-gray-700/80 transition duration-150 cursor-pointer"
    >
        <div className="mt-1">
            <Icon className="w-4 h-4 text-violet-300 group-hover:text-violet-200" />
        </div>
        <div>
            <p className="font-semibold text-sm text-white">{title}</p>
            <p className="text-xs text-gray-400 group-hover:text-gray-300">{description}</p>
        </div>
    </Link>
);


// --- Main Header Component ---
export default function Header() {
    // State for all three dropdowns
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
    const [extrasDropdownOpen, setExtrasDropdownOpen] = useState(false);

    // Refs for all three dropdowns
    const accountRef = useRef(null);
    const customerRef = useRef(null);
    const extrasRef = useRef(null);

    const { user } = useUser();
    const { signOut } = useClerk();

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setAccountDropdownOpen(false);
            }
            if (customerRef.current && !customerRef.current.contains(event.target)) {
                setCustomerDropdownOpen(false);
            }
            if (extrasRef.current && !extrasRef.current.contains(event.target)) {
                setExtrasDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Toggle functions now close other dropdowns
    const toggleAccountDropdown = () => {
        setAccountDropdownOpen((prev) => !prev);
        setCustomerDropdownOpen(false);
        setExtrasDropdownOpen(false);
    };

    const toggleCustomerDropdown = () => {
        setCustomerDropdownOpen((prev) => !prev);
        setAccountDropdownOpen(false);
        setExtrasDropdownOpen(false);
    };

    const toggleExtrasDropdown = () => {
        setExtrasDropdownOpen((prev) => !prev);
        setAccountDropdownOpen(false);
        setCustomerDropdownOpen(false);
    };

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl z-50 px-6">
            <div className="backdrop-blur-lg border-b border-x border-gray-800/50 rounded-b-xl py-3 px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="cursor-pointer">
                        <SiteLogo />
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex gap-8 text-sm text-gray-300 items-center">
                        <a href="/#services" className="hover:text-violet-400 transition">
                            Services
                        </a>
                        <a href="/#portfolio" className="hover:text-violet-400 transition">
                            Portfolio
                        </a>
                        <a href="/#pricing" className="hover:text-violet-400 transition">
                            Pricing
                        </a>
                        <a href="/#testimonials" className="hover:text-violet-400 transition cursor-pointer">
                            Testimonials
                        </a>

                        {/* Customer Dropdown */}
                        <div className="relative" ref={customerRef}>
                            <button
                                onClick={toggleCustomerDropdown}
                                className="flex items-center gap-1 hover:text-violet-400 transition duration-300 cursor-pointer"
                            >
                                Customer
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${customerDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {customerDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-md shadow-lg p-2 z-50">
                                    <DropdownItemWithDescription
                                        href="/customer/status"
                                        icon={Server}
                                        title="Project Status"
                                        description="Check the current development stage of your project."
                                    />
                                    <DropdownItemWithDescription
                                        href="/customer/requirement"
                                        icon={ClipboardList}
                                        title="Submit Requirements"
                                        description="Discuss new features or start a new project."
                                    />
                                </div>
                            )}
                        </div>

                        {/* Extras Dropdown */}
                        <div className="relative" ref={extrasRef}>
                            <button
                                onClick={toggleExtrasDropdown}
                                className="flex items-center gap-1 hover:text-violet-400 transition duration-300 cursor-pointer"
                            >
                                Extras
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${extrasDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {extrasDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-md shadow-lg p-2 z-50">
                                    <DropdownItem href="/pages/about" icon={Info}>About Us</DropdownItem>
                                    <DropdownItem href="/pages/join" icon={UserPlus}>Join Us</DropdownItem>
                                    <DropdownItem href="/pages/contact" icon={Mail}>Contact Us</DropdownItem>
                                </div>
                            )}
                        </div>

                        <a href="/#contact" className="hover:text-violet-400 transition">
                            Contact
                        </a>
                    </nav>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="bg-violet-600 px-4 py-2 rounded-lg font-semibold hover:bg-violet-700 transition">
                                    Sign In
                                </button>
                            </SignInButton>
                            <Link
                                href="/sign-up"
                                className="border border-violet-600 px-4 py-2 rounded-lg font-semibold text-violet-600 hover:bg-violet-700 hover:text-white transition"
                            >
                                Sign Up
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <div className="relative" ref={accountRef}>
                                {/* Avatar Button */}
                                <button
                                    onClick={toggleAccountDropdown}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 border border-gray-700 rounded-full hover:bg-gray-700/60 transition"
                                >
                                    <img
                                        src={user?.imageUrl}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full border border-gray-700"
                                    />
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transition-transform ${accountDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {accountDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 animate-fadeIn">
                                        <div className="px-4 py-3 border-b border-gray-800">
                                            <p className="text-sm font-semibold text-white truncate">
                                                {user?.fullName || "User"}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                        </div>

                                        <div className="flex flex-col py-2 text-sm text-gray-300">
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 transition"
                                                onClick={() => setAccountDropdownOpen(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-violet-400" />
                                                Dashboard
                                            </Link>

                                            <button
                                                onClick={async () => {
                                                    await signOut();
                                                    setAccountDropdownOpen(false);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 transition text-left w-full"
                                            >
                                                <LogOut className="w-4 h-4 text-rose-400" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    );
}

