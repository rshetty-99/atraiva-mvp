// API endpoint to convert a URL into a blog post
import { NextRequest, NextResponse } from "next/server";
import { convertToBlogPost } from "@/lib/blog/url-converter";

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
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the webpage
    const fetchResponse = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      // Set timeout
      signal: AbortSignal.timeout(30000), // 30 seconds
    });

    if (!fetchResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch URL: ${fetchResponse.status} ${fetchResponse.statusText}`,
        },
        { status: fetchResponse.status }
      );
    }

    const html = await fetchResponse.text();

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

