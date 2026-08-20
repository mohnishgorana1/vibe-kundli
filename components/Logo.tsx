import { cn } from "@/lib/utils";
import React from "react";

interface LogoProps {
  showText?: boolean;
  textSize?: "12px" | "16px" | "18px" | "20px" | "24px" | "32px";
  className?: string;
}

export default function Logo({ showText = true, textSize = "20px", className }: LogoProps) {
  const sizeClass = {
    "12px": "text-xs",
    "16px": "text-base",
    "18px": "text-lg",
    "20px": "text-xl",
    "24px": "text-2xl",
    "32px": "text-4xl",
  }[textSize];

  return (
    <div className={cn("flex items-center gap-1.5 group cursor-pointer", className)}>
      
      {/* 🌌 PREMIUM COSMIC KUNDLI ICON */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-500 group-hover:scale-105">
        
        {/* Background Glow */}
        <div className="absolute inset-1 bg-primary/10 blur-sm rounded-full group-hover:bg-primary/20 transition-colors duration-500"></div>


        {/* Outer Kundli Diamond */}
        <div className="absolute h-6 w-6 bg-linear-to-br from-background to-secondary/80 border border-primary/50 rotate-45 rounded-sm shadow-inner group-hover:border-primary transition-colors duration-300"></div>

        {/* Inner Glowing Diamond */}
        <div className="absolute h-3 w-3 bg-linear-to-tr from-primary to-purple-500 rotate-45 rounded-xs shadow-[0_0_12px_rgba(var(--primary),1)] group-hover:rotate-225 transition-transform duration-700 ease-in-out"></div>

        {/* Center Soul Pulse */}
        <div className="absolute h-1 w-1 bg-white rounded-full animate-pulse shadow-[0_0_5px_#fff]"></div>
      </div>

      {/* ✨ PREMIUM TYPOGRAPHY */}
      {showText && (
        <div className="flex items-center tracking-tight">
          <span className={cn("font-extrabold text-foreground transition-colors duration-300", sizeClass)}>
            Vibe
          </span>
          <span className={cn("font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 ml-[1px]", sizeClass)}>
            Kundli
          </span>
        </div>
      )}
    </div>
  );
}