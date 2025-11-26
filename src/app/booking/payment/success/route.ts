// src/app/booking/payment/success/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const bodyText = await req.text();

  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success/view`
  return NextResponse.redirect(redirectUrl, 303);
}
