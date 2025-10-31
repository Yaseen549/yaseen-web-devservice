"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";

export default function ConfirmWithInputDialog({
    username,
    open,
    onClose,
    onConfirm,
    description, // ✅ new prop
    action,
}) {
    const [inputValue, setInputValue] = useState("");

    const handleConfirm = () => {
        if (inputValue !== username) return;
        onConfirm();
        setInputValue("");
    };

    const handleCancel = () => {
        setInputValue("");
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/70 backdrop-blur-md p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 border transition-colors duration-200 bg-[#121212] border-neutral-700 dark:bg-white dark:border-neutral-300"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Trash2 size={20} />
                                Confirm {action}
                            </h2>
                            <button onClick={handleCancel} className="hover:text-red-500">
                                <X />
                            </button>
                        </div>

                        {/* ✅ Optional Description */}
                        {description && (
                            <p className="mb-3 text-sm text-gray-400 dark:text-gray-600 leading-relaxed">
                                {description}
                            </p>
                        )}

                        {/* Username confirmation line */}
                        <p className="mb-4">
                            Type <span className="font-semibold">{username}</span> to confirm {action}.
                        </p>

                        {/* Input */}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter username"
                            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 mb-4
              border-neutral-700 bg-[#121212] text-neutral-200 dark:border-neutral-300 dark:bg-white dark:text-neutral-800"
                        />

                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors duration-200
                bg-gray-700 hover:bg-gray-600 text-white dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={inputValue !== username}
                                className="px-4 py-2 rounded-lg text-white disabled:opacity-60 transition-colors duration-200
                bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                            >
                                {action}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
