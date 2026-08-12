"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] w-full items-center justify-center p-4 lg:p-8 bg-background overflow-hidden selection:bg-primary/20">

      {/* 🌌 ANIMATED COSMIC BACKGROUND */}
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }} className="absolute top-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }} className="absolute bottom-[-15%] left-[-15%] h-[800px] w-[800px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />

      {/* 📦 MAIN GLASSMORPHISM CARD */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative z-10 flex w-full max-w-6xl overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl shadow-2xl border border-border/50 flex-row-reverse">


        {/* 📦 LEFT PANEL (Form Area) */}
        <div className="flex w-full flex-col items-center justify-center p-8 sm:p-12 lg:w-1/2 bg-background/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="w-full max-w-[360px] flex flex-col items-center">

            <div className="mb-8 flex items-center justify-center lg:hidden">
              <Logo showText={false} />
            </div>

            <div className="mb-8 w-full text-center">
              <h2 className="mb-2 text-3xl font-bold text-foreground tracking-tight">Join VibeKundli</h2>
              <p className="text-base font-medium text-muted-foreground">Create an account to reveal your destiny</p>
            </div>

            <div className="flex w-full justify-center transform transition-all hover:scale-[1.01]">
              <SignUp />
            </div>

            <div className="mt-8 flex w-full flex-col items-center space-y-4">
              <p className="text-center text-sm font-medium text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-primary underline-offset-4 transition-all hover:underline hover:text-primary/80">Sign in instead</Link>
              </p>
            </div>
          </motion.div>
        </div>


        {/* ✨ RIGHT PANEL (Flipped for Signup) */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-foreground lg:flex border-l border-border/50">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute top-24 right-16 text-primary/30"><Compass className="h-16 w-16" /></motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative z-10 flex justify-end">
            {/* Logo in Reverse layout */}
            <Logo textSize="24px" className="flex-row-reverse text-right" />
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 mt-16 mb-auto text-right">
            <motion.h1 variants={itemVariants} className="mb-6 text-6xl font-black leading-[1.1] tracking-tight text-foreground">
              Align your <br /><span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-primary/60">Stars.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="ml-auto max-w-md text-lg font-medium text-muted-foreground leading-relaxed">
              Join the cosmic cloud today. Get your personalized Kundli, daily roasts, and <span className="text-primary font-bold">100 free tokens</span> to chat with Astro-G.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}