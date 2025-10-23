// src/app/dat-ve/thanh-toan/success/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const bodyText = await req.text();

  console.log(bodyText)

  const redirectUrl = new URL(`/dat-ve/thanh-toan/success/view`, req.url);
  return NextResponse.redirect(redirectUrl, 303); // 303 = POST→GET redirect
}
