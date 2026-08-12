"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] w-full items-center justify-center p-4 lg:p-8 bg-background overflow-hidden selection:bg-primary/20">
      
      {/* 🌌 ANIMATED COSMIC BACKGROUND */}
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }} className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />

      {/* 📦 MAIN GLASSMORPHISM CARD */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 flex w-full max-w-6xl overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl shadow-2xl border border-border/50">
        
        {/* ✨ LEFT PANEL */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-foreground lg:flex border-r border-border/50">
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-20 right-20 text-primary/40"><Star className="h-8 w-8" /></motion.div>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative z-10">
            <Logo textSize="24px" />
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 mt-16 mb-auto">
            <motion.h1 variants={itemVariants} className="mb-6 text-6xl font-black leading-[1.1] tracking-tight text-foreground">
              Decode your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Karma.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="max-w-md text-lg font-medium text-muted-foreground leading-relaxed">
              Step into the cosmic realm. Let Astro-G roast your stars, fix your karma, and guide your daily vibe with AI-powered astrology.
            </motion.p>
          </motion.div>
        </div>

        {/* 📦 RIGHT PANEL: Form Area */}
        <div className="flex w-full flex-col items-center justify-center p-8 sm:p-12 lg:w-1/2 bg-background/40">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="w-full max-w-[360px] flex flex-col items-center">
            
            <div className="mb-8 flex items-center justify-center lg:hidden">
              <Logo showText={false} />
            </div>

            <div className="mb-8 w-full text-center">
              <h2 className="mb-2 text-3xl font-bold text-foreground tracking-tight">Welcome back</h2>
              <p className="text-base font-medium text-muted-foreground">Sign in to check your cosmic vibe</p>
            </div>

            <div className="flex w-full justify-center transform transition-all hover:scale-[1.01]">
              <SignIn />
            </div>

            <div className="mt-8 flex w-full flex-col items-center space-y-4">
              <p className="text-center text-sm font-medium text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-bold text-primary underline-offset-4 transition-all hover:underline hover:text-primary/80">Create one now</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}