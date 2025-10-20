'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BangQuanLyItem({ index, duLieuVe }) {
    const router = useRouter();
    const paymentMethods = {
        PL: 'Pay Later',
        AG: 'Agency credit',
    };

    return (
        <div className="text-sm text-start grid grid-cols-8 gap-2 px-2 py-4 text-gray-800 bg-white rounded-lg font-medium mt-2 border border-gray-100">
            <div>{index}</div>
            <div>
                <span className="text-sky-400">{duLieuVe?.locator}</span>
            </div>
            <div>{duLieuVe?.bookingInformation.contactInformation.name}</div>
            <div>{duLieuVe?.bookingInformation.contactInformation.phoneNumber}</div>
            <div>{paymentMethods[duLieuVe?.paymentTransactions[0].paymentMethod.identifier]}</div>
            <div>
                <span
                    className={`px-2 py-1 font-semibold rounded ${
                        duLieuVe?.paymentTransactions[0].paymentMethod.identifier == 'PL'
                            ? 'bg-red-100 text-red-500'
                            : 'bg-green-100 text-green-500'
                    }`}
                >
                    {duLieuVe?.paymentTransactions[0].paymentMethod.identifier == 'PL'
                        ? 'Chưa thanh toán'
                        : 'Đã thanh toán'}
                </span>
            </div>
            <div>
                {duLieuVe?.paymentTransactions[0].currencyAmounts[0].totalAmount.toLocaleString()}
                <u>đ</u>
            </div>
            <div className="flex justify-start">
                <button
                    onClick={() => {
                        router.push(`/quan-ly-dat-cho/chi-tiet-dat-cho?locator=${duLieuVe?.locator}`);
                    }}
                    className="mr-2 p-1 flex justify-center items-center rounded-full bg-gray-200 hover:bg-blue-50 hover:text-blue-500"
                    title="Chi tiết"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>
                <button
                    className="p-1 flex justify-center items-center rounded-full bg-gray-200 hover:bg-blue-50 hover:text-blue-500"
                    title="Thêm"
                >
                    <svg
                        className="w-4 h-4"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {' '}
                        <path stroke="none" d="M0 0h24v24H0z" /> <circle cx="5" cy="12" r="1" />{' '}
                        <circle cx="12" cy="12" r="1" /> <circle cx="19" cy="12" r="1" />
                    </svg>
                </button>
            </div>
        </div>
    );
}