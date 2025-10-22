export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Đọc body từ request
    const body = await req.json();
    console.log(body)
    
    return NextResponse.json(
      {
        status: 200,
        message: "OK"
      }
    );
  } catch (error) {
    console.error('Payment POST error:', error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error"
      },
      { status: 500 }
    );
  }
}