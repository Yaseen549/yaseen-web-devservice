// components/admin/ui.js
"use client";

import React, { useState } from "react";
import { X, Check, Copy, Loader2 } from "lucide-react";

// --- Constants ---
export const STATUS_OPTIONS = ["active", "pending", "inactive"];
export const STAGE_OPTIONS = ["planning", "design", "development", "testing", "deployment", "deployed"];

// --- Modal (Light Mode) ---
export const Modal = ({ children, onClose, title }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose}></div>
        <div
            className="relative bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-md m-4 z-10"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);

// --- FormInput (Light Mode) ---
export const FormInput = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        <input
            id={id}
            {...props}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
    </div>
);

// --- FormSelect (Light Mode) ---
export const FormSelect = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        <select
            id={id}
            {...props}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        >
            {children}
        </select>
    </div>
);

// --- Button (Light Mode) ---
export const Button = ({ children, onClick, variant = "primary", className = "", ...props }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-indigo-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// --- StatusPill (Light Mode) ---
export const StatusPill = ({ status }) => {
    const colors = {
        active: "bg-green-100 text-green-800 border-green-200",
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        inactive: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return (
        <span className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize border ${colors[status] || colors.inactive}`}>
            {status}
        </span>
    );
};

// --- StagePill (Light Mode) ---
export const StagePill = ({ stage }) => (
    <span className="px-3 py-0.5 rounded-full text-xs font-medium capitalize bg-slate-100 text-slate-700 border border-slate-200">
        {stage}
    </span>
);

// --- MaintenancePill (Light Mode) ---
export const MaintenancePill = ({ maintenance }) => {
    const isTrue = !!maintenance; // Ensure it's a boolean
    const text = isTrue ? "Active" : "Inactive";
    const colorClass = isTrue
        ? "bg-green-100 text-green-800 border-green-200" // Style for "Active"
        : "bg-slate-100 text-slate-600 border-slate-200"; // Style for "Inactive"

    return (
        <span className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize border ${colorClass}`}>
            {text}
        </span>
    );
};

// --- CopyButton (Light Mode) ---
export const CopyButton = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copy = async () => {
        if (!textToCopy) return;
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <button
            onClick={copy}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
};

// --- LoadingSpinner (Light Mode) ---
export const LoadingSpinner = ({ text = "Loading..." }) => (
    <tr>
        <td colSpan="100%" className="px-6 py-12 text-center text-slate-500">
            <div className="flex justify-center items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {text}
            </div>
        </td>
    </tr>
);