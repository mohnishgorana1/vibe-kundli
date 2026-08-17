"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function CosmicQueriesTab({
    freeQueries,
    onSwitchToChat
}: {
    freeQueries: any[];
    onSwitchToChat: (v: string) => void;
}) {
    return (
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <div className="mb-6">
                <h3 className="text-lg md:text-2xl font-bold text-foreground mb-1">Your Personalized Queries</h3>
                <p className="text-base text-muted-foreground">Based on your chart, I have formulated these 3 specific questions for you.</p>
            </div>

            {freeQueries.length > 0 ? (
                <div className="w-full space-y-4">
                    {freeQueries.map((q: any, index: number) => {
                        const safeId = `cosmic-query-${index}`;
                        return (
                            <div key={safeId} className="border-2 border-border bg-secondary dark:bg-secondary/30 rounded-xl px-3 shadow-sm">
                                <div className="hover:no-underline text-left py-3 text-base font-semibold text-foreground/90">
                                    {q.question}
                                </div>
                                <div className="pb-4 pt-1">
                                    <div className="bg-secondary/80 dark:bg-background/50 p-5 rounded-xl border border-border/50 shadow-inner">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="prose prose-sm dark:prose-invert prose-a:text-primary prose-strong:text-foreground max-w-none w-full min-w-0 leading-relaxed break-words [overflow-wrap:anywhere] text-foreground/80 text-justify [&_*]:whitespace-normal selection:bg-primary/30"
                                        >
                                            <ReactMarkdown>{q.answer}</ReactMarkdown>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10">
                    <span className="text-muted-foreground animate-pulse text-sm">Generating cosmic queries...</span>
                </div>
            )}

            <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
                <span className="text-2xl block mb-2">✨</span>
                <h4 className="text-sm font-bold text-foreground mb-1">Ask Your Own Questions</h4>
                <p className="text-xs text-muted-foreground mb-3">Want to know about a specific person, career move, or timeline? Use your tokens.</p>
                <button
                    onClick={onSwitchToChat}
                    className="w-full bg-primary text-primary-foreground text-xs font-bold py-2 rounded-md shadow-sm transition-all hover:scale-[1.02]"
                >
                    Switch to Chat
                </button>
            </div>
        </div>
    );
}