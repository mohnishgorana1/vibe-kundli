import Link from "next/link";
import { ArrowLeft, Receipt } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 md:py-20 px-4 sm:px-6 lg:px-8 selection:bg-primary/30">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center rounded-xl border border-red-500/20 shrink-0">
            <Receipt className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Refund Policy</h1>
        </div>
        
        <p className="text-muted-foreground mb-12 border-b border-border/50 pb-6">
          Because VibeKundli delivers digital, AI-generated services instantly, our refund policy is strictly structured.
        </p>

        <div className="space-y-10 text-base md:text-lg">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. All Sales Are Final</h2>
            <p className="text-muted-foreground leading-relaxed">
              Currently, <strong className="text-foreground">we do not offer refunds</strong> for any &quot;Karma Token&quot; purchases or Pro plan upgrades. Once a transaction is completed and tokens are credited to your account, the sale is considered final.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Unused Tokens</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tokens purchased on VibeKundli do not expire. However, unused tokens cannot be converted back into fiat currency (INR, USD, etc.), nor can they be refunded if you decide to stop using the platform.
            </p>
          </section>

          {/* Info Box */}
          <section className="bg-secondary/40 border border-border p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Technical Errors & Failures</h2>
            <p className="text-muted-foreground leading-relaxed">
              We understand that technology isn&apos;t perfect. If you experience a payment failure where your money was deducted but tokens were not credited, please do the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Wait for 10-15 minutes and refresh your dashboard.</li>
              <li>If tokens are still missing, email us at <a href="mailto:support@vibekundli.com" className="text-primary hover:underline">support@vibekundli.com</a> with your Payment ID/Transaction ID.</li>
              <li>We will verify the logs. If valid, we will manually credit the tokens to your account within 24-48 hours.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Dissatisfaction with AI Responses</h2>
            <p className="text-muted-foreground leading-relaxed">
              Because AI responses are dynamically generated based on complex calculations, we cannot guarantee that you will always &quot;like&quot; or &quot;agree with&quot; the reading. We do not issue refunds for dissatisfaction with the astrological interpretations provided by Astro-G.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}