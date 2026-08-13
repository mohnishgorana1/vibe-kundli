import { Inngest } from "inngest";

// Create a client to send and receive events
// "vibe-kundli" tumhare app ka ID hai jo Inngest dashboard me dikhega

export const inngest = new Inngest({ id: "vibe-kundli" });