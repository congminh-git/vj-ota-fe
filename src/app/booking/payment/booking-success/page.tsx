'use client';

import Steps from '@/components/select-flight/steps';
import FlightInfomation from '@/components/payment/booking-success/journey_info';
import PassengerInfomationBookingSuccess from '@/components/payment/booking-success/passenger_info';
import ContactInfomationBookingSuccess from '@/components/payment/booking-success/contact_info';
import ReservationInformation from '@/components/payment/booking-success/reservation_info';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/components/loading';
import { Check } from '@/components/icons/check';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const bookingSuccessResult =
        typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('bookingSuccessResult')) : null;

    const viewDetail = () => {
        // sessionStorage.setItem('reservationKey', bookingSuccessResult?.key);
        sessionStorage.setItem('managementLocator', bookingSuccessResult?.locator);
        router.push('/booking-management');
        // router.push(`/booking-management/booking-detail?locator=${bookingSuccessResult?.locator}`);
    };

    useEffect(() => {
        if (!bookingSuccessResult) {
            router.replace('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingSuccessResult]);
    return (
        <>
            {bookingSuccessResult ? (
                <main className="relative mt-[74px] sm:mt-0">
                    <Steps />
                    {bookingSuccessResult ? (
                        <div className="flex flex-wrap justify-center p-2 sm:p-4 min-h-screen bg-gray-100 border shadow font-medium">
                            <div className={` w-full max-w-[1200px] relative`}>
                                <div className="bg-white rounded-md p-2 sm:p-8 mt-12 text-center">
                                    <div className="text-center">
                                        <h2 className="mt-16 text-2xl">
                                            <i>
                                                {bookingSuccessResult?.paymentTransactions[0].paymentMethod
                                                    .identifier != 'PL'
                                                    ? 'Đặt vé'
                                                    : 'Giữ chỗ'}{' '}
                                                thành công
                                            </i>
                                            <br />
                                            <span className='text-4xl block mt-4 font-bold text-sky-500 tracking-wide'>
                                                {bookingSuccessResult?.locator}
                                            </span>
                                        </h2>
                                        <p className="text-sm text-gray-500 my-4">
                                            Thông tin đặt vé đã được chúng tôi gửi vào địa chỉ email{' '}
                                            <i className='text-sky-500'>
                                                {bookingSuccessResult?.bookingInformation.contactInformation.email}
                                            </i>
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 pb-8">
                                        <div className="col-span-1">
                                            <ReservationInformation bookingSuccessResult={bookingSuccessResult} />
                                        </div>
                                        <div className="col-span-1">
                                            <ContactInfomationBookingSuccess
                                                bookingSuccessResult={bookingSuccessResult}
                                            />
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <PassengerInfomationBookingSuccess
                                                bookingSuccessResult={bookingSuccessResult}
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <FlightInfomation direction={'đi'} flight={bookingSuccessResult.journeys[0]} />
                                        {bookingSuccessResult?.journeys.length > 1 ? (
                                            <FlightInfomation
                                                direction={'về'}
                                                flight={bookingSuccessResult.journeys[1]}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <button
                                            onClick={viewDetail}
                                            className="w-full py-4 text-sky-400 text-md font-bold border-2 border-sky-400 rounded-md hover:bg-sky-400 hover:text-white transition-all"
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
                                            <Check className={"w-8 h-8 text-white"} strokeWidth={"3"}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-20 flex justify-center min-h-screen">
                            <Loading />
                        </div>
                    )}
                </main>
            ) : (
                <div className="min-h-screen">
                    <Loading />
                </div>
            )}
        </>
    );
}
