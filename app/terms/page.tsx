import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-20 px-4 sm:px-6 lg:px-8 selection:bg-primary/30">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl border border-primary/20 shrink-0">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
        </div>
        
        <p className="text-muted-foreground mb-12 border-b border-border/50 pb-6">
          Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="space-y-10 text-base md:text-lg">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing, registering, or using VibeKundli, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our platform.
            </p>
          </section>

          {/* 🔥 CRITICAL DISCLAIMER BOX 🔥 */}
          <section className="bg-primary/10 border border-primary/30 p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-primary uppercase tracking-widest">2. Entertainment Disclaimer (Important)</h2>
            <p className="text-foreground/90 leading-relaxed font-medium">
              VibeKundli provides AI-generated Vedic astrology insights. Astrology is an ancient belief system, not an exact science. All predictions, chart readings, and chat responses are provided strictly for entertainment, personal reflection, and spiritual guidance.
            </p>
            <p className="text-foreground/90 leading-relaxed font-medium">
              VibeKundli must <strong className="text-primary">never</strong> be used as a substitute for professional medical, financial, psychological, or legal advice. We take no responsibility for the actions you take based on our AI&apos;s insights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Karma Tokens & Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform operates on a &quot;Karma Token&quot; economy. Generating basic charts is free, but querying the AI requires tokens. 
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>1 Token is deducted for every message sent to the AI (unless stated otherwise).</li>
              <li>Tokens are non-transferable and cannot be exchanged for real currency.</li>
              <li>We reserve the right to modify the token cost of features in the future.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to misuse the AI system (e.g., prompt injection, generating harmful/abusive content), reverse-engineer our ephemeris calculation logic, or share your account credentials with multiple users.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, VibeKundli, its founders, and affiliates shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}