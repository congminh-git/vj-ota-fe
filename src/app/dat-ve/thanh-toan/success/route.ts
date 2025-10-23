// src/app/dat-ve/thanh-toan/success/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const bodyText = await req.text();

  // Giải mã form data nếu có
  const params = new URLSearchParams(bodyText);
  const orderId = params.get('orderId');
  const transactionId = params.get('transactionId');
  const status = params.get('status') || 'success';

  // TODO: bạn có thể gọi API nội bộ, lưu DB, xác thực chữ ký thanh toán ở đây
  // await fetch(`${process.env.API_URL}/save-transaction`, { method: 'POST', body: JSON.stringify({ orderId, transactionId }) })

  // Redirect người dùng đến trang view React
  const redirectUrl = new URL(`/dat-ve/thanh-toan/success/view?orderId=${orderId}&status=${status}`, req.url);
  return NextResponse.redirect(redirectUrl, 303); // 303 = POST→GET redirect
}
