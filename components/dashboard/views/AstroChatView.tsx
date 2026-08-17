"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function AstroChatView() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // (Paste your EXACT handleChatSubmit function here from the previous step)
  const handleChatSubmit = async (e: any) => { /*... same logic ...*/ };

  return (
    <div className="max-w-4xl mx-auto w-full h-full flex flex-col animate-in fade-in duration-500 border border-border/40 rounded-2xl bg-card/30 overflow-hidden shadow-sm">
      
      {/* Chat Header */}
      <div className="p-4 bg-background/80 backdrop-blur-md border-b border-border/40 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-xl">🧿</div>
        <div>
          <h2 className="font-bold text-foreground">Astro-G Live</h2>
          <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Cosmic Connection Active</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
            <span className="text-5xl mb-4">🌌</span>
            <h3 className="text-2xl font-extrabold text-foreground mb-2">Astro-G is Ready</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              I have memorized your entire astrological matrix. I know the past, and I can calculate the future. Ask me anything.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'user' ? (
                <div className="bg-primary text-primary-foreground px-5 py-3 rounded-3xl rounded-tr-sm max-w-[80%] shadow-sm">
                  {m.content}
                </div>
              ) : (
                <div className="flex items-start gap-3 max-w-[90%] md:max-w-[80%]">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mt-1">🧿</div>
                  <div className="bg-secondary/60 border border-border/50 px-5 py-4 rounded-3xl rounded-tl-sm text-foreground/90 shadow-sm prose prose-sm md:prose-base dark:prose-invert prose-a:text-primary break-words">
                    {isLoading && m.content === "" ? <span className="inline-block w-2 h-4 bg-primary animate-pulse rounded-sm" /> : <ReactMarkdown>{m.content}</ReactMarkdown>}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {errorMsg && <div className="text-center p-3 bg-red-500/10 text-red-500 rounded-lg text-sm font-semibold mx-auto max-w-md">{errorMsg}</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/90 backdrop-blur-md border-t border-border/40 shrink-0">
        <form onSubmit={handleChatSubmit} className="relative flex items-center max-w-3xl mx-auto">
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} placeholder="Ask the cosmos about your career, marriage, or timeline..."
            className="w-full bg-secondary/80 rounded-full pl-6 pr-14 py-4 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 shadow-inner"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center w-10 h-10">
            {isLoading ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>}
          </button>
        </form>
      </div>
    </div>
  );
}