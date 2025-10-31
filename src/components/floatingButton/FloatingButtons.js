"use client";

import React, { useState, useEffect } from "react";
// Make sure you have these icons imported
import { MessageSquare, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Typewriter Hook ---
// This hook types out a given string character by character.
const useTypewriter = (text, speed = 50) => {
    const [displayText, setDisplayText] = useState("");
    const isDone = text.length === displayText.length;

    useEffect(() => {
        // Reset the display text when the 'text' prop changes
        setDisplayText("");

        if (!text) return;

        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        // Cleanup function to clear the interval
        return () => clearInterval(interval);
    }, [text, speed]); // Re-run effect if text or speed changes

    return { typedText: displayText, isTypingDone: isDone };
};
// --- End Typewriter Hook ---

/**
 * A reusable component for the new "cute" buttons with an animated
 * "thinking bubble" tooltip on the left.
 * It now uses the useTypewriter hook for its message.
 */
function CuteButtonWithTooltip({
    href,
    title,
    messages,
    children,
    hoverBgClass,
}) {
    const [isHovered, setIsHovered] = useState(false);
    // State to hold the message that *should* be typed
    const [messageToType, setMessageToType] = useState("");

    // Use the typewriter hook, passing it the messageToType
    const { typedText, isTypingDone } = useTypewriter(messageToType, 40);

    // Animation variants for the bubble
    const bubbleVariants = {
        initial: { opacity: 0, scale: 0.8, x: 10 }, // Start from the right, slightly
        animate: { opacity: 1, scale: 1, x: 0 }, // Animate to final position
        exit: { opacity: 0, scale: 0.8, x: 10 }, // Exit to the right
    };

    const handleMouseEnter = () => {
        // Pick a random message from the array when hovering
        if (messages && messages.length > 0) {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            setMessageToType(randomMsg); // Set the text for the typewriter
        } else {
            setMessageToType(title); // Fallback to the main title
        }
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setMessageToType(""); // Clear the text, so the typewriter resets on next hover
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* This is the "Thinking Bubble" tooltip. */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={bubbleVariants}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute top-1/2 -translate-y-1/2 right-full mr-3 z-10"
                    >
                        {/* Bubble content area */}
                        <div
                            className={`
                relative
                px-3 py-1.5 
                text-xs font-semibold text-gray-900 bg-white 
                rounded-lg shadow-lg
                /* No whitespace-nowrap here; the ghost span below handles width */
              `}
                        >
                            {/* 1. Ghost element: Sets the width of the bubble instantly */}
                            <span className="invisible whitespace-nowrap">
                                {messageToType}
                            </span>

                            {/* 2. Visible content: Overlaid on top of the ghost element */}
                            <div className="absolute top-0 left-0 w-full h-full px-3 py-1.5">
                                <span className="whitespace-nowrap">
                                    <span>{typedText}</span>

                                    {/* 3. Blinking cursor */}
                                    {!isTypingDone && (
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                            className="inline-block w-0.5 h-3 bg-gray-900 ml-0.5"
                                            style={{ transform: "translateY(1px)" }}
                                        />
                                    )}
                                </span>
                            </div>

                            {/* 4. This creates the little triangle "tail" of the bubble */}
                            <div
                                className="
                  absolute top-1/2 -translate-y-1/2 -right-[6px]
                  w-0 h-0
                  border-t-[6px] border-t-transparent
                  border-b-[6px] border-b-transparent
                  border-l-[6px] border-l-white
                "
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* This is the tiny icon button */}
            <a
                href={href}
                title={title} // Good for accessibility (uses the simple title)
                className={`
          bg-gray-900 text-white 
          p-2 rounded-full 
          shadow-md border border-gray-700 
          transition-all duration-200
          flex items-center justify-center
          relative z-0
          ${hoverBgClass} 
        `}
            >
                {children}
            </a>
        </div>
    );
}

// Your main component implementation
export default function FloatingButtons() {
    // Curious messages for the feedback button
    const feedbackMessages = [
        "Got a bright idea?",
        "What's on your mind?",
        "Help me improve!",
        "Spotted something odd?",
        "Psst... tell me a secret.",
    ];

    // Curious messages for the testimonial button
    const testimonialMessages = [
        "Enjoying this?",
        "Share your story!",
        "Made something cool?",
        "How are we doing?",
        "What do you think?",
    ];

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            <CuteButtonWithTooltip
                href="/feedback"
                title="Feedback" // This is the fallback and accessibility title
                messages={feedbackMessages} // Pass the array of random messages
                hoverBgClass="hover:bg-violet-600 hover:border-violet-500"
            >
                <MessageSquare className="w-4 h-4" />
            </CuteButtonWithTooltip>

            <CuteButtonWithTooltip
                href="/client-say"
                title="Testimonial" // This is the fallback and accessibility title
                messages={testimonialMessages} // Pass the array of random messages
                hoverBgClass="hover:bg-fuchsia-600 hover:border-fuchsia-500"
            >
                <Star className="w-4 h-4" />
            </CuteButtonWithTooltip>
        </div>
    );
}

