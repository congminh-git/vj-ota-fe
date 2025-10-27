'use client';

// import Breadcrumb from '@/components/breadcrumb';
import ConsecutiveDays from '@/components/danh-sach-ve/cac_ngay_ke_tiep';
import Filter from '@/components/danh-sach-ve/bo_loc';
import ListFlightTravelOptions from '@/components/danh-sach-ve/danh_sach_chuyen_bay';
import SelectedFlight from '@/components/danh-sach-ve/chuyen_bay_duoc_chon';
import Steps from '@/components/danh-sach-ve/steps';
import HomePageSearchForm from '@/components/home-page/search_form';
import PriceInfomation from '@/components/thong-tin-hanh-khach/thong_tin_gia';
import ListPaymentMethod from '@/components/thanh-toan/listPaymentMethod';
import InternationalCardInfoForm from '@/components/thanh-toan/internationalCardInfo';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    getTravelOptionsUpdateJourney,
    getTravelOptionsAddJourney,
    formatTravelOptions,
} from '@/services/travelOptions/functions';
import {
    putQuotationReservationUpdateJourney,
    putQuotationReservationAddJourney,
} from '@/services/quotations/functions';
import {
    getReservationByKey,
    putUpdateReservationJourneyByKey,
    postReservationAddJourney,
} from '@/services/reservations/functions';
import { getCompany } from '@/services/companies/functions';
import { getCurrencySymbol } from '@/lib/parseCurrency';
import { setCookie, getCookie } from '@/lib/cookie';

export default function ListTravelOptions() {
    const router = useRouter();
    const pathname = usePathname();
    const today = useMemo(() => new Date(), []);
    const apiUrl = process.env.NEXT_PUBLIC_PUBLICAPI_URL;
    const cityPair = typeof window !== 'undefined' ? sessionStorage.getItem('cityPairSearchParamUpdate') : null;
    const departmentDate =
        typeof window !== 'undefined' ? sessionStorage.getItem('departmentDateSearchParamUpdate') : null;
    const returnDate = '2024-05-12';
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;
    const departureCity =
        typeof window !== 'undefined' ? sessionStorage.getItem('departureCitySearchParamUpdate') : null;
    const arrivalCity = typeof window !== 'undefined' ? sessionStorage.getItem('arrivalCitySearchParamUpdate') : null;
    const adult = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('adultSearchParamUpdate')) : null;
    const child = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('childSearchParamUpdate')) : null;
    const infant = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('infantSearchParamUpdate')) : null;
    const reservationKey =
        typeof window !== 'undefined' ? sessionStorage.getItem('reservationKeySearchParamUpdate') : null;
    const journeyKey = typeof window !== 'undefined' ? sessionStorage.getItem('journeyKeySearchParamUpdate') : null;
    const updateJourneysStatus = typeof window !== 'undefined' ? sessionStorage.getItem('updateJourneysStatus') : null;
    const [listFlightTraveloptions, setListFlightTravelOptions] = useState(null);
    const [ReservationByKey, setReservationByKey] = useState(null);
    const [activeSelectFlight, setActiveSelectFlight] = useState('đi');
    const [departureFlight, setDepartureFlight] = useState(null);
    const [returnFlight, setReturnFlight] = useState(null);
    const [fareOptions, setFareOptions] = useState(0);
    const [companyKey, setCompanyKey] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState({ identifier: null, description: null });
    const [quotations, setQuotations] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);
    const [roundTrip, setRoundTrip] = useState(false);
    const [typeSearchForm, setTypeSearchForm] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [handleResult, setHandleResult] = useState(false);
    const [journeyAdd, setJourneyAdd] = useState(null);
    const [fareOptionsDepartureFlight, setFareOptionsDepartureFlight] = useState(null);
    const [fareOptionsReturnFlight, setFareOptionsReturnFlight] = useState(null);
    // const listBreadcrumb = [
    //     { title: 'Tìm vé', uri: '/' },
    //     { title: 'Danh sách vé', uri: 'danh-sach-ve' },
    // ];
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
        return data;
    };

    const paymentConfirm = async () => {
        if (updateJourneysStatus == 'update') {
            let passengerJourneyDetails;
            ReservationByKey.journeys.forEach((element) => {
                if (element.key == journeyKey) {
                    passengerJourneyDetails = element.passengerJourneyDetails;
                }
            });
            passengerJourneyDetails.forEach((element) => {
                element.bookingKey = departureFlight.fareOptions[fareOptions].bookingCode.key;
            });
            let paymentTransactions = [];
            quotations.paymentTransactions.forEach((element) => {
                if (!element.receiptNumber) {
                    paymentTransactions.push(element);
                }
            });
            paymentTransactions.forEach((element) => {
                element.paymentMethodCriteria = {
                    account: {
                        company: {
                            key: companyKey,
                        },
                    },
                };
                if (!element.receiptNumber && paymentMethod.identifier != 'AG') {
                    element.billingInfo = billing;
                    element.cardInfo = cardInfo;
                    element.callbackURLs = {
                        successURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/success',
                        failureURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/failure',
                        cancelURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/cancel',
                        pendingURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/pending',
                        ipnURL: '',
                    };
                }
            });
            const body = {
                key: journeyKey,
                passengerJourneyDetails: passengerJourneyDetails,
                paymentTransactions: paymentTransactions,
            };

            const data = await handlePutUpdateReservationJourneyByKey(reservationKey, journeyKey, body);
            if (data?.data?.responseData?.transactionId) {
                setCookie('transactionID', JSON.stringify(data?.data?.responseData?.transactionId));
                setCookie('reservationKey', reservationKey, 1);
                router.push(data?.data?.responseData?.endpoint);
            } else {
                sessionStorage.setItem('managementLocator', ReservationByKey.locator);
                router.push('/quan-ly-dat-cho');
            }
        } else {
            const journeyAddStr = JSON.stringify(journeyAdd);
            const journeyAddWithPaymentTransaction = JSON.parse(journeyAddStr);
            let paymentTransactions = [];
            quotations.paymentTransactions.forEach((element) => {
                if (!element.receiptNumber) {
                    paymentTransactions.push(element);
                }
            });
            paymentTransactions.forEach((element) => {
                element.paymentMethodCriteria = {
                    account: {
                        company: {
                            key: companyKey,
                        },
                    },
                };
                if (!element.receiptNumber && paymentMethod.identifier != 'AG') {
                    element.billingInfo = billing;
                    element.cardInfo = cardInfo;
                    element.callbackURLs = {
                        successURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/success',
                        failureURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/failure',
                        cancelURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/cancel',
                        pendingURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/pending',
                        ipnURL: '',
                    };
                }
            });
            journeyAddWithPaymentTransaction.paymentTransactions = paymentTransactions;
            const data = await postReservationAddJourney(reservationKey, journeyAddWithPaymentTransaction);
            if (data?.data?.responseData?.transactionId) {
                setCookie('transactionID', JSON.stringify(data?.data?.responseData?.transactionId));
                setCookie('reservationKey', reservationKey, 1);
                router.push(data?.data?.responseData?.endpoint);
            } else {
                sessionStorage.setItem('managementLocator', ReservationByKey.locator);
                router.push('/quan-ly-dat-cho');
            }
        }
    };

    const handleGetCompany = async () => {
        const data = await getCompany();
        setCompanyKey(data.key);
    };

    const handlePutQuotationReservationUpdateJourney = async (reservationKey, journeyKey, body) => {
        const data = await putQuotationReservationUpdateJourney(reservationKey, journeyKey, body);
        setQuotations(data);
    };

    const handlePutQuotationReservationAddJourney = async (body) => {
        const data = await putQuotationReservationAddJourney(body);
        setQuotations(data);
    };

    const handleGetReservationByKey = async (reservationKey) => {
        const data = await getReservationByKey(reservationKey);
        setReservationByKey(data);
    };

    const [currencySymbol, setCurrencySymbol] = useState('');

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (handleResult) {
            sessionStorage.setItem('reservationKey', reservationKey);
            router.replace(`/quan-ly-dat-cho/chi-tiet-dat-cho?locator=${ReservationByKey.locator}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleResult]);

    useEffect(() => {
        if (reservationKey && companyKey) {
            const getTravelOptionsUpdate = async () => {
                const travelOptions = await getTravelOptionsUpdateJourney(
                    departmentDate,
                    cityPair,
                    reservationKey,
                    journeyKey,
                    companyKey,
                );
                setListFlightTravelOptions(formatTravelOptions(travelOptions));
            };
            const getTravelOptionsAdd = async () => {
                const travelOptions = await getTravelOptionsAddJourney(
                    departmentDate,
                    cityPair,
                    reservationKey,
                    companyKey,
                );
                setListFlightTravelOptions(formatTravelOptions(travelOptions));
            };
            setListFlightTravelOptions(null);
            handleGetReservationByKey(reservationKey);
            if (activeSelectFlight == 'đi') {
                setDepartureFlight(null);
            } else {
                setReturnFlight(null);
            }
            if (updateJourneysStatus == 'update') {
                getTravelOptionsUpdate();
            } else if (updateJourneysStatus == 'add') {
                getTravelOptionsAdd();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentDate, apiUrl, cityPair, reservationKey, journeyKey, companyKey]);

    useEffect(() => {
        if (pathname.includes('dat-ve')) {
            setTypeSearchForm('Đặt vé');
        } else if (pathname.includes('quan-ly-dat-cho')) {
            setTypeSearchForm('Quản lý đặt chỗ');
        }
        handleGetCompany();
    }, [pathname]);

    useEffect(() => {
        if (departureFlight && ReservationByKey.passengers) {
            const newJourney = {
                index: 1,
                passengerJourneyDetails: ReservationByKey.passengers.map((passenger) => {
                    return {
                        passenger: {
                            key: passenger.key,
                        },
                        bookingKey: departureFlight.fareOptions[fareOptions].bookingCode.key,
                        reservationStatus: {
                            confirmed: true,
                            waitlist: false,
                            standby: false,
                            cancelled: false,
                            open: false,
                            finalized: false,
                            external: false,
                        },
                    };
                }),
            };

            setJourneyAdd(newJourney);
        }
    }, [departureFlight, ReservationByKey, fareOptions]);

    useEffect(() => {
        if (updateJourneysStatus == 'update') {
            if (departureFlight) {
                const strReservationByKey = JSON.stringify(ReservationByKey);
                const body = JSON.parse(strReservationByKey);
                body.journeys.forEach((element) => {
                    if (element.key == journeyKey) {
                        element.passengerJourneyDetails[0].bookingKey =
                            departureFlight.fareOptions[fareOptions].bookingCode.key;
                    }
                });

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

                if (paymentMethod.identifier) {
                    body.paymentTransactions = [
                        {
                            paymentMethod: internationalPaymentMethod[methodIndex] || {
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
                        },
                    ];
                } else {
                    body.paymentTransactions = [
                        {
                            paymentMethod: internationalPaymentMethod[methodIndex] || {
                                key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                                identifier: 'AG',
                            },
                            currencyAmounts: [
                                {
                                    totalAmount: 0,
                                    currency: {
                                        code: 'VND',
                                        baseCurrency: true,
                                    },
                                    exchangeRate: 1,
                                },
                            ],
                            processingCurrencyAmounts: [
                                {
                                    totalAmount: 0,
                                    currency: {
                                        code: 'VND',
                                        baseCurrency: true,
                                    },
                                    exchangeRate: 1,
                                },
                            ],
                            payerDescription: null,
                            receiptNumber: null,
                            payments: null,
                            refundTransactions: null,
                            notes: null,
                        },
                    ];
                }
                handlePutQuotationReservationUpdateJourney(reservationKey, journeyKey, body);
            }
        } else {
            if (departureFlight) {
                const strReservationByKey = JSON.stringify(ReservationByKey);
                const body = JSON.parse(strReservationByKey);
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
                if (paymentMethod.identifier) {
                    body.journeys.push(journeyAdd);
                    body.paymentTransactions = [
                        {
                            paymentMethod: internationalPaymentMethod[methodIndex] || {
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
                        },
                    ];
                } else {
                    const newJourney = {
                        index: 1,
                        passengerJourneyDetails: ReservationByKey.passengers.map((passenger) => {
                            return {
                                passenger: {
                                    key: passenger.key,
                                },
                                bookingKey: departureFlight.fareOptions[fareOptions].bookingCode.key,
                                reservationStatus: {
                                    confirmed: true,
                                    waitlist: false,
                                    standby: false,
                                    cancelled: false,
                                    open: false,
                                    finalized: false,
                                    external: false,
                                },
                            };
                        }),
                    };
                    body.journeys.push(newJourney);
                    body.paymentTransactions = [
                        {
                            paymentMethod: internationalPaymentMethod[methodIndex] || {
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
                        },
                    ];
                }
                handlePutQuotationReservationAddJourney(body);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departureFlight, journeyKey, reservationKey, ReservationByKey, fareOptions, paymentMethod, companyKey]);

    useEffect(() => {
        let totalPrice = 0;
        if (quotations) {
            quotations.paymentTransactions.forEach((element) => {
                if (!element.receiptNumber) {
                    totalPrice += element.currencyAmounts[0].totalAmount;
                }
            });
        }
        setTotalPrice(totalPrice);
    }, [quotations]);

    useEffect(() => {
        if (listFlightTraveloptions) {
            setLoadingStatus(false);
        }
    }, [listFlightTraveloptions]);

    return (
        <>
            {reservationKey ? (
                <main className="relative">
                    <Steps />
                    <div className="flex flex-wrap justify-center p-4 min-h-screen bg-gray-100 border shadow">
                        <div className={` w-full max-w-[1200px]`}>
                            {/* <Breadcrumb listBreadcrumb={listBreadcrumb} /> */}
                            {/* <HomePageSearchForm
                            typeSearchForm={typeSearchForm}
                            loadingStatus={loadingStatus}
                            setLoadingStatus={setLoadingStatus}
                        /> */}
                            <div>
                                <div className="grid grid-cols-2 gap-4 mt-4 ">
                                    <div className={`${roundTrip ? 'col-span-1' : 'col-span-2'}`}>
                                        <SelectedFlight
                                            direction={'đi'}
                                            departureAirport={`${departureCity?.replaceAll('_', ' ')} (${
                                                cityPair?.split('-')[0]
                                            })`}
                                            arrivalAirport={`${arrivalCity?.replaceAll('_', ' ')} (${
                                                cityPair?.split('-')[1]
                                            })`}
                                            flyingDay={departmentDate}
                                            numberOfPassenger={adult + child + infant}
                                            selectedFlight={departureFlight}
                                            activeSelectFlight={activeSelectFlight}
                                            setActiveSelectFlight={setActiveSelectFlight}
                                        />
                                    </div>
                                    {roundTrip ? (
                                        <div className="col-span-1">
                                            <SelectedFlight
                                                direction={'về'}
                                                departureAirport={`${arrivalCity?.replace('_', ' ')} ${
                                                    cityPair?.split('-')[1]
                                                }`}
                                                arrivalAirport={`${departureCity?.replace('_', ' ')} ${
                                                    cityPair?.split('-')[0]
                                                }`}
                                                flyingDay={returnDate}
                                                numberOfPassenger={adult + child + infant}
                                                selectedFlight={returnFlight}
                                                activeSelectFlight={activeSelectFlight}
                                                setActiveSelectFlight={setActiveSelectFlight}
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    {departureFlight ? (
                                        <div className="col-span-2 p-4 rounded bg-white">
                                            <div className="py-2 border-t border-b">
                                                <p>Phương thức thanh toán: </p>
                                                <ListPaymentMethod
                                                    setPaymentMethod={setPaymentMethod}
                                                    listPaymentMethod={['AG', 'VJPVI', 'VJPMC', 'VJPAMEX', 'VJPJCB']}
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
                                            </div>
                                            {totalPrice || totalPrice == 0 ? (
                                                <div className="pt-2">
                                                    <p className="font-semibold text-gray-800">
                                                        Tổng giá (<i className="text-sm text-gray-600">Bao gồm dư nợ</i>{' '}
                                                        ): {totalPrice.toLocaleString()} {currencySymbol}
                                                    </p>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    {/* {roundTrip && departureFlight && returnFlight ? (
                                    <button
                                        onClick={paymentConfirm}
                                        className="col-span-2 py-3 font-bold flex justify-center items-center rounded-md text-white bg-blue-500 border-2 border-blue-500 hover:bg-white hover:text-blue-500"
                                    >
                                        Xác nhận
                                    </button>
                                ) : (
                                    <></>
                                )} */}
                                    {!roundTrip &&
                                    departureFlight &&
                                    quotations &&
                                    (paymentMethod.identifier === 'AG' ||
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
                                            cardInfo.cardNumber)) ? (
                                        <button
                                            onClick={paymentConfirm}
                                            className="col-span-2 py-3 font-bold flex justify-center items-center rounded-md text-white bg-blue-500 border-2 border-blue-500 hover:bg-white hover:text-blue-500"
                                        >
                                            Xác nhận
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="grid grid-cols-7 gap-4 mt-4">
                                    <div className={`${updateJourneysStatus == 'add' ? 'col-span-5' : 'col-span-7'}`}>
                                        <ConsecutiveDays
                                            flyingDay={activeSelectFlight == 'đi' ? departmentDate : returnDate}
                                            activeSelectFlight={activeSelectFlight}
                                            departmentDate={departmentDate}
                                            returnDate={returnDate}
                                            roundTrip={roundTrip}
                                        />
                                        {listFlightTraveloptions && listFlightTraveloptions.length > 0 ? (
                                            <ListFlightTravelOptions
                                                listFlightTraveloptions={listFlightTraveloptions}
                                                adult={adult}
                                                child={child}
                                                infant={infant}
                                                setSelectedFlight={
                                                    activeSelectFlight == 'đi' ? setDepartureFlight : setReturnFlight
                                                }
                                                selectedFlight={
                                                    activeSelectFlight == 'đi' ? departureFlight : returnFlight
                                                }
                                                setFareOptionFlight={
                                                    activeSelectFlight == 'đi'
                                                        ? setFareOptionsDepartureFlight
                                                        : setFareOptionsReturnFlight
                                                }
                                            />
                                        ) : (
                                            <div className="mt-20 flex justify-center">
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
                                    </div>
                                    {updateJourneysStatus == 'add' ? (
                                        <div className="col-span-2">
                                            <PriceInfomation
                                                adult={adult}
                                                child={child}
                                                infant={infant}
                                                cityPair={cityPair}
                                                departureCity={departureCity}
                                                arrivalCity={arrivalCity}
                                                fareOptionsDepartureFlight={fareOptionsDepartureFlight}
                                                fareOptionsReturnFlight={fareOptionsReturnFlight}
                                                departureFlight={departureFlight}
                                                returnFlight={returnFlight}
                                                roundTrip={roundTrip}
                                            />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            ) : (
                <div className="min-h-screen">
                    <span>Loading...</span>
                </div>
            )}
        </>
    );
}
