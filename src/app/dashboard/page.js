import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
    const user = await currentUser();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center bg-black text-white">
            <h1 className="text-3xl font-bold">Welcome, {user?.username || "Unknown"} 👋</h1>
            <p className="text-gray-400 mt-2">You’re now in your YMS dashboard.</p>
        </div>
    );
}
