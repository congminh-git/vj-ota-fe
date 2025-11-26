// src/app/booking/payment/success/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const bodyText = await req.text();

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel/view`;
    return NextResponse.redirect(redirectUrl, 303); // 303 = POST→GET redirect
}
