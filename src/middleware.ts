import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { buildArcjetDenyResponse, requestProtector } from "@/lib/arcjet";

// Define public routes that don't require authentication
// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
  "/profile(.*)",
  "/api/protected(.*)",
  "/compliance(.*)",
  "/breach-management(.*)",
  "/admin(.*)",
  "/docs/support(.*)", // Protected documentation
]);

export default clerkMiddleware(async (auth, req) => {
  if (requestProtector && req.nextUrl.pathname.startsWith("/api/")) {
    try {
      const decision = await requestProtector.protect(req, { requested: 1 });
      const deny = buildArcjetDenyResponse(decision);
      if (deny) {
        return NextResponse.json(deny.body, { status: deny.status });
      }
    } catch (error) {
      console.error("[arcjet] Failed to evaluate request", error);
    }
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
