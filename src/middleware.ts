import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/home",
  "/about",
  "/aboutus",
  "/contact",
  "/contact-us",
  "/pricing",
  "/price",
  "/features",
  "/solutions",
  "/resources",
  "/privacy",
  "/terms",
  "/api/webhooks/clerk",
  "/api/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/register(.*)", // Registration link flow
  "/onboarding(.*)", // Onboarding flow (pre-authentication)
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
  "/profile(.*)",
  "/api/protected(.*)",
  "/compliance(.*)",
  "/breach-management(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
