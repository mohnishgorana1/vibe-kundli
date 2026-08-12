"use client";

import Navbar from "@/components/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
     <Navbar />
     <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}