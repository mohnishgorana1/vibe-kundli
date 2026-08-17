import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


function OverView({ userData, onSwitchToChat }: { userData: any, onSwitchToChat: (v: string) => void; }) {
    // Format DOB securely
    const formattedDOB = userData.birthDetails?.dob
        ? new Date(userData.birthDetails.dob).toLocaleDateString("en-IN", {
            day: "2-digit", month: "long", year: "numeric",
        })
        : "Not Provided";

    return (
        <section className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 ">
            {/* header */}
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {userData.firstName}</h1>
                <p className="text-muted-foreground mt-1">Here is a detailed snapshot of your astrological matrix.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">

                {/* Left Column: Planetary Snapshot (Using your detailed UI) */}

                <div className="lg:col-span-8 bg-background border border-border/50 rounded-2xl p-6 shadow-sm overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Detailed Planetary Placements</h3>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md font-bold uppercase tracking-widest">D1 Chart</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {userData.kundliChartData?.map((planet: any, idx: number) => (
                            <Accordion key={idx}>
                                <AccordionItem>
                                    <div className="bg-secondary/50  px-3 rounded-xl border-2 border-border hover:border-primary/30 transition-colors flex flex-col gap-3 shadow-secondary/50 shadow-sm">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(var(--primary),0.5)]"></span>
                                                <span className="font-extrabold text-[13px] text-foreground tracking-widest uppercase">{planet.name}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-2 gap-y-5 gap-x-12">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-0.5">Sign</span>
                                                    <span className="font-semibold text-foreground text-xs">{planet.sign}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-0.5">House</span><span className="font-extrabold text-primary text-xs">{planet.house}</span></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-0.5">Nakshatra</span><span className="font-semibold text-foreground text-xs line-clamp-1">{planet.nakshatra || "—"}</span></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-0.5">State</span><span className="font-semibold text-foreground text-xs line-clamp-1">{planet.planet_awastha || "—"}</span></div>
                                            </div>
                                        </AccordionContent>

                                    </div>
                                </AccordionItem>
                            </Accordion>
                        ))}
                    </div>


                    <button onClick={() => onSwitchToChat("CHARTS")} className="w-full mt-6 py-3.5 rounded-xl border-2  border-border hover:ring-1 ring-primary/40 transition-all duration-200">
                        Explore Full Chart Analysis →
                    </button>
                </div>

                {/* Right Column: Quick Actions & Birth Details */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Birth Details Card */}
                    <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-6">Birth Coordinates</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-border/40 pb-3">
                                <span className="text-xs uppercase text-muted-foreground font-bold tracking-widest">Date</span>
                                <span className="text-sm font-semibold text-foreground">{formattedDOB}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-border/40 pb-3">
                                <span className="text-xs uppercase text-muted-foreground font-bold tracking-widest">Time</span>
                                <span className="text-sm font-semibold text-foreground">{userData.birthDetails?.tob || "Unknown"}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-border/40 pb-3">
                                <span className="text-xs uppercase text-muted-foreground font-bold tracking-widest">Location</span>
                                <span className="text-sm font-semibold text-foreground capitalize truncate max-w-[150px]">{userData.birthDetails?.pob || "Unknown"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs uppercase text-muted-foreground font-bold tracking-widest">Gender</span>
                                <span className="text-sm font-semibold text-foreground capitalize">{userData.gender || "Unknown"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Call To Action */}
                    <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 text-8xl opacity-10">🧿</div>
                        <h3 className="font-bold text-lg text-primary mb-2 relative z-10">Need Guidance?</h3>
                        <p className="text-sm text-muted-foreground mb-6 relative z-10">Astro-G is ready to answer your specific questions regarding career, relationship, and timeline.</p>
                        <button onClick={() => setActiveView("CHAT")} className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 relative z-10 flex items-center justify-center gap-2">
                            <span>Start Astro Chat</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </button>
                    </div>

                </div>

            </div >
        </section >
    );
}

export default OverView