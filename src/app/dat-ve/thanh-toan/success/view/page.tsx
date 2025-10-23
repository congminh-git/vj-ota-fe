'use client';

export default function SuccessPage() {
    const transactionID = sessionStorage.getItem('transactionID');
    return (
        <main className="flex flex-col items-center justify-center min-h-screen text-center bg-green-50 text-green-700">
            <h1 className="text-3xl font-bold mb-4">Thanh toán thành công 🎉</h1>
            <p>Cảm ơn bạn đã thanh toán. Giao dịch {transactionID} của bạn đã được xử lý thành công.</p>
        </main>
    );
}
