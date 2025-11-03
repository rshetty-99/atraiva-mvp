"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/types/blog";

type BlogPostInteractionsProps = {
  post: Post;
  initialLikes: number;
  onViewIncrement?: () => void;
};

export function BlogPostInteractions({
  post,
  initialLikes,
  onViewIncrement,
}: BlogPostInteractionsProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  React.useEffect(() => {
    // Increment view count on mount - use requestIdleCallback for better performance
    const incrementViews = () => {
      if (onViewIncrement) {
        onViewIncrement();
      } else {
        incrementViewCount(post.id);
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      requestIdleCallback(incrementViews, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(incrementViews, 100);
    }
  }, [post.id, onViewIncrement]);

  const incrementViewCount = async (postId: string) => {
    try {
      await fetch(`/api/blog/${postId}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleShare = React.useCallback((platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = post?.title || "";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        if (typeof window !== "undefined") {
          navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        }
        return;
    }

    if (shareUrl && typeof window !== "undefined") {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  }, [post]);

  const handleLike = React.useCallback(async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await fetch(`/api/blog/${post.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        toast.success("Thanks for liking!");
      } else {
        toast.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  }, [post.id, isLiking]);

  return (
    <div className="flex items-center gap-4 pb-8 border-b border-border">
      <span className="text-sm text-muted-foreground">Share:</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare("twitter")}
        className="text-muted-foreground hover:text-foreground"
      >
        <Twitter className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare("facebook")}
        className="text-muted-foreground hover:text-foreground"
      >
        <Facebook className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare("linkedin")}
        className="text-muted-foreground hover:text-foreground"
      >
        <Linkedin className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare("copy")}
        className="text-muted-foreground hover:text-foreground"
      >
        <Link2 className="w-5 h-5" />
      </Button>
      <div className="ml-auto">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center gap-2 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-muted-foreground"
        >
          <ThumbsUp className={`w-4 h-4 ${isLiking ? "animate-pulse" : ""}`} />
          <span>{likes} likes</span>
        </button>
      </div>
    </div>
  );
}

