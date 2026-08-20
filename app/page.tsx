"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Sparkles, MessageSquareHeart, Compass, Orbit, Coins, HelpCircle, CheckCircle2, ScrollText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/nextjs";
import DashboardIllustration from "@/components/home/DashboardIllustration";

// --- CUSTOM ELEGANT EASING ---
const smoothTransition = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };
const springHover = { type: "spring", stiffness: 400, damping: 25 };

// --- REUSABLE MASK REVEAL COMPONENT ---
const RevealText = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ ...smoothTransition, delay }}
    >
      {children}
    </motion.div>
  </div>
);

// --- REUSABLE FEATURE LIST ITEM WITH HOVER EFFECT ---
const FeatureListItem = ({ text }: { text: string }) => (
  <motion.li
    whileHover={{ x: 5 }}
    transition={springHover}
    className="flex items-center gap-2 text-foreground font-medium group cursor-default text-sm md:text-base"
  >
    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary group-hover:scale-110 group-hover:text-primary/80 transition-all shrink-0" />
    <span className="group-hover:text-primary transition-colors">{text}</span>
  </motion.li>
);

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  // Adjusted parallax for mobile vs desktop
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const dashboardRef = useRef(null);
  const { scrollYProgress: dashboardScroll } = useScroll({
    target: dashboardRef,
    offset: ["start 90%", "start 50%"], 
  });

  const scale = useTransform(dashboardScroll, [0, 1], [0.85, 1]);
  const opacity = useTransform(dashboardScroll, [0, 1], [0.4, 1]);
  const rotateX = useTransform(dashboardScroll, [0, 1], [15, 0]);

  const { isSignedIn } = useUser();
  const [hoveredFAQ, setHoveredFAQ] = useState<number | null>(null);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans">

      {/* 🌌 SUBTLE NOISE TEXTURE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <Navbar />

      {/* 🚀 1. HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden pt-20 md:pt-0">
        {/* Glow effect - smaller on mobile */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -translate-x-1/2 left-1/2 h-[20rem] w-[20rem] md:h-[40rem] md:w-[40rem] rounded-full bg-primary/20 blur-[80px] md:blur-[120px] pointer-events-none"
        />

        <motion.div style={{ y: yParallaxSlow }} className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...smoothTransition, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="mb-6 md:mb-8 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium text-primary backdrop-blur-md cursor-default shadow-sm hover:shadow-primary/20 transition-all"
          >
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
            <span>AI-Powered Vedic Astrology</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-4 md:mb-6">
            <RevealText delay={0.2}>Decode your cosmic</RevealText>
            <RevealText delay={0.3}>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-accent">blueprint.</span>
            </RevealText>
          </h1>

          <div className="max-w-2xl mt-4 mb-10 md:mb-12 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-2">
            <RevealText delay={0.4}>
              Beyond generic horoscopes. Discover your exact life alignments, planetary aspects, and cosmic queries using precision birth data and advanced AI deep-learning.
            </RevealText>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...smoothTransition, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-up"}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 md:h-14 px-6 md:px-8 text-sm md:text-base w-full sm:w-auto rounded-xl md:rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_-10px_rgba(var(--primary),0.6)] hover:scale-[1.02] hover:shadow-[0_0_50px_-15px_rgba(var(--primary),0.8)] active:scale-[0.98] transition-all overflow-hidden group relative"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                {isSignedIn ? "Enter Dashboard" : "Align My Stars"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>

            {!isSignedIn && (
              <motion.p whileHover={{ scale: 1.05 }} className="text-xs md:text-sm text-muted-foreground mt-2 sm:mt-0 flex items-center gap-2 cursor-default">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-primary" /> Free first reading
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* ❌ NON-ESSENTIAL DECOR: Hidden on Mobile (`hidden md:flex`) */}
        <motion.div style={{ y: yParallax }} className="hidden md:flex absolute inset-0 pointer-events-none items-center justify-center -z-10">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="w-[800px] h-[800px] border border-primary/10 rounded-full border-dashed" />
        </motion.div>
      </section>

      {/* 🔥 DASHBOARD REVEAL SECTION 🔥 */}
      <section ref={dashboardRef} className="relative py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto perspective-2000 hidden sm:block">
        <motion.div
          style={{ scale, opacity, rotateX }}
          className="w-full h-full will-change-transform"
        >
          <DashboardIllustration />
        </motion.div>
      </section>

      {/* 📊 2. SOCIAL PROOF / STATS */}
      <section className="border-y border-border/50 bg-card/30 backdrop-blur-sm py-8 md:py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-24 opacity-80">
          {[
            { value: "12", label: "Houses Analyzed" },
            { value: "99.9%", label: "Ephemeris Accuracy" },
            { value: "24/7", label: "AI Guru Available" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={springHover}
              className="text-center cursor-default group"
            >
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">{stat.value}</h3>
              <p className="text-[10px] md:text-sm font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🧩 3. BENTO GRID FEATURES (REAL FEATURES) */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 md:mb-20 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4">Precision insights.</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto md:mx-0">Everything you need to navigate life's cosmic waves, packed into a beautifully dark experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-min md:auto-rows-[300px]">

          {/* Feature 1: Astro-G Chat */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={smoothTransition}
            whileHover={{ y: -5 }}
            className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-border/50 bg-card p-6 md:p-10 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 origin-bottom-left"
              >
                <MessageSquareHeart className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </motion.div>
              <div className="relative z-20">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">Astro-G AI Chat</h3>
                <p className="text-muted-foreground text-sm md:text-lg max-w-md">Chat with an intelligence that memorizes your 12 houses and planetary states. Ask specific questions about career, love, timelines, or doshas.</p>
              </div>
              {/* ❌ NON-ESSENTIAL DECOR: Hidden on Mobile */}
              <div className="hidden md:flex absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-80 h-80 bg-background rounded-tl-[3rem] border border-border/50 shadow-2xl p-6 flex-col gap-4 group-hover:-translate-x-4 group-hover:-translate-y-4 transition-transform duration-700 ease-out">
                <div className="h-12 w-3/4 bg-muted/50 rounded-2xl animate-pulse" />
                <div className="h-20 w-full bg-primary/10 rounded-2xl" />
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Detailed AI Report */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ ...smoothTransition, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-border/50 bg-card p-6 md:p-8 group flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="relative z-10">
              <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className="origin-bottom-left inline-block">
                <ScrollText className="h-8 w-8 text-primary mb-3 md:mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">AI Kundli Report</h3>
              <p className="text-muted-foreground text-xs md:text-sm">A multi-page, detailed reading covering your soul's purpose, career trajectory, and emotional core.</p>
            </div>
          </motion.div>

          {/* Feature 3: Cosmic Queries */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ ...smoothTransition, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-border/50 bg-card p-6 md:p-8 group flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="relative z-10">
              <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="origin-bottom-left inline-block">
                <HelpCircle className="h-8 w-8 text-primary mb-3 md:mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Cosmic Queries</h3>
              <p className="text-muted-foreground text-xs md:text-sm">Personalized, highly specific questions pre-generated from your exact birth chart data.</p>
            </div>
          </motion.div>

          {/* Feature 4: Advanced Charts */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ ...smoothTransition, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="md:col-span-2 relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-border/50 bg-card p-6 md:p-8 group flex flex-col justify-center hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="inline-block">
                  <Orbit className="h-8 w-8 text-primary mb-3 md:mb-4" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Advanced Astro Charts</h3>
                <p className="text-muted-foreground text-xs md:text-sm max-w-sm">Deep dive into Lagna, Surya, & Chandra Kundli. Analyze your Power Houses, Mangalik Dosh, Grah Drishti (Aspects), and Tatkalik Maitri.</p>
              </div>
              {/* ❌ NON-ESSENTIAL DECOR: Hidden on Mobile */}
              <div className="hidden md:block opacity-50 group-hover:scale-110 group-hover:rotate-45 transition-all duration-1000 ease-out">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                  <Compass className="w-24 h-24 md:w-32 md:h-32 text-primary/30 stroke-[0.5]" />
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 🆚 NEW: US VS THEM (COMPARISON) */}
      <section className="py-20 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4">Why VibeKundli?</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">Stop reading generic sun-sign horoscopes meant for millions of people.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Traditional Apps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={smoothTransition}
            className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-red-500/20 bg-red-500/5 relative overflow-hidden group cursor-default"
          >
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="text-4xl md:text-6xl">🥱</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground/80">Generic Astro Apps</h3>
            <ul className="space-y-3 md:space-y-4">
              {["Generalized daily horoscopes", "Only focuses on Sun/Moon signs", "Scare tactics (Kaal Sarp, Mangalik)", "Pre-written static paragraphs", "No context of your past/present"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                  <span className="text-red-500 mt-0.5">✕</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* VibeKundli */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ ...smoothTransition, delay: 0.1 }}
            className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-primary/40 bg-primary/10 relative overflow-hidden shadow-2xl shadow-primary/5 group cursor-default"
          >
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-20 group-hover:opacity-60 transition-opacity">
              <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-primary">VibeKundli AI</h3>
            <ul className="space-y-3 md:space-y-4">
              {["Calculates exact 12-house placements", "Analyzes Drishti & Maitri dynamically", "Empowering & logical interpretations", "Real-time AI conversation", "Remembers your specific chart details"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm md:text-base text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 💬 4. THE CHAT EXPERIENCE (PEEK) */}
      <section className="py-16 md:py-24 bg-card/20 border-y border-border/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-10 md:gap-16">
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Speak directly to your stars.</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              No more confusing charts or cryptic jargon. Just ask a question in plain English, and our AI interprets your exact Kundli to give you actionable, personalized guidance.
            </p>
            <ul className="space-y-3 md:space-y-4 pt-4 inline-block text-left">
              <FeatureListItem text="Ask about career shifts" />
              <FeatureListItem text="Check relationship compatibility" />
              <FeatureListItem text="Find your favorable timelines" />
            </ul>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              transition={smoothTransition}
              className="rounded-[1.5rem] md:rounded-[2rem] border border-border/50 bg-background shadow-2xl hover:shadow-primary/10 p-5 md:p-6 relative cursor-default overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4 md:mb-6 pb-4 border-b border-border/50">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], boxShadow: ["0px 0px 0px rgba(var(--primary),0)", "0px 0px 15px rgba(var(--primary),0.5)", "0px 0px 0px rgba(var(--primary),0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg md:text-xl"
                >
                  🧿
                </motion.div>
                <div>
                  <p className="font-bold text-xs md:text-sm">Astro-G</p>
                  <p className="text-[10px] md:text-xs text-primary">Online & Analyzing</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="bg-secondary p-3 md:p-4 rounded-2xl rounded-tr-sm ml-auto w-[85%] md:w-[80%] text-xs md:text-sm"
                >
                  "When is a good time to switch my job? I'm feeling stuck."
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                  className="bg-card border border-border p-3 md:p-4 rounded-2xl rounded-tl-sm mr-auto w-[95%] md:w-[90%] text-xs md:text-sm leading-relaxed shadow-sm"
                >
                  Looking at your current transits, Saturn is gazing at your 10th house. While it feels restricting right now, it's building a solid foundation. <strong>Expect a major breakthrough after November 15th</strong> when Jupiter aspects your career lord. Hang tight! ✨
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🎭 5. FLUID STEPS */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase mb-12 md:mb-16 text-center">How It Works</h2>

          <div className="space-y-16 md:space-y-24">
            {[
              { num: "01", title: "Enter Birth Details", desc: "No guesswork. Just your exact time, date, and coordinates to lock into your cosmic signature." },
              { num: "02", title: "Generate Matrix", desc: "Our engine processes planetary transits and generates a multi-layered Vedic chart, detailed report, and custom queries in milliseconds." },
              { num: "03", title: "Seek Answers", desc: "Start chatting. The AI holds your Drishti, Maitri, and Houses in context, providing answers that are purely meant for you." }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, x: 5 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={smoothTransition}
                className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center group cursor-default text-center md:text-left"
              >
                <div className="w-full md:w-auto text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary/40 to-transparent italic group-hover:from-primary transition-all duration-500">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🪙 6. TOKEN ECONOMICS (PRICING) */}
      <section className="py-20 md:py-32 bg-card/40 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="inline-block mb-4 md:mb-6">
            <Coins className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4">Simple cosmic pricing.</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-12 md:mb-16">No confusing subscriptions. Get your free insights instantly, or upgrade for a deeper conversation with the cosmos.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto text-left">

            {/* FREE PLAN */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={springHover}
              className="p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full group"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Free Seeker</h3>
              <p className="text-2xl md:text-3xl font-black text-primary mb-4 md:mb-6">₹0 <span className="text-xs md:text-sm text-muted-foreground font-normal">/ Lifetime</span></p>
              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-sm md:text-base text-muted-foreground flex-1">
                <FeatureListItem text="Full Chart Generation" />
                <FeatureListItem text="3 Personalized Cosmic Queries" />
                <FeatureListItem text="2 Astro Chat Tokens" />
              </ul>
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl group-hover:bg-secondary transition-colors")}>
                {isSignedIn ? "Enter Dashboard" : "Start For Free"}
              </Link>
            </motion.div>

            {/* PRO PLAN */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={springHover}
              className="p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-primary bg-primary/5 relative transform md:-translate-y-4 shadow-2xl hover:shadow-primary/20 transition-all flex flex-col h-full group mt-4 md:mt-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] md:text-xs font-bold px-3 py-0.5 md:px-4 md:py-1 rounded-full shadow-lg">PRO</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Cosmic Pro</h3>
              <p className="text-2xl md:text-3xl font-black text-primary mb-4 md:mb-6">₹49 <span className="text-xs md:text-sm text-muted-foreground font-normal">/ One-time</span></p>
              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-sm md:text-base text-foreground flex-1">
                <FeatureListItem text="Full Chart Generation" />
                <FeatureListItem text="3 Personalized Cosmic Queries" />
                <FeatureListItem text="10 Astro Chat Tokens" />
              </ul>
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className={cn(buttonVariants({ variant: "default" }), "w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-transform overflow-hidden relative")}>
                <span className="relative z-10 font-bold">Upgrade to Pro</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ❓ 7. FAQ SECTION */}
      <section className="py-20 md:py-32 max-w-4xl mx-auto px-4 w-full">
        <div className="text-center mb-12 md:mb-16">
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="inline-block mb-3 md:mb-4">
            <HelpCircle className="h-8 w-8 md:h-10 md:w-10 text-primary mx-auto" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Cosmic Doubts?</h2>
        </div>
        <div className="space-y-4 md:space-y-6">
          {[
            { q: "How does the Token system work?", a: "It's beautifully simple: 1 Token = 1 Question asked to Astro-G. Regardless of how complex the astrological calculation is behind the scenes, exactly 1 token is deducted per query." },
            { q: "What is included in the Free vs Pro plan?", a: "The Free plan gives you access to your full generated chart, 3 personalized Cosmic Queries, and 2 Tokens to chat with Astro-G. The Pro plan gives you everything in free, plus 10 Tokens for deeper, more extended conversations." },
            { q: "What all charts do you analyze?", a: "VibeKundli provides deeply analyzed insights on your Lagna (D1), Surya, and Chandra Kundli. We also map out your Power Houses, Mangalik Dosh, Planetary Aspects (Drishti), and Planetary Alliances (Maitri)." },
            { q: "Is the AI actually doing astrology?", a: "Yes. The AI doesn't hallucinate. It first calculates your exact planetary positions using an Ephemeris engine, then interprets those fixed positions using its trained Vedic knowledge." }
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onHoverStart={() => setHoveredFAQ(idx)}
              onHoverEnd={() => setHoveredFAQ(null)}
              className={cn(
                "border border-border/50 rounded-xl md:rounded-[1.5rem] p-5 md:p-6 bg-card/20 transition-all duration-300 cursor-default",
                hoveredFAQ === idx ? "bg-card shadow-md border-primary/30 md:-translate-y-1" : ""
              )}
            >
              <h4 className={cn("text-base md:text-xl font-bold mb-2 md:mb-3 transition-colors", hoveredFAQ === idx ? "text-primary" : "")}>{faq.q}</h4>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🌌 8. ELEVATED CTA */}
      <section className="py-24 md:py-40 px-4 relative flex items-center justify-center overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={smoothTransition}
          className="relative z-10 text-center max-w-3xl group cursor-default"
        >
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.5 }}
            className="mx-auto w-16 h-16 md:w-20 md:h-20 mb-6 md:mb-8 rounded-full border border-primary/30 flex items-center justify-center bg-card shadow-[0_0_50px_rgba(var(--primary),0.3)] group-hover:shadow-[0_0_80px_rgba(var(--primary),0.5)] transition-shadow duration-500"
          >
            <Star className="h-6 w-6 md:h-8 md:w-8 text-primary" fill="currentColor" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 md:mb-8 group-hover:text-primary/90 transition-colors duration-500">
            Your journey begins here.
          </h2>

          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-14 md:h-16 px-8 md:px-12 text-base md:text-lg rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden relative inline-flex items-center gap-2"
            )}
          >
            <span className="relative z-10 font-bold">{isSignedIn ? "Enter Dashboard" : "Start For Free"}</span>
            <ArrowRight className="relative z-10 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}