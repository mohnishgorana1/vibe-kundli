"use client";

import KundliChart from "@/components/KundliChart";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AstroChartsView({ userData }: { userData: any }) {
  const [activeTab, setActiveTab] = useState<"LAGNA" | "MOON" | "SUN" | "MANGALIK" | "POWER" | "DRISHTI" | "MAITRI">("LAGNA");
  
  const chartData = userData.kundliChartData || [];
  
  // --- 1. CORE PLANETS ---
  const mars = chartData.find((p: any) => p.name.toLowerCase() === 'mars');
  const sun = chartData.find((p: any) => p.name.toLowerCase() === 'sun');
  const moon = chartData.find((p: any) => p.name.toLowerCase() === 'moon');
  const firstHousePlanets = chartData.filter((p: any) => p.house === 1);

  const isMangalik = mars ? [1, 4, 7, 8, 12].includes(mars.house) : false;
  const kendraPlanets = chartData.filter((p: any) => [1, 4, 7, 10].includes(p.house));
  const trikonaPlanets = chartData.filter((p: any) => [1, 5, 9].includes(p.house));

  // --- 2. ROTATE CHART FUNCTION ---
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

  // --- 3. INSIGHT FUNCTIONS ---
  const getCoreInsights = (type: "LAGNA" | "SUN" | "MOON") => {
    if (type === "LAGNA") {
      if (firstHousePlanets.length === 0) {
        return {
          title: "The Empty First House", theme: "Self & Physical Body",
          insight: "Your 1st house is empty, which means your physical vitality and core personality are highly adaptable. You take on the traits of your Ascendant lord and easily mold yourself to your environment.", color: "text-primary"
        };
      } else {
        const pNames = firstHousePlanets.map((p: any) => p.name).join(", ");
        return {
          title: `Planets in Ascendant: ${pNames}`, theme: "Self & Outward Expression",
          insight: `Having ${pNames} in your 1st house directly colors your physical appearance and how the world sees you. You project the energy of these planets directly into your environment, making your personality distinct and powerful.`, color: "text-primary"
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
      return { level: "None", desc: "You are not a Mangalik. Mars is positioned in a neutral house regarding marriage and domestic peace.", remedy: "No specific Mars remedies are required for marriage purposes." };
    }
    let level = "Medium", desc = "";
    switch (marsHouse) {
      case 1: level = "High"; desc = "Mars in the 1st house affects your personality directly. You may be highly independent, short-tempered, or dominant."; break;
      case 4: level = "Medium"; desc = "Mars in the 4th house affects domestic peace and family happiness. You might experience frequent arguments at home."; break;
      case 7: level = "High"; desc = "Mars in the 7th house is considered strong Mangal Dosh. It directly aspects the house of marriage, potentially causing power struggles."; break;
      case 8: level = "High"; desc = "Mars in the 8th house affects longevity, hidden matters, and marital intimacy. This is a sensitive placement."; break;
      case 12: level = "Low to Medium"; desc = "Mars in the 12th house affects subconscious mind, expenses, and bedroom harmony."; break;
    }
    return { level, desc, remedy: "Common remedies include chanting the Hanuman Chalisa, offering sweets on Tuesdays, avoiding impulsive arguments, and traditionally, marrying another Mangalik to cancel the harsh energy." };
  };

  const getPowerInsight = (kPlanets: any[], tPlanets: any[]) => {
    const kendraStrength = kPlanets.length > 2 ? "Very Strong" : kPlanets.length > 0 ? "Moderate" : "Weak";
    const trikonaStrength = tPlanets.length > 2 ? "Very Strong" : tPlanets.length > 0 ? "Moderate" : "Weak";
    return {
      kendra: { status: kendraStrength, desc: kendraStrength === "Weak" ? "You have few planets in the Kendra (1, 4, 7, 10) houses." : `With ${kPlanets.length} planets in Kendra, the structural pillars of your life are highly active.` },
      trikona: { status: trikonaStrength, desc: trikonaStrength === "Weak" ? "You have few planets in Trikona (1, 5, 9)." : `With ${tPlanets.length} planets in Trikona, you have strong spiritual backing and natural luck.` }
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
        let target = p.house + d - 1; return target > 12 ? target - 12 : target;
      });
      const aspectedPlanets = chartData.filter((targetP: any) => targetP.name !== p.name && aspectedHouses.includes(targetP.house)).map((targetP: any) => targetP.name);
      return { ...p, aspectedHouses, aspectedPlanets };
    });
  };

  const getMaitriData = () => {
    return chartData.map((baseP: any) => {
      const friendlyHouses = [2, 3, 4, 10, 11, 12].map(d => { let target = baseP.house + d - 1; return target > 12 ? target - 12 : target; });
      const friends = chartData.filter((p: any) => p.name !== baseP.name && friendlyHouses.includes(p.house)).map((p: any) => p.name);
      const enemies = chartData.filter((p: any) => p.name !== baseP.name && !friendlyHouses.includes(p.house)).map((p: any) => p.name);
      return { name: baseP.name, house: baseP.house, friends, enemies };
    });
  };

  // ==========================================
  // 🔥 ADVANCED DRISHTI LOGIC (HOUSE + PLANET BLEND)
  // ==========================================
  const houseThemes: Record<number, string> = {
    1: "Self, Physical Body & Personality", 2: "Wealth, Speech & Family", 3: "Courage, Siblings & Efforts",
    4: "Mother, Home & Inner Peace", 5: "Children, Intellect & Romance", 6: "Enemies, Debts & Health",
    7: "Marriage & Business Partnerships", 8: "Transformation, Secrets & Longevity", 9: "Luck, Dharma & Higher Knowledge",
    10: "Career, Status & Public Life", 11: "Gains, Desires & Social Network", 12: "Spirituality, Expenses & Foreign Lands"
  };

  const getHouseDomain = (h: number) => {
    const domains: any = {
      1: "your core personality, physical body, and overall life path",
      2: "your wealth accumulation, speech, and immediate family dynamics",
      3: "your personal courage, younger siblings, and daily efforts",
      4: "your inner peace, relationship with your mother, and domestic environment",
      5: "your intellect, creative pursuits, children, and romantic affairs",
      6: "your daily routines, debts, health matters, and ability to overcome enemies",
      7: "your marriage, business partnerships, and public dealings",
      8: "sudden transformations, hidden secrets, and your deep psychological fears",
      9: "your luck, higher beliefs, dharma, and long journeys",
      10: "your career, public reputation, and worldly authority",
      11: "your social networks, large gains, and fulfillment of deep desires",
      12: "your spirituality, isolation, expenses, and potential for foreign travel"
    };
    return domains[h];
  };

  const getPlanetTrait = (p: string) => {
    const traits: any = {
      sun: "themes of ego, pure authority, and illumination",
      moon: "themes of deep emotions, care, and mental fluctuation",
      mars: "themes of aggressive action, ambition, and fierce courage",
      mercury: "themes of logic, sharp communication, and business intellect",
      jupiter: "themes of wisdom, immense expansion, and divine blessings",
      venus: "themes of luxury, romantic harmony, and material comfort",
      saturn: "themes of delay, strict discipline, and karmic lessons",
      rahu: "themes of intense obsession, worldly illusion, and sudden unconventional gains",
      ketu: "themes of spiritual detachment, deep intuition, and sudden release"
    };
    return traits[p.toLowerCase()];
  };

  const renderMaitriInsight = (planet: string, friends: string[], enemies: string[]) => {
    const p = planet.toLowerCase();
    const isFavorable = friends.length >= enemies.length; 
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
          {isFavorable ? (<span>Since your {planet} has more friends than enemies, you can expect <strong>{data.pos}</strong> Your temporary friends ({friends.join(", ") || "none"}) will act as catalysts for this success.</span>) : (<span>Your {planet} is surrounded by more enemies than friends. Watch out for <strong>{data.neg}</strong> Planets like ({enemies.join(", ") || "none"}) may create friction in this area of your life.</span>)}
        </p>
      </div>
    );
  };

  const drishtiData = getDrishtiData();
  const maitriData = getMaitriData();

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500 pb-10 ">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Astro Charts & Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">Deep dive into your planetary alignments and cosmic forces.</p>
      </div>

      <div className="lg:bg-card/50 lg:border lg:border-border lg:rounded-2xl shadow-sm pt-6 flex flex-col items-center min-h-[550px]">
        {/* Tabs Row */}
        <div className="flex px-4 py-4 md:py-4 shadow-sm shadow-secondary/50 mb-8 bg-background rounded-2xl flex-wrap justify-center gap-2 w-full md:max-w-5xl">
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

        {/* 🔥 CONDITIONAL LAYOUT: FULL WIDTH FOR DRISHTI, SPLIT FOR OTHERS */}
        {activeTab === "DRISHTI" ? (
          <div className="max-w-5xl w-full flex flex-col pt-2 pb-8 animate-in fade-in duration-500">
            <div className="mb-8 max-w-3xl ">
              <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">Grah Drishti (Planetary Aspects)</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Planets don&apos;t just affect where they sit; they cast a powerful energetic &quot;gaze&quot; onto other houses. 
                Expand below to see exactly how each planet is influencing the specific areas of your life.
              </p>
            </div>
            
            {/* 🔥 NEW DRISHTI ACCORDION LAYOUT 🔥 */}
            <Accordion type="single" className="w-full mx-auto space-y-4 ">
              {drishtiData.map((p: any, i: number) => (
                <AccordionItem 
                  key={i} 
                  value={`drishti-${i}`} 
                  className="border-2 dark:border border-border bg-background rounded-2xl px-2 shadow-sm overflow-hidden transition-all data-open:ring-2 ring-primary/20"
                >
                  <AccordionTrigger className="hover:no-underline px-4 group">
                    <div className="flex items-center justify-between w-full pr-4 h-4">
                      <div className="flex items-center gap-4">
                        <span className="text-base md:text-lg font-extrabold text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-xs font-bold bg-secondary/50 text-muted-foreground px-3 py-1 md:py-1.5 rounded-full border border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all w-30 md:w-40 text-center">
                        Gazing at {p.aspectedHouses.length} House{p.aspectedHouses.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-4 pb-6 pt-2">
                    <div className="space-y-4">
                      {p.aspectedHouses.map((h: number, idx: number) => (
                        <div key={idx} className="bg-secondary/20  p-5 rounded-xl border border-border">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                            <span className="inline-block bg-background border border-border shadow-sm text-foreground text-xs font-bold px-3 py-1 rounded-md w-fit">
                              House {h}
                            </span>
                            <span className="text-base font-extrabold text-foreground">
                              {houseThemes[h]}
                            </span>
                          </div>
                          
                          {/* 🔥 BLENDED ASTROLOGICAL LOGIC (PLANET + HOUSE DOMAIN) 🔥 */}
                          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                            Since the <strong>{p.name}</strong> gazes at your {h}th House, it actively brings its natural <strong>{getPlanetTrait(p.name)}</strong> directly into matters of <strong>{getHouseDomain(h)}</strong>. 
                          </p>
                        </div>
                      ))}
                      
                      {p.aspectedPlanets.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/40">
                          <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest block mb-2">Direct Aspect On Planets</span>
                          <div className="flex flex-wrap gap-2">
                            {p.aspectedPlanets.map((tp: string, idx: number) => (
                              <span key={idx} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-md text-xs font-bold uppercase">
                                {tp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-8 items-start justify-center border-t border-border/40 pt-6  pb-8">
            
            {/* Left Column (Chart/Visuals) */}
            <div className="w-full lg:w-[45%] min-h-[350px]">
              
              {/* Added Left Column visual for MAITRI */}
              {activeTab === "MAITRI" && (
                <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-300 pt-8 pb-4">
                  <span className="text-7xl mb-6 opacity-80">⚖️</span>
                  <h3 className="text-2xl font-extrabold text-foreground text-center">Cosmic Alliances</h3>
                  <p className="text-muted-foreground text-center mt-3 px-4 text-sm leading-relaxed">
                    Planets form temporary friendships (Mitra) and enmities (Shatru) based on their exact distance in your birth chart. This determines whether a planet will support you or create friction.
                  </p>
                  <div className="mt-8 flex gap-4 w-full px-4 md:px-8">
                    <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center shadow-sm">
                      <span className="block text-green-500 font-extrabold text-2xl">Mitra</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Friends</span>
                    </div>
                    <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center shadow-sm">
                      <span className="block text-red-500 font-extrabold text-2xl">Shatru</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Enemies</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center justify-center">
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
                  <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 flex flex-col items-center text-center">
                    <span className="text-3xl mb-3">🏛️</span>
                    <h4 className="font-bold text-foreground uppercase tracking-widest text-sm mb-2">Kendra Sthaan</h4>
                    <p className="text-xs text-muted-foreground mb-4">Pillars (1, 4, 7, 10)</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {kendraPlanets.length > 0 ? kendraPlanets.map((p: any, i: number) => (<span key={i} className="text-sm font-semibold bg-primary/20 text-primary px-3 py-1 rounded-md">{p.name}</span>)) : <span className="text-sm text-muted-foreground">Empty</span>}
                    </div>
                  </div>
                  <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 flex flex-col items-center text-center">
                    <span className="text-3xl mb-3">✨</span>
                    <h4 className="font-bold text-foreground uppercase tracking-widest text-sm mb-2">Trikona Sthaan</h4>
                    <p className="text-xs text-muted-foreground mb-4">Luck (1, 5, 9)</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {trikonaPlanets.length > 0 ? trikonaPlanets.map((p: any, i: number) => (<span key={i} className="text-sm font-semibold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-md">{p.name}</span>)) : <span className="text-sm text-muted-foreground">Empty</span>}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (Text/Reasoning) */}
            <div className="w-full lg:w-[55%] flex flex-col justify-start min-h-[350px] lg:min-h-[450px] animate-in fade-in duration-500 delay-150">
              {["LAGNA", "MOON", "SUN"].includes(activeTab) && (
                <div className="space-y-6 mt-4">
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
                  {(() => {
                    const insightData = getCoreInsights(activeTab as "LAGNA" | "SUN" | "MOON");
                    return (
                      <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50">
                        <span className={`text-[10px] uppercase font-extrabold tracking-widest ${insightData.color} block mb-2`}>
                          {insightData.theme}
                        </span>
                        <h4 className="font-bold text-foreground text-lg mb-2">{insightData.title}</h4>
                        <p className="text-foreground/80 text-sm leading-relaxed">{insightData.insight}</p>
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
                          <p className="text-muted-foreground leading-relaxed text-base">{insight.desc}</p>
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
                          <div className="border-2 dark:border border-secondary rounded-xl p-4 bg-secondary/20 hover:bg-secondary transition-colors duration-300 cursor-pointer shadow-sm shadow-secondary">
                            <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                              <h4 className="text-lg font-bold text-foreground">Kendra (Pillars of Action)</h4>
                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-widest ${insight.kendra.status === "Weak" ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>
                                {insight.kendra.status}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">{insight.kendra.desc}</p>
                          </div>
                          <div className="border-2 dark:border border-secondary rounded-xl p-4 bg-secondary/20 hover:bg-secondary transition-colors duration-300 cursor-pointer shadow-sm shadow-secondary">
                            <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                              <h4 className="text-lg font-bold text-foreground">Trikona (Houses of Fortune)</h4>
                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-widest ${insight.trikona.status === "Weak" ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"}`}>
                                {insight.trikona.status}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">{insight.trikona.desc}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {activeTab === "MAITRI" && (
                <div className="max-h-[400px] md:max-h-[70vh] flex flex-col h-full w-full">
                  <div className="space-y-2 my-6 lg:hidden"> {/* Mobile Only Header */}
                    <h3 className="text-xl md:text-2xl font-bold text-primary">Tatkalik Maitri Insights</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border space-y-4 max-h-[450px]">
                    {maitriData.map((p: any, i: number) => (
                      <div key={i} className="flex flex-col border-2 dark:border border-border dark:border-border/20 rounded-xl p-4 bg-secondary/20 hover:bg-secondary transition-colors duration-300 cursor-pointer shadow-sm shadow-secondary">
                        <h4 className="text-lg font-bold text-foreground capitalize pb-1 mb-2">{p.name}</h4>
                        {renderMaitriInsight(p.name, p.friends, p.enemies)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}