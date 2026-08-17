import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReactMarkdown from 'react-markdown';

function AIKundliView({ aiReport }: { aiReport: any }) {

    const parseAiReport = (report: string) => {
        if (!report) return [];
        const parts = report.split(/^##\s+/m);
        const sections = [];
        if (parts[0] && parts[0].trim().length > 20) sections.push({ title: "Cosmic Overview", content: parts[0].trim() });
        for (let i = 1; i < parts.length; i++) {
            const currentPart = parts[i];
            const newlineIndex = currentPart.indexOf('\n');
            if (newlineIndex !== -1) {
                const cleanTitle = currentPart.slice(0, newlineIndex).trim().replace(/^[\d\.]+\s*/, '');
                const content = currentPart.slice(newlineIndex).trim();
                if (cleanTitle && content.length > 0) sections.push({ title: cleanTitle, content });
            }
        }
        return sections;
    };
    const reportSections = parseAiReport(aiReport || "");
    
    return (
        <section className="mx-auto max-w-7xl animate-in slide-in-from-bottom-4 duration-500 pb-20 ">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">AI Kundli Report</h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">Your detailed cosmic blueprint, decoded by Astro-G.</p>
            </div>

            <Accordion className="w-full space-y-4">
                {reportSections.map((section: any, idx: number) => (
                    <AccordionItem
                        key={idx}
                        value={`report-section-${idx}`}
                        className="border-2 dark:border border-border bg-background rounded-2xl px-2 shadow-sm overflow-hidden transition-all"
                    >
                        <AccordionTrigger className="font-bold text-lg text-left py-5 px-4 hover:no-underline hover:text-primary transition-colors group">
                            <div className="flex items-center gap-4">
                                {/* Premium Number Badge */}
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-extrabold group-hover:bg-primary/70 group-hover:text-primary-foreground transition-colors">
                                    {idx + 1}
                                </span>
                                {section.title}
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 pb-6 pt-2">
                            <div className="prose prose-base md:prose-lg dark:prose-invert prose-a:text-primary prose-strong:text-foreground 
                                max-w-none w-full min-w-0 leading-relaxed wrap-anywhere text-foreground/80 text-justify
                                **:max-w-full **:min-w-0 **:wrap-break-word **:whitespace-normal
                                [&_pre]:overflow-x-hidden [&_pre]:whitespace-pre-wrap
                                [&_code]:break-all [&_code]:whitespace-pre-wrap selection:bg-primary/30 text-base flex flex-col gap-y-2
  ">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

        </section>
    );
}

export default AIKundliView