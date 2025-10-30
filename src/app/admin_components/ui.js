// components/admin/ui.js
"use client";

import React, { useState } from "react";
import { X, Check, Copy, Loader2 } from "lucide-react";

// --- Constants ---
export const STATUS_OPTIONS = ["active", "pending", "inactive"];
export const STAGE_OPTIONS = ["planning", "design", "development", "testing", "deployment", "maintenance", "deployed"];

// --- Modal ---
export const Modal = ({ children, onClose, title }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose}></div>
        <div
            className="relative bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md m-4 z-10"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
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

// --- FormInput ---
export const FormInput = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
        </label>
        <input
            id={id}
            {...props}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
        />
    </div>
);

// --- FormSelect ---
export const FormSelect = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
        </label>
        <select
            id={id}
            {...props}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
        >
            {children}
        </select>
    </div>
);

// --- Button ---
export const Button = ({ children, onClick, variant = "primary", className = "", ...props }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-violet-600 text-white hover:bg-violet-500 focus:ring-2 focus:ring-violet-400 focus:outline-none",
        secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none",
        danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:outline-none",
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

// --- StatusPill ---
export const StatusPill = ({ status }) => {
    const colors = {
        active: "bg-green-600/20 text-green-300 border-green-500/30",
        pending: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30",
        inactive: "bg-gray-600/20 text-gray-400 border-gray-500/30",
    };
    return (
        <span className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize border ${colors[status] || colors.inactive}`}>
            {status}
        </span>
    );
};

// --- StagePill ---
export const StagePill = ({ stage }) => (
    <span className="px-3 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-700/50 text-gray-300 border border-gray-600/50">
        {stage}
    </span>
);

// --- CopyButton ---
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
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
            {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
};

// --- LoadingSpinner ---
export const LoadingSpinner = ({ text = "Loading..." }) => (
    <tr>
        <td colSpan="100%" className="px-6 py-12 text-center text-gray-400">
            <div className="flex justify-center items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {text}
            </div>
        </td>
    </tr>
);