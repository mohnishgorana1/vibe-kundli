"use client";

import Link from "next/link";
import Logo from "./Logo"; 

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/50 bg-card/50 backdrop-blur-lg pt-16 pb-8 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Logo showText={true} textSize="20px" />
            <p className="mt-4 text-muted-foreground text-sm max-w-xs leading-relaxed">
              Decoding the cosmos with advanced ephemeris data and deep-learning AI. Your personalized guide to the stars.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-foreground mb-4 tracking-tight">Features</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Astro-G Chat</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">AI Kundli Report</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Drishti & Maitri Analysis</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cosmic Queries</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-foreground mb-4 tracking-tight">Legal & Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VibeKundli. Built with mystic energy and modern code.
          </p>
          <div className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
            Astrology is a guide, not a guarantee.
          </div>
        </div>
      </div>
    </footer>
  );
}