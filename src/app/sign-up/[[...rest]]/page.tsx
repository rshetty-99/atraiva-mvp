import Image from "next/image";
import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="grid min-h-[calc(100vh-12rem)] lg:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
              <SignUp
                routing="path"
                path="/sign-up"
                afterSignUpUrl="/dashboard"
                signInUrl="/sign-in"
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
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white z-10">
            <div className="mb-4 inline-block px-3 py-1 bg-secondary/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wide">
              Start Your Journey
            </div>
            <h2 className="text-3xl font-bold mb-3 leading-tight">
              Join Leading Organizations
              <br />
              in Compliance Excellence
            </h2>
            <p className="text-lg opacity-90 mb-6 max-w-lg">
              Start your compliance journey with AI-powered breach detection,
              automated PII discovery, and instant regulatory reporting.
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  AI-powered PII detection across all data sources
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  Automated breach notification workflows
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium">
                  Real-time compliance monitoring & alerts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
