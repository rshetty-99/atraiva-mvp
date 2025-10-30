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
    const { clerkId } = body;

    // Verify the clerk ID matches the authenticated user
    if (clerkId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Force refresh session data
    const sessionData = await SessionService.processLogin(clerkId, true);

    return NextResponse.json({ 
      success: true, 
      message: 'Session refreshed successfully',
      sessionData 
    });

  } catch (error) {
    console.error('Error refreshing session:', error);
    return NextResponse.json(
      { error: 'Failed to refresh session' }, 
      { status: 500 }
    );
  }
}