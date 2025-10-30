import { isSuperAdmin } from "@/lib/isSuperAdmin";
import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({ children }) {
    const user = await currentUser();

    // Check Super Admin
    const authorized = user && isSuperAdmin(user);

    if (!authorized) {
        const requestHeaders = headers();
        const userAgent =
            requestHeaders?.get?.("user-agent") ||
            requestHeaders?.["user-agent"] ||
            "";

        const isBrowser =
            userAgent.includes("Mozilla") ||
            userAgent.includes("Chrome") ||
            userAgent.includes("Safari") ||
            userAgent.includes("Firefox");

        if (isBrowser) {
            redirect("/"); // If from browser, go home
        } else {
            notFound(); // If API / SSR request, throw 404
        }
    }

    return <>{children}</>;
}
