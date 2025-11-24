import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const datastoreId = process.env.GEMINI_DATASTORE_ID;

    if (!apiKey || !datastoreId) {
      return NextResponse.json(
        {
          error:
            "Gemini configuration missing. Set GEMINI_API_KEY and GEMINI_DATASTORE_ID in your environment.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const notes = formData.get("notes");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Placeholder: send to Gemini File Search ingestion endpoint.
    // Replace with REST API call once credentials/scopes are enabled.
    console.log("[GeminiUpload] Received file", {
      filename: file.name,
      size: file.size,
      type: file.type,
      notes,
    });

    return NextResponse.json({ message: "Upload received" }, { status: 200 });
  } catch (error) {
    console.error("[GeminiUpload]", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
