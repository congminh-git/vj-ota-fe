'use client';

import Breadcrumb from '@/components/breadcrumb';
import UpdatePassengerInfomationPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_cap_nhat_thong_tin_hanh_khach';
import UpdateBookingInfomationPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_cap_nhat_thong_tin_lien_he';
import AddPassengerPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_them_hanh_khach';
import SearchFlightPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_tim_chuyen_form';
import SplitPassengersPopup from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/popup/popup_tach_hanh_khach';
import FlightInfomation from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/thong_tin_chuyen_bay';
import PassengerInfomation from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/thong_tin_hanh_khach';
import ContactInfomation from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/thong_tin_lien_he';
import ReservationInformation from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/thong_tin_ve';
import InternationalCardInfoForm from '@/components/thanh-toan/internationalCardInfo';
import { generateUUID } from '@/lib/uuid';
import { getCurrentTimestamp } from '@/lib/dateTime';
import { setCookie, getCookie } from '@/lib/cookie';

import {
    getReservationByLocator,
    getReservationByKey,
    postReservationPaymentTransaction,
    postReservationPaymentTransactionByInternationalCard,
    postEmailingItineraries,
} from '@/services/reservations/functions';
import { putQuotationPaymentTransaction } from '@/services/quotations/functions';
import { getReservationByLocatorForSearch } from '@/services/reservations/functions';
import { getAncillaryOptionsReturn } from '@/services/ancillaryOptions/functions';
import { getSeatSelectionOptionsReturn } from '@/services/seatSelection/functions';
import { getCompany } from '@/services/companies/functions';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SelectMealForm from '../../components/quan-ly-dat-cho/chi-tiet-dat-cho/form_chon_suat_an';
import SelectBaggageForm from '../../components/quan-ly-dat-cho/chi-tiet-dat-cho/form_chon_hanh_ly';
import SelectSeatForm from '../../components/quan-ly-dat-cho/chi-tiet-dat-cho/form_chon_cho_ngoi';
import { toast } from 'react-hot-toast';
import { getCurrencySymbol } from '@/lib/parseCurrency';
import ListPaymentMethod from '@/components/thanh-toan/listPaymentMethod';

export default function BookingManagement() {
    const router = useRouter();
    const today = useMemo(() => new Date(), []);
    const [managementLocator, setManagementLocator] = useState(null);
    const [currency, setCurrency] = useState('VND');
    const [exchangeRate, setExchangeRate] = useState(1);

    // State management
    const [body, setBody] = useState(null);
    const [locator, setLocator] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [addServiceTab, setAddServiceTab] = useState('');
    const [reservationByLocator, setReservationByLocator] = useState(null);
    const [reservationByKey, setReservationByKey] = useState(null);
    const [quotations, setQuotations] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [debt, setDebt] = useState(0);
    const [companyKey, setCompanyKey] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState({ identifier: null, description: null });
    const [passengerSelect, setPassengerSelect] = useState(null);
    const [searchFlightPopup, setSearchFlightPopup] = useState(false);
    const [changePassengerInfoPopup, setChangePassengerInfoPopup] = useState(false);
    const [addPassengerInfoPopup, setAddPassengerInfoPopup] = useState(false);
    const [updateBookingInfomationPopup, setUpdateBookingInfomationPopup] = useState(false);
    const [openSplitPassengersPopup, setOpenSplitPassengersPopup] = useState(false);
    const [journeyUpdate, setJourneyUpdate] = useState(null);
    const [reservationKey, setReservationKey] = useState();
    const [listAllJourneySeatOptions, setListAllJourneySeatOptions] = useState(null);
    const [listAllJourneyBaggageOptions, setListAllJourneyBaggageOptions] = useState(null);
    const [listAllJourneyMealOptions, setListAllJourneyMealOptions] = useState(null);
    const [sendEmailResult, setSendEmailResult] = useState(null);
    const [listPrice, setListPrice] = useState([]);
    const [listCharge, setListCharge] = useState([]);
    const [notCancelJourneys, setnotCancelJourneys] = useState(null);
    const [refetch, setRefetch] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('');

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

    // Refs để tránh re-render không cần thiết
    const hasInitializedRef = useRef(false);
    const hasFetchedSeatOptionsRef = useRef(false);
    const hasFetchedAncillaryOptionsRef = useRef(false);

    // Load sessionStorage values on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setManagementLocator(sessionStorage.getItem('managementLocator'));
            setCurrency(sessionStorage.getItem('currencySearchParam') ?? 'VND');
            setExchangeRate(parseInt(sessionStorage.getItem('exchangeRate')) ?? 1);
        }
    }, []);

    // Memoized values
    const listBreadcrumb = useMemo(
        () => [
            { title: 'Quản lý booking', uri: 'quan-ly-dat-cho' },
            { title: 'Quản lý đặt chỗ', uri: 'quan-ly-dat-cho' },
        ],
        [],
    );

    // Memoized callbacks
    const handleGetCompany = useCallback(async () => {
        if (!companyKey) {
            const data = await getCompany();
            setCompanyKey(data.key);
        }
    }, [companyKey]);

    const handlePutQuotationPaymentTransaction = useCallback(
        async (reservationKey, reservationByKey, companyKey, currency, exchangeRate, paymentMethod) => {
            if (reservationKey && reservationByKey && companyKey) {
                const data = await putQuotationPaymentTransaction(
                    reservationKey,
                    reservationByKey,
                    companyKey,
                    currency,
                    exchangeRate,
                    paymentMethod
                );
                setQuotations(data);
            }
        },
        [],
    );

    const handleGetReservationByKey = useCallback(async (reservationKey) => {
        if (reservationKey) {
            const data = await getReservationByKey(reservationKey);
            setReservationByKey(data);
        }
    }, []);

    const handleGetReservationByLocator = useCallback(async (locator) => {
        if (locator) {
            const data = await getReservationByLocator(locator);
            setReservationByLocator(data);
        }
    }, []);

    const handleFind = useCallback(async (locator) => {
        if (locator) {
            const data = await getReservationByLocatorForSearch(locator);
            setReservationKey(data[0].key);
        }
    }, []);

    const sendItineraryEmail = useCallback(() => {
        if (reservationByKey?.key && reservationByKey?.bookingInformation?.contactInformation?.email) {
            setSendEmailResult(null);
            postEmailingItineraries(
                reservationByKey.key,
                reservationByKey.bookingInformation.contactInformation.email,
                setSendEmailResult,
                false,
            );
        }
    }, [reservationByKey]);

    // Memoized utility functions
    const getCurrentDateTimeString = useCallback(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handlePayAG = useCallback(async () => {
        if (paymentMethod && reservationByKey && companyKey && quotations) {
            await postReservationPaymentTransaction(reservationByKey, companyKey, quotations, currency, exchangeRate);
        } else {
            toast.error('Vui lòng chọn phương thức thanh toán');
        }
    }, [paymentMethod, reservationByKey, companyKey, quotations, currency, exchangeRate]);

    const onPaymentByCard = useCallback(async () => {
        const data = await postReservationPaymentTransactionByInternationalCard(
            reservationByKey,
            companyKey,
            quotations,
            currency,
            exchangeRate,
            billing,
            cardInfo,
            paymentMethod,
        );
        setCookie('transactionID', JSON.stringify(data?.data?.responseData?.transactionId));
        router.push(data?.data?.responseData?.endpoint);
    }, [billing, cardInfo, reservationByKey, quotations, paymentMethod, companyKey, currency, exchangeRate]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handlePay = useCallback(() => {
        if (paymentMethod.identifier === 'AG') {
            handlePayAG();
        } else if (
            paymentMethod.identifier === 'VJPVI' ||
            paymentMethod.identifier === 'VJPMC' ||
            paymentMethod.identifier === 'VJPAMEX' ||
            paymentMethod.identifier === 'VJPJCB'
        ) {
            onPaymentByCard();
        }
    }, [paymentMethod.identifier, handlePayAG, onPaymentByCard]);

    // Optimized useEffect hooks
    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (managementLocator && managementLocator !== 'null' && !hasInitializedRef.current) {
            hasInitializedRef.current = true;
            handleFind(managementLocator);
            if (typeof window !== 'undefined') {
                const searchInput = document.querySelector('.search-locator-input');
                if (searchInput) {
                    searchInput.value = managementLocator;
                }
            }
        }
    }, [managementLocator, handleFind]);

    useEffect(() => {
        if (!hasInitializedRef.current) {
            handleGetCompany();
        }
        if (reservationKey) {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('managementLocator', locator);
            }
            handleGetReservationByKey(reservationKey);
        }
    }, [reservationKey, locator, handleGetCompany, handleGetReservationByKey]);

    useEffect(() => {
        if (refetch && typeof window !== 'undefined') {
            location.reload();
        }
    }, [refetch]);

    useEffect(() => {
        setBody(reservationByKey);
    }, [reservationByKey]);

    // Optimized useEffect for fetching seat and ancillary options
    useEffect(() => {
        if (body && !hasFetchedSeatOptionsRef.current) {
            const fetchSeatOptions = async () => {
                const getSeatOptions = async (bookingKey) => {
                    const seatOptions = await getSeatSelectionOptionsReturn(bookingKey);
                    return seatOptions;
                };

                const getAncilarryOptions = async (bookingKey) => {
                    const ancillaryOptions = await getAncillaryOptionsReturn(bookingKey);
                    return ancillaryOptions;
                };

                if (!listAllJourneySeatOptions && body) {
                    const tempListPromises = body.journeys.map((element) =>
                        getSeatOptions(element.passengerJourneyDetails[0].bookingKey),
                    );
                    const tempList = await Promise.all(tempListPromises);
                    setListAllJourneySeatOptions(tempList);
                    hasFetchedSeatOptionsRef.current = true;
                }

                if (
                    !listAllJourneyBaggageOptions &&
                    !listAllJourneyMealOptions &&
                    body &&
                    !hasFetchedAncillaryOptionsRef.current
                ) {
                    const tempListPromises = body.journeys.map((element) =>
                        getAncilarryOptions(element.passengerJourneyDetails[0].bookingKey),
                    );
                    const tempList = await Promise.all(tempListPromises);
                    let listBaggage = tempList.map((item) => {
                        if (item) {
                            return item[0];
                        }
                    });
                    let listMeal = tempList.map((item) => {
                        if (item) {
                            return item[1];
                        }
                    });
                    setListAllJourneyBaggageOptions(listBaggage);
                    setListAllJourneyMealOptions(listMeal);
                    hasFetchedAncillaryOptionsRef.current = true;
                }
            };

            fetchSeatOptions();
        }
    }, [body, listAllJourneySeatOptions, listAllJourneyBaggageOptions, listAllJourneyMealOptions]);

    // Memoized calculations for quotations
    useEffect(() => {
        if (quotations) {
            const { tempTotal, tempPaid, tempDebt } = quotations.paymentTransactions.reduce(
                (acc, element) => {
                    const amount = element.currencyAmounts[0].totalAmount;
                    acc.tempTotal += amount;
                    if (element.receiptNumber) {
                        acc.tempPaid += amount;
                    } else {
                        acc.tempDebt += amount;
                    }
                    return acc;
                },
                { tempTotal: 0, tempPaid: 0, tempDebt: 0 },
            );

            setTotalPrice(tempTotal);
            setAmountPaid(tempPaid);
            setDebt(tempDebt);
        }
    }, [quotations]);

    useEffect(() => {
        if (reservationByKey && companyKey && reservationKey) {
            handlePutQuotationPaymentTransaction(reservationKey, reservationByKey, companyKey, currency, exchangeRate);
            handleGetReservationByLocator(reservationByKey.locator);
        }
    }, [
        reservationByKey,
        companyKey,
        reservationKey,
        currency,
        exchangeRate,
        handlePutQuotationPaymentTransaction,
        handleGetReservationByLocator,
    ]);

    // Memoized calculations for reservation data
    useEffect(() => {
        if (reservationByKey) {
            const tempListPrice = [];
            const tempListCharge = [];

            reservationByKey.journeys.forEach((journey) => {
                if (!journey.reservationStatus.cancelled) {
                    let price = 0;
                    let list = [];
                    reservationByKey.charges.forEach((charge) => {
                        if (charge.journey.key === journey.key) {
                            price += charge.currencyAmounts[0].totalAmount;
                            list.push(charge);
                        }
                    });
                    tempListPrice.push(price);
                    tempListCharge.push(list);
                }
            });

            setListPrice(tempListPrice);
            setListCharge(tempListCharge);
            setnotCancelJourneys(reservationByKey.journeys.filter((journey) => !journey.reservationStatus.cancelled));
        }
    }, [reservationByKey]);

    // Memoized handlers for better performance
    const handleLocatorChange = useCallback((e) => {
        setLocator(e.target.value);
    }, []);

    const handleTabClick = useCallback((tabIndex) => {
        setActiveTab(tabIndex);
        if (tabIndex === 1) {
            setAddServiceTab('');
        }
    }, []);

    const handleSearchClick = useCallback(() => {
        handleFind(locator);
    }, [locator, handleFind]);

    // Memoized JSX elements
    const searchSection = useMemo(
        () => (
            <div className="p-4">
                <label htmlFor="" className="text-xl text-gray-700 font-bold">
                    Tìm kiếm mã đặt chỗ
                </label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-fit border px-2 py-1 rounded relative">
                            <input
                                onInput={handleLocatorChange}
                                placeholder="VD: PLGH7D"
                                className="w-full outline-none search-locator-input"
                                type="text"
                            />
                        </div>
                        <button
                            className="h-full px-4 bg-blue-500 hover:bg-blue-400 text-lg font-bold rounded text-white"
                            onClick={handleSearchClick}
                        >
                            Tìm kiếm mã đặt chỗ
                        </button>
                    </div>
                </div>
            </div>
        ),
        [handleLocatorChange, handleSearchClick],
    );

    const tabSection = useMemo(
        () =>
            reservationKey ? (
                <div className="px-4">
                    <button
                        onClick={() => handleTabClick(0)}
                        className={`px-4 py-2 border-b-4 hover:border-yellow-300 ${
                            activeTab === 0 ? 'border-yellow-400' : 'border-transparent'
                        }`}
                    >
                        Thông tin booking
                    </button>
                    <button
                        onClick={() => handleTabClick(1)}
                        className={`px-4 py-2 border-b-4 hover:border-yellow-300 ${
                            activeTab === 1 ? 'border-yellow-400' : 'border-transparent'
                        }`}
                    >
                        Quản lý booking
                    </button>
                </div>
            ) : null,
        [reservationKey, activeTab, handleTabClick],
    );

    return (
        <main className="relative min-h-screen bg-gray-100 p-4 mt-20 sm:mt-0">
            <Breadcrumb listBreadcrumb={listBreadcrumb} />
            <div className="bg-white rounded">
                {searchSection}
                {tabSection}
            </div>
            <div className="mt-4">
                {reservationByKey && activeTab === 0 ? (
                    <div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <ReservationInformation
                                reservation={reservationByKey}
                                reservationByLocator={reservationByLocator}
                                debt={debt}
                            />
                            <ContactInfomation
                                reservation={reservationByKey}
                                setUpdateBookingInfomationPopup={setUpdateBookingInfomationPopup}
                            />
                            <div className="col-span-2">
                                <PassengerInfomation
                                    setChangePassengerInfoPopup={setChangePassengerInfoPopup}
                                    reservation={reservationByKey}
                                    setPassengerSelect={setPassengerSelect}
                                />
                            </div>
                            <div
                                className={`col-span-2 grid ${
                                    reservationByKey.journeys[1] ? 'grid-cols-2' : 'grid-cols-1'
                                } gap-4`}
                            >
                                {notCancelJourneys?.map((element, index) => (
                                    <div key={`journey-${element.key || index}`} className="col-span-2">
                                        <FlightInfomation
                                            legNumber={index}
                                            setSearchFlightPopup={setSearchFlightPopup}
                                            reservation={reservationByKey}
                                            journeyInfo={element}
                                            setJourneyUpdate={setJourneyUpdate}
                                            price={listPrice[index]}
                                            listCharge={listCharge[index]}
                                            reservationByKey={reservationByKey}
                                            companyKey={companyKey}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="col-span-2 font-medium">
                                <div className="border p-4 rounded-lg text-start h-full bg-white">
                                    <div className=" flex justify-between items-center">
                                        <div>
                                            <p>
                                                Tổng giá{' '}
                                                <i className="text-sm text-gray-400 ml-2">
                                                    (Đã bao gồm thuế, VAT và các chi phí khác)
                                                </i>
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <i>{totalPrice.toLocaleString()}</i> {currencySymbol}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-1 flex justify-between items-center">
                                        <div>
                                            <p>Đã thanh toán</p>
                                        </div>
                                        <div>
                                            <p>
                                                <i>{amountPaid.toLocaleString()}</i> {currencySymbol}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-1 flex justify-between items-center">
                                        <div>
                                            <p>Dư nợ</p>
                                        </div>
                                        <div>
                                            <p>
                                                <i>{debt.toLocaleString()}</i> {currencySymbol}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {debt === 0 ? null : (
                                <div className="col-span-2 bg-white rounded-md border p-2">
                                    <h3 className="font-bold text-lg mb-4 mt-2 ml-2">Chọn phương thức thanh toán</h3>

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
                                    <div>
                                        <button
                                            disabled={
                                                !paymentMethod.identifier === 'AG' &&
                                                !(
                                                    (paymentMethod.identifier === 'VJPVI' ||
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
                                                    cardInfo.cardNumber
                                                )
                                                    ? true
                                                    : false
                                            }
                                            className={`${
                                                ((reservationByKey?.bookingInformation.hold &&
                                                    new Date(reservationByKey?.bookingInformation.hold.expiryTime) >
                                                        today) ||
                                                    !reservationByKey?.bookingInformation.hold) &&
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
                                                        cardInfo.cardNumber))
                                                    ? ' border-blue-400 text-white bg-blue-400 hover:text-blue-400 hover:bg-white'
                                                    : ' border-gray-400 text-white bg-gray-400'
                                            } border-2 py-2 justify-center flex items-center font-semibold w-full rounded-md mt-4`}
                                            onClick={() => {
                                                handlePay();
                                            }}
                                        >
                                            {reservationByKey?.bookingInformation.hold &&
                                            new Date(reservationByKey?.bookingInformation.hold.expiryTime) < today
                                                ? 'Đã hết hạn giữ chỗ'
                                                : 'Thanh toán'}
                                        </button>
                                        <div id="galaxy-pay-sdk"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : reservationByKey && activeTab === 1 ? (
                    <div className="flex items-start">
                        <div className="flex-grow bg-white p-4 rounded">
                            {addServiceTab == '' ? (
                                <div className="">
                                    <div className="mb-4">
                                        <ReservationInformation
                                            reservation={reservationByKey}
                                            reservationByLocator={reservationByLocator}
                                            debt={debt}
                                        />
                                    </div>
                                    <div>
                                        <ContactInfomation
                                            reservation={reservationByKey}
                                            setUpdateBookingInfomationPopup={setUpdateBookingInfomationPopup}
                                        />
                                    </div>
                                </div>
                            ) : addServiceTab == 'Mua chỗ ngồi' ? (
                                <SelectSeatForm
                                    body={body}
                                    setRefetch={setRefetch}
                                    refetch={refetch}
                                    companyKey={companyKey}
                                    listAllJourneySeatOptions={listAllJourneySeatOptions}
                                    currency={currency}
                                    exchangeRate={exchangeRate}
                                />
                            ) : addServiceTab == 'Mua hành lý' ? (
                                <SelectBaggageForm
                                    body={body}
                                    setRefetch={setRefetch}
                                    refetch={refetch}
                                    companyKey={companyKey}
                                    listAllJourneyBaggageOptions={listAllJourneyBaggageOptions}
                                    currency={currency}
                                    exchangeRate={exchangeRate}
                                />
                            ) : (
                                <SelectMealForm
                                    body={body}
                                    setRefetch={setRefetch}
                                    refetch={refetch}
                                    companyKey={companyKey}
                                    listAllJourneyMealOptions={listAllJourneyMealOptions}
                                    currency={currency}
                                    exchangeRate={exchangeRate}
                                />
                            )}
                        </div>
                        <div className="bg-white w-[320px] ml-4 p-4 pt-0 rounded">
                            <button
                                onClick={() => setAddServiceTab('Mua chỗ ngồi')}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                            >
                                Mua chỗ ngồi
                            </button>
                            <button
                                onClick={() => setAddServiceTab('Mua hành lý')}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                            >
                                Mua hành lý
                            </button>
                            <button
                                onClick={() => setAddServiceTab('Mua suất ăn')}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                            >
                                Mua suất ăn
                            </button>
                            <button
                                onClick={() => setSearchFlightPopup('add')}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                            >
                                Thêm chặng bay
                            </button>
                            {reservationByKey.passengers.length > 1 && (
                                <button
                                    onClick={() => setOpenSplitPassengersPopup(true)}
                                    className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                                >
                                    Tách hành khách
                                </button>
                            )}
                            <button
                                onClick={sendItineraryEmail}
                                className="py-2 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-full mt-4"
                            >
                                Gửi mail hành trình
                            </button>
                        </div>
                    </div>
                ) : null}
                <SearchFlightPopup
                    searchFlightPopup={searchFlightPopup}
                    setSearchFlightPopup={setSearchFlightPopup}
                    journeyUpdate={journeyUpdate}
                    reservationByKey={reservationByKey}
                />
                <UpdatePassengerInfomationPopup
                    changePassengerInfoPopup={changePassengerInfoPopup}
                    setChangePassengerInfoPopup={setChangePassengerInfoPopup}
                    reservationKey={reservationKey}
                    reservationByKey={reservationByKey}
                    companyKey={companyKey}
                    passengerSelect={passengerSelect}
                    setPassengerSelect={setPassengerSelect}
                />
                <AddPassengerPopup
                    addPassengerInfoPopup={addPassengerInfoPopup}
                    setAddPassengerInfoPopup={setAddPassengerInfoPopup}
                    reservationKey={reservationKey}
                    reservationByKey={reservationByKey}
                    companyKey={companyKey}
                    currency={currency}
                    exchangeRate={exchangeRate}
                />
                <UpdateBookingInfomationPopup
                    updateBookingInfomationPopup={updateBookingInfomationPopup}
                    setUpdateBookingInfomationPopup={setUpdateBookingInfomationPopup}
                    reservationKey={reservationKey}
                    reservationByKey={reservationByKey}
                    companyKey={companyKey}
                />
                <SplitPassengersPopup
                    openSplitPassengersPopup={openSplitPassengersPopup}
                    setOpenSplitPassengersPopup={setOpenSplitPassengersPopup}
                    reservationByKey={reservationByKey}
                />
            </div>
        </main>
    );
}
