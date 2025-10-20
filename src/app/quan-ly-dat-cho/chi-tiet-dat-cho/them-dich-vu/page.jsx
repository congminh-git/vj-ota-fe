'use client';

import Breadcrumb from '@/components/breadcrumb';
import ListService from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/them-dich-vu/list_service';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddService() {
    const [refetch, setRefetch] = useState(0);
    const router = useRouter();
    const reservationKey = typeof window !== 'undefined' ? sessionStorage.getItem('reservationKey') : null;
    const bookingSuccessResult =
        typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('bookingSuccessResult')) : null;
    const listBreadcrumb = [
        { title: 'Quản lý booking', uri: '/' },
        { title: 'Quản lý đặt chỗ', uri: '/quan-ly-dat-cho' },
        { title: 'Chi tiết booking', uri: `/quan-ly-dat-cho/chi-tiet-dat-cho/?locator=${bookingSuccessResult?.locator}` },
        { title: 'Thêm dịch vụ', uri: '/quan-ly-dat-cho/chi-tiet-dat-cho/them-dich-vu' },
    ];
    useEffect(() => {
        if (refetch) {
            location.reload();
        }
        // if (reservationKey) getReservationByKey(reservationKey, setReservationByKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetch]);

    useEffect(()=>{
        if (!reservationKey) {
            router.replace('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[reservationKey])
    return (
        <>
        {
            reservationKey
            ?
                <main className="relative">
                    <div className="flex flex-wrap justify-center min-h-screen bg-gray-100 border shadow">
                        <div className={` w-full max-w-[1200px]`}>
                            <div className="mt-4 mb-2 flex justify-between items-center">
                                <Breadcrumb listBreadcrumb={listBreadcrumb} />
                                <button
                                    onClick={() => {
                                        router.push('/quan-ly-dat-cho/chi-tiet-dat-cho/?locator=');
                                    }}
                                    className="flex justify-between items-center p-2 text-white font-semibold bg-blue-400 rounded-md border hover:bg-blue-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-4 h-4 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                        />
                                    </svg>
                                    Chi tiết booking
                                </button>
                            </div>
                            <ListService
                                reservationKey={reservationKey}
                                setRefetch={setRefetch}
                                refetch={refetch}
                                moreAction={false}
                            />
                        </div>
                    </div>
                </main>
            :
            <div className='min-h-screen'>
                <span>Loading...</span>
            </div>
        }
        </>
    );
}