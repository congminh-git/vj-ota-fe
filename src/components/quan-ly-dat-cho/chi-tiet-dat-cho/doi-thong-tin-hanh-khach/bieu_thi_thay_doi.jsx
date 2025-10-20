'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { putUpdateReservationPassengerByKey } from '@/services/reservations/functions';
import { putQuotationReservationUpdatePassenger } from '@/services/quotations/functions';
import ListPaymentMethod from '@/components/thanh-toan/listPaymentMethod';
import { getCurrencySymbol } from '@/lib/parseCurrency';

function Change({
    changeItem,
    notChangeItem,
    index,
    changeIndex,
    setChangeIndex,
    reservationKey,
    companyKey,
    reservationByKey,
}) {
    const [quotations, setQuotations] = useState(null);
    const [price, setPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState({ identifier: null, description: null });
    const router = useRouter();
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;
    const fetchQuotationUpdatePassenger = async (
        reservationKey,
        passengerKey,
        companyKey,
        reservationByKeyStr,
        thongTinChange,
        setStateFunc,
    ) => {
        const body = JSON.parse(reservationByKeyStr);
        body.passengers.forEach((element, index) => {
            if (element.key == thongTinChange.key) {
                body.passengers[index] = thongTinChange;
            }
        });
        body.paymentTransactions[0] = {
            paymentMethod: {
                key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                identifier: 'AG',
                description: 'Agency Credit',
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
                    totalAmount: 0,
                    currency: {
                        code: currency,
                        baseCurrency: true,
                    },
                    exchangeRate: exchangeRate,
                },
            ],
            processingCurrencyAmounts: [
                {
                    totalAmount: 0,
                    currency: {
                        code: currency,
                        baseCurrency: true,
                    },
                    exchangeRate: exchangeRate,
                },
            ],
            payerDescription: null,
            receiptNumber: null,
            payments: null,
            refundTransactions: null,
            notes: null,
        };
        const data = await putQuotationReservationUpdatePassenger(reservationKey, passengerKey, body);
        setStateFunc(data)
    };

    const handlePutUpdateReservationPassengerByKey = async (reservationKey, body) => {
        const data = await putUpdateReservationPassengerByKey(reservationKey, body)
        setChangeIndex(changeIndex + 1)
    }

    const changeConfirm = async (paymentMethod, changeItem, companyKey) => {
        if (paymentMethod.identifier) {
            const body = changeItem;
            const listPaymentTransactions = [];
            quotations.paymentTransactions.forEach((element) => {
                if (!element.receiptNumber) {
                    listPaymentTransactions.push(element);
                }
            });
            body.paymentTransactions = listPaymentTransactions;
            if (body.paymentTransactions.length > 0) {
                body.paymentTransactions[body.paymentTransactions.length - 1].paymentMethodCriteria = {
                    account: {
                        company: {
                            key: companyKey,
                        },
                    },
                };
            }
            handlePutUpdateReservationPassengerByKey(reservationKey, body);
        }
    };

    const [currencySymbol, setCurrencySymbol] = useState('');

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (index == changeIndex) {
            fetchQuotationUpdatePassenger(
                reservationKey,
                changeItem.key,
                companyKey,
                JSON.stringify(reservationByKey),
                changeItem,
                setQuotations,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, changeIndex, reservationKey, companyKey, changeItem, reservationByKey]);

    useEffect(() => {
        if (quotations) {
            let totalPrice = 0;
            quotations.paymentTransactions.forEach((element) => {
                if (!element.receiptNumber) {
                    totalPrice += element.currencyAmounts[0].totalAmount;
                }
            });
            setPrice(totalPrice);
        }
    }, [quotations]);

    return (
        <div className={`${index == changeIndex ? 'block' : 'hidden'} border rounded p-2 bg-gray-50`}>
            <div className="w-full grid grid-cols-7 text-sm gap-4">
                <div className="col-span-3 border rounded p-2 bg-white">
                    <div className="">
                        <p className="flex items-center">
                            {notChangeItem.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}
                            <span className="bg-gray-200 h-2 w-2 block mx-1 rounded-full"></span>
                            {notChangeItem.reservationProfile.firstName +
                                ' ' +
                                notChangeItem.reservationProfile.lastName}
                        </p>
                    </div>
                    {notChangeItem.infants[0] ? (
                        <div className="mt-1">
                            <p>Đi cùng: </p>
                            <p className="flex items-center">
                                {notChangeItem.infants[0].reservationProfile.gender.toUpperCase() == 'MALE'
                                    ? 'Ông'
                                    : 'Bà'}
                                <span className="bg-gray-200 h-2 w-2 block mx-1 rounded-full"></span>
                                {notChangeItem.infants[0].reservationProfile.firstName +
                                    ' ' +
                                    notChangeItem.infants[0].reservationProfile.lastName}
                            </p>
                            <p>{notChangeItem.infants[0].reservationProfile.birthDate}</p>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="col-span-1 flex justify-center items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </div>
                <div className="col-span-3 border rounded p-2 bg-white">
                    <div className="">
                        <p className="flex items-center">
                            {changeItem.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}
                            <span className="bg-gray-200 h-2 w-2 block mx-1 rounded-full"></span>
                            {changeItem.reservationProfile.firstName + ' ' + changeItem.reservationProfile.lastName}
                        </p>
                    </div>
                    {changeItem.infants[0] ? (
                        <div className="mt-1">
                            <p>Đi cùng: </p>
                            <p className="flex items-center">
                                {changeItem.infants[0].reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}
                                <span className="bg-gray-200 h-2 w-2 block mx-1 rounded-full"></span>
                                {changeItem.infants[0].reservationProfile.firstName +
                                    ' ' +
                                    changeItem.infants[0].reservationProfile.lastName}
                            </p>
                            <p>{changeItem.infants[0].reservationProfile.birthDate}</p>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="mt-2">
                <p className="ml-1">Tổng giá (bao gồm dư nợ) </p>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 rounded border bg-white px-2 py-1">
                        {price.toLocaleString()} {currencySymbol}
                    </div>
                    <button
                        onClick={() => {
                            setChangeIndex(changeIndex + 1);
                            setPaymentMethod({ identifier: null, description: null });
                        }}
                        className="col-span-1 rounded bg-rose-500 hover:bg-rose-400 py-1 font-bold text-md text-white"
                    >
                        Bỏ qua
                    </button>
                </div>

                <div className="mt-2">
                    <ListPaymentMethod setPaymentMethod={setPaymentMethod} listPaymentMethod={['AG']} />

                    <button
                        onClick={() => changeConfirm(paymentMethod, changeItem, companyKey)}
                        disabled={paymentMethod.identifier ? false : true}
                        className={`${
                            paymentMethod.identifier ? 'bg-yellow-500 hover:bg-yellow-400 ' : 'bg-gray-400'
                        } w-full mt-2 rounded py-1 font-bold text-md text-white cursor-pointer`}
                    >
                        Đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Change;