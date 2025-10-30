// Simple test endpoint to verify API routes are working
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Blog API routes are accessible",
    timestamp: new Date().toISOString(),
  });
}
