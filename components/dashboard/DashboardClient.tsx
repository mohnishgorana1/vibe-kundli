"use client";

import { useState } from "react";
import SidebarNav from "./SidebarNav";
import AstroChartsView from "./views/AstroChartsView";
import AstroChatView from "./views/AstroChatView";
import CosmicQueriesTab from "./views/CosmicQueriesView";
import OverView from "./views/OverView";
import AIKundliView from "./views/AIKundliView";
import Logo from "../Logo";
;

export default function DashboardClient({ userData, initialMessages }: { userData: any; initialMessages: any[] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<string>("OVERVIEW");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleMobileDeleteChat = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/chat/history", { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting chat", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "CHARTS": return <AstroChartsView userData={userData} />;
      case "AI_REPORT": return <AIKundliView aiReport={userData.aiReport} />
      case "QUERIES": return <CosmicQueriesTab freeQueries={userData.freeQueries} onSwitchToChat={setActiveView} />
      case "CHAT": return <AstroChatView userData={userData} initialMessages={initialMessages} />;
      case "OVERVIEW": default: return <OverView userData={userData} onSwitchToChat={setActiveView} />
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-secondary/20">

      <SidebarNav
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userData={userData}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* navbar for small screen only */}
        <nav className="lg:hidden flex items-center justify-between p-4 border-b border-border/40 bg-background/80 backdrop-blur-md z-10 shrink-0 shadow-sm space-x-2">
          {
            activeView === "CHAT" ? (
              <div className="flex-1 flex items-center gap-3 shrink-0">
                <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-xl">🧿</span>
                <div className="space-y-2 ">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <span>Astro-G Live</span>
                    <span className="text-[10px] font-bold px-1.5  py-0.5 bg-secondary text-foreground rounded-md border border-border">
                      {userData.tokenBalance} 🪙
                    </span>
                  </h2>

                  <p className="text-[8px] text-green-500 uppercase tracking-widest font-bold">Cosmic Connection Active</p>
                </div>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="ml-auto p-1.5 bg-red-500/10 text-red-500 rounded-md border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                </button>
              </div>
            ) : (
              <Logo />
            )
          }



          {/* sidebar drawer btn */}
          <button onClick={toggleSidebar} className="p-2 bg-secondary rounded-lg text-foreground hover:bg-secondary/80 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </button>

        </nav>

        <main className={`flex-1 overflow-y-auto ${activeView === "CHAT" ? "" : "p-4 md:p-8 lg:p-10"} scrollbar-thin`}>
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}