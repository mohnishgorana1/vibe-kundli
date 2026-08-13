"use server";

import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { inngest } from "@/lib/inngest/client";

// ==========================================
// 🚀 CREATE USER (Triggered by Clerk Webhook)
// ==========================================
export const createUser = async (user: {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}) => {
  try {
    await dbConnect();
    console.log("🟡 Action :: createUser started for:", user.email);

    // 1. Validate Input (Pehle check karo data aaya bhi hai ya nahi)
    if (!user.clerkId || !user.email) {
      console.error("❌ Action :: Missing required fields (clerkId or email)");
      throw new Error("clerkId and email are required to create a user.");
    }

    // 1. Check if user already exists (Webhook retries/duplicates bachane ke liye)
    const existingUser = await User.findOne({ clerkId: user.clerkId });
    if (existingUser) {
      console.log("⚠️ Action :: User already exists in DB:", existingUser._id);
      return { success: true, data: JSON.parse(JSON.stringify(existingUser)) };
    }

    // 2. Create User in DB (Token balance aur default values model se auto-set ho jayengi)
    const newUser = await User.create(user);
    console.log("✅ Action :: NEW VibeKundli User created:", newUser._id);

    return { success: true, data: JSON.parse(JSON.stringify(newUser)) };
  } catch (error: any) {
    console.error("❌ Action :: ERROR in createUser:", error.message);
    return { success: false, error: error.message };
  }
};

// ==========================================
// 🗑️ DELETE USER (Triggered by Clerk Webhook)
// ==========================================
export const deleteUser = async (clerkId: string) => {
  try {
    await dbConnect();
    console.log(`🟡 Action :: deleteUser started for ClerkID: ${clerkId}`);

    if (!clerkId) throw new Error("clerkId is required for deletion");

    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) {
      console.log(`⚠️ Action :: User with Clerk ID ${clerkId} not found in DB`);
      return { success: false, message: "User not found in database" };
    }

    console.log(
      `🗑️ Action :: User ${clerkId} deleted from database successfully`,
    );
    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    console.error("❌ Action :: ERROR in deleteUser:", error.message);
    return { success: false, message: error.message };
  }
};

// ==========================================
// 🔍 GET USER (Chat load hone par tokens check karne ke liye)
// ==========================================
export const getUserByClerkId = async (clerkId: string) => {
  try {
    await dbConnect();
    const user = await User.findOne({ clerkId });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error("❌ Action :: ERROR in getUserByClerkId:", error.message);
    return { success: false, message: error.message };
  }
};

// ==========================================
// ✏️ UPDATE USER (Onboarding Form bharne ke baad call hoga)
// ==========================================
export const updateUser = async (clerkId: string, updateData: any) => {
  try {
    await dbConnect();
    console.log(`🟡 Action :: Updating user data for: ${clerkId}`);

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          ...updateData,
          isProfileComplete: true, // Form bharte hi profile complete mark kar denge
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return { success: false, message: "User update failed, not found." };
    }


    // Inngest Event Fire
    console.log("🚀 Firing Inngest Event: app/user.onboarded");

    await inngest.send({
      name: "app/user.onboarded",
      data: {
        userId: updatedUser._id.toString(),
        birthDetails: updatedUser.birthDetails,
        gender: updatedUser.gender,
        relationshipStatus: updatedUser.relationshipStatus,
      },
    });

    console.log("✅ Action :: User updated and event dispatched.");
    return { success: true, data: JSON.parse(JSON.stringify(updatedUser)) };
  } catch (error: any) {
    console.error("❌ Action :: ERROR in updateUser:", error.message);
    return { success: false, error: error.message };
  }
};
