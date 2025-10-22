import { NextResponse } from 'next/server';
import { getBaseURL } from '@/lib/getBaseUrl';

export async function POST(req: Request) {
  try {
    const baseUrl = getBaseURL();
    const body = await req.json();
    console.log('Payment callback data:', body);

  } catch (error) {
    console.error('Error processing payment callback:', error);
    return new NextResponse('Invalid request', { status: 400 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Use POST to send payment result' });
}
