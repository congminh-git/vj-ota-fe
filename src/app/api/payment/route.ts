import { NextRequest, NextResponse } from 'next/server';
import { getBaseURL } from '@/lib/getBaseUrl';

export async function POST(req: NextRequest) {
  try {
    const baseUrl = getBaseURL();
    const body = await req.json();
    
    console.log('Payment callback data:', body);
    console.log('Query params:', req.nextUrl.searchParams.toString());
    
    // Lấy language từ query params nếu cần
    const language = req.nextUrl.searchParams.get('language') || 'en';
    
    // Xử lý payment data
    const { 
      transactionID, 
      requestID, 
      currentState,
      requestData 
    } = body;

    // TODO: Lưu vào database, update booking status, etc.
    
    // QUAN TRỌNG: Phải return response
    if (currentState === 'RESULT') {
      return NextResponse.json({ 
        success: true,
        message: 'Payment processed successfully',
        transactionID 
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      success: false,
      message: 'Payment not completed',
      currentState 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.json(
      { error: 'Invalid request', message: error.message },
      { status: 400 }
    );
  }
}