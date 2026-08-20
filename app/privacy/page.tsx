import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-20 px-4 sm:px-6 lg:px-8 selection:bg-primary/30">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl border border-primary/20 shrink-0">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
        </div>
        
        <p className="text-muted-foreground mb-12 border-b border-border/50 pb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="space-y-10 text-base md:text-lg">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At <strong className="text-foreground">VibeKundli</strong>, your privacy and cosmic data security are our highest priorities. This Privacy Policy explains how we collect, process, and protect your personal and astrological information when you use our AI-powered Vedic astrology platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              To provide you with accurate astrological insights, we require specific birth details:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Astrological Data:</strong> Exact Date of Birth, Time of Birth, and Place of Birth (Coordinates).</li>
              <li><strong className="text-foreground">Account Data:</strong> Email address and basic profile information (handled securely via Clerk).</li>
              <li><strong className="text-foreground">Chat History:</strong> Your conversations with our AI (Astro-G) are stored to maintain context for future readings.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. How We Process Your Data (AI Usage)</h2>
            <p className="text-muted-foreground leading-relaxed">
              VibeKundli integrates with third-party AI models (like OpenAI) to interpret astrological charts. We ensure that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Your Name, Email, and exact birth location are <strong className="text-primary">never</strong> shared directly with the AI models.</li>
              <li>Only the calculated mathematical planetary positions (Ephemeris data) and your specific query are sent to the AI for interpretation.</li>
              <li>We <strong className="text-foreground">do not</strong> use your personal chat history to train public AI models.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              All sensitive information is stored in secured databases (MongoDB) with industry-standard encryption. Our vector databases (Pinecone) only hold anonymized astrological embeddings. You have full rights to request the deletion of your chat history at any time from your dashboard.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any concerns regarding how we handle your personal data, please reach out to us at <a href="mailto:privacy@vibekundli.com" className="text-primary hover:underline">privacy@vibekundli.com</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}