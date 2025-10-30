// components/admin/UserSearchInput.js
"use client";

import React, { useState, useEffect, useRef } from "react";
// import useDebounce from "../../hooks/useDebounce";
import { FormInput } from "./ui";
import { Loader2 } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

export default function UserSearchInput({ label, id, value, onChange, initialUsername = "", required }) {
    const [query, setQuery] = useState(initialUsername || "");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (debouncedQuery.length < 4) {
            setResults([]);
            setIsDropdownOpen(false);
            return;
        }
        if (debouncedQuery === initialUsername) {
            setIsDropdownOpen(false);
            return;
        }
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/admin/users?search=${encodeURIComponent(debouncedQuery)}`);
                const users = await res.json();
                if (res.ok) setResults(users);
                else setResults([]);
            } catch (error) {
                console.error("Error fetching users:", error);
                setResults([]);
            }
            setIsLoading(false);
            setIsDropdownOpen(true);
        };
        fetchUsers();
    }, [debouncedQuery, initialUsername]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (user) => {
        setQuery(user.fullname || user.username || user.clerk_id);
        onChange({ target: { name: id, value: user.clerk_id } });
        setIsDropdownOpen(false);
        setResults([]);
    };

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (value) {
            onChange({ target: { name: id, value: "" } });
        }
        if (newQuery.length >= 4) setIsDropdownOpen(true);
        else {
            setIsDropdownOpen(false);
            setResults([]);
        }
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <FormInput
                label={label}
                id={id}
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                    if (query.length >= 4 && results.length > 0) setIsDropdownOpen(true);
                }}
                placeholder="Search by name, username, email, or Clerk ID (min 4 chars)..."
                autoComplete="off"
                required={required && !value}
            />
            {isDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoading && (
                        <div className="p-3 text-gray-400 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                        </div>
                    )}
                    {!isLoading && results.length === 0 && debouncedQuery.length >= 4 && (
                        <div className="p-3 text-center text-gray-400">No users found.</div>
                    )}
                    {!isLoading && results.length > 0 && (
                        <ul className="divide-y divide-gray-700">
                            {results.map(user => (
                                <li key={user.clerk_id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(user)}
                                        className="w-full text-left p-3 hover:bg-gray-700 transition-colors"
                                    >
                                        <p className="font-medium text-white">{user.fullname || user.username || 'N/A'}</p>
                                        <p className="text-sm text-gray-400">{user.email}</p>
                                        <p className="text-xs text-gray-500 font-mono truncate">{user.clerk_id}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};