import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateAndIndexKundli } from "@/lib/inngest/functions";


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateAndIndexKundli, // Yahan apne saare inngest functions register karne hote hain
  ],
});