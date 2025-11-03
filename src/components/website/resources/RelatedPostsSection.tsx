"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Post } from "@/types/blog";

type RelatedPostsSectionProps = {
  posts: Post[];
};

export function RelatedPostsSection({ posts }: RelatedPostsSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((relatedPost) => (
            <Link
              key={relatedPost.id}
              href={`/resources/${relatedPost.slug}`}
              className="group"
            >
              <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all">
                {relatedPost.featuredImage && (
                  <div className="relative w-full h-48">
                    <Image
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  {relatedPost.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{relatedPost.readTimeMinutes || 5} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

