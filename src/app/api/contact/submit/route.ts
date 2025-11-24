// API route for contact form submissions
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { requestProtector, buildArcjetDenyResponse } from "@/lib/arcjet";

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

    // Use Arcjet to protect the endpoint and get IP address
    let ipAddress = "unknown";
    let userAgent = request.headers.get("user-agent") || "unknown";
    
    if (requestProtector) {
      try {
        const decision = await requestProtector.protect(request);
        
        // Log entire Arcjet decision for debugging
        console.log("=== ARCJET DECISION DEBUG ===");
        console.log("Full decision object:", JSON.stringify(decision, null, 2));
        console.log("decision.ip type:", typeof decision.ip);
        console.log("decision.ip value:", decision.ip);
        
        // Get IP address from Arcjet decision
        const arcjetIp = decision.ip;
        
        // Log the IP object details
        if (arcjetIp && typeof arcjetIp === 'object') {
          console.log("IP object keys:", Object.keys(arcjetIp));
          console.log("IP object values:", Object.values(arcjetIp));
          console.log("IP object full:", arcjetIp);
          
          // Try to serialize it to see all properties
          try {
            console.log("IP object JSON:", JSON.stringify(arcjetIp, null, 2));
          } catch (e) {
            console.log("Could not stringify IP object:", e);
          }
        }
        
        // Try to extract the IP address string from the object
        if (typeof arcjetIp === 'string') {
          ipAddress = arcjetIp;
        } else if (arcjetIp && typeof arcjetIp === 'object') {
          // Try all possible property names
          const possibleIp = (arcjetIp as any).address || 
                            (arcjetIp as any).ip || 
                            (arcjetIp as any).value ||
                            (arcjetIp as any).ipAddress ||
                            (arcjetIp as any).addr ||
                            (arcjetIp as any).host;
          
          if (possibleIp && typeof possibleIp === 'string') {
            ipAddress = possibleIp;
          } else {
            // Last resort: use headers as fallback
            console.warn("Could not extract IP from Arcjet object, using headers");
            const forwardedFor = request.headers.get("x-forwarded-for");
            const realIp = request.headers.get("x-real-ip");
            ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";
          }
          
          console.log("Final extracted IP:", ipAddress);
        }
        console.log("=== END ARCJET DEBUG ===");
        
        // Check if request is blocked by Arcjet
        const denyResponse = buildArcjetDenyResponse(decision);
        if (denyResponse) {
          return NextResponse.json(
            {
              success: false,
              error: denyResponse.body.error,
              message: "Request blocked by security protection",
            },
            { status: denyResponse.status }
          );
        }
      } catch (arcjetError) {
        // If Arcjet fails, log it but continue with fallback
        console.warn("Arcjet protection failed, using fallback:", arcjetError);
        const forwardedFor = request.headers.get("x-forwarded-for");
        const realIp = request.headers.get("x-real-ip");
        ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";
      }
    } else {
      // Fallback to headers if Arcjet is not configured
      const forwardedFor = request.headers.get("x-forwarded-for");
      const realIp = request.headers.get("x-real-ip");
      ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";
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

    // Save to Firestore (using 'inquiry' collection)
    const inquiryRef = collection(db, "inquiry");
    const docRef = await addDoc(inquiryRef, contactSubmission);

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
  } catch (error: unknown) {
    console.error("Contact form submission error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      error: error,
    });
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit contact form",
        message: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
