'use client';

import ListPaymentMethod from '@/components/payment/listPaymentMethod';
import InternationalCardInfoForm from '@/components/payment/internationalCardInfo';
import { putUpdateReservationJourneyByKey } from '@/services/reservations/functions';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { parseNgayThang, tinhThoiGianBay } from '@/components/select-flight/flight_item';
import { getCurrencySymbol } from '@/lib/parseCurrency';
import { setCookie, getCookie } from '@/lib/cookie';
import { useRouter } from 'next/navigation';

export default function CancelLegQuotationPopup({
    openCancelLegQuotationPopup,
    setOpenCancelLegQuotationPopup,
    quotations,
    cancelledBody,
    journeyKey,
    reservationKey,
    setCancelledResult,
    companyKey,
    journeyInfo,
}) {
    const router = useRouter();
    const today = useMemo(() => new Date(), []);
    const [paymentMethod, setPaymentMethod] = useState({ identifier: null, description: null });
    const [price, setPrice] = useState(0);
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;

    const [billing, setBilling] = useState({
        city: '',
        state: '',
        country: '',
        address: '',
        postalCode: '',
        phone: '',
    });

    const [cardInfo, setCardInfo] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const handlePutUpdateReservationJourneyByKey = async (reservationKey, journeyKey, body) => {
        const data = await putUpdateReservationJourneyByKey(reservationKey, journeyKey, body);
        if (data?.data?.responseData?.endpoint) {
            setCookie('transactionID', JSON.stringify(data?.data?.responseData?.transactionId));
            setCookie('reservationKey', reservationKey, 1);
            router.push(data?.data?.responseData?.endpoint);
        } else {
            location.reload()
        }
    };

    const handlePay = async () => {
        var methodIndex = -1;
        const internationalPaymentMethod = [
            {
                identifier: 'VJPVI',
                key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p2BJwZ8wTc4ExeJCtCEj4Hz7MHM1X8JzpsHK7LUkJqndw==',
            },
            {
                identifier: 'VJPMC',
                key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p194mAGlhM8hHzyNub1xGLall2SNuloDtpyhWuaoDeoPA==',
            },
            {
                identifier: 'VJPAMEX',
                key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p104nzxRaOCpOkEMnƒuqo2oi1d¥9h0pvhMOuUOg7P4ƒmA==',
            },
            {
                identifier: 'VJPJCB',
                key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1Ur12p0B7xIkkX8eFGwIjU0ZKUMgZƒDSk4CLyF3vJ0EQ==',
            },
        ];
        for (let i = 0; i < internationalPaymentMethod.length; i++) {
            if (internationalPaymentMethod[i].identifier === paymentMethod.identifier) {
                methodIndex = i;
                break;
            }
        }
        cancelledBody.paymentTransactions = [
            {
                paymentMethod: internationalPaymentMethod[methodIndex] || {
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                    identifier: 'AG',
                },
                paymentMethodCriteria: {
                    account: {
                        company: {
                            key: companyKey,
                        },
                    },
                },
                currencyAmounts: [
                    {
                        totalAmount: price,
                        currency: {
                            code: currency,
                            baseCurrency: true,
                        },
                        exchangeRate: exchangeRate,
                    },
                ],
                refundTransactions: [],
                notes: '',
            },
        ];
        handlePutUpdateReservationJourneyByKey(reservationKey, journeyKey, cancelledBody);
    };

    const [currencySymbol, setCurrencySymbol] = useState('');

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (quotations) {
            let total = 0;
            quotations.charges.forEach((element) => {
                if (element.chargeType.description == 'Cancellation') {
                    total += element.currencyAmounts[0].totalAmount;
                }
            });
            setPrice(total);
        }
    }, [quotations]);

    return (
        <div
            className={`${
                openCancelLegQuotationPopup ? 'fixed' : 'hidden'
            } bg-gray-800 top-0 left-0 right-0 bottom-0 bg-opacity-50 z-20`}
        >
            <div className="bg-white w-[400px] p-4 rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div>
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setOpenCancelLegQuotationPopup(false)}
                            className="border p-2 rounded hover:bg-blue-200 w-fit h-fit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-center">
                            <p className="text-md font-bold text-gray-800">Phí hủy chuyến</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-md mb-2">
                    <h3 className="mb-2 font-bold">
                        <i>Thông tin chuyến bay: </i>
                    </h3>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-500 font-medium">
                            <span>Chuyến bay:</span>
                            <span className="ml-2">
                                {journeyInfo.segments[0].flight.airlineCode?.code}
                                {journeyInfo.segments[0].flight.flightNumber}
                            </span>
                        </p>
                        <p className="text-gray-500 font-medium">
                            <span className="">Airbus:</span>
                            <span className="text-gray-500 ml-2">
                                A{journeyInfo.segments[0].flight.aircraftModel.identifier}
                            </span>
                        </p>
                    </div>
                    <div className="flex justify-between mb-2">
                        <div>
                            <div className="h-1/3 font-semibold mb-1">
                                <i>
                                    {journeyInfo.segments[0].departure.airport.name} (
                                    {journeyInfo.segments[0].departure.airport.code})
                                </i>
                            </div>
                            <div className="h-1/3"></div>
                            <div className="h-1/3 text-gray-500 text-sm flex items-center">
                                {parseNgayThang(journeyInfo.segments[0].departure.localScheduledTime).time}{' '}
                                <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                                {parseNgayThang(journeyInfo.segments[0].departure.localScheduledTime).date}
                            </div>
                        </div>
                        <span className="block w-5 h-5 bg-[url('/airplane1.png')] bg-cover"></span>
                        <div className="flex flex-col items-end">
                            <div className="h-1/3 font-semibold mb-1">
                                <i>
                                    {journeyInfo.segments[0].arrival.airport.name} (
                                    {journeyInfo.segments[0].arrival.airport.code})
                                </i>
                            </div>
                            <div className="h-1/3"></div>
                            <div className="h-1/3 text-gray-500 text-sm flex items-center">
                                {parseNgayThang(journeyInfo.segments[0].arrival.localScheduledTime).time}{' '}
                                <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                                {parseNgayThang(journeyInfo.segments[0].arrival.localScheduledTime).date}
                            </div>
                        </div>
                    </div>
                    {journeyInfo.segments[1] ? (
                        <div className="flex justify-around">
                            <div>
                                <div className="h-1/3 font-semibold mb-1">
                                    <i>
                                        {journeyInfo.segments[1].departure.airport.name} (
                                        {journeyInfo.segments[1].departure.airport.code})
                                    </i>
                                </div>
                                <div className="h-1/3"></div>
                                <div className="h-1/3 text-gray-500 text-sm flex items-center">
                                    {parseNgayThang(journeyInfo.segments[1].departure.localScheduledTime).time}{' '}
                                    <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                                    {parseNgayThang(journeyInfo.segments[1].departure.localScheduledTime).date}
                                </div>
                            </div>
                            <span className="block w-5 h-5 bg-[url('/airplane1.png')] bg-cover"></span>
                            <div className="flex flex-col items-end">
                                <div className="h-1/3 font-semibold mb-1">
                                    <i>
                                        {journeyInfo.segments[1].arrival.airport.name} (
                                        {journeyInfo.segments[1].arrival.airport.code})
                                    </i>
                                </div>
                                <div className="h-1/3"></div>
                                <div className="h-1/3 text-gray-500 text-sm flex items-center">
                                    {parseNgayThang(journeyInfo.segments[1].arrival.localScheduledTime).time}{' '}
                                    <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                                    {parseNgayThang(journeyInfo.segments[1].arrival.localScheduledTime).date}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    <ListPaymentMethod
                        setPaymentMethod={setPaymentMethod}
                        // listPaymentMethod={['AG', 'VJPVI', 'VJPMC', 'VJPAMEX', 'VJPJCB']}
                        listPaymentMethod={['AG']}
                        useVoucher={false}
                    />

                    <InternationalCardInfoForm
                        cardInfo={cardInfo}
                        setCardInfo={setCardInfo}
                        billing={billing}
                        setBilling={setBilling}
                        show={
                            paymentMethod.identifier === 'VJPVI' ||
                            paymentMethod.identifier === 'VJPMC' ||
                            paymentMethod.identifier === 'VJPAMEX' ||
                            paymentMethod.identifier === 'VJPJCB'
                        }
                    />
                    <button
                        onClick={handlePay}
                        disabled={
                            paymentMethod.identifier === 'AG' ||
                            ((paymentMethod.identifier === 'VJPVI' ||
                                paymentMethod.identifier === 'VJPMC' ||
                                paymentMethod.identifier === 'VJPAMEX' ||
                                paymentMethod.identifier === 'VJPJCB') &&
                                billing.address &&
                                billing.city &&
                                billing.country &&
                                billing.postalCode &&
                                billing.phone &&
                                cardInfo.cvv &&
                                cardInfo.expiryDate &&
                                cardInfo.cardName &&
                                cardInfo.cardNumber)
                                ? false
                                : true
                        }
                        className={`mt-8 w-full rounded py-2 text-white ${
                            paymentMethod ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-200'
                        }`}
                    >
                        <p>
                            (<i>{price?.toLocaleString()}</i> {currencySymbol})
                        </p>
                        <p className="font-bold">Thanh toán</p>
                    </button>
                </div>
            </div>
            {/* <div className="h-full grid grid-cols-8 py-4 border-t border-b">
                    <div className="col-span-2">
                        <div className="h-1/3 font-semibold mb-1">
                            <i>
                                {journeyInfo.segments[0].departure.airport.name} (
                                {journeyInfo.segments[0].departure.airport.code})
                            </i>
                        </div>
                        <div className="h-1/3"></div>
                        <div className="h-1/3 text-gray-500 text-sm flex items-center">
                            {parseNgayThang(journeyInfo.segments[0].departure.localScheduledTime).time}{' '}
                            <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                            {parseNgayThang(journeyInfo.segments[0].departure.localScheduledTime).date}
                        </div>
                    </div>
                    <div className="col-span-4 flex-grow mx-4">
                        <div className="h-1/3 text-sky-400 text-sm w-full text-center mb-1">
                            {tinhThoiGianBay(
                                journeyInfo.segments[0].departure.localScheduledTime,
                                journeyInfo.segments[0].arrival.localScheduledTime,
                            )}
                        </div>
                        <div className="h-1/3 flex justify-between items-center relative">
                            <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                            <div className="bg-[url('/Vector1.png')] h-[1px] flex-grow"></div>
                            <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                            <div className="w-5 h-5 bg-[url('/airplane1.png')] bg-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                        <div className="h-1/3 text-gray-500 text-xs w-full text-center mt-1">Bay thẳng</div>
                    </div>
                    <div className="col-span-2 flex flex-col items-end">
                        <div className="h-1/3 font-semibold mb-1">
                            <i>
                                {journeyInfo.segments[0].arrival.airport.name} (
                                {journeyInfo.segments[0].arrival.airport.code})
                            </i>
                        </div>
                        <div className="h-1/3"></div>
                        <div className="h-1/3 text-gray-500 text-sm flex items-center">
                            {parseNgayThang(journeyInfo.segments[0].arrival.localScheduledTime).time}{' '}
                            <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                            {parseNgayThang(journeyInfo.segments[0].arrival.localScheduledTime).date}
                        </div>
                    </div>
                </div> */}
        </div>
    );
}
