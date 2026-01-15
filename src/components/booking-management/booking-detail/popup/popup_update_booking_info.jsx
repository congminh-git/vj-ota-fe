'use client';

import 'flatpickr/dist/flatpickr.min.css';
import { useState, useEffect } from 'react';
import { putReservationBookingInformation } from '@/services/reservations/functions';
import { putQuotationReservationUpdateBookingInformation } from '@/services/quotations/functions';
import ListPaymentMethod from '@/components/payment/listPaymentMethod';
import { getCurrencySymbol } from '@/lib/parseCurrency';

export default function UpdateBookingInfomationPopup({
    updateBookingInfomationPopup,
    setUpdateBookingInfomationPopup,
    reservationKey,
    reservationByKey,
    companyKey,
}) {
    const [bookingInformation, setBookingInfomation] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [unpaidPaymentTransactions, setUnpaidPaymentTransactions] = useState(null);
    const [updateResult, setUpdateResult] = useState(null);
    const [quotations, setQuotations] = useState(null);
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;

    const removeVietnameseDiacritics = (str) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/Đ/g, 'D')
            .replace(/đ/g, 'd')
            .toUpperCase();
    };

    const convertToUpperCaseWithoutDiacritics = (str) => {
        const noDiacriticsStr = removeVietnameseDiacritics(str);
        const words = noDiacriticsStr.split(' ');
        const upperCaseStr = words.map((word) => word.toUpperCase()).join(' ');
        return upperCaseStr;
    };

    const handlePay = () => {
        putReservationBookingInformation(
            reservationKey,
            bookingInformation.key,
            {
                ...bookingInformation,
                paymentTransactions: unpaidPaymentTransactions.map((element) => ({
                    ...element,
                    paymentMethodCriteria: {
                        account: {
                            company: {
                                key: companyKey,
                            },
                        },
                    },
                })),
            },
            setUpdateResult,
        );
    };

    const handlePutQuotationReservationUpdateBookingInformation = async (body) => {
        const data = await putQuotationReservationUpdateBookingInformation(body);
        setQuotations(data);
    };

    const checkUpdate = () => {
        handlePutQuotationReservationUpdateBookingInformation(
            {
                ...reservationByKey,
                bookingInformation: bookingInformation,
                paymentTransactions: [
                    {
                        paymentMethod: {
                            key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                            identifier: 'AG',
                        },
                        paymentMethodCriteria: {},
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
                    },
                ],
            }
        );
    };

    const [currencySymbol, setCurrencySymbol] = useState('');

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (reservationByKey) {
            setBookingInfomation(reservationByKey.bookingInformation);
        }
    }, [reservationByKey]);

    useEffect(() => {
        if (updateResult) {
            location.reload();
        }
    }, [updateResult]);

    useEffect(() => {
        if (!quotations) return;
        async function processQuotations() {
            let totalDebt = 0;
            let tempUnpaidPaymentTransactions = [];
            quotations.paymentTransactions.forEach((element) => {
                if (!element.receiptNumber) {
                    totalDebt += element.currencyAmounts[0].totalAmount;
                    tempUnpaidPaymentTransactions.push(element);
                }
            });

            if (totalDebt == 0 || tempUnpaidPaymentTransactions.length == 0) {
                const response = await putReservationBookingInformation(
                    reservationKey,
                    bookingInformation.key,
                    bookingInformation,
                );
                setUpdateResult(response)
            } else {
                setUnpaidPaymentTransactions(tempUnpaidPaymentTransactions);
            }
        }
        processQuotations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quotations]);

    return (
        <div
            className={`${
                updateBookingInfomationPopup ? 'flex' : 'hidden'
            } h-screen w-screen bg-gray-700 bg-opacity-50 fixed z-20 top-0 right-0 flex justify-end`}
        >
            <div className="h-full p-8 bg-white overflow-auto">
                <div className="flex justify-between items-center pb-4 border-b">
                    <button
                        onClick={() => {
                            setUpdateBookingInfomationPopup(false);
                            //     setQuotations(null);
                        }}
                        className="bg-white p-2 rounded-md hover:bg-gray-100 border"
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
                    <h4 className="font-bold">Cập nhật thông tin liên hệ</h4>
                </div>
                <div className="mt-4 max-w-[600px]">
                    <div className="bg-white rounded-md mt-4">
                        <h3 className="mb-2 font-medium">
                            <i>Thông tin liên hệ</i>
                        </h3>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            <div className="col-span-1 w-full border px-2 py-1 rounded relative">
                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                    Họ và tên
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    onInput={(e) =>
                                        setBookingInfomation({
                                            ...bookingInformation,
                                            contactInformation: {
                                                ...bookingInformation.contactInformation,
                                                name: convertToUpperCaseWithoutDiacritics(e.target.value),
                                            },
                                        })
                                    }
                                    value={bookingInformation?.contactInformation.name}
                                    className="w-full outline-none"
                                    type="text"
                                />
                                <p className="text-red-500 thong-tin-lien-he-ho text-sm absolute top-2 right-2"></p>
                            </div>
                            <div className="col-span-1 w-full border px-2 py-1 rounded relative">
                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                    Số điện thoại
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={bookingInformation?.contactInformation.phoneNumber}
                                    onInput={(e) =>
                                        setBookingInfomation({
                                            ...bookingInformation,
                                            contactInformation: {
                                                ...bookingInformation.contactInfomation,
                                                phoneNumber: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full outline-none"
                                    type="text"
                                />
                                <p className="text-red-500 thong-tin-lien-he-so-dien-thoai text-sm absolute top-2 right-2"></p>
                            </div>
                            <div className="col-span-1 w-full border px-2 py-1 rounded relative">
                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                    Email
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    onInput={(e) =>
                                        setBookingInfomation({
                                            ...bookingInformation,
                                            contactInformation: {
                                                ...bookingInformation.contactInfomation,
                                                email: e.target.value,
                                            },
                                        })
                                    }
                                    value={bookingInformation?.contactInformation.email}
                                    className="w-full outline-none"
                                    type="text"
                                />
                                <p className="text-red-500 thong-tin-lien-he-email text-sm absolute top-2 right-2"></p>
                            </div>
                            {/* <div className="col-span-1 flex flex-col justify-between">
                                <label htmlFor="" className="text-sm text-gray-500 font-medium">
                                    Xưng danh
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className={`flex justify-start items-center thong-tin-lien-he-gioi-tinh`}>
                                    <label>
                                        <input
                                            // checked={contactInfomation.gender == 'nam' ? true : false}
                                            className="mr-2"
                                            type="radio"
                                            value="nam"
                                            name="xung-danh-lien-he"
                                            // onChange={handleOptionChange}
                                        />
                                        Ông
                                    </label>
                                    <label className="ml-8">
                                        <input
                                            // checked={contactInfomation.gender == 'nu' ? true : false}
                                            className="mr-2"
                                            type="radio"
                                            value="nu"
                                            name="xung-danh-lien-he"
                                            // onChange={handleOptionChange}
                                        />
                                        Bà
                                    </label>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <button
                        onClick={checkUpdate}
                        disabled=""
                        className={`${
                            unpaidPaymentTransactions ? 'hidden' : 'block'
                        } mt-8 w-full rounded py-2 text-white bg-blue-500 hover:bg-blue-400`}
                    >
                        <p className="font-bold">Tiếp theo</p>
                    </button>
                    {unpaidPaymentTransactions ? (
                        <div className="mt-6">
                            <ListPaymentMethod setPaymentMethod={setPaymentMethod} listPaymentMethod={['AG']} />

                            <button
                                onClick={handlePay}
                                disabled={paymentMethod ? false : true}
                                className={`mt-8 w-full rounded py-2 text-white ${
                                    paymentMethod ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-200'
                                }`}
                            >
                                <p>
                                    (
                                    <i>
                                        {unpaidPaymentTransactions
                                            .map((element) => element.currencyAmounts[0].totalAmount)
                                            .toLocaleString()}
                                    </i>{' '}
                                    {currencySymbol})
                                </p>
                                <p className="font-bold">Thanh toán</p>
                            </button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}