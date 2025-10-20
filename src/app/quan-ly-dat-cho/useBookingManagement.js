import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    getReservationByLocator,
    getReservationByKey,
    postReservationPaymentTransaction,
    postEmailingItineraries,
    getReservationByLocatorForSearch,
} from '@/services/reservations/functions';
import { putQuotationPaymentTransaction } from '@/services/quotations/functions';
import { getAncillaryOptionsReturn } from '@/services/ancillaryOptions/functions';
import { getSeatSelectionOptionsReturn } from '@/services/seatSelection/functions';
import { getCompany } from '@/services/companies/functions';
import { getCurrencySymbol } from '@/lib/parseCurrency';
import { postGpayPay } from '@/services/gpay/functions';
import { toast } from 'react-hot-toast';

export function useBookingManagement() {
    const router = useRouter();
    const [checkedAuth, setCheckedAuth] = useState(false);
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
    const [paymentMethodGpay, setPaymentMethodGpay] = useState({
        paymentMethod: null,
        sourceOfFund: null,
        sourceType: null,
    });
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
    const [body, setBody] = useState(null);
    const [refetch, setRefetch] = useState(0);
    const [sendEmailResult, setSendEmailResult] = useState(null);
    const [listPrice, setListPrice] = useState([]);
    const [listCharge, setListCharge] = useState([]);
    const [notCancelJourneys, setnotCancelJourneys] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState('');

    const listBreadcrumb = useMemo(() => [
        { title: 'Quản lý booking', uri: 'quan-ly-dat-cho' },
        { title: 'Quản lý đặt chỗ', uri: 'quan-ly-dat-cho' },
    ], []);

    const [currency, setCurrency] = useState('VND');
    const [exchangeRate, setExchangeRate] = useState(1);
    const [managementLocator, setManagementLocator] = useState(null);

    // Load sessionStorage values on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrency(sessionStorage.getItem('currencySearchParam') ?? 'VND');
            setExchangeRate(parseInt(sessionStorage.getItem('exchangeRate')) ?? 1);
            setManagementLocator(sessionStorage.getItem('managementLocator'));
        }
    }, []);

    useEffect(() => {
        const getCookie = (name) => {
            if (typeof document === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };
        const token = getCookie('token');
        const refreshToken = getCookie('refreshToken');
        const apikey = getCookie('apikey');
        if (!token && (!refreshToken || !apikey)) {
            router.replace('/login');
        }
        setCheckedAuth(true);
    }, [router]);

    const handleGetCompany = useCallback(async () => {
        const data = await getCompany();
        setCompanyKey(data.key);
    }, []);

    const handlePutQuotationPaymentTransaction = useCallback(async (
        reservationKey,
        reservationByKey,
        companyKey,
        currency,
        exchangeRate,
    ) => {
        const data = await putQuotationPaymentTransaction(
            reservationKey,
            reservationByKey,
            companyKey,
            currency,
            exchangeRate,
        );
        setQuotations(data);
    }, []);

    const handleGetReservationByKey = useCallback(async (reservationKey) => {
        const data = await getReservationByKey(reservationKey)
        setReservationByKey(data)
    }, []);

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (managementLocator && managementLocator !== 'null') {
            handleFind(managementLocator);
            if (typeof document !== 'undefined') {
                const input = document.querySelector('.search-locator-input');
                if (input) input.value = managementLocator;
            }
        }
    }, [managementLocator, handleFind]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        handleGetCompany();
        if (reservationKey) handleGetReservationByKey(reservationKey);
    }, [reservationKey, handleGetCompany, handleGetReservationByKey]);

    useEffect(() => {
        if (refetch) {
            // Không reload trang, chỉ refetch lại data
            if (reservationKey) handleGetReservationByKey(reservationKey);
        }
    }, [refetch, reservationKey, handleGetReservationByKey]);

    useEffect(() => {
        setBody(reservationByKey);
    }, [reservationByKey]);

    useEffect(() => {
        if (reservationKey && typeof window !== 'undefined') {
            sessionStorage.setItem('managementLocator', locator);
        }
    }, [reservationKey, locator]);

    useEffect(() => {
        if (body) {
            const getSeatOptions = async (bookingKey) => {
                const seatOptions = await getSeatSelectionOptionsReturn(bookingKey);
                return seatOptions;
            };
            const getAncilarryOptions = async (bookingKey) => {
                const ancillaryOptions = await getAncillaryOptionsReturn(bookingKey);
                return ancillaryOptions;
            };
            const fetchSeatOptions = async (body) => {
                if (!listAllJourneySeatOptions && body) {
                    const tempListPromises = body.journeys.map((element) =>
                        getSeatOptions(element.passengerJourneyDetails[0].bookingKey),
                    );
                    const tempList = await Promise.all(tempListPromises);
                    setListAllJourneySeatOptions(tempList);
                }
                if (!listAllJourneyBaggageOptions && !listAllJourneyMealOptions && body) {
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
                }
            };
            if (!listAllJourneySeatOptions) {
                fetchSeatOptions(body);
            }
        }
    }, [body, listAllJourneySeatOptions, listAllJourneyBaggageOptions, listAllJourneyMealOptions]);

    useEffect(() => {
        if (quotations) {
            let tempTotal = 0;
            let tempPaid = 0;
            let tempDebt = 0;
            quotations?.paymentTransactions.forEach((element) => {
                tempTotal += element.currencyAmounts[0].totalAmount;
                if (element.receiptNumber) {
                    tempPaid += element.currencyAmounts[0].totalAmount;
                } else {
                    tempDebt += element.currencyAmounts[0].totalAmount;
                }
            });
            setTotalPrice(tempTotal);
            setAmountPaid(tempPaid);
            setDebt(tempDebt);
        }
    }, [quotations]);

    useEffect(() => {
        if (reservationByKey) {
            handlePutQuotationPaymentTransaction(reservationKey, reservationByKey, companyKey, currency, exchangeRate);
            handleGetReservationByLocator(reservationByKey.locator);
        }
    }, [reservationByKey, companyKey, reservationKey, currency, exchangeRate, handlePutQuotationPaymentTransaction, handleGetReservationByLocator]);

    useEffect(() => {
        if (reservationByKey) {
            let tempListPrice = [];
            let tempListCharge = [];
            reservationByKey?.journeys.forEach((journey) => {
                if (!journey.reservationStatus.cancelled) {
                    let price = 0;
                    let list = [];
                    reservationByKey?.charges.map((charge) => {
                        if (charge.journey.key == journey.key) {
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

    const handleGetReservationByLocator = useCallback(async (locator) => {
        const data = await getReservationByLocator(locator)
        setReservationByLocator(data)
    }, []);

    const handleFind = useCallback(async (locator) => {
        if (locator) {
            const data = await getReservationByLocatorForSearch(locator);
            setReservationKey(data)
        }
    }, []);

    const sendItineraryEmail = useCallback(() => {
        setSendEmailResult(null);
        postEmailingItineraries(
            reservationByKey.key,
            reservationByKey.bookingInformation.contactInformation.email,
            setSendEmailResult,
            false,
        );
    }, [reservationByKey]);

    const handlePayAG = useCallback(() => {
        if (paymentMethod) {
            postReservationPaymentTransaction(
                reservationByKey,
                companyKey,
                quotations,
                currency,
                exchangeRate,
            );
        } else {
            toast.error('Vui lòng chọn phương thức thanh toán');
        }
    }, [paymentMethod, reservationByKey, companyKey, quotations, currency, exchangeRate]);

    const gpayPayFunction = useCallback(async (jsonData) => {
        const data = await postGpayPay(jsonData);
        return data;
    }, []);

    const gpayPay = useCallback(async () => {
        if (reservationByKey && totalPrice) {
            const passenger_list = [];
            const payment_detail = [];
            const flight_info = [];
            for (var i = 0; i < reservationByKey.charges.length; i++) {
                payment_detail.push({
                    leg_index: 'Chưa chắc',
                    service_code: reservationByKey.charges[i].chargeType.code,
                    amount: reservationByKey.charges[i].currencyAmounts[0].totalAmount,
                    ccy_code: reservationByKey.charges[i].currencyAmounts[0].currency.code,
                    payment_desc: reservationByKey.charges[i].chargeType.description,
                    additional_data: reservationByKey.charges[i].description,
                });
            }
            for (var i = 0; i < reservationByKey.passengers.length; i++) {
                passenger_list.push({
                    pax_id: 'Chưa biết',
                    pax_type: reservationByKey.passengers[i].fareApplicability.adult ? 'ADT' : 'CHD',
                    gender:
                        reservationByKey.passengers[i].reservationProfile.gender.toUpperCase() === 'MALE' ? 'M' : 'F',
                    dob: reservationByKey.passengers[i].reservationProfile.birthDate,
                    first_name: reservationByKey.passengers[i].reservationProfile.firstName,
                    last_name: reservationByKey.passengers[i].reservationProfile.lastName,
                    name_in_pnr:
                        reservationByKey.passengers[i].reservationProfile.firstName +
                        reservationByKey.passengers[i].reservationProfile.lastName,
                    customer_id: 'Chưa biết',
                    title: reservationByKey.passengers[i].reservationProfile.title,
                    member_ticket: 'Chưa biết',
                });
            }
            for (var i = 0; i < reservationByKey.journeys.length; i++) {
                flight_info.push({
                    leg_index: 'Chưa chắc',
                    airlineCode: reservationByKey.journeys[i].segments[0].flight.airlineCode.code,
                    operatingAirlineCode: reservationByKey.journeys[i].segments[0].flight.airlineCode.code,
                    flightNumber: reservationByKey.journeys[i].segments[0].flight.flightNumber,
                    journey_type: 'Chưa biết',
                    departureAirport: reservationByKey.journeys[i].segments[0].departure.airport.code,
                    departureTime: reservationByKey.journeys[i].segments[0].departure.scheduledTime,
                    arrivalAirport: reservationByKey.journeys[i].segments[0].arrival.airport.code,
                    arrivalTime: reservationByKey.journeys[i].segments[0].arrival.scheduledTime,
                    classOfService: 'Chưa biết',
                    fareBasisCode: 'Chưa biết',
                });
            }
            const extraData = {
                mc_acc_code: 'Chưa biết',
                channel_id: 'Chưa biết',
                ip_addr: 'Chưa biết',
                pay_method_code: 'Chưa biết',
                order_number: reservationByKey.number,
                record_locator: reservationByKey.locator,
                created_date: getCurrentDateTimeString(),
                expire_date: getCurrentDateTimeString(),
                add_data: 'Chưa biết',
                app_id: 'Chưa biết',
                cus_street_number: '',
                cus_add_line1: '',
                cus_add_line2: '',
                postal_code: '',
                cus_title: '',
                cus_name: reservationByKey.bookingInformation.contactInformation.name,
                cus_country: '',
                cus_email: reservationByKey.bookingInformation.contactInformation.email,
                cus_phone_number: reservationByKey.bookingInformation.contactInformation.phoneNumber,
                cus_phone_type: 'TEL',
                cus_dob: '',
                city_name: '',
                state_province: '',
                country_code: '',
                payment_detail: payment_detail,
                passenger_list: passenger_list,
                flight_info: flight_info,
                billing: {
                    country: 'VN',
                    state: 'Hồ Chí Minh',
                    city: 'Nhà Bè',
                    postalCode: '',
                    streetNumber: '673',
                    address01: 'Đường Nguyễn Hữu Thọ',
                    address02: '',
                    phoneNumber: '0321654987',
                    email: 'example@example.com',
                },
                shipping: {
                    country: 'VN',
                    state: 'Hồ Chí Minh',
                    city: 'Nhà Bè',
                    postalCode: '',
                    streetNumber: '673',
                    address01: 'Đường Nguyễn Hữu Thọ',
                    address02: '',
                    phoneNumber: '0321654987',
                    email: 'example@example.com',
                },
            };
            const jsonData = {
                requestID: '7c9c0d2d344346cdaf3c15e2cce67f8b',
                requestDateTime: getCurrentDateTimeString(),
                requestData: {
                    orderID: '061681766f384711acb8f3c0e66f0e97',
                    orderNumber: 'a9076e8d13f74d37ac27878288f898c1',
                    orderDateTime: getCurrentDateTimeString(),
                    orderAmount: totalPrice,
                    orderNetAmount: totalPrice,
                    orderFeeAmount: 0,
                    orderDiscountAmount: 0,
                    orderCurrency: 'VND',
                    orderDescription: 'Pay demo pay',
                    paymentMethod: paymentMethodGpay.paymentMethod,
                    sourceOfFund: paymentMethodGpay.sourceOfFund,
                    sourceType: paymentMethodGpay.sourceType,
                    customerToken: '',
                    extraData: extraData,
                    language: 'vi',
                },
            };
            return await gpayPayFunction(jsonData);
        }
    }, [reservationByKey, totalPrice, paymentMethodGpay, gpayPayFunction]);

    const handlePay = useCallback(() => {
        if (paymentMethod.identifier) {
            handlePayAG();
        } else if (paymentMethodGpay.paymentMethod) {
            // onPayment logic (tách riêng nếu cần)
            gpayPay();
        }
    }, [paymentMethod, paymentMethodGpay, handlePayAG, gpayPay]);

    return {
        checkedAuth,
        listBreadcrumb,
        locator,
        setLocator,
        handleFind,
        reservationKey,
        activeTab,
        setActiveTab,
        addServiceTab,
        setAddServiceTab,
        reservationByKey,
        reservationByLocator,
        debt,
        totalPrice,
        amountPaid,
        currencySymbol,
        notCancelJourneys,
        listPrice,
        listCharge,
        companyKey,
        paymentMethod,
        setPaymentMethod,
        paymentMethodGpay,
        setPaymentMethodGpay,
        handlePay,
        searchFlightPopup,
        setSearchFlightPopup,
        journeyUpdate,
        setJourneyUpdate,
        updateBookingInfomationPopup,
        setUpdateBookingInfomationPopup,
        changePassengerInfoPopup,
        setChangePassengerInfoPopup,
        passengerSelect,
        setPassengerSelect,
        addPassengerInfoPopup,
        setAddPassengerInfoPopup,
        openSplitPassengersPopup,
        setOpenSplitPassengersPopup,
        body,
        setRefetch,
        refetch,
        listAllJourneySeatOptions,
        listAllJourneyBaggageOptions,
        listAllJourneyMealOptions,
        sendItineraryEmail,
    };
} 