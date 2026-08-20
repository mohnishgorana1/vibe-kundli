import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-background text-foreground py-16 px-4 md:px-8 selection:bg-primary/30">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Contact the Cosmos</h1>
                    <p className="text-muted-foreground text-lg">Have a question about your tokens, account, or the universe? We're here to help.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Details */}
                    <div className="space-y-8">
                        <div className="bg-card/50 border border-border/50 p-6 rounded-2xl">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Email Us</h3>
                            <p className="text-muted-foreground mb-4">Our support team usually replies within 24 hours.</p>
                            <a href="mailto:support@vibekundli.com" className="text-primary font-medium hover:underline">
                                support@vibekundli.com
                            </a>
                        </div>

                        <div className="bg-card/50 border border-border/50 p-6 rounded-2xl">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Location</h3>
                            <p className="text-muted-foreground">
                                VibeKundli HQ<br />
                                Madhya Pradesh, India<br />
                                (Operating across the multiverse)
                            </p>
                        </div>
                    </div>

                    {/* Simple Contact Form */}
                    <div className="bg-card/50 border border-border/50 p-8 rounded-3xl">
                        <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground block mb-1.5">Name</label>
                                <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground block mb-1.5">Email</label>
                                <input type="email" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground block mb-1.5">Message</label>
                                <textarea rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="How can we help you?" />
                            </div>
                            <button type="button" className={cn(buttonVariants({ size: "lg" }), "w-full rounded-xl gap-2 mt-2")}>
                                <Send className="h-4 w-4" /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}