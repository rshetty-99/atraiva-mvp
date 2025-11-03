import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, path, type } = body;

    // Validate secret token
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret) {
      console.error("REVALIDATION_SECRET is not set in environment variables");
      return NextResponse.json(
        { error: "Revalidation secret not configured" },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid secret token" },
        { status: 401 }
      );
    }

    // Revalidate based on type or specific path
    if (type === "blog") {
      // Revalidate all blog pages
      revalidatePath("/resources");
      revalidatePath("/resources/[slug]", "page");
      return NextResponse.json({
        revalidated: true,
        message: "All blog pages revalidated",
        now: Date.now(),
      });
    } else if (type === "breach") {
      // Revalidate features page with breach map
      revalidatePath("/features");
      return NextResponse.json({
        revalidated: true,
        message: "Features page revalidated",
        now: Date.now(),
      });
    } else if (path) {
      // Revalidate specific path
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now(),
      });
    } else {
      return NextResponse.json(
        { error: "Either 'type' or 'path' must be provided" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error revalidating:", error);
    return NextResponse.json(
      {
        error: "Error revalidating",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

