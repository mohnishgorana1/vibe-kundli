import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getMongoUserId } from "@/lib/helpers/auth";
import Message from "@/models/message.model";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function POST(req: Request) {
  try {
    const userId = await getMongoUserId();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    await dbConnect();
    const userData = await User.findById(userId);
    if (!userData) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (userData.tokenBalance <= 0) {
      return new NextResponse("Insufficient Tokens", { status: 403 });
    }

    await User.findByIdAndUpdate(userData._id, {
      $inc: { tokenBalance: -1, totalTokensUsed: 1 },
    });

    // ==========================================
    // 🔥 1. QUERY REWRITING (Advanced RAG)
    // ==========================================
    let optimizedQuery = lastUserMessage;
    try {
      const rewriteResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a query optimizer for a Vedic Astrology Vector Database. Convert the user's question into 5-8 highly relevant astrological keywords (houses, planets, themes) for semantic search. Return ONLY the comma-separated keywords.",
          },
          { role: "user", content: lastUserMessage },
        ],
        temperature: 0.1,
        max_tokens: 30,
      });
      optimizedQuery =
        rewriteResponse.choices[0].message.content || lastUserMessage;
    } catch (err) {
      console.warn(
        "Query rewriting failed, falling back to original query.",
        err,
      );
    }

    // ==========================================
    // 🧠 2. SEMANTIC SEARCH (Pinecone)
    // ==========================================
    let ragContext = "NO_RELEVANT_CONTEXT_FOUND";
    try {
      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: optimizedQuery,
      });
      const queryEmbedding = embeddingRes.data[0].embedding;

      const index = pinecone.index(process.env.PINECONE_INDEX_NAME as string);
      const queryResponse = await index.query({
        vector: queryEmbedding,
        topK: 2,
        filter: { userId: String(userId) },
        includeMetadata: true,
      });

      if (queryResponse.matches.length > 0) {
        ragContext = queryResponse.matches
          .map((m) => m.metadata?.text)
          .join("\n\n");
      }
    } catch (pineconeErr) {
      console.error("Pinecone search failed:", pineconeErr);
    }

    // ==========================================
    // 🧬 3. COMPRESSED MATRIX, MEMORY & TIME
    // ==========================================
    const chart = userData.kundliChartData || [];
    const getHouse = (planetName: string) =>
      chart.find((p: any) => p.name.toLowerCase() === planetName)?.house || "?";

    const compressedMatrix = `[Gender:${userData.gender || "U"}|Status:${userData.relationshipStatus || "Unknown"}|Sun:${getHouse("sun")},Moon:${getHouse("moon")},Mars:${getHouse("mars")},Mercury:${getHouse("mercury")},Jupiter:${getHouse("jupiter")},Venus:${getHouse("venus")},Saturn:${getHouse("saturn")},Rahu:${getHouse("rahu")},Ketu:${getHouse("ketu")}]`;

    const pastFacts =
      userData.lifeEvents && userData.lifeEvents.length > 0
        ? userData.lifeEvents.map((e: any) => `- ${e.fact}`).join("\n")
        : "No past events.";

    const currentDateTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    // ==========================================
    // 🌟 4. CRAG SYSTEM PROMPT
    // ==========================================
    const systemPrompt = `You are Astro-G, an elite and brutally honest Vedic Astrologer. You calculate predictions relative to today's current date.

--- REAL-TIME CLOCK ---
TODAY'S DATE & TIME (IST): ${currentDateTime}

--- USER DATA ---
ASTRO MATRIX: ${compressedMatrix}
PAST MEMORY: ${pastFacts}

--- RETRIEVED KUNDLI CONTEXT ---
<context>
${ragContext}
</context>

--- CRITICAL INSTRUCTIONS (MUST FOLLOW) ---
1. TIME AWARENESS: ALWAYS use "TODAY'S DATE" to calculate upcoming transits (Gochara). If the user asks about the future, calculate how far ahead they mean from ${currentDateTime}.
2. CORRECTIVE EVALUATION (CRAG): Read the <context>. If it directly answers the user's question, use it. If irrelevant, IGNORE IT and base your answer purely on the ASTRO MATRIX.
3. NO GENERIC TIMELINES: Never say "soon" or "next year" blindly. Calculate actual planetary movements from TODAY. Give a specific timeframe (e.g., "From mid-October 2026 to Jan 2027") and state the astrological reason.
4. TONE & REMEDY: Be mystical, authoritative, and concise. Provide a specific Vedic remedy based on the afflicted planet.
5. FORMATTING: Use Markdown. Keep it to 2-3 short, punchy paragraphs.`;
    // ==========================================
    // 🚀 5. RAW OPENAI STREAM and DB SAVE
    // ==========================================

    // save user msg
    await Message.create({
      userId: userData._id,
      role: "user",
      content: lastUserMessage,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.3,
      stream: true,
    });

    const encoder = new TextEncoder();
    let aiFullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            aiFullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();

        // 🔥 AI REPLY KO STREAM KHATAM HONE KE BAAD SAVE KARO (ANDAR HI)
        try {
          if (aiFullResponse.trim()) {
            // Make sure empty messages are not saved
            await Message.create({
              userId: userData._id,
              role: "assistant",
              content: aiFullResponse,
            });
          }
        } catch (dbErr) {
          console.error("Failed to save AI message:", dbErr);
        }
      },
    });

    // Bahar wala try-catch delete kar diya hai, ab sirf Response return karo
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });

    
  } catch (error) {
    console.error("[CHAT_API_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
