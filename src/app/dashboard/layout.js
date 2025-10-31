// /app/dashboard/layout.js
// import Header from "../partials/Header";

import Header from "../partials/Header";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <div className="max-w-6xl mx-auto px-4">
                {children} {/* Client component handles auth and token */}
            </div>
        </div>
    );
}
