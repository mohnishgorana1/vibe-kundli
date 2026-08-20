"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Logo from "../Logo";
import ThemeToggle from "../themes/ThemeToggle";

export default function SidebarNav({
  activeView,
  setActiveView,
  isOpen,
  toggleSidebar,
  userData
}: {
  activeView: string;
  setActiveView: (v: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  userData: any;
}) {
  const navItems = [
    { id: "CHAT", label: "Astro Chat", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg> },
    { id: "OVERVIEW", label: "Overview", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg> },
    { id: "CHARTS", label: "Astro Charts", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg> },
    { id: "AI_REPORT", label: "AI Kundli", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="m10 13 4 4-4 4" /></svg> },
    { id: "QUERIES", label: "Cosmic Queries", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></svg> },
  ];

  const { isLoaded, userId } = useAuth();
  const isSignedIn = !!userId;

  return (
    <>
      {/* Mobile Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={toggleSidebar} />

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-border/40 transition-all duration-300 ease-in-out
        ${isOpen ? "w-[300px] translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[80px]"}`}
      >
        {/* Floating Toggle Button (Desktop Only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-8 items-center justify-center w-6 h-6 bg-background border border-border/50 rounded-full shadow-sm text-muted-foreground hover:text-foreground z-50 transition-all hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${!isOpen && "rotate-180"}`}>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Header / Logo */}
        <div className={`h-16 flex items-center shrink-0 border-b border-border/20 transition-all duration-300 ${isOpen ? "px-6 py-4 justify-between" : "justify-center"}`}>
          {
            isOpen ? (
              <Logo />

            ) : (
              <Logo showText={false} />
            )
          }
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group
                  ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}
                  ${!isOpen ? "justify-center" : "justify-start"}
                `}
                title={!isOpen ? item.label : ""}
              >
                {/* Active Indicator Line */}
                {isActive && <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}

                <span className="shrink-0">{item.icon}</span>
                <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden
                  ${!isOpen ? "opacity-0 w-0" : "opacity-100 w-auto"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile / Tokens Bottom Section */}
        <div className={`p-4 border-t border-border/20 transition-all duration-300 ${isOpen ? "" : "flex justify-center"}`}>
          <div className={`flex items-center justify-between gap-3 ${isOpen ? "bg-secondary/30 p-3 rounded-xl border border-border/40" : "flex-col"}`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg border border-subtle p-0.5 bg-panel hover:border-primary/40 transition-colors">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-7 w-7 rounded-md",
                      },
                    }}
                  />
                </div>
              </div>
              <div className={`flex flex-col items-start overflow-hidden transition-all duration-300 ${!isOpen ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
                <p className="text-sm font-semibold text-foreground truncate w-32 text-left">{userData.firstName} {userData.lastName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-muted-foreground tracking-widest">{userData.tokenBalance} TOKENS</span>
                </div>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>

      </aside>
    </>
  );
}