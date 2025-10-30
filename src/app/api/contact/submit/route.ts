// API route for contact form submissions
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is initialized
    if (!db) {
      console.error("Firebase database is not initialized");
      return NextResponse.json(
        {
          success: false,
          error: "Database not initialized",
          message: "Firebase configuration may be missing",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { formData, utmSource, utmMedium, utmCampaign } = body;

    if (!formData) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing form data",
        },
        { status: 400 }
      );
    }

    // Get client IP address and user agent
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create contact submission document
    const contactSubmission = {
      // Form data
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phone: formData.phone || null,
      countryCode: formData.countryCode || null,
      company: formData.company || null,
      subject: formData.subject || null,
      inquiryType: formData.inquiryType || "general",
      message: formData.message || "",

      // Metadata
      submittedAt: Timestamp.now(),
      ipAddress,
      userAgent,

      // UTM parameters
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,

      // Status tracking
      status: "new", // new, in-progress, resolved
      isRead: false,
      respondedAt: null,
      notes: null,
    };

    // Save to Firestore (using 'contacts' collection)
    const contactRef = collection(db, "contacts");
    const docRef = await addDoc(contactRef, contactSubmission);

    console.log("Contact form submitted:", {
      id: docRef.id,
      email: formData.email,
      inquiryType: formData.inquiryType,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        submissionId: docRef.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit contact form",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
