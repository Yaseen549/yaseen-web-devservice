// /components/layout/Header.js (or wherever you have it)
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    useUser,
    useClerk,
} from "@clerk/nextjs";
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
    Menu, // Mobile Menu Icon
    X, // Mobile Close Icon
} from "lucide-react";
import SiteLogo from "@/components/siteLogo/SiteLogo";

// --- Dropdown Item Components (No changes needed) ---

// Standard Dropdown Item (Icon + Text)
const DropdownItem = ({ href, icon: Icon, children, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700/80 hover:text-white transition duration-150 cursor-pointer"
    >
        <Icon className="w-4 h-4 text-violet-300" />
        <span>{children}</span>
    </Link>
);

// Dropdown Item with Description - Used for Customer
const DropdownItemWithDescription = ({
    href,
    icon: Icon,
    title,
    description,
    onClick,
}) => (
    <Link
        href={href}
        onClick={onClick}
        className="group flex items-start gap-3 p-3 rounded-md hover:bg-gray-700/80 transition duration-150 cursor-pointer"
    >
        <div className="mt-1">
            <Icon className="w-4 h-4 text-violet-300 group-hover:text-violet-200" />
        </div>
        <div>
            <p className="font-semibold text-sm text-white">{title}</p>
            <p className="text-xs text-gray-400 group-hover:text-gray-300">
                {description}
            </p>
        </div>
    </Link>
);

// --- Main Header Component ---
export default function Header() {
    // State for desktop dropdowns
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
    const [extrasDropdownOpen, setExtrasDropdownOpen] = useState(false);

    // --- NEW: State for mobile menu ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileCustomerOpen, setMobileCustomerOpen] = useState(false);
    const [mobileExtrasOpen, setMobileExtrasOpen] = useState(false);

    // Refs for desktop dropdowns
    const accountRef = useRef(null);
    const customerRef = useRef(null);
    const extrasRef = useRef(null);

    const { user } = useUser();
    const { signOut } = useClerk();

    // Close desktop dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                accountRef.current &&
                !accountRef.current.contains(event.target)
            ) {
                setAccountDropdownOpen(false);
            }
            if (
                customerRef.current &&
                !customerRef.current.contains(event.target)
            ) {
                setCustomerDropdownOpen(false);
            }
            if (
                extrasRef.current &&
                !extrasRef.current.contains(event.target)
            ) {
                setExtrasDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Toggle functions for desktop dropdowns
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

    // --- NEW: Function to close mobile menu ---
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl z-40 px-6">
                <div className="backdrop-blur-lg border-b border-x border-gray-800/50 rounded-b-xl py-3 px-6">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="cursor-pointer" onClick={closeMobileMenu}>
                            <SiteLogo />
                        </Link>

                        {/* --- MODIFIED: Desktop Navigation --- */}
                        <nav className="hidden md:flex gap-8 text-sm text-gray-300 items-center">
                            <a
                                href="/#services"
                                className="hover:text-violet-400 transition"
                            >
                                Services
                            </a>
                            <a
                                href="/#portfolio"
                                className="hover:text-violet-400 transition"
                            >
                                Portfolio
                            </a>
                            <a
                                href="/#pricing"
                                className="hover:text-violet-400 transition"
                            >
                                Pricing
                            </a>
                            <a
                                href="/#testimonials"
                                className="hover:text-violet-400 transition cursor-pointer"
                            >
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
                                        className={`w-4 h-4 transition-transform duration-200 ${customerDropdownOpen
                                                ? "rotate-180"
                                                : ""
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
                                        className={`w-4 h-4 transition-transform duration-200 ${extrasDropdownOpen
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                    />
                                </button>
                                {extrasDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-md shadow-lg p-2 z-50">
                                        <DropdownItem
                                            href="/pages/about"
                                            icon={Info}
                                        >
                                            About Us
                                        </DropdownItem>
                                        {/* <DropdownItem
                                            href="/pages/join"
                                            icon={UserPlus}
                                        >
                                            Join Us
                                        </DropdownItem> */}
                                        <DropdownItem
                                            href="/pages/contact"
                                            icon={Mail}
                                        >
                                            Contact Us
                                        </DropdownItem>
                                    </div>
                                )}
                            </div>

                            <a
                                href="/#contact"
                                className="hover:text-violet-400 transition"
                            >
                                Contact
                            </a>
                        </nav>
                        {/* --- END OF DESKTOP NAV --- */}


                        {/* --- MODIFIED: Auth & Mobile Toggle --- */}
                        <div className="flex items-center gap-4">
                            {/* Desktop Auth */}
                            <div className="hidden md:flex items-center gap-4">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="bg-violet-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-violet-700 transition">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <div className="relative" ref={accountRef}>
                                        <button
                                            onClick={toggleAccountDropdown}
                                            className="flex items-center gap-1.5 p-1 bg-gray-800/60 border border-gray-700 rounded-full hover:bg-gray-700/60 transition"
                                        >
                                            <img
                                                src={user?.imageUrl}
                                                alt="User Avatar"
                                                className="w-7 h-7 rounded-full border border-gray-700"
                                            />
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-400 transition-transform mr-1 ${accountDropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                            />
                                        </button>

                                        {accountDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50 animate-fadeIn">
                                                <div className="px-3 py-2.5 border-b border-gray-800">
                                                    <p className="text-sm font-semibold text-white truncate">
                                                        {user?.fullName ||
                                                            "User"}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {
                                                            user
                                                                ?.primaryEmailAddress
                                                                ?.emailAddress
                                                        }
                                                    </p>
                                                </div>

                                                <div className="flex flex-col py-1.5 text-sm text-gray-300">
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800 transition"
                                                        onClick={() =>
                                                            setAccountDropdownOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <LayoutDashboard className="w-4 h-4 text-violet-400" />
                                                        Dashboard
                                                    </Link>

                                                    <button
                                                        onClick={async () => {
                                                            await signOut();
                                                            setAccountDropdownOpen(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800 transition text-left w-full"
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

                            {/* --- NEW: Mobile Menu Button --- */}
                            <button
                                className="p-2 md:hidden text-gray-300 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- NEW: Mobile Menu Drawer --- */}

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeMobileMenu}
            ></div>

            {/* Menu Panel */}
            <div
                className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-gray-950 border-l border-gray-800 shadow-xl flex flex-col z-50 md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Panel Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <SiteLogo />
                    <button
                        className="p-2 text-gray-400 hover:text-white"
                        onClick={closeMobileMenu}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Panel Navigation */}
                <nav className="flex-1 flex flex-col p-6 text-gray-300 overflow-y-auto">
                    <a
                        href="/#services"
                        className="block px-4 py-3 rounded-md hover:bg-gray-800"
                        onClick={closeMobileMenu}
                    >
                        Services
                    </a>
                    <a
                        href="/#portfolio"
                        className="block px-4 py-3 rounded-md hover:bg-gray-800"
                        onClick={closeMobileMenu}
                    >
                        Portfolio
                    </a>
                    <a
                        href="/#pricing"
                        className="block px-4 py-3 rounded-md hover:bg-gray-800"
                        onClick={closeMobileMenu}
                    >
                        Pricing
                    </a>
                    <a
                        href="/#testimonials"
                        className="block px-4 py-3 rounded-md hover:bg-gray-800"
                        onClick={closeMobileMenu}
                    >
                        Testimonials
                    </a>

                    {/* Mobile Customer Accordion */}
                    <div>
                        <button
                            onClick={() =>
                                setMobileCustomerOpen(!mobileCustomerOpen)
                            }
                            className="w-full flex justify-between items-center px-4 py-3 rounded-md hover:bg-gray-800"
                        >
                            <span>Customer</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${mobileCustomerOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {mobileCustomerOpen && (
                            <div className="pl-6 pb-2">
                                <DropdownItemWithDescription
                                    href="/customer/status"
                                    icon={Server}
                                    title="Project Status"
                                    description="Check your project's stage."
                                    onClick={closeMobileMenu}
                                />
                                <DropdownItemWithDescription
                                    href="/customer/requirement"
                                    icon={ClipboardList}
                                    title="Submit Requirements"
                                    description="Start a new project."
                                    onClick={closeMobileMenu}
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile Extras Accordion */}
                    <div>
                        <button
                            onClick={() =>
                                setMobileExtrasOpen(!mobileExtrasOpen)
                            }
                            className="w-full flex justify-between items-center px-4 py-3 rounded-md hover:bg-gray-800"
                        >
                            <span>Extras</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${mobileExtrasOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {mobileExtrasOpen && (
                            <div className="pl-6 pb-2">
                                <DropdownItem
                                    href="/pages/about"
                                    icon={Info}
                                    onClick={closeMobileMenu}
                                >
                                    About Us
                                </DropdownItem>
                                {/* <DropdownItem
                                    href="/pages/join"
                                    icon={UserPlus}
                                    onClick={closeMobileMenu}
                                >
                                    Join Us
                                </DropdownItem> */}
                                <DropdownItem
                                    href="/pages/contact"
                                    icon={Mail}
                                    onClick={closeMobileMenu}
                                >
                                    Contact Us
                                </DropdownItem>
                            </div>
                        )}
                    </div>

                    <a
                        href="/#contact"
                        className="block px-4 py-3 rounded-md hover:bg-gray-800"
                        onClick={closeMobileMenu}
                    >
                        Contact
                    </a>
                </nav>

                {/* Panel Auth Footer */}
                <div className="p-6 border-t border-gray-800">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="w-full bg-violet-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 transition">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={user?.imageUrl}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border-2 border-gray-700"
                            />
                            <div>
                                <p className="text-sm font-semibold text-white truncate">
                                    {user?.fullName}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {
                                        user?.primaryEmailAddress
                                            ?.emailAddress
                                    }
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-800 transition text-gray-300 mb-2"
                            onClick={closeMobileMenu}
                        >
                            <LayoutDashboard className="w-4 h-4 text-violet-400" />
                            Dashboard
                        </Link>
                        <button
                            onClick={async () => {
                                await signOut();
                                closeMobileMenu();
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-800 transition text-gray-300"
                        >
                            <LogOut className="w-4 h-4 text-rose-400" />
                            Sign Out
                        </button>
                    </SignedIn>
                </div>
            </div>
        </>
    );
}