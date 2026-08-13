import { redirect } from "next/navigation";
import { getFullMongoUser } from "@/lib/helpers/auth";
import OnboardingForm from "@/components/forms/OnboardingForm";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import { Sparkles, Moon, Star, ShieldCheck } from "lucide-react";

export default async function OnboardingPage() {
  const dbUser = await getFullMongoUser();

  // // Agar profile complete hai toh direct chat par redirect
  // if (dbUser?.isProfileComplete) {
  //   redirect("/chat");
  // }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* 🔮 TOP NAVBAR */}
      <Navbar />

      {/* 🌌 AMBIENT BACKGROUND GLOWS */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      {/* 💳 MAIN WIDE CONTAINER */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="flex w-full max-w-6xl flex-col md:flex-row overflow-hidden rounded-3xl border border-border/50 bg-card/60 shadow-2xl backdrop-blur-xl">
          
          {/* 🌟 LEFT PANE: BRANDING & FEATURES (Desktop Only) */}
          <div className="relative hidden w-full flex-col justify-between border-r border-border/50 bg-primary/5 p-8 lg:p-10 md:flex md:w-5/12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-70 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <Logo showText={true} />
              
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Decode Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Cosmic Matrix.
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Astro-G needs your birth coordinates to map the exact planetary transits at your birth moment.
                </p>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="relative z-10 space-y-3 pt-6">
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                <span>NASA-Grade Ephemeris Calculations</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3 text-xs font-medium backdrop-blur-sm">
                <Moon className="h-4 w-4 shrink-0 text-primary" />
                <span>Deep Vedic Nakshatra Analysis</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3 text-xs font-medium backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                <span>Encrypted & 100% Private Data</span>
              </div>
            </div>
          </div>

          {/* 📝 RIGHT PANE: FORM AREA */}
          <div className="flex w-full flex-col justify-center bg-card p-6 sm:p-8 lg:p-10 md:w-7/12">
            {/* Mobile Header */}
            <div className="mb-6 text-center md:hidden">
              <h1 className="text-2xl font-bold">Align Your Stars</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter your exact birth details below.
              </p>
            </div>

            <OnboardingForm dbUser={dbUser}/>
          </div>

        </div>
      </main>
    </div>
  );
}