import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import DashboardClient from "@/components/dashboard/DashboardClient"
import { getFullMongoUser } from "@/lib/helpers/auth";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
    const dbUser = await getFullMongoUser();
    await dbConnect();

    if (!dbUser || !dbUser.kundliChartData) {
        // Agar matrix initiate hi nahi hui hai, redirect to onboarding
        redirect("/onboarding");
    }

    const serializedUser = JSON.parse(JSON.stringify(dbUser));

    return (
        <main className="relative flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
 
            {/* Premium Conditional Rendering */}
            {!dbUser.isKundliGenerated ? (
                // ⏳ THE LOADING STATE (While Inngest is working)
                <div className="flex-1 flex flex-col items-center justify-center p-8 h-[calc(100vh-64px)]">
                    {/* Custom Cosmic Spinner */}
                    <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping duration-1000"></div>
                        <div className="absolute inset-2 border-t-4 border-primary/60 rounded-full animate-spin duration-700"></div>
                        <div className="absolute inset-6 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-3xl">✨</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3 bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                        Aligning Your Stars...
                    </h1>
                    <p className="text-muted-foreground max-w-md text-center text-lg leading-relaxed">
                        Astro-G is currently decoding your 12 houses and calculating planetary precise positions. This takes a few moments.
                    </p>
                </div>
            ) : (
                // 🌟 THE SUCCESS STATE (When Inngest is done)
                <DashboardClient userData={serializedUser} />
            )}
        </main>
    );
}