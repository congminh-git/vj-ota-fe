'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentResultPage() {
  const params = useSearchParams();
  const status = params.get('status');
  const transactionId = params.get('transactionId');

  return (
    <div style={{ padding: 40 }}>
      <h1>Kết quả thanh toán</h1>
      <p>Trạng thái: <b>{status}</b></p>
      <p>Mã giao dịch: {transactionId}</p>

      {/* {status === 'SUCCESS' && <p>✅ Thanh toán thành công!</p>}
      {status === 'FAILURE' && <p>❌ Thanh toán thất bại!</p>}
      {status === 'CANCEL' && <p>⚠️ Giao dịch bị hủy!</p>} */}
    </div>
  );
}
