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

    // 🤖 STEP 2: Generate Detailed Report via OpenAI
    const detailedReport = await step.run(
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

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: prompts.system },
            { role: "user", content: prompts.user },
          ],
          temperature: 0.3, // Lower temperature to strictly stick to facts and reduce hallucination
        });

        const report = completion.choices[0].message.content || "";

        console.log(
          `✅ [Step 2] Report generated successfully. Total length: ${report.length} characters.`,
        );
        return report;
      },
    );

    // 💾 STEP 2.5: Save AI Report to MongoDB
    await step.run("save-report-to-db", async () => {
      console.log(
        `\n🟡 [Step 2.5] Saving detailed AI report to MongoDB for user ${userId}...`,
      );

      await dbConnect(); // Ensure DB connection

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { aiReport: detailedReport },
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
      console.log(
        `\n🟡 [Step 3] Splitting the generated report into semantic chunks...`,
      );

      const splitChunks = detailedReport
        .split("\n\n") // Split by paragraphs
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 50); // Remove very small or empty fragments

      console.log(
        `✅ [Step 3] Report split into ${splitChunks.length} chunks.`,
      );
      return splitChunks;
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
        { isKundliGenerated: true }, // 🔥 Flag ko true kar diya
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
