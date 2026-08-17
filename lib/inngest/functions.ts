import { inngest } from "./client";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { generateKundliReportPrompt } from "../ai/prompts";
import axios from "axios";
import User from "@/models/user.model";
import mongoose from "mongoose";
import dbConnect from "../dbConnect";

// Initialize OpenAI and Pinecone
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
// const index = pinecone.index({name: process.env.PINECONE_INDEX_NAME!});

export const generateAndIndexKundli = inngest.createFunction(
  {
    id: "generate-user-matrix",
    name: "Generate & Index Kundli",
    triggers: [{ event: "app/user.onboarded" }],
  },
  async ({ event, step }) => {
    const { userId, birthDetails, gender, relationshipStatus } = event.data;

    console.log(`\n==================================================`);
    console.log(`🚀 [START] KUNDLI MATRIX PIPELINE FOR USER: ${userId}`);
    console.log(`==================================================\n`);
    console.log(
      `📋 User Meta: Gender: ${gender} | Status: ${relationshipStatus}`,
    );

    // 🌟 STEP 1: Fetch Raw Astrology Data
    const astroData = await step.run("fetch-astro-data", async () => {
      console.log(
        `\n🟡 [Step 1] Parsing birth details and calling AstrologyAPI...`,
      );

      // 1. Parse Date and Time
      const dob = new Date(birthDetails.dob);
      const day = dob.getDate();
      const month = dob.getMonth() + 1; // JS months are 0-11
      const year = dob.getFullYear();

      const [hour, min] = birthDetails.tob.split(":").map(Number);

      // 2. Prepare payload for AstrologyAPI.com
      const apiPayload = {
        day,
        month,
        year,
        hour,
        min,
        lat: birthDetails.latitude,
        lon: birthDetails.longitude,
        tzone: 5.5, // IST Timezone
      };

      console.log("api payload: ", apiPayload);

      const ASTRO_API_KEY = process.env.ASTRO_API_KEY!;

      // 🔥 Exact Axios Config from Official Docs
      const config = {
        method: "post",
        url: "https://json.astrologyapi.com/v1/planets/extended",
        headers: {
          "x-astrologyapi-key": ASTRO_API_KEY,
          "Content-Type": "application/json",
        },
        data: apiPayload,
      };

      const response = await axios(config);
      const planetData = response.data;

      return planetData;

      // console.log(planetData);

      // // 4. Extract required planets
      // const sun = planetData.find((p: any) => p.name === "SUN");
      // const moon = planetData.find((p: any) => p.name === "MOON");
      // const mars = planetData.find((p: any) => p.name === "MARS");
      // const mercury = planetData.find((p: any) => p.name === "MERCURY");
      // const jupiter = planetData.find((p: any) => p.name === "JUPITER");
      // const venus = planetData.find((p: any) => p.name === "VENUS");
      // const saturn = planetData.find((p: any) => p.name === "SATURN");
      // const rahu = planetData.find((p: any) => p.name === "RAHU");
      // const ketu = planetData.find((p: any) => p.name === "KETU");
      // const uranus = planetData.find((p: any) => p.name === "URANUS");
      // const neptune = planetData.find((p: any) => p.name === "NEPTUNE");
      // const pluto = planetData.find((p: any) => p.name === "PLUTO");
      // const ascendant = planetData.find((p: any) => p.name === "Ascendant");

      // const extractedData = {
      //   sunSign: sun?.sign || "Unknown",
      //   moonSign: moon?.sign || "Unknown",
      //   ascendant: ascendant?.sign || "Unknown",
      //   marsPosition: `${mars?.house || "Unknown"} House`,
      //   currentDasha: "Rahu",
      // };

      // console.log(
      //   `✅ [Step 1] Real Data Fetched successfully: ${JSON.stringify(extractedData)}`,
      // );
      // return extractedData;
    });

    // 💾 STEP 1.5: Save Full Kundli Data to MongoDB
    await step.run("save-kundli-to-db", async () => {
      console.log(
        `\n🟡 [Step 1.5] Saving full 12-house chart to MongoDB for user ${userId}...`,
      );

      // Mongoose se connect karna zaroori hai agar connection cached na ho
      await dbConnect();

      // Yahan userId ki jagah event.data.userId aayega
      const updatedUser = await User.findByIdAndUpdate(
        userId, // Ya _id agar aap seedha mongo ID use kar rahe ho
        { kundliChartData: astroData },
        { new: true },
      );

      if (!updatedUser) {
        console.error(
          `❌ [Step 1.5] User with clerkId ${userId} not found in MongoDB.`,
        );
        throw new Error(`User with clerkId ${userId} not found.`);
      }

      console.log(`✅ [Step 1.5] Kundli data permanently saved to MongoDB!`);
      return true;
    });

    // 🤖 STEP 2: Generate Report & 3 Free Queries (JSON FORMAT) via OPENAI
    const { aiReport, freeQueries } = await step.run(
      "generate-openai-report",
      async () => {
        console.log(
          `\n🟡 [Step 2] Harnessing OpenAI (gpt-4o-mini) to write the extensive Kundli document...`,
        );

        const prompts = generateKundliReportPrompt(
          gender,
          relationshipStatus,
          astroData,
        );

        // We instruct OpenAI to strictly return JSON containing both the report and the queries
        // 🔥 THE UPGRADE: Added instructions for detailed answers and astrological reasoning
        // 🔥 THE UPGRADE: Strict JSON Array forcing EXACTLY 3 items & Markdown answers
        const jsonSystemPrompt = `${prompts.system}\n\nIMPORTANT: You must output ONLY a raw JSON object with EXACTLY two keys:
      1. "report": A long Markdown string containing the detailed deep Kundli reading.
      2. "freeQueries": A JSON array containing EXACTLY 3 objects (You MUST provide 3, not 1). Each object must have an "id" (e.g., "q1", "q2", "q3"), a "question", and an "answer".
      
      RULES FOR "freeQueries" ANSWERS:
      - EXACTLY 3 QUERIES: Generate 3 entirely different questions covering different life aspects (e.g., Career, Marriage, Wealth).
      - MARKDOWN FORMATTING: The "answer" MUST be beautifully formatted in Markdown. Use **bold text** for emphasis, proper paragraph breaks (\\n\\n), and bullet points (-) for readability.
      - LENGTH & DEPTH: The "answer" MUST be detailed and comprehensive (at least 2-3 paragraphs long). 
      - ASTROLOGICAL REASONING: You MUST explicitly explain the astrological reasoning behind the answer based on their specific chart (e.g., "Because your Sun is in the 10th house aspected by Mars...").
      - SIMPLICITY: Write in simple, practical English.
      - REMEDY: At the end of every answer, provide a simple, actionable remedy using a Markdown bulleted list.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" }, // Ensures output is strictly JSON
          messages: [
            { role: "system", content: jsonSystemPrompt },
            { role: "user", content: prompts.user },
          ],
          temperature: 0.4,
        });

        const rawResponse = completion.choices[0].message.content || "{}";
        const parsedData = JSON.parse(rawResponse);

        console.log(
          `✅ [Step 2] Generated AI Report length: ${parsedData.report?.length} chars.`,
        );
        console.log(
          `✅ [Step 2] Generated ${parsedData.freeQueries?.length} personalized queries.`,
        );
        return {
          aiReport: parsedData.report || "",
          freeQueries: parsedData.freeQueries || [],
        };
      },
    );

    // 💾 STEP 2.5: Save AI Report to MongoDB
    await step.run("save-report-to-db", async () => {
      console.log(
        `\n🟡 [Step 2.5] Saving detailed AI report to MongoDB for user ${userId}...`,
      );

      await dbConnect();

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { aiReport: aiReport, freeQueries: freeQueries },
        { new: true },
      );

      if (!updatedUser) {
        throw new Error(
          `User with ID ${userId} not found while saving report.`,
        );
      }

      console.log(`✅ [Step 2.5] AI Report permanently saved to MongoDB!`);
      return true;
    });

    // 🔪 STEP 3: Chunking the Report
    const chunks = await step.run("chunk-report", async () => {
      const splittedChunks = aiReport
        .split("\n\n")
        .map((chunk: string) => chunk.trim())
        .filter((chunk: string) => chunk.length > 50);

      console.log(
        `✅ [Step 3] AI Report split into ${splittedChunks.length} chunks.`,
      );

      return splittedChunks;
    });

    // 🔢 STEP 4: Embeddings & Pinecone Upsert
    await step.run("embed-and-index", async () => {
      console.log(
        `\n🟡 [Step 4] Generating OpenAI Embeddings for ${chunks.length} chunks...`,
      );

      if (!chunks || chunks.length === 0) {
        console.warn(
          "⚠️ [Step 4] No valid chunks found. Skipping Pinecone upsert.",
        );
        return false;
      }

      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks,
      });

      console.log(
        `✅ [Step 4a] Embeddings created. Preparing Pinecone vectors...`,
      );

      const vectors = embeddingResponse.data.map((record, i) => ({
        id: `${userId}-chunk-${i}`,
        values: record.embedding,
        metadata: {
          userId: String(userId),
          text: chunks[i],
          topic: "Kundli Matrix",
        },
      }));

      // 🚨 SAFETY CHECK 2: Upsert tabhi karo jab vectors available hon
      if (vectors.length > 0) {
        const pinecone = new Pinecone({
          apiKey: process.env.PINECONE_API_KEY!,
        });
        const index = pinecone.index({
          name: process.env.PINECONE_INDEX_NAME as string,
        });

        const pureVectors = JSON.parse(JSON.stringify(vectors));

        await index.upsert({ records: pureVectors });
        console.log(`✅ [Step 4c] Vectors successfully saved to Pinecone!`);
      } else {
        console.error("❌ ERROR: Vector array is empty. Nothing to upsert.");
      }

      return true;
    });

    // 🏁 STEP 5: Mark Kundli as "READY" in MongoDB
    await step.run("mark-kundli-ready", async () => {
      console.log(
        `\n🟡 [Step 5] Marking Kundli as READY for user ${userId}...`,
      );

      await dbConnect();

      const finalUser = await User.findByIdAndUpdate(
        userId,
        { isKundliGenerated: true },
        { new: true },
      );

      if (!finalUser) {
        throw new Error(
          `User with ID ${userId} not found for final status update.`,
        );
      }

      console.log(`✅ [Step 5] Kundli Matrix is now LIVE!`);
      return true;
    });

    console.log(
      `\n🎉 [SUCCESS] Pipeline completed entirely for user ${userId}!\n`,
    );

    return {
      success: true,
      message: `Matrix generated and indexed for ${userId}`,
    };
  },
);
