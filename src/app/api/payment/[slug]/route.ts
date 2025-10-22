import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Đọc body từ request
    const body = await req.json();
    
    // Log để debug
    console.log('========== PAYMENT CALLBACK ==========');
    console.log('Body:', JSON.stringify(body, null, 2));
    console.log('Query params:', req.nextUrl.searchParams.toString());
    console.log('Full URL:', req.url);
    console.log('=====================================');
    
    // Lấy các thông tin từ body
    const { 
      transactionID, 
      requestID, 
      currentState,
      requestData,
      signature,
      fingerprint,
      dateTimeExpire,
      requestDateTime
    } = body;

    // TODO: Xử lý logic nghiệp vụ của bạn
    // - Verify signature nếu có
    // - Lưu vào database
    // - Update booking status
    // - Gửi email xác nhận
    
    if (currentState === 'RESULT') {
      console.log('✅ Payment SUCCESS:', transactionID);
      
      // Xử lý thanh toán thành công
      // await updateBookingStatus(requestID, 'paid');
      // await sendConfirmationEmail(requestData);
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Payment processed successfully',
          transactionID,
          requestID
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    } else {
      console.log('⚠️ Payment status:', currentState);
      
      return NextResponse.json(
        { 
          success: false,
          message: 'Payment not completed',
          currentState,
          transactionID
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
    
  } catch (error) {
    console.error('❌ Error processing payment callback:', error);
    
    return NextResponse.json(
      { 
        error: 'Invalid request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}