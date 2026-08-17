"use client";

import { useState } from "react";
import SidebarNav from "./SidebarNav";
import AstroChartsView from "./views/AstroChartsView";
import AstroChatView from "./views/AstroChatView";
import ReactMarkdown from "react-markdown";
import CosmicQueriesTab from "./views/CosmicQueriesView";
import OverView from "./views/OverView";
import AIKundliView from "./views/AIKundliView";
import Logo from "../Logo";
;

export default function DashboardClient({ userData }: { userData: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<string>("OVERVIEW");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderActiveView = () => {
    switch (activeView) {
      case "AI_REPORT": return <AIKundliView aiReport={userData.aiReport} />
      case "CHARTS": return <AstroChartsView userData={userData} />;
      case "CHAT": return <AstroChatView />;
      case "QUERIES": return <CosmicQueriesTab freeQueries={userData.freeQueries} onSwitchToChat={setActiveView} />
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
        <nav className="lg:hidden flex items-center justify-between p-4 border-b border-border/40 bg-background/80 backdrop-blur-md z-10 shrink-0 shadow-sm">
          <Logo />
          <button onClick={toggleSidebar} className="p-2 bg-secondary rounded-lg text-foreground hover:bg-secondary/80 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </button>
        </nav>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scrollbar-thin">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}