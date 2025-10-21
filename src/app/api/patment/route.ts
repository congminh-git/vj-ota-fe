import { getBaseURL } from '@/lib/getBaseUrl';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const baseUrl = getBaseURL();
        const body = await req.json();
        console.log('Payment callback data:', body);
        const params = new URLSearchParams({
            status: body?.currentState || 'unknown',
            transactionId: body?.requestData?.transactionID || '',
        });

        return NextResponse.redirect(`${baseUrl}/dat-ve/result?${params.toString()}`);
    } catch (error) {
        console.error('Error processing payment callback:', error);
        return new NextResponse('Invalid request', { status: 400 });
    }
}

export function GET() {
    // Nếu ai truy cập /dat-ve trực tiếp bằng GET
    return NextResponse.json({ message: 'Use POST to send payment result' });
}
