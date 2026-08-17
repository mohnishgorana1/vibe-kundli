"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import DeleteChatDialog from "../DeleteChatDialog"; 

export default function AstroChatView({ userData, initialMessages }: { userData: any; initialMessages: any[] }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Dialog state for Desktop
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  };

  const handleDeleteChat = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/chat/history", { method: "DELETE" });
      if (res.ok) {
        setMessages([]);
        setIsDeleteDialogOpen(false);
      } else {
        setErrorMsg("⚠️ Failed to delete chat.");
      }
    } catch (error) {
      setErrorMsg("⚠️ Error connecting to server.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setErrorMsg("");
    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto"; // reset height
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiMessageId, role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        if (response.status === 403) setErrorMsg("⚠️ Your tokens are exhausted! Please recharge.");
        else setErrorMsg("⚠️ Server error. Please try again.");
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkText = decoder.decode(value, { stream: true });

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, content: msg.content + chunkText } : msg
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("⚠️ Connection interrupted.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full h-full flex flex-col animate-in fade-in duration-500 border-none lg:border-x lg:border-border/40 bg-card/30 overflow-hidden shadow-sm relative">

      {/* Desktop Only Dialog */}
      <DeleteChatDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteChat}
        isDeleting={isDeleting}
      />

      {/* 🔥 FLOATING TOP-RIGHT ACTIONS (Desktop Only) 🔥 */}
      <div className="hidden absolute top-4 right-4 z-20 lg:flex items-center gap-2">
        <span className="text-xs font-bold px-2.5 py-2 bg-background border border-border shadow-sm rounded-lg text-foreground flex items-center gap-1">
          {userData.tokenBalance} 🪙
        </span>
        <button 
          onClick={() => setIsDeleteDialogOpen(true)} 
          className="p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"
          title="Delete Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>

      {/* 🔥 SINGLE COLUMN SEAMLESS FLOW 🔥 */}
      <div className="flex-1 flex flex-col w-full h-full justify-between">
        
        {/* Messages Area (Scrollable with Bottom Mask) */}
        <div 
          className="pt-16 pb-2 flex-1 overflow-y-auto space-y-6 scrollbar-thin relative z-0"
          style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)" }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70 px-4">
              <span className="text-5xl mb-4">🌌</span>
              <h3 className="text-2xl font-extrabold text-foreground mb-2">Astro-G is Ready</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                I have memorized your entire astrological matrix. I know the past, and I can calculate the future. Ask me anything.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex mx-auto self-center px-2.5 lg:w-[65%] ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'user' ? (
                  <div className="bg-secondary text-foreground px-5 py-3 rounded-3xl rounded-tr-sm max-w-[80%] shadow-sm">
                    {m.content}
                  </div>
                ) : (
                  <div className="flex items-start gap-3 text-justify">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mt-3">🧿</div>
                    <div className="px-5 py-4 text-foreground bg-background dark:bg-background/20 backdrop-blur-2xl rounded-2xl shadow-md shadow-secondary dark:shadow-none  prose prose-sm md:prose-base dark:prose-invert prose-a:text-primary wrap-break-word space-y-5 leading-6 border-b border-border/80">
                      {
                        isLoading && m.content === "" ?
                          (<span className="inline-block w-2 h-4 bg-primary animate-pulse rounded-sm" />)
                          : (<ReactMarkdown>{m.content}</ReactMarkdown>)
                      }
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {errorMsg && <div className="text-center p-3 bg-red-500/10 text-red-500 rounded-lg text-sm font-semibold mx-auto max-w-md">{errorMsg}</div>}
          
          {/* Spacer block taaki aakhiri message mask me hide na ho jaye */}
          <div ref={messagesEndRef} className="h-20 w-full" />
        </div>

        {/* Input Area (Relative, sits right under the mask effect) */}
        <div className="relative z-10 w-full shrink-0 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-6">
          <div className="mx-auto px-4 w-full lg:w-[65%] space-y-3">
            <form onSubmit={handleChatSubmit} className="relative flex items-end bg-secondary/80 rounded-3xl shadow-inner border border-border/50 px-4 py-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Ask the cosmos about your career, marriage, or timeline..."
                className="w-full bg-transparent pl-2 pr-12 py-3 text-foreground focus:outline-none resize-none scrollbar-thin text-sm md:text-base leading-relaxed"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="absolute right-3 bottom-3 p-2 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center w-9 h-9 shrink-0"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>}
              </button>
            </form>

            <p className="text-foreground opacity-60 font-light text-xs text-center">Astro-G is AI and can make mistakes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}