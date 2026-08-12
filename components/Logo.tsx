import { cn } from "@/lib/utils";
import React from "react";
import { Sparkles, Moon } from "lucide-react";

interface LogoProps {
  showText?: boolean;
  textSize?: "12px" | "16px" | "18px" | "20px" | "24px" | "32px";
  className?: string;
}

export default function Logo({ showText = true, textSize = "16px", className }: LogoProps) {
  const sizeClass = {
    "12px": "text-xs",
    "16px": "text-base",
    "18px": "text-lg",
    "20px": "text-xl",
    "24px": "text-2xl",
    "32px": "text-4xl",
  }[textSize];

  return (
    <div className={cn("flex items-center gap-2.5 group cursor-pointer", className)}>
      {/* ✨ ANIMATED COSMIC ICON BOX */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
        {/* Sparkle (Top Right) */}
        <Sparkles className="absolute top-1.5 right-1.5 h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-125" />
        {/* Moon (Bottom Left) */}
        <Moon className="absolute bottom-1.5 left-1.5 h-4 w-4 text-foreground transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
      </div>

      {/* TEXT AREA */}
      {showText && (
        <div className="flex items-center tracking-tight font-extrabold">
          <span className={cn("text-foreground transition-colors group-hover:text-primary", sizeClass)}>
            VibeKundli
          </span>
        </div>
      )}
    </div>
  );
}