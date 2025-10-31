"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Define the default settings
const defaultSettings = {
    showRocket: false,
    starRipple: true,
    starTwinkle: true,
    showStars: true,
};

// 2. Create the context
const SettingsContext = createContext({
    settings: defaultSettings,
    setSettings: () => { }, // Placeholder function
});

// 3. Create the Provider component
export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(defaultSettings);

    // Effect to load settings from localStorage on mount (client-side)
    useEffect(() => {
        let storedSettings;
        try {
            storedSettings = localStorage.getItem("starSettings");
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error("Failed to parse settings from local storage", error);
        }
    }, []);

    // Effect to save settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem("starSettings", JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings to local storage", error);
        }
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

// 4. Create a custom hook for easy access
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};