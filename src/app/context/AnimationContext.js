// src/context/AnimationContext.js (or wherever you prefer)

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Define the default settings structure
const defaultSettings = {
    showRocket: true,
    starRipple: true, // Mouse interaction
    starTwinkle: true, // Blinking
    showStars: true,
};

// 2. Create the context
const AnimationContext = createContext({
    settings: defaultSettings,
    toggleSetting: () => { }, // Placeholder function
});

// 3. Create the Provider component (handles state and persistence)
export const AnimationProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);

    // Effect to load settings from localStorage on mount (Client-side only)
    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem("starSettings");
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error("Failed to load settings from local storage", error);
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

    // Function to toggle any setting by key
    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AnimationContext.Provider value={{ settings, toggleSetting }}>
            {children}
        </AnimationContext.Provider>
    );
};

// 4. Custom hook for easy consumption
export const useAnimation = () => useContext(AnimationContext);

// Export the default settings for initial component state checks if needed
export { defaultSettings };