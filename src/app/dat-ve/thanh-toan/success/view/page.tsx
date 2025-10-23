'use client';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [transactionID, setTransactionID] = useState<string | null>(null);

  useEffect(() => {
    // Chỉ chạy trên client
    const id = sessionStorage.getItem('transactionID');
    setTransactionID(id);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-green-50 text-green-700">
      <h1 className="text-3xl font-bold mb-4">Thanh toán thành công 🎉</h1>
      {transactionID ? (
        <p>Cảm ơn bạn đã thanh toán. Giao dịch <b>{transactionID}</b> của bạn đã được xử lý thành công.</p>
      ) : (
        <p>Đang tải thông tin giao dịch...</p>
      )}
    </main>
  );
}
