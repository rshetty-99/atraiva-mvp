import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SessionService } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clerkId, orgId } = body;

    // Verify the clerk ID matches the authenticated user
    if (clerkId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    // Switch primary organization
    await SessionService.switchPrimaryOrganization(clerkId, orgId);

    return NextResponse.json({ 
      success: true, 
      message: 'Organization switched successfully' 
    });

  } catch (error) {
    console.error('Error switching organization:', error);
    return NextResponse.json(
      { error: 'Failed to switch organization' }, 
      { status: 500 }
    );
  }
}