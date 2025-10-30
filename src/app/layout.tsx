import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import HydrationFix from "@/components/HydrationFix";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "Atraiva.ai - Intelligent AI Solutions",
  description: "Advanced AI-powered solutions with modern interface design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "oklch(0.655 0.156 186.5)", // Atraiva teal
          colorBackground: "oklch(0.15 0.02 220)", // Dark background
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} font-sans antialiased`}
          suppressHydrationWarning
        >
          <HydrationFix />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
