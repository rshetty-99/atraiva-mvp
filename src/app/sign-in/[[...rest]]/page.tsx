"use client";

import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // Show success message if coming from registration
  useEffect(() => {
    if (email) {
      toast.success("Account created successfully!", {
        description: "Please sign in with your new credentials to continue.",
        duration: 5000,
      });
    }
  }, [email]);

  return (
    <AuthLayout>
      <div className="grid min-h-[calc(100vh-12rem)] lg:grid-cols-2 w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col justify-center p-6 md:p-10 w-full max-w-full overflow-x-hidden">
          <div className="flex flex-1 items-center justify-center w-full max-w-full overflow-x-hidden">
            <div className="w-full max-w-md overflow-x-hidden">
              {email && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    ✓ Account created successfully!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Sign in with <strong>{email}</strong> to access your
                    dashboard.
                  </p>
                </div>
              )}
              <SignIn
                afterSignInUrl="/dashboard"
                signUpUrl="/sign-up"
                forceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
                appearance={{
                  layout: {
                    socialButtonsPlacement: "bottom",
                  },
                  elements: {
                    formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm",
                    card: "shadow-none",
                    headerTitle: "text-2xl font-bold",
                    headerSubtitle: "text-muted-foreground text-sm",
                    socialButtonsBlockButton:
                      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                    socialButtonsBlockButtonText: "text-sm",
                    formFieldLabel:
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    formFieldInput:
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    footerActionLink:
                      "text-primary underline-offset-4 hover:underline text-sm",
                    dividerLine: "bg-border",
                    dividerText: "text-muted-foreground text-sm",
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative hidden lg:block overflow-hidden">
          <Image
            src="/auth-hero.svg"
            alt="AI-powered breach response journey: from detection through AI analysis to compliance resolution"
            fill
            className="object-cover dark:brightness-[0.95] opacity-90"
            priority
          />

          {/* Overlay content */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white z-10">
            <div className="mb-4 inline-block px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wide">
              AI-Powered Protection
            </div>
            <h2 className="text-3xl font-bold mb-3 leading-tight">
              From Breach Detection to
              <br />
              Compliance Resolution
            </h2>
            <p className="text-lg opacity-90 mb-6 max-w-lg">
              Automated breach response with AI-driven analysis, instant
              regulatory notifications, and comprehensive compliance
              documentation.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="font-medium">SOX Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">HIPAA Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
