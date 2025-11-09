"use client";

import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 pt-16 sm:pt-18 md:pt-20 lg:pt-22 xl:pt-24 2xl:pt-28 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
