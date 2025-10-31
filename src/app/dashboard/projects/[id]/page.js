import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    ExternalLink,
    CalendarClock,
    Loader2,
    CircleDashed,
    ChevronRight,
    Wrench, // Icon for maintenance plan
} from "lucide-react";
// Initialize Supabase admin client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Fetches a single project's details.
 */
async function getProjectDetails(projectId, clerkId) {
    const { data, error } = await supabase
        .from("websites")
        .select("*")
        .eq("id", projectId)
        .eq("clerk_id", clerkId)
        .single();

    if (error) {
        console.error("Error fetching project:", error.message);
        return null;
    }
    return data;
}

// --- Constants ---
const STAGES = [
    "planning",
    "design",
    "development",
    "testing",
    "deployment",
    "deployed",
];

// --- Helper Components (Dark Mode) ---

/**
 * 1. At a Glance Info Card
 */
const InfoCard = ({ icon, title, value, valueColor = "text-white" }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 text-gray-400">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                    {title}
                </p>
                <p className={`text-base font-medium ${valueColor}`}>
                    {value}
                </p>
            </div>
        </div>
    );
};

/**
 * 2. NEW: Responsive Project Timeline
 */
const ProjectTimeline = ({ stages, currentStage }) => {
    const currentStageIndex = stages.indexOf(currentStage);

    // Helper function to get props for each stage
    const getStageProps = (index, stage) => {
        const isCompleted =
            index < currentStageIndex ||
            (stage === "deployed" && index === currentStageIndex);
        const isCurrent =
            index === currentStageIndex && stage !== "deployed";

        if (isCompleted) {
            return {
                Icon: CheckCircle,
                color: "text-green-500",
                textColor: "text-green-400",
            };
        }
        if (isCurrent) {
            return {
                Icon: Loader2,
                color: "text-violet-400",
                textColor: "text-violet-300 font-bold",
                animate: true,
            };
        }
        // isPending
        return {
            Icon: CircleDashed,
            color: "text-gray-600",
            textColor: "text-gray-600",
        };
    };

    return (
        <>
            {/* --- 1. Horizontal/Desktop View (hidden on sm, flex on md) --- */}
            <div className="hidden md:flex pb-2 -mb-2 overflow-x-auto justify-center">
                <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
                    {stages.map((stage, index) => {
                        const { Icon, color, textColor, animate } =
                            getStageProps(index, stage);
                        return (
                            <React.Fragment key={stage}>
                                <div
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900 rounded-lg ${textColor} transition-colors`}
                                >
                                    <Icon
                                        className={`w-4 h-4 ${color} ${animate ? "animate-spin" : ""
                                            }`}
                                    />
                                    <span className="capitalize text-sm">
                                        {stage}
                                    </span>
                                </div>
                                {index < stages.length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-gray-700 flex-shrink-0" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* --- 2. Vertical/Mobile View (flex on sm, hidden on md) --- */}
            <div className="flex flex-col gap-4 md:hidden">
                {stages.map((stage, index) => {
                    const { Icon, color, textColor, animate } = getStageProps(
                        index,
                        stage
                    );
                    return (
                        <div
                            key={stage}
                            className="flex items-center gap-3 p-1"
                        >
                            <Icon
                                className={`w-5 h-5 ${color} ${animate ? "animate-spin" : ""
                                    } flex-shrink-0`}
                            />
                            <span
                                className={`capitalize text-sm ${textColor}`}
                            >
                                {stage}
                            </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

// --- The Main Page Component ---

export default async function ProjectDetailsPage({ params }) {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    if (!projectId || projectId === "undefined") {
        notFound();
    }

    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const project = await getProjectDetails(projectId, clerkUser.id);
    if (!project) notFound();

    const currentStage = project.development_stage?.toLowerCase() || "";
    const projectStatus = project.status?.toLowerCase() || "inactive";

    // --- NEW: Read the maintenance service boolean ---
    const maintenanceService = project.maintenance;

    return (
        // --- UPDATED: Root div is now a flex column ---
        <div className="min-h-screen bg-black text-white flex flex-col">

            {/* --- NEW: Centering wrapper for all content BELOW the header --- */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                {/* --- UPDATED: Container now has w-full and no mx-auto --- */}
                <div className="max-w-4xl w-full">
                    {/* Header & Back Button */}
                    <div className="mb-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* --- Page Header --- */}
                    <div className="mb-8">
                        {/* Responsive Font Size */}
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            {project.label || project.url}
                        </h1>
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            // Added break-all for long URLs on mobile
                            className="text-violet-400 hover:text-violet-300 hover:underline flex items-center gap-1.5 mt-1 break-all"
                        >
                            {project.url}
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                    </div>

                    {/* --- Content Area (Single Column) --- */}
                    <div className="flex flex-col gap-8">
                        {/* Development Stage Card */}
                        <div className="bg-gray-950/60 border border-gray-800 rounded-xl shadow-lg">
                            <h2 className="text-lg font-semibold text-white p-5 border-b border-gray-800">
                                Project Timeline
                            </h2>
                            <div className="p-5">
                                <ProjectTimeline
                                    stages={STAGES}
                                    currentStage={currentStage}
                                />
                            </div>
                        </div>

                        {/* At a Glance Card */}
                        <div className="bg-gray-950/60 border border-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-4 mb-6">
                                At a Glance
                            </h3>

                            {/* --- UPDATED: Grid changed to md:grid-cols-2 for a 2x2 layout --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard
                                    icon={<CheckCircle className="w-5 h-5" />}
                                    title="Status"
                                    value={project.status}
                                    valueColor={
                                        projectStatus === "active"
                                            ? "text-green-400"
                                            : projectStatus === "pending"
                                                ? "text-yellow-400"
                                                : "text-gray-500"
                                    }
                                />

                                {/* --- UPDATED: Maintenance Plan Card --- */}
                                <InfoCard
                                    icon={<Wrench className="w-5 h-5" />}
                                    title="Maintenance Plan"
                                    value={maintenanceService ? "Active" : "Inactive"}
                                    valueColor={
                                        maintenanceService
                                            ? "text-green-400" // "Active" is green (good)
                                            : "text-gray-500" // "Inactive" is gray
                                    }
                                />

                                <InfoCard
                                    icon={<Clock className="w-5 h-5" />}
                                    title="Created"
                                    value={new Date(
                                        project.created_at
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                />
                                {project.updated_at && (
                                    <InfoCard
                                        icon={
                                            <CalendarClock className="w-5 h-5" />
                                        }
                                        title="Last Updated"
                                        value={new Date(
                                            project.updated_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Description Card */}
                        {project.description && (
                            <div className="bg-gray-950/60 border border-gray-800 rounded-xl shadow-lg">
                                <h3 className="text-lg font-semibold text-white p-5 border-b border-gray-800">
                                    Description
                                </h3>
                                <p className="text-gray-300 whitespace-pre-wrap p-5">
                                    {project.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}