import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, name, phone, notes } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // In a real application, you would save this to your database
    // For now, we'll just log it and return a success response
    console.log('Waitlist submission:', { email, name, phone, notes });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined the waitlist!',
        data: { email, name, phone, notes }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in waitlist API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process waitlist submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic route handling
