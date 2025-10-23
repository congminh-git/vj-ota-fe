import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Nhận data từ cổng thanh toán
  const bodyText = await req.text();

  // (Tuỳ chọn) xử lý dữ liệu body ở đây, ví dụ parse form:
  // const params = new URLSearchParams(bodyText);
  // const orderId = params.get('orderId');

  // Trả về HTML trang thành công
  const html = `
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Thanh toán thành công</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding-top: 10%; }
          h1 { color: #22c55e; font-size: 2em; }
          p { color: #555; margin-top: 1em; }
        </style>
      </head>
      <body>
        <h1>🎉 Thanh toán thành công!</h1>
        <p>Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử lý thành công.</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
