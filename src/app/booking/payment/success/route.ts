// src/app/booking/payment/success/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const bodyText = await req.text();

  const redirectUrl = new URL(`/payment/success/view`, req.url);
  return NextResponse.redirect(redirectUrl, 303); // 303 = POST→GET redirect
}
