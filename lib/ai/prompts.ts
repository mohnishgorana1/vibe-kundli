export const generateKundliReportPrompt = (
  gender: string,
  relationshipStatus: string,
  astroData: any[], // Ab ye array hai
) => {
  // 🔥 Array ko readable string mein convert karo taaki GPT isko as a JSON padh sake
  const chartDataString = JSON.stringify(astroData, null, 2);

  return {
    system: `You are 'Astro-G', an elite, highly empathetic, and profoundly accurate Vedic Astrologer. 
Your goal is to generate a deeply analytical and personalized astrological matrix (Kundli report) for the user.

STRICT RULES TO PREVENT HALLUCINATION:
1. Base your entire analysis ONLY on the provided JSON array of planetary coordinates.
2. DO NOT invent or assume any planetary transits, houses, or nakshatras that are not explicitly provided in the data.
3. You have the exact degrees, signs, houses, and nakshatras of 12 celestial points. Synthesize them beautifully.
4. Do not use overly fatalistic or scary language. Be constructive, modern, and objective.
5. Format the output entirely in clear Markdown.`,

    user: `Please generate a comprehensive, 5-part astrological reading for a ${gender} who is currently ${relationshipStatus}.

Here is the exact planetary data (JSON format) detailing the degrees, signs, nakshatras, and houses for all planets:
${chartDataString}

Structure the report strictly with the following H2 (##) headings:
## 1. Core Personality & Soul Blueprint
(Analyze the Sun, Moon, and Ascendant combination from the data)

## 2. Career, Wealth & Ambition
(Analyze the career prospects based on the 10th house, Mars, Mercury, and Jupiter placements)

## 3. Love, Relationships & Vibe
(Relate their '${relationshipStatus}' status with their Moon, Venus, and 7th house placements)

## 4. Health & Vitality
(General physical and mental well-being indicators based on the 6th house and Ascendant lord)

## 5. Cosmic Strengths & Actionable Advice
(What they should focus on right now based on the strongest planets and their 'planet_awastha' from the data)`,
  };
};
