// src/app/dat-ve/thanh-toan/success/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const bodyText = await req.text();

  const decoded:any = Buffer.from(bodyText, 'base64').toString('utf-8');

  const redirectUrl = new URL(`/dat-ve/thanh-toan/success/view?transactionID=${decoded?.responseData?.transactionID}`, req.url);
  return NextResponse.redirect(redirectUrl, 303); // 303 = POST→GET redirect
}
