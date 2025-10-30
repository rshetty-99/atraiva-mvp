import { NextRequest, NextResponse } from "next/server";
import { MemberInvitationService } from "@/lib/member-invitation-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const result = await MemberInvitationService.validateInvitationToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      invitation: {
        organizationId: result.invitation!.organizationId,
        organizationName: result.invitation!.organizationName,
        memberData: result.invitation!.memberData,
        invitedByName: result.invitation!.invitedByName,
        expiresAt: result.invitation!.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error validating invitation:", error);
    return NextResponse.json(
      {
        error: "Failed to validate invitation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


