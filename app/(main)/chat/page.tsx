import { getFullMongoUser } from "@/lib/helpers/auth";

export default async function ChatPage() {
  const dbUser = await getFullMongoUser();

  return (
    <div className="p-8">
      {/* CONDITIONAL RENDERING */}
      <h1 className="text-3xl font-bold mb-4">
        Namaste, {dbUser?.firstName || "Seeker"}! 🙏
      </h1>
      
      <div className="bg-card border border-border/50 p-6 rounded-2xl max-w-lg">
        <h2 className="text-xl font-semibold mb-2">Your Cosmic Coordinates:</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>📍 Born in: <span className="text-primary font-medium">{dbUser?.birthDetails?.pob}</span></li>
          <li>🪙 Karma Tokens: <span className="text-primary font-bold">{dbUser?.tokenBalance || 0}</span></li>
        </ul>
      </div>

      {/* Yahan aapka actual Chat Interface aayega */}
    </div>
  );
}