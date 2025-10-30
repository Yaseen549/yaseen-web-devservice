// app/admin/[[...slug]]/page.js
"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    Globe,
    Settings,
    Menu,
    X,
    Users,
    Package, // Using Package as a sample logo
} from "lucide-react";
import DashboardOverview from "../admin_components/DashboardOverview";
import WebsiteList from "../admin_components/WebsiteList";
import UserManagement from "../admin_components/UserManagement";

// --- Data for Sidebar ---
const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
    { name: "Website List", icon: Globe, tab: "websites" },
    { name: "Users", icon: Users, tab: "users" },
    { name: "Settings", icon: Settings, tab: "settings" },
];

// --- Main Component ---
export default function AdminControl() {
    const [websites, setWebsites] = useState([]);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Sidebar Component ---
    const Sidebar = () => (
        <div className="flex flex-col justify-between h-full">
            <nav className="flex flex-col space-y-2 p-4">
                {navItems.map((item) => {
                    const isActive = activeTab === item.tab;
                    return (
                        <button
                            key={item.tab}
                            onClick={() => {
                                setActiveTab(item.tab);
                                setIsSidebarOpen(false);
                            }}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 
                        ${isActive
                                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-200">
                <button
                    className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => alert("Logout logic here")}
                >
                    <Users className="w-5 h-5" />
                    <span>Your Profile</span>
                </button>
            </div>
        </div>
    );

    // --- Content Area based on Tab ---
    const Content = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardOverview websites={websites} />;
            case "websites":
                return <WebsiteList setParentWebsites={setWebsites} />;
            case "users":
                return <UserManagement />;
            case "settings":
                return (
                    <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-xl">
                        <h3 className="text-xl font-semibold mb-4 text-slate-900">Admin Settings</h3>
                        <p className="text-slate-600">User management, API keys, and configuration options will go here.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex font-inter">
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Static Sidebar for Desktop */}
            <div className="hidden md:block w-64 bg-white border-r border-slate-200 flex-shrink-0">
                <div className="flex items-center justify-center h-16 border-b border-slate-200">
                    <Package className="w-6 h-6 text-indigo-600" />
                    <h1 className="text-xl font-bold ml-2 text-slate-900 tracking-tight">
                        AdminPanel
                    </h1>
                </div>
                <Sidebar />
            </div>

            {/* Mobile Overlay Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-center h-16 border-b border-slate-200">
                    <Package className="w-6 h-6 text-indigo-600" />
                    <h1 className="text-xl font-bold ml-2 text-slate-900 tracking-tight">
                        AdminPanel
                    </h1>
                </div>
                <Sidebar />
            </div>

            {/* Content Area */}
            <div className="flex-grow p-6 md:p-10 transition-all duration-300">
                <header className="mb-8 pt-12 md:pt-0">
                    <h2 className="text-3xl font-bold text-slate-900">
                        {navItems.find(item => item.tab === activeTab)?.name}
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                        Manage your studio's projects and overview.
                    </p>
                </header>
                <main>
                    {Content()}
                </main>
            </div>
        </div>
    );
}