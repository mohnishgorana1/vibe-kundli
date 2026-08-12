import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript support (Ekdum strict typing)
export interface IUser extends Document {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;

  // 💰 Token & Monetization System
  tokenBalance: number;
  totalTokensUsed: number;   // Analytics ke liye ki user kitna active hai
  planType: "free" | "pro";  // Future mein subscription lane ke liye

  // 🔮 Core Astrology Data
  birthDetails?: {
    dob?: Date;              // String ki jagah Date object better query ke liye
    tob?: string;            // Time of Birth (HH:MM format)
    pob?: string;            // Place of Birth (City, State)
    latitude?: number;       // Exact API calculations ke liye
    longitude?: number;      
  };

  // 🌟 Cached Astro Data (Taki baar-baar external API ko paise na dene padein)
  zodiacSigns?: {
    sunSign?: string;        // Surya Rashi
    moonSign?: string;       // Chandra Rashi (Vedic astrology ka base)
    ascendant?: string;      // Lagna (Rising sign)
  };

  // 🎭 Personalization & GenZ Vibe
  gender?: "male" | "female" | "non-binary" | "other";
  relationshipStatus?: "single" | "taken" | "complicated" | "healing"; // Roast karne mein kaam aayega
  languagePref: "english" | "hinglish" | "hindi"; // User kis bhasha mein chat chahta hai

  // 🛠️ App State & Meta
  role: "user" | "admin";
  isProfileComplete: boolean; // Check karne ke liye ki user ne onboarding form bhara hai ya nahi
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true }, // sparse allows null but keeps unique
    firstName: { type: String },
    lastName: { type: String },
    avatarUrl: { type: String },

    // 💰 Monetization
    tokenBalance: { type: Number, default: 200 }, // Initial free tokens
    totalTokensUsed: { type: Number, default: 0 },
    planType: { type: String, enum: ["free", "pro"], default: "free" },

    // 🔮 Astrology Details
    birthDetails: {
      dob: { type: Date },
      tob: { type: String },
      pob: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    
    // 🌟 Cached Zodiac
    zodiacSigns: {
      sunSign: { type: String },
      moonSign: { type: String },
      ascendant: { type: String },
    },

    // 🎭 Personalization
    gender: { type: String, enum: ["male", "female", "non-binary", "other"] },
    relationshipStatus: { type: String, enum: ["single", "taken", "complicated", "healing"] },
    languagePref: { type: String, enum: ["english", "hinglish", "hindi"], default: "hinglish" },

    // 🛠️ Meta
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isProfileComplete: { type: Boolean, default: false }, // Login ke baad direct form pe bhejna agar false ho
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recompiling the model in Next.js Serverless environment
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;