import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();

  // Redirect sang trang /dat-ve/thanh-toan/success/view với query
  return NextResponse.redirect(new URL('/dat-ve/thanh-toan/success/view', req.url));

}
