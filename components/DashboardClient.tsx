"use client";

import { useState } from "react";
import KundliChart from "./KundliChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";

// ==========================================
// ⬅️ LEFT SIDEBAR COMPONENT (Untouched)
// ==========================================
const LeftSidebar = ({ userData, isOpen }: { userData: any; isOpen: boolean }) => {
  const formattedDOB = userData.birthDetails?.dob
    ? new Date(userData.birthDetails.dob).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    })
    : "Not Provided";

  const chartData = userData.kundliChartData || [];
  const mars = chartData.find((p: any) => p.name.toLowerCase() === 'mars');
  const isMangalik = mars ? [1, 4, 7, 8, 12].includes(mars.house) : false;
  const kendraCount = chartData.filter((p: any) => [1, 4, 7, 10].includes(p.house)).length;
  const trikonaCount = chartData.filter((p: any) => [1, 5, 9].includes(p.house)).length;

  return (
    <div className={`hidden lg:flex flex-col border-r border-border/40 bg-card/10 overflow-y-auto scrollbar-hide transition-all duration-500 ease-in-out scrollbar ${isOpen ? "w-[25%] max-w-[320px] p-5 opacity-100" : "w-0 p-0 opacity-0 border-none"}`}>
      <div className="min-w-[270px]">
        <div className="mt-2 mb-6 ">
          <p className="my-3 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Verified Matrix
          </p>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Overview</h2>
        </div>
        <div className="bg-secondary/30 rounded-xl p-4 mb-6 border border-border/50 flex flex-col gap-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-border/40 pb-2"><span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Date</span><span className="text-sm font-semibold text-foreground">{formattedDOB}</span></div>
          <div className="flex justify-between items-center border-b border-border/40 pb-2"><span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Time</span><span className="text-sm font-semibold text-foreground">{userData.birthDetails?.tob || "Unknown"}</span></div>
          <div className="flex justify-between items-center"><span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Location</span><span className="text-sm font-semibold text-foreground capitalize truncate max-w-[100px]">{userData.birthDetails?.pob || "Unknown"}</span></div>
        </div>
        {/* <div className="mb-6">
          <h3 className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest mb-3">Cosmic Insights</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-3 rounded-xl border flex flex-col gap-1 shadow-sm ${isMangalik ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}><span className="text-[9px] uppercase font-bold tracking-widest text-foreground/70">Mangalik</span><span className={`text-sm font-bold ${isMangalik ? 'text-red-500' : 'text-green-500'}`}>{isMangalik ? "Yes (Dosh)" : "No"}</span></div>
            <div className="p-3 rounded-xl border border-border/50 bg-secondary/30 flex flex-col gap-1 shadow-sm"><span className="text-[9px] uppercase font-bold tracking-widest text-foreground/70">Power Houses</span><span className="text-xs font-bold text-primary">{kendraCount} Kendra <br /> <span className="text-foreground">{trikonaCount} Trikona</span></span></div>
          </div>
        </div> */}
        <div className="bg-card border border-border/40 rounded-xl shadow-sm px-2 mb-6">
          <Accordion type="single" className="w-full">
            <AccordionItem value="all-planets" className="border-none">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors px-2 py-3 group">
                <div className="flex items-center gap-2"><h2 className="text-sm font-bold text-foreground">Planetary Details</h2><span className="text-[10px] font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">{chartData?.length || 0}</span></div>
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-4">
                <div className="grid grid-cols-1 gap-4">
                  {chartData?.map((planet: any, idx: number) => (
                    <div key={idx} className="bg-secondary/20 p-2.5 rounded-lg border border-border/80 hover:border-primary/30 transition-colors flex flex-col gap-2 shadow-secondary/50 shadow-sm">
                      <div className="flex items-center gap-2 border-b border-border/40 pb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span><span className="font-bold text-[11px] text-foreground tracking-widest uppercase">{planet.name}</span></div>
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                        <div className="flex flex-col"><span className="text-[12px] uppercase text-muted-foreground font-bold tracking-widest">Sign</span><span className="font-medium text-foreground text-[11px]">{planet.sign}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] uppercase text-muted-foreground font-bold tracking-widest">House</span><span className="font-bold text-primary text-[11px]">{planet.house}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] uppercase text-muted-foreground font-bold tracking-widest">Nakshatra</span><span className="font-medium text-foreground text-[11px] line-clamp-1">{planet.nakshatra || "—"}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] uppercase text-muted-foreground font-bold tracking-widest">State</span><span className="font-medium text-foreground text-[11px] line-clamp-1">{planet.planet_awastha || "—"}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🤖 RIGHT SIDEBAR COMPONENT (Untouched)
// ==========================================
const RightSidebar = ({ userData, isOpen }: { userData: any; isOpen: boolean }) => {
  return (
    <div className={`hidden lg:flex flex-col bg-card/10 border-l border-border/30 relative transition-all duration-500 ease-in-out ${isOpen ? "w-[40%] max-w-[600px] opacity-100" : "w-0 opacity-0 border-none"}`}>
      <div className="min-w-[280px] h-full flex flex-col">
        <div className="p-4 border-b border-border/40 bg-background/50 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"><span className="text-sm">🧿</span></div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Astro-G</h3>
              <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Meditating</p>
            </div>
          </div>
          <div className="text-[10px] font-bold bg-secondary/80 px-2 py-1 rounded-md text-muted-foreground border border-border/50">{userData.tokenBalance} TOKENS</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-70">
          <h3 className="text-xl font-extrabold text-foreground mb-2">Ask about your stars</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">I am analyzing the intricate web of your 12 houses. The conversational interface will unlock momentarily.</p>
        </div>
        <div className="p-4 bg-background/80 backdrop-blur-md absolute bottom-0 w-full border-t border-border/40">
          <div className="w-full bg-secondary/50 rounded-lg px-4 py-3 border border-border/50 text-muted-foreground text-xs flex items-center gap-2 cursor-not-allowed opacity-70 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>
            Establishing cosmic connection...
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🌟 MAIN DASHBOARD LAYOUT
// ==========================================
export default function DashboardClient({ userData }: { userData: any }) {
  // 🔥 INITIAL STATE: Left open, Right closed
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"LAGNA" | "MOON" | "SUN" | "MANGALIK" | "POWER" | "DRISHTI" | "MAITRI">("LAGNA");

  // 🔥 STRICT TOGGLE LOGIC: Ek khulega toh dusra band hoga
  const toggleLeftSidebar = () => {
    setIsLeftOpen(!isLeftOpen);
    if (!isLeftOpen) setIsRightOpen(false);
  };

  const toggleRightSidebar = () => {
    setIsRightOpen(!isRightOpen);
    if (!isRightOpen) setIsLeftOpen(false);
  };

  const chartData = userData.kundliChartData || [];

  // --- Rotated Charts Math ---
  const getRotatedChart = (planetName: string) => {
    if (!chartData.length) return [];
    const basePlanet = chartData.find((p: any) => p.name.toLowerCase() === planetName);
    if (!basePlanet) return chartData;
    const baseHouse = basePlanet.house;
    return chartData.map((planet: any) => {
      let newHouse = planet.house - baseHouse + 1;
      if (newHouse <= 0) newHouse += 12;
      return { ...planet, house: newHouse };
    });
  };
  const chartDataToDisplay = activeTab === "MOON" ? getRotatedChart('moon') : activeTab === "SUN" ? getRotatedChart('sun') : chartData;

  // --- Reasoning Math ---
  const mars = chartData.find((p: any) => p.name.toLowerCase() === 'mars');
  const sun = chartData.find((p: any) => p.name.toLowerCase() === 'sun');
  const moon = chartData.find((p: any) => p.name.toLowerCase() === 'moon');
  const firstHousePlanets = chartData.filter((p: any) => p.house === 1);

  const isMangalik = mars ? [1, 4, 7, 8, 12].includes(mars.house) : false;
  const kendraPlanets = chartData.filter((p: any) => [1, 4, 7, 10].includes(p.house));
  const trikonaPlanets = chartData.filter((p: any) => [1, 5, 9].includes(p.house));

  const getCoreInsights = (type: "LAGNA" | "SUN" | "MOON") => {
    if (type === "LAGNA") {
      if (firstHousePlanets.length === 0) {
        return {
          title: "The Empty First House",
          theme: "Self & Physical Body",
          insight: "Your 1st house is empty, which means your physical vitality and core personality are highly adaptable. You take on the traits of your Ascendant lord and easily mold yourself to your environment.",
          color: "text-primary"
        };
      } else {
        const pNames = firstHousePlanets.map((p: any) => p.name).join(", ");
        return {
          title: `Planets in Ascendant: ${pNames}`,
          theme: "Self & Outward Expression",
          insight: `Having ${pNames} in your 1st house directly colors your physical appearance and how the world sees you. You project the energy of these planets directly into your environment, making your personality distinct and powerful.`,
          color: "text-primary"
        };
      }
    }

    if (type === "SUN") {
      const house = sun?.house;
      let insight = "The Sun brings light and authority wherever it sits.";
      if ([1, 5, 9, 10].includes(house)) insight = "Your Sun is placed in a highly powerful house, indicating a strong sense of purpose, leadership potential, and natural authority in your career.";
      else if ([6, 8, 12].includes(house)) insight = "Your Sun is in a hidden or transformative house. Your true power lies in behind-the-scenes work, research, healing, or overcoming significant life hurdles.";
      else insight = `With the Sun in House ${house}, your soul's main focus is directed towards the themes of this specific area, bringing vitality and a need for recognition here.`;

      return { title: `Sun in House ${house || "?"}`, theme: "Soul & Career Path", insight, color: "text-orange-500" };
    }

    if (type === "MOON") {
      const house = moon?.house;
      let insight = "The Moon governs your emotional reactions and inner peace.";
      if ([1, 4, 5, 9].includes(house)) insight = "Your Moon is in a very comfortable placement, giving you a deep connection to your emotions, strong intuition, and a generally peaceful or highly creative inner life.";
      else if ([6, 8, 12].includes(house)) insight = "Your Moon is in a sensitive house. You possess deep, complex emotions and strong intuitive abilities, but you must actively protect your mental peace from overthinking.";
      else insight = `With the Moon in House ${house}, your emotional security is tied to the themes of this house. This is where your mind naturally wanders.`;

      return { title: `Moon in House ${house || "?"}`, theme: "Mind & Emotional Core", insight, color: "text-blue-400" };
    }

    return { title: "", theme: "", insight: "", color: "" };
  };


  const getMangalikInsight = (marsHouse: number | undefined) => {
    if (!marsHouse || ![1, 4, 7, 8, 12].includes(marsHouse)) {
      return {
        level: "None",
        desc: "You are not a Mangalik. Mars is positioned in a neutral house regarding marriage and domestic peace. You do not need to worry about traditional Mangal Dosh compatibility rules.",
        remedy: "No specific Mars remedies are required for marriage purposes."
      };
    }

    let level = "Medium";
    let desc = "";

    switch (marsHouse) {
      case 1:
        level = "High";
        desc = "Mars in the 1st house affects your personality directly. You may be highly independent, short-tempered, or dominant. This can cause friction with a partner who expects a submissive spouse.";
        break;
      case 4:
        level = "Medium";
        desc = "Mars in the 4th house affects domestic peace and family happiness. You might experience frequent arguments at home or issues related to property and inner emotional contentment.";
        break;
      case 7:
        level = "High";
        desc = "Mars in the 7th house is considered strong Mangal Dosh. It directly aspects the house of marriage, potentially causing power struggles, intense arguments, or sudden disruptions in partnerships.";
        break;
      case 8:
        level = "High";
        desc = "Mars in the 8th house affects longevity, hidden matters, and marital intimacy. This is a sensitive placement that can bring sudden, transformative events in your personal life.";
        break;
      case 12:
        level = "Low to Medium";
        desc = "Mars in the 12th house affects subconscious mind, expenses, and bedroom harmony. It can lead to hidden frustrations, high expenses, or a feeling of detachment in intimate relationships.";
        break;
    }

    return {
      level,
      desc,
      remedy: "Common remedies include chanting the Hanuman Chalisa, offering sweets on Tuesdays, avoiding impulsive arguments, and traditionally, marrying another Mangalik to cancel the harsh energy."
    };
  };

  const getPowerInsight = (kPlanets: any[], tPlanets: any[]) => {
    let kendraStrength = kPlanets.length > 2 ? "Very Strong" : kPlanets.length > 0 ? "Moderate" : "Weak";
    let trikonaStrength = tPlanets.length > 2 ? "Very Strong" : tPlanets.length > 0 ? "Moderate" : "Weak";

    return {
      kendra: {
        status: kendraStrength,
        desc: kendraStrength === "Weak"
          ? "You have few planets in the Kendra (1, 4, 7, 10) houses. This means you will need to actively build the foundational pillars of your life (Career, Home, Relationships) through sheer hard work rather than relying on inherent momentum."
          : `With ${kPlanets.length} planets in Kendra, the structural pillars of your life are highly active. You are built for action, public visibility, and taking on major responsibilities in the real world.`
      },
      trikona: {
        status: trikonaStrength,
        desc: trikonaStrength === "Weak"
          ? "You have few planets in Trikona (1, 5, 9). Your successes will come more from logic, effort, and karma rather than sudden strokes of luck or divine grace."
          : `With ${tPlanets.length} planets in Trikona, you have strong spiritual backing and natural luck. These planets bring intelligence, creative solutions, and fortune without immense struggle.`
      }
    };
  };

  const getDrishtiData = () => {
    return chartData.map((p: any) => {
      const name = p.name.toLowerCase();
      let aspectDists = [7];
      if (name === 'mars') aspectDists = [4, 7, 8];
      else if (['jupiter', 'rahu', 'ketu'].includes(name)) aspectDists = [5, 7, 9];
      else if (name === 'saturn') aspectDists = [3, 7, 10];
      const aspectedHouses = aspectDists.map(d => {
        let target = p.house + d - 1;
        return target > 12 ? target - 12 : target;
      });
      const aspectedPlanets = chartData.filter((targetP: any) => targetP.name !== p.name && aspectedHouses.includes(targetP.house)).map((targetP: any) => targetP.name);
      return { ...p, aspectedHouses, aspectedPlanets };
    });
  };

  const getMaitriData = () => {
    return chartData.map((baseP: any) => {
      const friendlyHouses = [2, 3, 4, 10, 11, 12].map(d => {
        let target = baseP.house + d - 1;
        return target > 12 ? target - 12 : target;
      });
      const friends = chartData.filter((p: any) => p.name !== baseP.name && friendlyHouses.includes(p.house)).map((p: any) => p.name);
      const enemies = chartData.filter((p: any) => p.name !== baseP.name && !friendlyHouses.includes(p.house)).map((p: any) => p.name);
      return { name: baseP.name, house: baseP.house, friends, enemies };
    });
  };


  const renderDrishtiInsight = (planet: string, aspectedHouses: number[], aspectedPlanets: string[]) => {
    const p = planet.toLowerCase();

    // Hardcoded Astrological Aspect Effects (Pure English)
    const aspectEffects: any = {
      jupiter: { type: "Blessing & Expansion", desc: "Jupiter's gaze acts as a divine shield. It brings luck, wisdom, protection, and growth to these areas of your life.", color: "text-green-500", bg: "bg-green-500/20" },
      saturn: { type: "Discipline & Delay", desc: "Saturn restricts and demands hard work. Its aspect causes delays and challenges, but ultimately builds strong long-term stability.", color: "text-blue-500", bg: "bg-blue-500/20" },
      mars: { type: "Energy & Conflict", desc: "Mars injects high energy, courage, and ambition, but also brings potential conflicts, impatience, and aggressive friction.", color: "text-red-500", bg: "bg-red-500/20" },
      rahu: { type: "Obsession & Illusion", desc: "Rahu's gaze creates intense worldly desires, unconventional thinking, and sometimes confusion or obsession in these areas.", color: "text-purple-500", bg: "bg-purple-500/20" },
      ketu: { type: "Detachment & Intuition", desc: "Ketu brings a sense of spiritual detachment, deep intuition, and sometimes sudden endings or mystical experiences.", color: "text-gray-400", bg: "bg-gray-400/20" },
      venus: { type: "Harmony & Luxury", desc: "Venus brings a touch of luxury, harmony, and creative or romantic energy to the houses it aspects.", color: "text-pink-500", bg: "bg-pink-500/20" },
      mercury: { type: "Intellect & Logic", desc: "Mercury enhances communication, intellect, analytical thinking, and business acumen in these areas.", color: "text-emerald-500", bg: "bg-emerald-500/20" },
      sun: { type: "Authority & Ego", desc: "The Sun illuminates these houses, demanding authority and visibility, though it may cause some ego clashes or dominance issues.", color: "text-orange-500", bg: "bg-orange-500/20" },
      moon: { type: "Emotion & Nurturing", desc: "The Moon's aspect brings emotional focus, nurturing, and intuition, though it may cause emotional fluctuations in these areas.", color: "text-sky-500", bg: "bg-sky-500/20" }
    };

    const data = aspectEffects[p] || { type: "General Influence", desc: "This planet brings its natural energy to these houses.", color: "text-primary", bg: "bg-primary/20" };

    return (
      <div className="flex flex-col gap-1.5 mt-2 bg-background/50 p-4 rounded-xl border border-border/30">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-widest ${data.bg} ${data.color}`}>
            {data.type}
          </span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {data.desc}
          {aspectedPlanets.length > 0 && (
            <span className="block mt-2 font-medium text-foreground/90">
              It is directly influencing the energy of: <strong className="text-primary">{aspectedPlanets.join(", ")}</strong>.
            </span>
          )}
        </p>
      </div>
    );
  };

  const renderMaitriInsight = (planet: string, friends: string[], enemies: string[]) => {
    const p = planet.toLowerCase();
    const fCount = friends.length;
    const eCount = enemies.length;
    const isFavorable = fCount >= eCount; // Favorable if friends are >= enemies

    // Hardcoded Astrological Traits Dictionary (Pure English)
    const traits: any = {
      sun: { theme: "Career & Authority", pos: "Strong leadership, full support from your father or boss, and fame.", neg: "Ego clashes, confidence issues, and conflicts with authority figures or superiors." },
      moon: { theme: "Mind & Emotions", pos: "Mental peace, strong intuition, and emotional stability.", neg: "Overthinking, anxiety, mood swings, and inner restlessness." },
      mars: { theme: "Action & Courage", pos: "High energy, fearless decisions, and gains in property or sports.", neg: "Anger issues, impulsive decisions, and unnecessary arguments." },
      mercury: { theme: "Intellect & Business", pos: "Sharp communication, business success, and quick learning.", neg: "Miscommunication, nervous energy, and confusion in decision-making." },
      jupiter: { theme: "Wisdom & Luck", pos: "Financial growth, good luck, and spiritual clarity.", neg: "Missed opportunities, financial delays, and over-optimism." },
      venus: { theme: "Love & Luxury", pos: "Romantic harmony, financial comfort, and artistic success.", neg: "Relationship troubles, dissatisfaction, and unnecessary expenses." },
      saturn: { theme: "Karma & Discipline", pos: "Patience, long-term stability, and steady career growth.", neg: "Delays, frustration, and extra hard work without immediate results." },
      rahu: { theme: "Ambition", pos: "Out-of-the-box thinking and sudden material gains.", neg: "Illusions, bad habits, and unnecessary risks." },
      ketu: { theme: "Spirituality", pos: "Deep intuition, spiritual growth, and detachment.", neg: "Isolation, feeling lost, and over-detachment." },
    };

    const data = traits[p] || { theme: "General", pos: "Smooth progress and support.", neg: "Hurdles and mixed results." };

    return (
      <div className="flex flex-col gap-1.5 mt-2 bg-background/50 p-4 rounded-xl border border-border/30">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm uppercase font-extrabold text-primary tracking-widest">{data.theme}</span>
          {isFavorable ? <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-bold">Favorable</span> : <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold">Challenging</span>}
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {isFavorable ? (
            <span>Since your {planet} has more friends than enemies, you can expect <strong>{data.pos}</strong> Your temporary friends ({friends.join(", ") || "none"}) will act as catalysts for this success.</span>
          ) : (
            <span>Your {planet} is surrounded by more enemies than friends. Watch out for <strong>{data.neg}</strong> Planets like ({enemies.join(", ") || "none"}) may create friction in this area of your life.</span>
          )}
        </p>
      </div>
    );
  };

  const drishtiData = getDrishtiData();
  const maitriData = getMaitriData();

  // --- Parse Markdown ---
  const parseAiReport = (report: string) => {
    if (!report) return [];
    const parts = report.split(/^##\s+/m);
    const sections = [];
    if (parts[0] && parts[0].trim().length > 20) sections.push({ title: "Cosmic Overview", content: parts[0].trim() });
    for (let i = 1; i < parts.length; i++) {
      const currentPart = parts[i];
      const newlineIndex = currentPart.indexOf('\n');
      if (newlineIndex !== -1) {
        const cleanTitle = currentPart.slice(0, newlineIndex).trim().replace(/^[\d\.]+\s*/, '');
        const content = currentPart.slice(newlineIndex).trim();
        if (cleanTitle && content.length > 0) sections.push({ title: cleanTitle, content });
      }
    }
    return sections;
  };
  const reportSections = parseAiReport(userData.aiReport || "");

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      <LeftSidebar userData={userData} isOpen={isLeftOpen} />

      {/* 🎯 CENTER PANEL (Relative Position for Absolute Buttons) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative transition-all duration-500">

        {/* 🔥 ABSOLUTE BUTTONS (Header Removed) */}
        <button
          onClick={toggleLeftSidebar}
          className="absolute top-6 left-6 z-20 hidden lg:flex p-2.5 rounded-lg bg-background/80 backdrop-blur-md border border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary/80 shadow-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
        </button>

        <button
          onClick={toggleRightSidebar}
          className="absolute top-6 right-6 z-20 hidden lg:flex p-2.5 rounded-lg bg-background/80 backdrop-blur-md border border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary/80 shadow-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M15 3v18" /></svg>
        </button>

        {/* Scrollable Center Content (Added pt-20 to avoid overlap with absolute buttons) */}
        <div className="flex-1 overflow-y-auto pt-4 pb-40 px-4 md:px-8 lg:px-24 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-4">

            {/* 📜 1. TOP: AI REPORT (Direct Content Start) */}
            <div className="bg-card/50 border border-border rounded-2xl shadow-sm w-full min-w-0 overflow-hidden">
              <Accordion type="single" className="w-full">
                <AccordionItem value="ai-report" className="border-none">
                  <AccordionTrigger className="px-6 py-2 hover:no-underline hover:text-primary transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✨</span>
                      <h2 className="text-sm md:text-base font-bold text-foreground">AI Kundli Report</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 md:px-6 pb-6 pt-2">
                    <div className="max-h-[500px] overflow-y-auto pr-2 md:pr-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent space-y-8">
                      {reportSections.length > 0 ? (
                        reportSections.map((section, idx) => (
                          <div key={idx} className="w-full border-b border-border pb-4">
                            <h3 className="text-sm md:text-base font-bold text-primary pb-2">
                              {section.title}
                            </h3>
                            <div className="
                              prose prose-base md:prose-lg dark:prose-invert 
                              prose-a:text-primary prose-strong:text-foreground 
                              max-w-none w-full min-w-0 leading-relaxed
                              break-words [overflow-wrap:anywhere] text-foreground/80 text-justify
                              [&_*]:max-w-full [&_*]:min-w-0 [&_*]:break-words [&_*]:whitespace-normal
                              [&_pre]:overflow-x-hidden [&_pre]:whitespace-pre-wrap
                              [&_code]:break-all [&_code]:whitespace-pre-wrap selection:bg-primary/30
                            ">
                              <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10"><span className="text-muted-foreground animate-pulse">AI Report is being processed...</span></div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* 🔮 2. BOTTOM: INTERACTIVE TABS */}
            <div className="bg-card/50 border border-border rounded-2xl shadow-sm  pt-6 flex flex-col items-center min-h-[550px]">

              <div className="flex px-4 py-6 shadow-sm shadow-secondary/50 hover:shadow-secondary/80 mb-8 bg-background rounded-2xl  flex-wrap justify-center gap-1 w-full max-w-3xl">
                <button onClick={() => setActiveTab("LAGNA")} className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeTab === "LAGNA" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Lagna</button>
                <button onClick={() => setActiveTab("MOON")} className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeTab === "MOON" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Moon</button>
                <button onClick={() => setActiveTab("SUN")} className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeTab === "SUN" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Sun</button>
                <div className="w-px bg-border/50 mx-2 hidden sm:block"></div>
                <button onClick={() => setActiveTab("MANGALIK")} className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeTab === "MANGALIK" ? "bg-red-500/80 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Mangalik</button>
                <button onClick={() => setActiveTab("POWER")} className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeTab === "POWER" ? "bg-blue-500/80 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Power</button>
                <div className="w-px bg-border/50 mx-2 hidden sm:block"></div>
                <button onClick={() => setActiveTab("DRISHTI")} className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeTab === "DRISHTI" ? "bg-purple-500/80 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Drishti</button>
                <button onClick={() => setActiveTab("MAITRI")} className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeTab === "MAITRI" ? "bg-teal-500/80 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Maitri</button>
              </div>

              {/* Split Content Layout */}
              <div className="w-full flex flex-col lg:flex-row gap-8 items-start border">

                {/* 🎨 LEFT COLUMN: Visuals */}
                <div className="w-full lg:w-[55%] p-6 min-h-[450px]">
                  <div className=" flex flex-col items-center justify-center">
                    {["LAGNA", "MOON", "SUN"].includes(activeTab) && (
                      <div className="animate-in fade-in zoom-in duration-300 w-full flex justify-center">
                        <KundliChart chartData={chartDataToDisplay} title={activeTab === "LAGNA" ? "Lagna Chart (D1)" : activeTab === "MOON" ? "Chandra Kundli" : "Surya Kundli"} />
                      </div>
                    )}
                  </div>

                  {activeTab === "MANGALIK" && (
                    <div className="flex flex-col items-center justify-start animate-in zoom-in duration-300 pt-8">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 shadow-lg ${isMangalik ? "bg-red-500/10 border-red-500/50 text-red-500 shadow-red-500/20" : "bg-green-500/10 border-green-500/50 text-green-500 shadow-green-500/20"}`}>
                        <span className="text-4xl font-bold">{mars?.house || "?"}</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground">{isMangalik ? "Mangalik Dosh Detected" : "No Mangalik Dosh"}</h3>
                    </div>
                  )}
                  {activeTab === "POWER" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full animate-in zoom-in duration-300 pt-4">
                      <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 flex flex-col items-center text-center"><span className="text-3xl mb-3">🏛️</span><h4 className="font-bold text-foreground uppercase tracking-widest text-sm mb-2">Kendra Sthaan</h4><p className="text-xs text-muted-foreground mb-4">Pillars (1, 4, 7, 10)</p><div className="flex flex-wrap justify-center gap-2">{kendraPlanets.length > 0 ? kendraPlanets.map((p: any, i: number) => (<span key={i} className="text-sm font-semibold bg-primary/20 text-primary px-3 py-1 rounded-md">{p.name}</span>)) : <span className="text-sm text-muted-foreground">Empty</span>}</div></div>
                      <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 flex flex-col items-center text-center"><span className="text-3xl mb-3">✨</span><h4 className="font-bold text-foreground uppercase tracking-widest text-sm mb-2">Trikona Sthaan</h4><p className="text-xs text-muted-foreground mb-4">Luck (1, 5, 9)</p><div className="flex flex-wrap justify-center gap-2">{trikonaPlanets.length > 0 ? trikonaPlanets.map((p: any, i: number) => (<span key={i} className="text-sm font-semibold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-md">{p.name}</span>)) : <span className="text-sm text-muted-foreground">Empty</span>}</div></div>
                    </div>
                  )}
                  {activeTab === "DRISHTI" && (
                    <div className="w-full max-h-[400px] md:max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin animate-in fade-in duration-300 pt-2">
                      <div className="grid grid-cols-1 gap-3 w-full">
                        {drishtiData.map((p: any, i: number) => (
                          <div key={i} className="bg-secondary/20 border border-border/40 p-4 rounded-xl flex items-center justify-between">
                            <span className="font-bold text-foreground uppercase w-20">{p.name}</span>
                            <span className="text-xl text-muted-foreground">👁️</span>
                            <div className="flex gap-1 flex-wrap justify-end w-32">
                              {p.aspectedHouses.map((h: number, j: number) => <span key={j} className="text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md">H{h}</span>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "MAITRI" && (
                    <div className="w-full max-h-[400px] md:max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin animate-in fade-in duration-300 pt-2">
                      <div className="grid grid-cols-1 gap-3 w-full">
                        {maitriData.map((p: any, i: number) => (
                          <div key={i} className="bg-secondary/20 border border-border/40 p-4 rounded-xl flex flex-col gap-2">
                            <span className="font-bold text-foreground uppercase">{p.name}</span>
                            <div className="flex gap-4">
                              <div className="flex-1 border-l-2 border-green-500 pl-2">
                                <span className="text-[10px] text-green-500 font-bold block">FRIENDS</span>
                                <span className="text-xs">{p.friends.join(", ") || "None"}</span>
                              </div>
                              <div className="flex-1 border-l-2 border-red-500 pl-2">
                                <span className="text-[10px] text-red-500 font-bold block">ENEMIES</span>
                                <span className="text-xs">{p.enemies.join(", ") || "None"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-[45%] flex flex-col justify-start min-h-[450px] p-2 animate-in fade-in duration-500 delay-150">

                  {["LAGNA", "MOON", "SUN"].includes(activeTab) && (
                    <div className="space-y-6 mt-4">
                      {/* Base Introduction */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground">
                          {activeTab === "LAGNA" && "Lagna Kundli (D1)"}
                          {activeTab === "MOON" && "Chandra Kundli"}
                          {activeTab === "SUN" && "Surya Kundli"}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-2">
                          {activeTab === "LAGNA" && "The Ascendant chart maps your physical reality and outward personality."}
                          {activeTab === "MOON" && "This chart reveals your inner mental landscape and emotional reactions."}
                          {activeTab === "SUN" && "This perspective explains your soul's true purpose and career trajectory."}
                        </p>
                      </div>

                      {/* Dynamic Personalized Insight */}
                      {(() => {
                        const insightData = getCoreInsights(activeTab as "LAGNA" | "SUN" | "MOON");
                        return (
                          <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50">
                            <span className={`text-[10px] uppercase font-extrabold tracking-widest ${insightData.color} block mb-2`}>
                              {insightData.theme}
                            </span>
                            <h4 className="font-bold text-foreground text-lg mb-2">{insightData.title}</h4>
                            <p className="text-foreground/80 text-sm leading-relaxed">
                              {insightData.insight}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {activeTab === "MANGALIK" && (
                    <div className="max-h-[400px] md:max-h-[70vh] flex flex-col h-full w-full">
                      <div className="space-y-4 mt-4">
                        <h3 className="text-xl md:text-2xl font-bold text-primary">Mangalik Dosh Analysis</h3>

                        {(() => {
                          const insight = getMangalikInsight(mars?.house);
                          return (
                            <div className="space-y-6">
                              <p className="text-muted-foreground leading-relaxed text-base">
                                {insight.desc}
                              </p>

                              {isMangalik && (
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                    <span className="text-xs uppercase font-extrabold text-red-500 tracking-widest block mb-1">Intensity Level</span>
                                    <span className="text-lg font-bold text-foreground">{insight.level}</span>
                                  </div>

                                  <div className="bg-secondary/20 border border-border/40 p-4 rounded-xl">
                                    <span className="text-xs uppercase font-extrabold text-primary tracking-widest block mb-2">Practical Remedies</span>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{insight.remedy}</p>
                                  </div>
                                </div>
                              )}

                              <div className="bg-card border border-border/40 p-4 rounded-xl mt-4">
                                <span className="text-xs uppercase text-muted-foreground font-bold block mb-1">Astrological Rule</span>
                                <span className="text-sm text-foreground/80">Triggered only if Mars occupies House 1, 4, 7, 8, or 12.</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {activeTab === "POWER" && (
                    <div className="max-h-[400px] md:max-h-[70vh] flex flex-col h-full w-full">
                      <div className="space-y-4 mt-4">
                        <h3 className="text-xl md:text-2xl font-bold text-primary">Core Matrix Strength</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          Your chart's true capacity to handle fame, wealth, and spiritual growth is determined by the planets sitting in the Power Houses.
                        </p>

                        {(() => {
                          const insight = getPowerInsight(kendraPlanets, trikonaPlanets);
                          return (
                            <div className="space-y-4 mt-6">
                              {/* Kendra Insight */}
                              <div className="border-2 dark:border border-border dark:border-border/20 rounded-xl p-4 bg-secondary/20">
                                <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                                  <h4 className="text-lg font-bold text-foreground">Kendra (Pillars of Action)</h4>
                                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-widest ${insight.kendra.status === "Weak" ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>
                                    {insight.kendra.status}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                  {insight.kendra.desc}
                                </p>
                              </div>

                              {/* Trikona Insight */}
                              <div className="border-2 dark:border border-border dark:border-border/20 rounded-xl p-4 bg-secondary/20">
                                <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                                  <h4 className="text-lg font-bold text-foreground">Trikona (Houses of Fortune)</h4>
                                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-widest ${insight.trikona.status === "Weak" ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"}`}>
                                    {insight.trikona.status}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                  {insight.trikona.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {activeTab === "DRISHTI" && (
                    <div className="max-h-[400px] md:max-h-[70vh] flex flex-col h-full w-full">
                      <div className="space-y-2 my-6">
                        <h3 className="text-xl md:text-2xl font-bold text-primary">Grah Drishti Insights</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          In Vedic Astrology, planets cast a powerful energetic "gaze" (Drishti) onto other houses. Here is how each planet is actively influencing your chart:
                        </p>
                      </div>

                      {/* Scrollable list of insights for each planet */}
                      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border space-y-6 max-h-[450px]">
                        {drishtiData.map((p: any, i: number) => (
                          <div key={i} className="flex flex-col border-2 dark:border border-border dark:border-border/20 rounded-xl p-4 bg-secondary/20">
                            <h4 className="text-lg font-bold text-foreground capitalize border-b border-border/40 pb-1 mb-1">
                              {p.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                              Looking at Houses: <span className="text-foreground">{p.aspectedHouses.join(", ")}</span>
                            </p>
                            {renderDrishtiInsight(p.name, p.aspectedHouses, p.aspectedPlanets)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "MAITRI" && (
                    <div className="max-h-[400px] md:max-h-[70vh] flex flex-col h-full w-full">
                      <div className="space-y-2 my-6">
                        <h3 className="text-xl md:text-2xl font-bold text-primary">Tatkalik Maitri Insights</h3>
                      </div>

                      {/* Scrollable list of insights for each planet */}
                      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border space-y-4 max-h-[450px]">
                        {maitriData.map((p: any, i: number) => (
                          <div key={i} className="flex flex-col border-2 dark:border border-border dark:border-border/20 rounded-xl p-4 bg-secondary/20">
                            <h4 className="text-lg font-bold text-foreground capitalize pb-1 mb-2">
                              {p.name}
                            </h4>
                            {renderMaitriInsight(p.name, p.friends, p.enemies)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <RightSidebar userData={userData} isOpen={isRightOpen} />
    </div>
  );
}