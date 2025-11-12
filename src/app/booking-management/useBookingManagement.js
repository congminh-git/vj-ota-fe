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
        { title: 'Quản lý booking', uri: 'booking-management' },
        { title: 'Quản lý đặt chỗ', uri: 'booking-management' },
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