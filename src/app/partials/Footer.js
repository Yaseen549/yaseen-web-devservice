"use client";

import React, { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Mail, MessageSquare, Settings, Star } from "lucide-react";
import SiteLogo from "@/components/siteLogo/SiteLogo";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// --- Typewriter Hook ---
const useTypewriter = (text, speed = 50) => {
    const [displayText, setDisplayText] = useState("");
    const isDone = text.length === displayText.length;

    useEffect(() => {
        setDisplayText("");
        if (!text) return;

        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.slice(0, i + 1));
                i++;
            } else clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    return { typedText: displayText, isTypingDone: isDone };
};

// --- Tooltip Wrapper ---
function TooltipButton({ href, title, messages, children, color = "indigo" }) {
    const [isHovered, setIsHovered] = useState(false);
    const [messageToType, setMessageToType] = useState("");
    const { typedText, isTypingDone } = useTypewriter(messageToType, 40);

    const bubbleVariants = {
        initial: { opacity: 0, scale: 0.8, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 10 },
    };

    const handleMouseEnter = () => {
        if (messages?.length > 0) {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            setMessageToType(randomMsg);
        } else setMessageToType(title);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setMessageToType("");
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={bubbleVariants}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-10"
                    >
                        <div className="relative px-3 py-1.5 text-xs font-semibold text-gray-900 bg-white rounded-lg shadow-lg">
                            <span className="invisible whitespace-nowrap">{messageToType}</span>
                            <div className="absolute top-0 left-0 w-full h-full px-3 py-1.5">
                                <span className="whitespace-nowrap">
                                    {typedText}
                                    {!isTypingDone && (
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                            className="inline-block w-0.5 h-3 bg-gray-900 ml-0.5"
                                        />
                                    )}
                                </span>
                            </div>
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modern flat button */}
            <a
                href={href}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md 
          bg-${color}-100 text-${color}-700 hover:bg-${color}-200 transition-all duration-300`}
            >
                {children}
                <span>{title}</span>
            </a>
            {/* incase if dark mode needed use below */}
            {/* <a
                href={href}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-all duration-300
  ${color === "indigo-dark"
                        ? "bg-indigo-900/40 text-indigo-300 border-indigo-700/40 hover:bg-indigo-800/60 hover:text-white hover:shadow-[0_0_8px_#818cf880]"
                        : color === "violet-dark"
                            ? "bg-violet-900/40 text-violet-300 border-violet-700/40 hover:bg-violet-800/60 hover:text-white hover:shadow-[0_0_8px_#a78bfa80]"
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                    }`}

            >  {children}
                <span>{title}</span>
            </a>
            */}

        </div>
    );
}

// --- Footer Links ---
const navLinks = [
    { label: "Home", href: "#" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
];
const legalLinks = [
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms of Service", href: "/legal/terms-of-use" },
];
const socialLinks = [
    { icon: Github, href: "https://github.com/Yaseen549", name: "GitHub" },
    // { icon: Linkedin, href: "#", name: "LinkedIn" },
    { icon: Mail, href: "mailto:contact@snippkit.com", name: "Email" },
];

const FooterLink = ({ href, children }) => (
    <a
        href={href}
        className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
    >
        {children}
    </a>
);

export default function Footer({ setIsSettingsOpen }) {
    const pathname = usePathname(); // get current path

    const feedbackMessages = [
        "Got a bright idea?",
        "What's on your mind?",
        "Help me improve!",
        "Spotted something odd?",
        "Psst... tell me a secret.",
    ];
    const testimonialMessages = [
        "Enjoying this?",
        "Share your story!",
        "Made something cool?",
        "How are we doing?",
        "What do you think?",
    ];

    return (
        <footer className="border-t border-gray-800 bg-black text-gray-400 z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="py-16 flex flex-col lg:flex-row justify-between gap-12">
                    {/* Left: Logo + Actions */}
                    <div className="flex flex-col gap-4 items-center lg:items-start">
                        <SiteLogo />
                        <p className="text-gray-500 max-w-xs text-center lg:text-left">
                            Crafting digital experiences that inspire.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-4">
                            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                                <TooltipButton
                                    href="/feedback"
                                    title="Feedback"
                                    messages={feedbackMessages}
                                    color="indigo"
                                >
                                    <MessageSquare size={14} />
                                </TooltipButton>

                                <TooltipButton
                                    href="/client-say"
                                    title="Send Testimonial"
                                    messages={testimonialMessages}
                                    color="green"
                                >
                                    <Star size={14} />
                                </TooltipButton>

                                {/* Show Site Settings button only on home "/" */}
                                {pathname === "/" && (
                                    <button
                                        onClick={() => setIsSettingsOpen(true)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-all duration-300"
                                    >
                                        <Settings size={14} /> Site Settings
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {/* <div className="flex flex-col gap-3 mt-4">
                            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                                
                                <TooltipButton
                                    href="/feedback"
                                    title="Feedback"
                                    messages={feedbackMessages}
                                    color="indigo-dark"
                                >
                                    <MessageSquare size={14} />
                                </TooltipButton>

                                <TooltipButton
                                    href="/client-say"
                                    title="Client Say"
                                    messages={testimonialMessages}
                                    color="violet-dark"
                                >
                                    <Star size={14} />
                                </TooltipButton>

                                <button
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md 
                 bg-cyan-900/40 text-cyan-300 border border-cyan-700/40 
                 hover:bg-cyan-800/60 hover:text-white hover:shadow-[0_0_8px_#22d3ee80] 
                 transition-all duration-300"
                                >
                                    <Settings size={14} /> Settings
                                </button>
                            </div>
                        </div> */}

                    </div>

                    {/* Right: Links */}
                    <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-24 text-center sm:text-left">
                        <div>
                            <h3 className="font-semibold text-gray-200 mb-4">Navigation</h3>
                            <ul className="space-y-3">
                                {navLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <FooterLink href={href}>{label}</FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-200 mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {legalLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <FooterLink href={href}>{label}</FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-8 border-t border-gray-800 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-500 text-center md:text-left">
                        © {new Date().getFullYear()} Yaseen's MockStudio. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-5">
                        {socialLinks.map(({ icon: Icon, href, name }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit our ${name} page`}
                                className="text-gray-400 hover:text-indigo-400 transition transform hover:scale-110"
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
