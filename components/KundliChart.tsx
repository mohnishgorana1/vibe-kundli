import React from 'react';

// House mapping with absolute positioning percentages for the Diamond Chart
const housePositions = {
  1: { top: '25%', left: '50%' },
  2: { top: '15%', left: '25%' },
  3: { top: '25%', left: '15%' },
  4: { top: '50%', left: '25%' },
  5: { top: '75%', left: '15%' },
  6: { top: '85%', left: '25%' },
  7: { top: '75%', left: '50%' },
  8: { top: '85%', left: '75%' },
  9: { top: '75%', left: '85%' },
  10: { top: '50%', left: '75%' },
  11: { top: '25%', left: '85%' },
  12: { top: '15%', left: '75%' },
};

// Map full names to short names to fit in the chart
const getShortName = (name: string) => {
  const shortNames: any = {
    SUN: 'Su', MOON: 'Mo', MARS: 'Ma', MERCURY: 'Me', 
    JUPITER: 'Ju', VENUS: 'Ve', SATURN: 'Sa', RAHU: 'Ra', KETU: 'Ke',
    Ascendant: 'Asc'
  };
  return shortNames[name] || name.substring(0, 2);
};

export default function KundliChart({ chartData, title }: { chartData: any[], title: string }) {
  // Group planets by house
  const planetsByHouse: Record<number, any[]> = {};
  chartData?.forEach(planet => {
    if (!planet.house) return;
    if (!planetsByHouse[planet.house]) planetsByHouse[planet.house] = [];
    planetsByHouse[planet.house].push(planet);
  });

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-xl font-bold text-primary mb-6">{title}</h3>
      
      <div className="relative w-[320px] min-h-[320px] md:w-[400px] md:h-[400px] bg-secondary/20 rounded-sm border-2 border-primary/40 overflow-hidden shadow-lg mb-6">
        
        {/* 🔷 The SVG Grid for North Indian Chart */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 stroke-primary/50 stroke-[0.4] fill-transparent">
          <rect x="0" y="0" width="100" height="100" />
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
          <line x1="50" y1="0" x2="100" y2="50" />
          <line x1="100" y1="50" x2="50" y2="100" />
          <line x1="50" y1="100" x2="0" y2="50" />
          <line x1="0" y1="50" x2="50" y2="0" />
        </svg>

        {/* 🪐 Rendering Planets in their respective houses */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
          const position = housePositions[houseNum as keyof typeof housePositions];
          const planetsInThisHouse = planetsByHouse[houseNum] || [];

          return (
            <div 
              key={houseNum} 
              className="absolute flex flex-wrap justify-center items-center gap-1 w-16 -ml-8 -mt-4 text-center z-10"
              style={{ top: position.top, left: position.left }}
            >
              {/* House Number (Faint) */}
              <div className="absolute -top-3 text-[10px] text-muted-foreground/60 font-mono">
                {houseNum}
              </div>
              
              {/* Planets Text */}
              {planetsInThisHouse.map((p, i) => (
                <span 
                  key={i} 
                  className={`text-xs md:text-sm font-bold ${p.name === 'Ascendant' ? 'text-green-500' : 'text-foreground'}`}
                  title={`${p.name} in ${p.sign}`}
                >
                  {getShortName(p.name)}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}