"use client";

import * as React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

const ThemeToggle = () => {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggleThemeWithTransition = useCallback(async () => {
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition || !buttonRef.current) {
      setTheme(nextTheme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    }).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [isDark, setTheme]);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleThemeWithTransition}
      className={cn("flex h-8 w-8 items-center justify-center rounded-lg  transition-all duration-300", "border border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary")}
      aria-label="Toggle theme"
    >
      <Moon
        className={`absolute h-4 w-4 transition-all duration-500 ${isDark ? 'scale-0 rotate-90' : 'scale-100 rotate-0'
          }`}
      />
      <Sun
        className={`absolute h-4 w-4 transition-all duration-500 ${isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
          }`}
      />
    </button>
  );
};

export default ThemeToggle;