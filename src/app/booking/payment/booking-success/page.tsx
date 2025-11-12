'use client';

import Steps from '@/components/select-flight/steps';
import FlightInfomation from '@/components/payment/booking-success/journey_info';
import PassengerInfomationBookingSuccess from '@/components/payment/booking-success/passenger_info';
import ContactInfomationBookingSuccess from '@/components/payment/booking-success/contact_info';
import ReservationInformation from '@/components/payment/booking-success/reservation_info';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const bookingSuccessResult =
        typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('bookingSuccessResult')) : null;

    const viewDetail = () => {
        sessionStorage.setItem('reservationKey', bookingSuccessResult?.key);
        router.push(`/booking-management/booking-detail?locator=${bookingSuccessResult?.locator}`);
    };

    useEffect(()=>{
        if (!bookingSuccessResult) {
            router.replace('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[bookingSuccessResult])
    return (
        <>
        {
            bookingSuccessResult
            ?
            <main className="relative">
                <Steps />
                {bookingSuccessResult ? (
                    <div className="flex flex-wrap justify-center p-4 min-h-screen bg-gray-100 border shadow font-medium">
                        <div className={` w-full max-w-[1200px] relative`}>
                            <div className="bg-white rounded-md p-8 mt-12 text-center">
                                <div className="text-center">
                                    <h2 className="mt-16 text-2xl">
                                        <i>
                                            {bookingSuccessResult?.paymentTransactions[0].paymentMethod.identifier != 'PL'
                                                ? 'Đặt vé'
                                                : 'Giữ chỗ'}{' '}
                                            thành công
                                        </i>
                                    </h2>
                                    <p className="text-sm text-gray-500 my-4">
                                        Thông tin đặt vé chúng tôi gửi vào{' '}
                                        {bookingSuccessResult?.bookingInformation.contactInformation.email}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-8 mt-8 pb-8">
                                    <div className="col-span-1">
                                        <ReservationInformation bookingSuccessResult={bookingSuccessResult} />
                                    </div>
                                    <div className="col-span-1">
                                        <ContactInfomationBookingSuccess bookingSuccessResult={bookingSuccessResult} />
                                    </div>
                                    <div className="col-span-2">
                                        <PassengerInfomationBookingSuccess bookingSuccessResult={bookingSuccessResult} />
                                    </div>
                                </div>
                                <div className="">
                                    <FlightInfomation direction={'đi'} flight={bookingSuccessResult.journeys[0]} />
                                    {bookingSuccessResult?.journeys.length > 1 ? (
                                        <FlightInfomation direction={'về'} flight={bookingSuccessResult.journeys[1]} />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <button
                                        onClick={viewDetail}
                                        className="w-full py-4 text-sky-400 text-md font-bold border-2 border-sky-400 rounded-md hover:bg-sky-400 hover:text-white"
                                    >
                                        <i>Chi tiết đơn hàng</i>
                                    </button>
                                </div>
                                <div className="w-24 h-24 rounded-full absolute top-0 left-1/2 -translate-x-1/2 bg-white p-2">
                                    <div
                                        className={`w-full h-full rounded-full flex justify-center items-center ${
                                            bookingSuccessResult?.paymentTransactions[0].paymentTime
                                                ? 'bg-green-500'
                                                : 'bg-yellow-400'
                                        }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="3"
                                            stroke="currentColor"
                                            className="w-8 h-8 text-white"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-20 flex justify-center min-h-screen">
                        <div role="status">
                            <svg
                                aria-hidden="true"
                                className="inline w-10 h-10 text-gray-200 animate-spin fill-green-500"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
            </main>
            :
            <div className='min-h-screen'>
                <span>Loading...</span>
            </div>
        }
        </>
    );
}