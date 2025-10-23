'use client'

export default function FailurePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-red-50 text-red-700">
      <h1 className="text-3xl font-bold mb-4">Thanh toán thất bại</h1>
      <p>Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.</p>
    </main>
  );
}
