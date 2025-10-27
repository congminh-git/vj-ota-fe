'use client';
import { useEffect, useState, useCallback } from 'react';
import { getReservationByKey, postEmailingItineraries, postReservationCheck } from '@/services/reservations/functions';
import { useRouter } from 'next/navigation';
import { setCookie, getCookie } from "@/lib/cookie"

export default function SuccessPage() {
    const [transactionID, setTransactionID] = useState<string | null>(null);
    const [reservationKey, setReservationKey] = useState<string | null>(null);
    const [response, setResponse] = useState<any | null>(null);
    const router = useRouter()

    const handleReservationCheck = useCallback(async (transactionID: string) => {
        const data = await postReservationCheck(transactionID.slice(1, -1));
        if (data) {
            if (data.locator) {
                sessionStorage.setItem('managementLocator', data.locator);
                // await postEmailingItineraries(data.key, data.bookingInformation.contactInformation.email, true);
                // router.push('/dat-ve/thanh-toan/dat-cho-thanh-cong');
                router.push('/quan-ly-dat-cho')
            } else {
                const key = getCookie('reservationKey');
                const data = await getReservationByKey(key)
                sessionStorage.setItem('managementLocator', data.locator)
                router.push('/quan-ly-dat-cho')
            }
        }
        setResponse(data);
    }, [router]);

    useEffect(() => {
        const id = getCookie('transactionID');
        setTransactionID(id);
    }, []);

    useEffect(() => {
        if (transactionID) {
            handleReservationCheck(transactionID);
        }
    }, [transactionID, handleReservationCheck]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen text-center bg-green-50 text-green-700">
            <h1 className="text-3xl font-bold mb-6">Thanh toán thành công 🎉</h1>

            {transactionID ? (
                <>
                    <p className="mb-6">
                        Cảm ơn bạn đã thanh toán. Giao dịch <b>{transactionID}</b> của bạn đã được xử lý thành công.
                    </p>

                    {response ? (
                        <div className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-all cursor-default">
                            ✅ Hoàn tất
                        </div>
                    ) : (
                        <div className="px-6 py-3 bg-yellow-400 text-yellow-900 font-medium rounded-lg shadow-md animate-pulse cursor-default">
                            ⏳ Đang xử lý dịch vụ...
                        </div>
                    )}
                </>
            ) : (
                <p>Đang tải thông tin giao dịch...</p>
            )}
        </main>
    );
}
