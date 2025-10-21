'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResultContent() {
  const params = useSearchParams();
  const status = params.get('status');
  const transactionId = params.get('transactionId');

  return (
    <div style={{ padding: 40 }}>
      <h1>Kết quả thanh toán</h1>
      <p>Trạng thái: <b>{status}</b></p>
      <p>Mã giao dịch: {transactionId}</p>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div>Đang tải kết quả...</div>}>
      <ResultContent />
    </Suspense>
  );
}
