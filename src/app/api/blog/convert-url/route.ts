// API endpoint to convert a URL into a blog post
import { NextRequest, NextResponse } from "next/server";
import { convertToBlogPost } from "@/lib/blog/url-converter";
import { fetchHtmlWithFallback } from "@/lib/blog/headless-fetch";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the webpage with standard request first, then headless fallback
    const { html, mode } = await fetchHtmlWithFallback(parsedUrl.toString());

    if (!html || html.length < 100) {
      return NextResponse.json(
        { error: "No content found at URL" },
        { status: 400 }
      );
    }

    // Convert to blog post format
    const blogData = convertToBlogPost(html, url);

    return NextResponse.json({
      success: true,
      data: blogData,
      sourceUrl: url,
      fetchMode: mode,
    });
  } catch (error) {
    console.error("Error converting URL to blog post:", error);
    
    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        return NextResponse.json(
          { error: "Request timed out. The URL may be taking too long to respond." },
          { status: 408 }
        );
      }
      
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { error: "Failed to fetch URL. Please check if the URL is accessible." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to convert URL",
      },
      { status: 500 }
    );
  }
}

