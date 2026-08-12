"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star, Sparkles, MessageSquareHeart, Compass, Orbit, Zap, Coins, HelpCircle, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; 
import { cn } from "@/lib/utils"; 
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs"; // ✅ IMPORTS: Clerk's useUser hook

// --- CUSTOM ELEGANT EASING ---
const smoothTransition = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };

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

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // ✅ CHECK: User logged in hai ya nahi?
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans">
      
      {/* 🌌 SUBTLE NOISE TEXTURE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <Navbar />

      {/* 🚀 1. HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -translate-x-1/2 left-1/2 h-[40rem] w-[40rem] rounded-full bg-primary/20 blur-[120px] pointer-events-none" 
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...smoothTransition, delay: 0.1 }}
            className="mb-8 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>AI-Powered Vedic Astrology</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-6">
            <RevealText delay={0.2}>Decode your cosmic</RevealText>
            <RevealText delay={0.3}>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-accent">blueprint.</span>
            </RevealText>
          </h1>

          <div className="max-w-2xl mt-4 mb-12 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            <RevealText delay={0.4}>
              Beyond generic horoscopes. Discover your exact life alignments using precision birth data and advanced AI deep-learning.
            </RevealText>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...smoothTransition, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            {/* ✅ DYNAMIC CTA: Changes based on Login Status */}
            <Link 
              href={isSignedIn ? "/chat" : "/sign-up"} // Clerk middleware handles /sign-up if needed, or just /chat
              className={cn(
                buttonVariants({ size: "lg" }), 
                "h-14 px-8 text-base rounded-2xl bg-primary text-primary-foreground shadow-[0_0_40px_-10px_rgba(var(--primary),0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden group relative"
              )}
            >
                <span className="relative z-10 flex items-center gap-2">
                  {isSignedIn ? "Go to Chat" : "Align My Stars"} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>
            
            {!isSignedIn && (
              <p className="text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Free first reading
              </p>
            )}
          </motion.div>
        </div>

        <motion.div style={{ y: yParallax }} className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="w-[800px] h-[800px] border border-primary/10 rounded-full border-dashed" />
        </motion.div>
      </section>

      {/* 📊 2. SOCIAL PROOF / STATS */}
      <section className="border-y border-border/50 bg-card/30 backdrop-blur-sm py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
          {[
            { value: "10K+", label: "Kundlis Generated" },
            { value: "99.9%", label: "Ephemeris Accuracy" },
            { value: "24/7", label: "AI Guru Availability" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl font-black text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧩 3. BENTO GRID FEATURES */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Precision insights.</h2>
          <p className="text-muted-foreground text-lg max-w-xl">Everything you need to navigate life's cosmic waves, packed into a beautifully dark experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={smoothTransition}
            className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 sm:p-10 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <MessageSquareHeart className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-3">AI Astro-Guru</h3>
                <p className="text-muted-foreground text-lg max-w-md">Chat with an intelligence that understands Vedic astrology down to the last Nakshatra. Ask about career, love, or doshas.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-80 h-80 bg-background rounded-tl-[3rem] border border-border/50 shadow-2xl p-6 flex flex-col gap-4 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                 <div className="h-12 w-3/4 bg-muted/50 rounded-2xl animate-pulse" />
                 <div className="h-20 w-full bg-primary/10 rounded-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ ...smoothTransition, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 group flex flex-col justify-between"
          >
             <div className="relative z-10">
                <Orbit className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Exact Alignments</h3>
                <p className="text-muted-foreground text-sm">Calculated using NASA-grade ephemeris data for pinpoint planetary accuracy.</p>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                 <Compass className="w-40 h-40 text-primary/20 stroke-[0.5]" />
               </motion.div>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ ...smoothTransition, delay: 0.2 }}
            className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 group flex flex-col justify-between"
          >
             <div className="relative z-10">
                <Zap className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 mt-4">Daily Vibes</h3>
                <p className="text-muted-foreground text-sm">Know your favorable hours and cosmic warnings before you start the day.</p>
             </div>
             <div className="absolute right-6 bottom-6 flex items-center justify-center">
                <div className="absolute w-16 h-16 rounded-full bg-primary/20 animate-ping" />
                <div className="w-8 h-8 rounded-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* 💬 4. THE CHAT EXPERIENCE (PEEK) */}
      <section className="py-24 bg-card/20 border-y border-border/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Speak directly to your stars.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              No more confusing charts or cryptic jargon. Just ask a question in plain English, and our AI interprets your exact Kundli to give you actionable, personalized guidance.
            </p>
            <ul className="space-y-3 pt-4">
              {["Ask about career shifts", "Check relationship compatibility", "Find your lucky dates"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, rotateY: 20, x: 50 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }} viewport={{ once: true }} transition={smoothTransition}
              className="rounded-[2rem] border border-border/50 bg-background shadow-2xl p-6 relative perspective-1000"
            >
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                 <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">G</div>
                 <div>
                   <p className="font-bold text-sm">Astro-G</p>
                   <p className="text-xs text-primary">Online & Analyzing</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="bg-muted p-4 rounded-2xl rounded-tr-sm ml-auto w-[80%] text-sm">
                   "When is a good time to switch my job? I'm feeling stuck."
                 </div>
                 <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-tl-sm mr-auto w-[90%] text-sm leading-relaxed">
                   Looking at your current transits, Saturn is in your 10th house. While it feels restricting right now, it's building a foundation. <strong>Expect a major breakthrough after November 15th</strong> when Jupiter aspects your career lord. Hang tight! ✨
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🎭 5. FLUID STEPS */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-16 text-center">How It Works</h2>
          
          <div className="space-y-24">
            {[
              { num: "01", title: "Enter Birth Details", desc: "No guesswork. Just your exact time, date, and coordinates to lock into your cosmic signature." },
              { num: "02", title: "Generate Matrix", desc: "Our engine processes planetary transits and generates a multi-layered Vedic chart in milliseconds." },
              { num: "03", title: "Seek Answers", desc: "Start chatting. The AI holds your chart in context, providing answers that are purely meant for you." }
            ].map((step, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-20%" }} transition={smoothTransition} className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary/40 to-transparent italic">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🪙 6. TOKEN ECONOMICS (PRICING) */}
      <section className="py-32 bg-card/40 border-y border-border/50">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <Coins className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Pay per cosmic query.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">No recurring subscriptions. No hidden fees. Buy Karma Tokens and use them only when you need profound answers.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
               <div className="p-8 rounded-3xl border border-border/50 bg-background hover:border-primary/50 transition-colors flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2">Seeker</h3>
                  <p className="text-3xl font-black text-primary mb-6">₹99 <span className="text-sm text-muted-foreground font-normal">/ 50 Tokens</span></p>
                  <ul className="space-y-3 mb-8 text-sm text-muted-foreground flex-1">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Basic Kundli Generation</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> ~50 AI Chat Questions</li>
                  </ul>
                  {/* ✅ DYNAMIC CTA FOR PRICING */}
                  <Link href={isSignedIn ? "/chat" : "/sign-up"} className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl")}>
                    {isSignedIn ? "Buy Tokens" : "Get Started"}
                  </Link>
               </div>
               
               <div className="p-8 rounded-3xl border border-primary bg-primary/5 relative transform md:-translate-y-4 shadow-2xl flex flex-col h-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                  <h3 className="text-2xl font-bold mb-2">Astrologer</h3>
                  <p className="text-3xl font-black text-primary mb-6">₹299 <span className="text-sm text-muted-foreground font-normal">/ 200 Tokens</span></p>
                  <ul className="space-y-3 mb-8 text-sm text-foreground flex-1">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Advanced Kundli & Doshas</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> ~200 AI Chat Questions</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Daily Cosmic Vibe Alerts</li>
                  </ul>
                  <Link href={isSignedIn ? "/chat" : "/sign-up"} className={cn(buttonVariants({ variant: "default" }), "w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90")}>
                    Buy Tokens
                  </Link>
               </div>
               
               <div className="p-8 rounded-3xl border border-border/50 bg-background hover:border-primary/50 transition-colors flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2">Guru</h3>
                  <p className="text-3xl font-black text-primary mb-6">₹999 <span className="text-sm text-muted-foreground font-normal">/ 1000 Tokens</span></p>
                  <ul className="space-y-3 mb-8 text-sm text-muted-foreground flex-1">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Complete Life Matrix</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> ~1000 AI Chat Questions</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Priority AI Processing</li>
                  </ul>
                  <Link href={isSignedIn ? "/chat" : "/sign-up"} className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl")}>
                    Buy Tokens
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* ❓ 7. FAQ SECTION */}
      <section className="py-32 max-w-4xl mx-auto px-4 w-full">
        <div className="text-center mb-16">
          <HelpCircle className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Cosmic Doubts?</h2>
        </div>
        <div className="space-y-6">
          {[
            { q: "How does the Token system work?", a: "Every time you ask a question to Astro-G, a small amount of token is deducted based on the complexity of the AI calculation. 1 Token roughly equals 1 detailed answer." },
            { q: "Is the AI actually doing astrology?", a: "Yes. The AI doesn't hallucinate. It first calculates your exact planetary positions using an Ephemeris engine, then interprets those fixed positions using its trained Vedic knowledge." },
            { q: "Can I try it for free?", a: "Your first Kundli generation and a few introductory questions are on us. You only pay when you want deep, continuous guidance." }
          ].map((faq, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="border border-border/50 rounded-[1.5rem] p-6 bg-card/20">
              <h4 className="text-lg md:text-xl font-bold mb-3">{faq.q}</h4>
              <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🌌 8. ELEVATED CTA */}
      <section className="py-40 px-4 relative flex items-center justify-center overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={smoothTransition}
          className="relative z-10 text-center max-w-3xl"
        >
          <div className="mx-auto w-20 h-20 mb-8 rounded-full border border-primary/30 flex items-center justify-center bg-card shadow-[0_0_50px_rgba(var(--primary),0.3)]">
             <Star className="h-8 w-8 text-primary" fill="currentColor" />
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
            Your journey begins here.
          </h2>
          
          {/* ✅ DYNAMIC CTA: Bottom button */}
          <Link 
            href={isSignedIn ? "/chat" : "/sign-up"} 
            className={cn(
              buttonVariants({ size: "lg" }), 
              "h-16 px-12 text-lg rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            )}
          >
              {isSignedIn ? "Return to Cosmos" : "Start For Free"}
          </Link>
        </motion.div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="py-12 border-t border-border/50 text-center text-muted-foreground text-sm relative z-10 bg-card/50">
        <p className="mb-2">Built with mystic energy and modern code.</p>
        <p>© {new Date().getFullYear()} VibeKundli. All rights reserved.</p>
      </footer>
    </div>
  );
}