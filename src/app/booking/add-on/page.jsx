'use client';

import Breadcrumb from '@/components/breadcrumb';
import Steps from '@/components/select-flight/steps';
import FlightInfomation from '@/components/passengers-info/journey_info';
import PriceInfomation from '@/components/passengers-info/price_info';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { putQuotationReservation } from '@/services/quotations/functions';
import { getAncillaryOptions } from '@/services/ancillaryOptions/functions';
import { getSeatSelectionOptions } from '@/services/seatSelection/functions';
import { putInsurancePolicyOptions } from '@/services/insurancePolicy/functions';
import SelectBaggagePopup from '@/components/add-on/popup/popup_select_baggage';
import SelectMealPopup from '@/components/add-on/popup/popup_select_meal';
import SelectSeatPopup from '@/components/add-on/popup/popup_select_seat';
import ListInsurance from '@/components/add-on/list_insurance';

// Custom hook để đọc sessionStorage một lần
const useSessionStorageData = () => {
    return useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                roundTrip: null,
                adult: null,
                child: null,
                infant: null,
                cityPair: null,
                departureCity: null,
                arrivalCity: null,
                fareOptionsDepartureFlightStr: null,
                fareOptionsReturnFlightStr: null,
                contactInfomation: null,
                listPassengers: null,
                currency: 'VND',
                exchangeRate: 1,
            };
        }
        return {
            roundTrip: JSON.parse(sessionStorage.getItem('roundTripSearchParam')),
            adult: parseInt(sessionStorage.getItem('adultSearchParam')),
            child: parseInt(sessionStorage.getItem('childSearchParam')),
            infant: parseInt(sessionStorage.getItem('infantSearchParam')),
            cityPair: sessionStorage.getItem('cityPairSearchParam'),
            departureCity: sessionStorage.getItem('departureCitySearchParam'),
            arrivalCity: sessionStorage.getItem('arrivalCitySearchParam'),
            fareOptionsDepartureFlightStr: sessionStorage.getItem('fareOptionsDepartureFlight'),
            fareOptionsReturnFlightStr: sessionStorage.getItem('fareOptionsReturnFlight'),
            contactInfomation: JSON.parse(sessionStorage.getItem('contactInfomation')),
            listPassengers: JSON.parse(sessionStorage.getItem('listPassengers')),
            currency: sessionStorage.getItem('currencySearchParam') ?? 'VND',
            exchangeRate: parseInt(sessionStorage.getItem('exchangeRate')) ?? 1,
        };
    }, []);
};

export default function AddService() {
    const router = useRouter();
    // Sử dụng custom hook để đọc sessionStorage
    const sessionData = useSessionStorageData();
    const {
        roundTrip,
        adult,
        child,
        infant,
        cityPair,
        departureCity,
        arrivalCity,
        fareOptionsDepartureFlightStr,
        fareOptionsReturnFlightStr,
        contactInfomation,
        listPassengers,
        currency,
        exchangeRate,
    } = sessionData;
    const [fareOptionsDepartureFlight, setFareOptionsDepartureFlight] = useState(0);
    const [fareOptionsReturnFlight, setFareOptionsReturnFlight] = useState(0);
    const [totalPrice, setTotalPrice] = useState(null);
    const [quotations, setQuotations] = useState(null);
    const [body, setBody] = useState(null);
    const [departureFlight, setDepartureFlight] = useState(null);
    const [returnFlight, setReturnFlight] = useState(null);
    const [openPopupBaggage, setOpenPupupBaggage] = useState(false);
    const [openPopupMeal, setOpenPopupMeal] = useState(false);
    const [openPopupSeat, setOpenPopupSeat] = useState(false);
    const [openListInsurance, setOpenListInsurance] = useState(false);
    const [listDepartureBaggagePack, setListDepartureBaggagePack] = useState(null);
    const [listReturnBaggagePack, setListReturnBaggagePack] = useState(null);
    const [listDepartureMealPack, setListDepartureMealPack] = useState(null);
    const [listReturnMealPack, setListReturnMealPack] = useState(null);
    const [departureFlightSeatOptions, setDepartureFlightSeatOptions] = useState(null);
    const [returnFlightSeatOptions, setReturnFlightSeatOptions] = useState(null);
    const [listInsurance, setListInsurance] = useState(null);
    const [listSeleactedInsurance, setListSelectedInsurance] = useState([]);
    const [baggageConfirmed, setBaggageConfirmed] = useState([]);
    const [mealConfirmed, setMealConfirmed] = useState([]);
    const [seatConfirmed, setSeatConfirmed] = useState([]);
    const [baggageTotalPrice, setBaggageTotalPrice] = useState({ departurePrice: 0, arrivalPrice: 0 });
    const [mealTotalPrice, setMealTotalPrice] = useState({ departurePrice: 0, arrivalPrice: 0 });
    const [seatTotalPrice, setSeatTotalPrice] = useState({ departurePrice: 0, arrivalPrice: 0 });
    const [insuranceTotalPrice, setInsuranceTotalPrice] = useState({ departurePrice: 0, arrivalPrice: 0 });
    // Memoize breadcrumb để tránh tạo lại object mỗi lần render
    const listBreadcrumb = useMemo(() => [
        { title: 'Tìm vé', uri: '/booking' },
        { title: 'Danh sách vé', uri: '/booking/select-flight' },
        { title: 'Thông tin hành khách', uri: '/booking/passengers-info' },
        { title: 'Thêm dịch vụ', uri: '/booking/add-on' },
    ], []);

    const removeVietnameseDiacritics = useCallback((str) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/Đ/g, 'D')
            .replace(/đ/g, 'd')
            .toUpperCase();
    }, []);

    const convertToUpperCaseWithoutDiacritics = useCallback((str) => {
        const noDiacriticsStr = removeVietnameseDiacritics(str);
        const words = noDiacriticsStr.split(' ');
        const upperCaseStr = words.map((word) => word.toUpperCase()).join(' ');
        return upperCaseStr;
    }, [removeVietnameseDiacritics]);

    const navigateToPaymentPage = useCallback(() => {
        sessionStorage.setItem('reservationBody', JSON.stringify(body));
        sessionStorage.setItem('baggageTotalPrice', JSON.stringify(baggageTotalPrice));
        sessionStorage.setItem('mealTotalPrice', JSON.stringify(mealTotalPrice));
        sessionStorage.setItem('seatTotalPrice', JSON.stringify(seatTotalPrice));
        sessionStorage.setItem('insuranceTotalPrice', JSON.stringify(insuranceTotalPrice));
        router.push('/booking/payment');
    }, [body, baggageTotalPrice, mealTotalPrice, seatTotalPrice, insuranceTotalPrice, router]);

    const handlePutInsurance = useCallback(async (body) => {
        const data = await putInsurancePolicyOptions(body);
        setListInsurance(data);
    }, []);

    const handlePutQuotation = useCallback(async (body) => {
        const data = await putQuotationReservation(body);
        setQuotations(data);
    }, []);

    const handleGetAncillaryOptions = useCallback(async (bookingKey, setListBaggage, setListmeal) => {
        const data = await getAncillaryOptions(bookingKey);
        setListBaggage(data[0]);
        setListmeal(data[1]);
    }, []);

    const handleGetSeatSelectionOptions = useCallback(async (bookingKey, setDataFunc) => {
        const data = await getSeatSelectionOptions(bookingKey);
        setDataFunc(data);
    }, []);

    useEffect(() => {
        if (departureFlight) {
            const personalContactInformation = {
                phoneNumber:
                    '+84' + contactInfomation.phoneNumber.startsWith('0')
                        ? contactInfomation.phoneNumber.slice(1, 10)
                        : contactInfomation.phoneNumber,
                mobileNumber:
                    '+84' + contactInfomation.phoneNumber.startsWith('0')
                        ? contactInfomation.phoneNumber.slice(1, 10)
                        : contactInfomation.phoneNumber,
                email: contactInfomation.email,
            };
            const passengerJourneyDetailsDeparture = [];
            const passengerJourneyDetailsReturn = [];
            const passengers = [];
            [...listPassengers.listAdult].forEach((element, index) => {
                departureFlight.flights.forEach((flight, flightIndex) => {
                    passengerJourneyDetailsDeparture.push({
                        passenger: { index: index + 1 },
                        segment: { index: flightIndex + 1 },
                        bookingKey: departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight).bookingCode.key,
                        reservationStatus: {
                            confirmed: true,
                            waitlist: false,
                            standby: false,
                            cancelled: false,
                            open: false,
                            finalized: false,
                            external: false,
                        },

                    });
                });
                if (returnFlight) {
                    returnFlight.flights.forEach((flight, flightIndex) => {
                        passengerJourneyDetailsReturn.push({
                            passenger: { index: index + 1 },
                            segment: { index: flightIndex + 1 },
                            bookingKey: returnFlight.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight).bookingCode.key,
                            reservationStatus: {
                                confirmed: true,
                                waitlist: false,
                                standby: false,
                                cancelled: false,
                                open: false,
                                finalized: false,
                                external: false,
                            },
                        });
                    });
                }
                passengers.push({
                    index: index + 1,
                    fareApplicability: {
                        child: false,
                        adult: true,
                    },
                    reservationProfile: {
                        lastName: convertToUpperCaseWithoutDiacritics(element.lastName),
                        firstName: convertToUpperCaseWithoutDiacritics(element.firstName),
                        title: element.gender == 'nam' ? 'Mr' : 'Ms',
                        gender: element.gender == 'nam' ? 'MALE' : 'FEMALE',
                        address: {
                            "address1": "",
                            "addresas2": "",
                            "city": "",
                            "location": {
                                "country": {
                                    "code": "",
                                    "name": ""
                                },
                                "province": {
                                    "code": "",
                                    "name": ""
                                }
                            },
                            "postalCode": ""
                        },
                        birthDate: element.dob,
                        personalContactInformation: personalContactInformation,
                        status: {
                            active: true,
                            inactive: false,
                            denied: true,
                        },
                        passport: {
                            number: element.number
                        }
                    },
                    infants: [],
                });
            });
            [...listPassengers.listChild].forEach((element, index) => {
                departureFlight.flights.forEach((flight, flightIndex) => {
                    passengerJourneyDetailsDeparture.push({
                        passenger: { index: index + 1 + listPassengers.listAdult.length },
                        segment: { index: flightIndex + 1 },
                        bookingKey: departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight).bookingCode.key,
                        reservationStatus: {
                            confirmed: true,
                            waitlist: false,
                            standby: false,
                            cancelled: false,
                            open: false,
                            finalized: false,
                            external: false,
                        },
                    });
                });
                if (returnFlight) {
                    returnFlight.flights.forEach((flight, flightIndex) => {
                        passengerJourneyDetailsReturn.push({
                            passenger: { index: index + 1 + listPassengers.listAdult.length },
                            segment: { index: flightIndex + 1 },
                            bookingKey: returnFlight.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight).bookingCode.key,
                            reservationStatus: {
                                confirmed: true,
                                waitlist: false,
                                standby: false,
                                cancelled: false,
                                open: false,
                                finalized: false,
                                external: false,
                            },
                        });
                    });
                }
                passengers.push({
                    index: index + 1 + listPassengers.listAdult.length,
                    fareApplicability: {
                        child: true,
                        adult: false,
                    },
                    reservationProfile: {
                        lastName: convertToUpperCaseWithoutDiacritics(element.lastName),
                        firstName: convertToUpperCaseWithoutDiacritics(element.firstName),
                        title: 'Master',
                        gender: element.gender == 'nam' ? 'MALE' : 'FEMALE',
                        address: {
                            "address1": "",
                            "addresas2": "",
                            "city": "",
                            "location": {
                                "country": {
                                    "code": "",
                                    "name": ""
                                },
                                "province": {
                                    "code": "",
                                    "name": ""
                                }
                            },
                            "postalCode": ""
                        },
                        birthDate: element.dob,
                        personalContactInformation: personalContactInformation,
                        status: {
                            active: true,
                            inactive: false,
                            denied: true,
                        },
                    },
                    infants: [],
                });
            });
            [...listPassengers.listInfant].forEach((element, index) => {
                passengers[element.adultFollow].infants = [
                    {
                        index: index + 1 + listPassengers.listAdult.length + listPassengers.listChild.length,
                        reservationProfile: {
                            lastName: convertToUpperCaseWithoutDiacritics(element.lastName),
                            firstName: convertToUpperCaseWithoutDiacritics(element.firstName),
                            title: 'Infant',
                            gender: element.gender == 'nam' ? 'MALE' : 'FEMALE',
                            address: {
                                "address1": "",
                                "addresas2": "",
                                "city": "",
                                "location": {
                                    "country": {
                                        "code": "",
                                        "name": ""
                                    },
                                    "province": {
                                        "code": "",
                                        "name": ""
                                    }
                                },
                                "postalCode": ""
                            },
                            birthDate: element.dob,
                            personalContactInformation: personalContactInformation,
                        },
                    },
                ];
            });
            const journeyDi = {
                index: 1,
                passengerJourneyDetails: passengerJourneyDetailsDeparture,
            };
            const journeyVe = {
                index: 2,
                passengerJourneyDetails: passengerJourneyDetailsReturn,
            };
            const journeys = roundTrip ? [journeyDi, journeyVe] : [journeyDi];

            const tempBody = {
                bookingInformation: {
                    contactInformation: {
                        name: convertToUpperCaseWithoutDiacritics(
                            contactInfomation.lastName + ' ' + contactInfomation.firstName,
                        ),
                        phoneNumber:
                            '+84' + contactInfomation.phoneNumber.startsWith('0')
                                ? contactInfomation.phoneNumber.slice(1, 10)
                                : contactInfomation.phoneNumber,
                        // extension: '',
                        email: contactInfomation.email,
                        // language: {
                        //     href: '/languages/vi',
                        //     code: 'vi',
                        //     name: 'Vietnamese',
                        // },
                    },
                },
                insurancePolicies: [],
                journeys: journeys,
                passengers: passengers,
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
                ancillaryPurchases: [],
                seatSelections: [],
            };
            setBody(tempBody);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departureFlight, returnFlight]);

    useEffect(() => {
        if (fareOptionsDepartureFlightStr) {
            setFareOptionsDepartureFlight(fareOptionsDepartureFlightStr);
        } else {
            router.replace('/')
        }
        if (fareOptionsReturnFlightStr) {
            setFareOptionsReturnFlight(fareOptionsReturnFlightStr);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fareOptionsDepartureFlightStr, fareOptionsReturnFlightStr]);

    useEffect(() => {
        setDepartureFlight(
            typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('departureFlight')) : null,
        );
        setReturnFlight(typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('returnFlight')) : null);
    }, []);

    useEffect(() => {
        if (body) {
            if (body.passengers && body.journeys && body.bookingInformation) {
                handlePutQuotation(body);
            }
            if (body.journeys && body.journeys.length > 0) {
                const journey = body.journeys[0];

                if (journey.passengerJourneyDetails && journey.passengerJourneyDetails.length > 0) {
                    const bookingKey = journey.passengerJourneyDetails[0].bookingKey;

                    if (!listDepartureBaggagePack || !listDepartureMealPack || !departureFlightSeatOptions) {
                        handleGetAncillaryOptions(bookingKey, setListDepartureBaggagePack, setListDepartureMealPack)
                        handleGetSeatSelectionOptions(bookingKey, setDepartureFlightSeatOptions);
                    }
                }

                if (body.journeys.length > 1) {
                    const returnJourney = body.journeys[1];
                    if (returnJourney.passengerJourneyDetails && returnJourney.passengerJourneyDetails.length > 0) {
                        const returnBookingKey = returnJourney.passengerJourneyDetails[0].bookingKey;

                        if (!listReturnBaggagePack || !listReturnMealPack || !returnFlightSeatOptions) {
                            handleGetAncillaryOptions(returnBookingKey, setListReturnBaggagePack, setListReturnMealPack);
                            handleGetSeatSelectionOptions(returnBookingKey, setReturnFlightSeatOptions);
                        }
                    }
                }
            }

            if (!listInsurance) {
                const bodyStr = JSON.stringify(body);
                const newBody = JSON.parse(bodyStr);
                newBody.paymentTransactions = null;
                if (newBody.bookingInformation) {
                    handlePutInsurance(newBody);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [body]);

    useEffect(() => {
        if (quotations) {
            let tong = 0;
            quotations.paymentTransactions.forEach((element) => {
                tong += element.currencyAmounts[0].totalAmount;
            });
            setTotalPrice(tong);
        }
    }, [quotations]);

    useEffect(() => {
        if (baggageConfirmed.length > 0 || mealConfirmed.length > 0) {
            setBody({ ...body, ancillaryPurchases: [...baggageConfirmed, ...mealConfirmed] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baggageConfirmed, mealConfirmed]);

    useEffect(() => {
        if (seatConfirmed) {
            setBody({ ...body, seatSelections: [...seatConfirmed] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seatConfirmed]);

    useEffect(() => {
        if (listSeleactedInsurance) {
            let tong = 0;
            listInsurance?.forEach((element) => {
                for (let i = 0; i < listSeleactedInsurance.length; i++) {
                    if (listSeleactedInsurance[i].purchaseKey == element.purchaseKey) {
                        tong += element.chargeAmount.totalAmount;
                    }
                }
            });
            setInsuranceTotalPrice(tong);
            setBody({ ...body, insurancePolicies: listSeleactedInsurance });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listSeleactedInsurance]);

    return (
        <>
        {
            fareOptionsDepartureFlightStr
            ?
        <main className="relative">
            <Steps />
            <div className="flex flex-wrap justify-center min-h-screen bg-gray-100 border shadow">
                <div className={` w-full max-w-[1200px]`}>
                    <div className="mt-4">
                        <Breadcrumb listBreadcrumb={listBreadcrumb} />
                    </div>
                    <div className=" w-full grid grid-cols-7 gap-4">
                        <div className="col-span-5 p-4 h-fit rounded-md bg-white">
                            <h1 className="font-bold text-md">
                                <i>Chọn thêm dịch vụ</i>
                            </h1>
                            <div className="">
                                <div className="mt-4 p-2 border-2 hover:border-blue-400 bg-opacity-50 rounded-md ">
                                    <div className="grid grid-cols-5">
                                        <div className="flex justify-start items-center col-span-2">
                                            <div className="w-20 h-20 bg-[url('/baggage.jpg')] bg-cover rounded-sm"></div>
                                            <span className="ml-2">Chọn gói hành lý</span>
                                        </div>
                                        <div
                                            className={`${
                                                baggageTotalPrice.departurePrice + baggageTotalPrice.arrivalPrice > 0
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            } text-3xl font-bold text-orange-500 col-span-2 flex justify-start items-center`}
                                        >
                                            {(
                                                baggageTotalPrice.departurePrice + baggageTotalPrice.arrivalPrice
                                            ).toLocaleString()}
                                            đ
                                        </div>
                                        <div className="col-span-1 flex justify-center items-center">
                                            <button
                                                onClick={() => setOpenPupupBaggage(true)}
                                                className="rounded-full h-fit w-fit bg-blue-400 hover:bg-blue-300 text-white border p-2 mr-4"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <SelectBaggagePopup
                                        openPopupBaggage={openPopupBaggage}
                                        setOpenPupupBaggage={setOpenPupupBaggage}
                                        listDepartureBaggagePack={listDepartureBaggagePack}
                                        listReturnBaggagePack={listReturnBaggagePack}
                                        setBaggageTotalPrice={setBaggageTotalPrice}
                                        setBaggageConfirmed={setBaggageConfirmed}
                                        body={body}
                                    />
                                </div>
                                <div className="mt-4 p-2 border-2 hover:border-blue-400 bg-opacity-50 rounded-md ">
                                    <div className="grid grid-cols-5">
                                        <div className="flex justify-start items-center col-span-2">
                                            <div className="w-20 h-20 bg-[url('/meal.jpg')] bg-cover rounded-sm"></div>
                                            <span className="ml-2">Chọn suất ăn</span>
                                        </div>
                                        <div
                                            className={`${
                                                mealTotalPrice.departurePrice + mealTotalPrice.arrivalPrice > 0
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            } text-3xl font-bold text-orange-500 col-span-2 flex justify-start items-center`}
                                        >
                                            {(
                                                mealTotalPrice.departurePrice + mealTotalPrice.arrivalPrice
                                            ).toLocaleString()}
                                            đ
                                        </div>
                                        <div className="col-span-1 flex justify-center items-center">
                                            <button
                                                onClick={() => setOpenPopupMeal(true)}
                                                className="rounded-full h-fit w-fit bg-blue-400 hover:bg-blue-300 text-white border p-2 mr-4"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <SelectMealPopup
                                        openPopupMeal={openPopupMeal}
                                        setOpenPopupMeal={setOpenPopupMeal}
                                        listDepartureMealPack={listDepartureMealPack}
                                        listReturnMealPack={listReturnMealPack}
                                        setMealConfirmed={setMealConfirmed}
                                        setMealTotalPrice={setMealTotalPrice}
                                        body={body}
                                    />
                                </div>
                                <div className="mt-4 p-2 border-2 hover:border-blue-400 bg-opacity-50 rounded-md ">
                                    <div className="grid grid-cols-5">
                                        <div className="flex justify-start items-center col-span-2">
                                            <div className="w-20 h-20 bg-[url('/seat.jpg')] bg-cover rounded-sm"></div>
                                            <div className="grid">
                                                <span className="ml-2">Chọn chỗ ngồi</span>
                                                {roundTrip ? (
                                                    <span className="ml-2">
                                                        {`${departureFlight?.flights[0].arrival.airportCode}` +
                                                            ' - ' +
                                                            `${departureFlight?.flights[0].departure.airportCode}`}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div
                                            className={`${
                                                seatTotalPrice.departurePrice + seatTotalPrice.arrivalPrice > 0
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            } text-3xl font-bold text-orange-500 col-span-2 flex justify-start items-center`}
                                        >
                                            {(
                                                seatTotalPrice.departurePrice + seatTotalPrice.arrivalPrice
                                            ).toLocaleString()}
                                            đ
                                        </div>
                                        <div className="col-span-1 flex justify-center items-center">
                                            <button
                                                onClick={() => setOpenPopupSeat(true)}
                                                className="rounded-full h-fit w-fit bg-blue-400 hover:bg-blue-300 text-white border p-2 mr-4"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <SelectSeatPopup
                                        openPopupSeat={openPopupSeat}
                                        setOpenPopupSeat={setOpenPopupSeat}
                                        departureFlightSeatOptions={departureFlightSeatOptions}
                                        returnFlightSeatOptions={returnFlightSeatOptions}
                                        departureFlight={departureFlight}
                                        returnFlight={returnFlight}
                                        setSeatConfirmed={setSeatConfirmed}
                                        setSeatTotalPrice={setSeatTotalPrice}
                                        body={body}
                                        currency={currency}
                                        exchangeRate={exchangeRate}
                                    />
                                </div>
                                <div className="mt-4 p-2 border-2 hover:border-blue-400 bg-opacity-50 rounded-md ">
                                    <div className="grid grid-cols-5">
                                        <div className="flex justify-start items-center col-span-2">
                                            <div className="w-20 h-20 bg-[url('/insurance.jpg')] bg-cover rounded-sm"></div>
                                            <span className="ml-2">Mua bảo hiểm</span>
                                        </div>
                                        <div
                                            className={`${
                                                insuranceTotalPrice.departurePrice + insuranceTotalPrice.arrivalPrice >
                                                0
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            } text-3xl font-bold text-orange-500 col-span-2 flex justify-start items-center`}
                                        >
                                            {(
                                                insuranceTotalPrice.departurePrice + insuranceTotalPrice.arrivalPrice
                                            ).toLocaleString()}
                                            đ
                                        </div>
                                        <div className="col-span-1 flex justify-center items-center">
                                            <button
                                                onClick={() => {
                                                    setOpenListInsurance(!openListInsurance);
                                                }}
                                                className="rounded-full h-fit w-fit bg-blue-400 hover:bg-blue-300 text-white border p-2 mr-4"
                                            >
                                                {openListInsurance ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <ListInsurance
                                        openListInsurance={openListInsurance}
                                        listInsurance={listInsurance}
                                        listSeleactedInsurance={listSeleactedInsurance}
                                        setListSelectedInsurance={setListSelectedInsurance}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => navigateToPaymentPage()}
                                    className="bg-blue-500 hover:bg-blue-400 rounded px-4 py-2 text-white font-bold"
                                >
                                    Tiếp theo
                                </button>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <PriceInfomation
                                departureFlight={departureFlight}
                                returnFlight={returnFlight}
                                roundTrip={roundTrip}
                                adult={adult}
                                child={child}
                                infant={infant}
                                cityPair={cityPair}
                                departureCity={departureCity}
                                arrivalCity={arrivalCity}
                                totalPrice={totalPrice}
                                fareOptionsDepartureFlight={fareOptionsDepartureFlight}
                                fareOptionsReturnFlight={fareOptionsReturnFlight}
                                baggageTotalPrice={baggageTotalPrice}
                                seatTotalPrice={seatTotalPrice}
                                mealTotalPrice={mealTotalPrice}
                                insuranceTotalPrice={insuranceTotalPrice}
                            />
                            {/* <FlightInfomation departureFlight={departureFlight} returnFlight={returnFlight} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
            :
            <div className='min-h-screen'>
                <span>Loading...</span>
            </div>
        }
        </>
    );
}