'use client';

import { getCountries } from '@/services/country/functions';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ListPaymentMethod({ setPaymentMethod, listPaymentMethod, useVoucher }) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchDataCountries = async () => {
            const result = await getCountries();
            setCountries(result);
        };

        if (!countries.length) {
            fetchDataCountries();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-white p-4 rounded-md">
            <div>
                {listPaymentMethod.includes('AG') ? (
                    <div className="flex items-center py-2 border-b">
                        <label
                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                            htmlFor="agencycredit"
                        >
                            <input
                                value="agencycredit"
                                name="type"
                                type="radio"
                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                id="agencycredit"
                                checked={selectedPaymentMethod === 'agencycredit'}
                                onChange={() => {
                                    if (selectedPaymentMethod !== 'agencycredit') {
                                        setPaymentMethod({
                                            identifier: 'AG',
                                            description: 'Agency Credit',
                                            creditCard: '',
                                        });
                                        setSelectedPaymentMethod('agencycredit');
                                    }
                                }}
                            />
                            <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                </svg>
                            </span>
                        </label>
                        <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="html">
                            Agency Credit
                        </label>
                    </div>
                ) : (
                    <></>
                )}

                {listPaymentMethod.includes('VJPVI') ? (
                    <div className="flex items-center py-2 border-b">
                        <label
                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                            htmlFor="visa"
                        >
                            <input
                                value="visa"
                                name="type"
                                type="radio"
                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                id="visa"
                                checked={selectedPaymentMethod === 'visa'}
                                onChange={() => {
                                    if (selectedPaymentMethod !== 'visa') {
                                        setPaymentMethod({
                                            identifier: 'VJPVI',
                                            description: 'VJPVI UPC',
                                            creditCard: '',
                                        });
                                        setSelectedPaymentMethod('visa');
                                    }
                                }}
                            />
                            <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                </svg>
                            </span>
                        </label>
                        <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="html">
                            Visa
                        </label>
                    </div>
                ) : (
                    <></>
                )}

                {listPaymentMethod.includes('VJPMC') ? (
                    <div className="flex items-center py-2 border-b">
                        <label
                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                            htmlFor="masterCard"
                        >
                            <input
                                value="masterCard"
                                name="type"
                                type="radio"
                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                id="masterCard"
                                checked={selectedPaymentMethod === 'masterCard'}
                                onChange={() => {
                                    if (selectedPaymentMethod !== 'masterCard') {
                                        setPaymentMethod({
                                            identifier: 'VJPMC',
                                            description: 'VJPMC UPC',
                                            creditCard: '',
                                        });
                                        setSelectedPaymentMethod('masterCard');
                                    }
                                }}
                            />
                            <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                </svg>
                            </span>
                        </label>
                        <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="html">
                            Master Card
                        </label>
                    </div>
                ) : (
                    <></>
                )}

                {listPaymentMethod.includes('VJPAMEX') ? (
                    <div className="flex items-center py-2 border-b">
                        <label
                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                            htmlFor="americanExpress"
                        >
                            <input
                                value="americanExpress"
                                name="type"
                                type="radio"
                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                id="americanExpress"
                                checked={selectedPaymentMethod === 'americanExpress'}
                                onChange={() => {
                                    if (selectedPaymentMethod !== 'americanExpress') {
                                        setPaymentMethod({
                                            identifier: 'VJPAMEX',
                                            description: 'VJPAMEX UPC',
                                            creditCard: '',
                                        });
                                        setSelectedPaymentMethod('americanExpress');
                                    }
                                }}
                            />
                            <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                </svg>
                            </span>
                        </label>
                        <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="html">
                            American Express
                        </label>
                    </div>
                ) : (
                    <></>
                )}

                {listPaymentMethod.includes('VJPJCB') ? (
                    <div className="flex items-center py-2 border-b">
                        <label
                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                            htmlFor="jcb"
                        >
                            <input
                                value="jcb"
                                name="type"
                                type="radio"
                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                id="jcb"
                                checked={selectedPaymentMethod === 'jcb'}
                                onChange={() => {
                                    if (selectedPaymentMethod !== 'jcb') {
                                        setPaymentMethod({
                                            identifier: 'VJPJCB',
                                            description: 'VJPJCB UPC',
                                            creditCard: '',
                                        });
                                        setSelectedPaymentMethod('jcb');
                                    }
                                }}
                            />
                            <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                </svg>
                            </span>
                        </label>
                        <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="html">
                            JCB
                        </label>
                    </div>
                ) : (
                    <></>
                )}

                {listPaymentMethod.includes('PL') && !useVoucher ? (
                    <div className="flex items-center py-2 border-b">
                        <label
                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                            htmlFor="paylater"
                        >
                            <input
                                value="paylater"
                                name="type"
                                type="radio"
                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                id="paylater"
                                onChange={() => {
                                    setPaymentMethod({ identifier: 'PL', description: 'Pay Later', creditCard: '' });
                                    setSelectedPaymentMethod('paylater');
                                }}
                            />
                            <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                </svg>
                            </span>
                        </label>
                        <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="html">
                            Giữ chỗ
                        </label>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
