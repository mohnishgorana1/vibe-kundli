"use client";

import { motion } from "framer-motion";
import { Zap, Orbit, MessageSquareHeart, UserCircle, Coins, Search } from "lucide-react";
import Logo from "../Logo"; // Path adjust kar lena

// --- MOCK NAVIGATION ITEMS ---
const navItems = [
  { icon: Zap, label: "Overview" },
  { icon: Orbit, label: "Astro Charts" },
  { icon: MessageSquareHeart, label: "Astro-G Chat" },
  { icon: UserCircle, label: "Profile" },
];

export default function DashboardIllustration() {
  return (
    <div className="w-full aspect-[16/10] bg-background border-2 border-border/60 rounded-[2.5rem] shadow-2xl shadow-primary/10 overflow-hidden flex p-2.5 group relative perspective-2000">
      
      {/* Subtle screen glaze/shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30" />

      {/* 🖥️ MOCK SIDEBAR */}
      <aside className="w-[22%] h-full bg-card rounded-[2rem] border border-border/50 p-5 flex flex-col justify-between shrink-0">
        <div>
          <Logo showText={false} className="mb-10" />
          <nav className="space-y-3">
            {navItems.map((item, i) => (
              <div key={i} className={i === 2 ? "bg-primary/10 border border-primary/20 p-3 rounded-xl text-primary flex items-center gap-3" : "p-3 flex items-center gap-3 text-muted-foreground opacity-70"}>
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-bold hidden md:block tracking-tight">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Token Balance Mock */}
        <div className="bg-secondary/50 border border-border/50 p-4 rounded-xl text-center space-y-1.5 hidden md:block">
            <Coins className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Balance</p>
            <p className="text-xl font-black text-foreground">120 <span className="text-xs font-normal text-muted-foreground">🪙</span></p>
        </div>
      </aside>

      {/* 🖥️ MOCK MAIN CONTENT AREA */}
      <main className="flex-1 h-full pl-3 pr-1 py-1 flex flex-col gap-3">
        
        {/* Mock Header */}
        <header className="w-full h-14 shrink-0 bg-card rounded-xl border border-border/50 flex items-center justify-between px-5">
            <div className="flex items-center gap-2.5 bg-secondary px-3 py-1.5 rounded-lg border border-border/50 text-xs text-muted-foreground flex-1 max-w-xs">
                <Search className="h-4 w-4" />
                Find insights...
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="w-20 h-6 rounded-md bg-muted animate-pulse" />
            </div>
        </header>

        {/* Bento Grid Content Mock */}
        <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-3">
            <div className="col-span-2 row-span-2 bg-card rounded-xl border border-border/50 p-5 space-y-3">
                <Orbit className="h-6 w-6 text-primary" />
                <div className="h-6 w-1/2 bg-muted rounded-md" />
                <div className="h-20 w-full bg-muted/50 rounded-lg" />
            </div>
            <div className="bg-card rounded-xl border border-border/50" />
            <div className="bg-card rounded-xl border border-border/50" />
            <div className="col-span-3 bg-card rounded-xl border border-border/50 flex items-center px-5 gap-3">
                <div className="w-full h-10 bg-secondary rounded-full border border-border/50" />
                <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0" />
            </div>
        </div>
      </main>
    </div>
  );
}