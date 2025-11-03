"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/blog";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type HeroProps = {
  post: Post | null;
  isLoading?: boolean;
};

export function Hero({ post, isLoading = false }: HeroProps) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Default/fallback content when no post is available
  const defaultTitle = "Security Insights & Expert Analysis";
  const defaultDescription =
    "Stay ahead of emerging threats with cutting-edge research, expert insights, and practical guidance from our team of cybersecurity professionals and AI specialists.";
  const defaultDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Check subscription status on mount and when user changes
  // First check Clerk metadata (cached), then fallback to API if needed
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isUserLoaded) return;

      // If no user, no need to check subscription
      if (!user) {
        setIsSubscribed(false);
        setCheckingSubscription(false);
        return;
      }

      // Check Clerk metadata first (cached, no API call)
      const sessionData = user.publicMetadata?.atraiva as
        | { preferences?: { newsletterSubscribed?: boolean } }
        | undefined;
      if (sessionData?.preferences?.newsletterSubscribed !== undefined) {
        setIsSubscribed(sessionData.preferences.newsletterSubscribed);
        setCheckingSubscription(false);
        return;
      }

      // If not in cache, check via API (will cache the result)
      setCheckingSubscription(true);
      try {
        let url = "/api/newsletter/subscribe?";
        if (user.id) {
          url += `userId=${encodeURIComponent(user.id)}`;
        } else if (user.primaryEmailAddress?.emailAddress) {
          url += `email=${encodeURIComponent(
            user.primaryEmailAddress.emailAddress
          )}`;
        } else {
          setIsSubscribed(false);
          setCheckingSubscription(false);
          return;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setIsSubscribed(data.isSubscribed || false);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [user, isUserLoaded]);

  const handleSubscribe = async (name?: string, email?: string) => {
    try {
      setIsSubscribing(true);

      const userEmail = email || user?.primaryEmailAddress?.emailAddress;
      const userName = name || user?.fullName || user?.firstName;

      if (!userEmail) {
        toast.error("Email address is required");
        return;
      }

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Successfully subscribed to newsletter!");
        setIsSubscribed(true);
        setDialogOpen(false);
        setGuestName("");
        setGuestEmail("");

        // Note: Clerk metadata will be updated by the API,
        // but we should refresh the user metadata to see the update immediately
        // This is handled automatically on next page load or user refresh
      } else {
        toast.error(data.message || "Failed to subscribe. Please try again.");
        if (data.message?.includes("already subscribed")) {
          setIsSubscribed(true);
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleGuestSubscribe = () => {
    if (!guestName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!guestEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    handleSubscribe(guestName, guestEmail);
  };

  // Use post data if available, otherwise use defaults
  const title = post?.title || defaultTitle;
  const description = post?.excerpt || defaultDescription;
  const author = "Atraiva Team"; // Could fetch author name from user data
  const publishedDate = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : defaultDate;
  const slug = post?.slug || "";
  // Always use the default hero background - featured images from blog posts
  // are typically thumbnails not suitable for hero backgrounds
  const heroBackground = "/images/website/resources/hero-background-96a838.jpg";

  return (
    <section
      className="relative bg-background px-20 overflow-hidden"
      style={{
        boxSizing: "border-box",
        paddingTop: "320px",
        paddingBottom: "5rem",
        height: "638px",
        maxHeight: "638px",
        minHeight: "638px",
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Theme-aware overlay for text contrast */}
      <div className="absolute inset-0 bg-background/60"></div>

      {/* Background Blur Element */}
      <div className="absolute top-16 left-[639px] w-[681.42px] h-[592.91px] rounded-full bg-[rgba(134,145,216,0.4)] blur-[300px]"></div>

      <div
        className="relative z-10 flex items-center"
        style={{
          height: "calc(638px - 320px - 5rem)",
          minHeight: "calc(638px - 320px - 5rem)",
          maxHeight: "calc(638px - 320px - 5rem)",
        }}
      >
        <div className="flex items-center justify-between w-full gap-20">
          {/* Left Content */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <div className="flex flex-col gap-4">
              <span className="font-lato text-lg font-normal leading-[1.33] text-left text-primary">
                Home / Resources
              </span>
              <h1
                className="font-lato text-[48px] font-normal leading-[1.2] text-left text-foreground"
                style={{
                  wordBreak: "normal",
                  overflowWrap: "normal",
                  whiteSpace: "normal",
                  hyphens: "none",
                  wordSpacing: "normal",
                }}
              >
                {isLoading ? (
                  <>
                    Security Insights &<br />
                    Expert Analysis
                  </>
                ) : (
                  title
                )}
              </h1>
              <p className="font-lato text-lg font-normal leading-[1.33] text-left text-muted-foreground max-w-[502px] line-clamp-3">
                {isLoading ? defaultDescription : description}
              </p>
            </div>

            {/* Author and Date */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="font-lato text-base font-medium leading-[1.5] text-foreground">
                  {author}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-lato text-base font-medium leading-[1.5] text-foreground">
                  {publishedDate}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex gap-4"
              style={{ height: "48px", minHeight: "48px", maxHeight: "48px" }}
            >
              {slug ? (
                <Link href={`/resources/${slug}`}>
                  <Button className="bg-primary hover:bg-primary/90 px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-white flex items-center gap-2 shadow-lg transition-all flex-shrink-0">
                    Read article
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Button>
                </Link>
              ) : (
                <Button className="bg-primary hover:bg-primary/90 px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-white flex items-center gap-2 shadow-lg transition-all flex-shrink-0">
                  Read article
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Button>
              )}
              {/* Subscribe Button - Conditional Rendering */}
              <div
                style={{
                  height: "48px",
                  minHeight: "48px",
                  maxHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {checkingSubscription ? (
                  <Button
                    variant="outline"
                    disabled
                    className="bg-transparent border-border border-2 px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-foreground opacity-50 cursor-not-allowed flex-shrink-0"
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </Button>
                ) : isSubscribed ? (
                  <Button
                    variant="outline"
                    disabled
                    className="bg-transparent border-border border-2 px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-foreground opacity-50 cursor-not-allowed flex-shrink-0"
                  >
                    Already Subscribed
                  </Button>
                ) : user ? (
                  <Button
                    variant="outline"
                    onClick={() => handleSubscribe()}
                    disabled={isSubscribing}
                    className="bg-transparent border-border border-2 hover:bg-muted px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe to newsletter"
                    )}
                  </Button>
                ) : (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-transparent border-border border-2 hover:bg-muted px-[25.6px] py-[12.8px] rounded-[48px] h-12 text-base font-medium text-foreground flex-shrink-0"
                      >
                        Subscribe to newsletter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Subscribe to Newsletter</DialogTitle>
                        <DialogDescription>
                          Enter your name and email to receive our weekly
                          security insights and expert analysis.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            disabled={isSubscribing}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            disabled={isSubscribing}
                          />
                        </div>
                        <Button
                          onClick={handleGuestSubscribe}
                          disabled={
                            isSubscribing ||
                            !guestName.trim() ||
                            !guestEmail.trim()
                          }
                          className="w-full"
                        >
                          {isSubscribing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Subscribing...
                            </>
                          ) : (
                            "Subscribe"
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          No spam, unsubscribe at any time. Read our privacy
                          policy.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          {/* <div className="flex-1 flex justify-end">
            <div className="w-full max-w-[500px] h-[400px] relative">
              <img
                src="/images/website/resources/hero-image.jpg"
                alt="Cybersecurity professional"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
