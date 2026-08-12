import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import OnboardingForm from "@/components/forms/OnboardingForm";
import Navbar from "@/components/Navbar";
import { getFullMongoUser } from "@/lib/helpers/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const dbUser = await getFullMongoUser();

  // Agar profile already complete hai, toh yahan kya kar raha hai? Wapas Chat pe bhejo!
  if (dbUser?.isProfileComplete) {
    redirect("/chat");
  }
  return (
    <main className="flex w-full bg-background flex-col">
      <Navbar />
      <div className="relative min-h-screen flex w-full items-center justify-center p-2 overflow-hidden selection:bg-primary/20">

        {/* 📦 THE GLASSMORPHISM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl shadow-2xl border border-border/50 p-8"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <Logo showText={false} className="mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Align Your Stars
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Astro-G needs your birth details to calculate your cosmic vibe and generate your exact Kundli.
            </p>
          </div>

          {/* 🧩 Component Inserted Here */}
          <OnboardingForm />

        </motion.div>
      </div>
    </main>

  );
}