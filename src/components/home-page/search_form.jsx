'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import Vietnamese from 'flatpickr/dist/l10n/vn';
import PassengersDropDown from './passengers_dropdown';
import ListAirport from './list_airports';
import React from 'react';
import { useFlightSearchForm } from '@/hooks/useFlightSearchForm';
import { Percent } from '../icons/percent';
import { ChevronDown } from '../icons/chevronDown';
import { Calendar } from '../icons/calendar';
import Loading from '../loading';
import { Search } from '../icons/search';
import { ArrowRightLeft } from '../icons/arrowRightLeft';

const MemoizedPassengersDropDown = React.memo(PassengersDropDown);
const MemoizedListAirport = React.memo(ListAirport);

function HomePageSearchForm({ typeSearchForm, loadingStatus, setLoadingStatus }) {
    const {
        departmentDate,
        setDepartmentDate,
        returnDate,
        setReturnDate,
        departureAirport,
        arrivalAirport,
        departureCity,
        arrivalCity,
        adult,
        child,
        infant,
        roundTrip,
        cheapFlight,
        promoCode,
        currency,
        totalPassengers,
        validationMessages,
        handleDepartureAirportChange,
        handleArrivalAirportChange,
        handleAdultChange,
        handleChildChange,
        handleInfantChange,
        handleRoundTripChange,
        handleCheapFlightChange,
        handlePromoCodeChange,
        saveSearchParams,
    } = useFlightSearchForm(typeSearchForm);

    // Local state for UI interactions
    const [searchAirport, setSearchAirport] = useState('');
    const [returnDateMessageValidate, setReturnDateMessageValidate] = useState('');
    const [messageValidate, setMessageValidate] = useState('');
    const [openDropDownPassengers, setOpenDropdownPassengers] = useState(false);
    const [openDropDownDepartureAirports, setOpenDropdownDepartureAirports] = useState(false);
    const [openDropDownArrivalAirports, setOpenDropdownArrivalAirports] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const passengerDropDownRef = useRef(null);
    const airpostInputDepartureRef = useRef(null);
    const airpostInputArrivalRef = useRef(null);
    const airpostDepartureDropDownRef = useRef(null);
    const airpostArrivalDropDownRef = useRef(null);

    // Memoize computed values
    const isBookingManagement = useMemo(() => pathname.includes('booking-management'), [pathname]);
    const isFlightListPage = useMemo(() => pathname && pathname.includes('select-flight'), [pathname]);

    // Memoize handleSearchFlight function
    const handleSearchFlight = useCallback(() => {
        const departmentDateCompare = new Date(departmentDate);
        const returnDateCompare = new Date(returnDate);
        const cityPair = departureAirport.split(' ')[0] + '-' + arrivalAirport.split(' ')[0];
        const endPoint = '/booking/select-flight';
        const url = `${endPoint}`;

        if (departureAirport !== arrivalAirport) {
            if (roundTrip) {
                if (departmentDateCompare <= returnDateCompare) {
                    setLoadingStatus(true);
                    saveSearchParams(
                        cityPair,
                        departmentDate,
                        returnDate,
                        roundTrip,
                        currency,
                        adult,
                        child,
                        infant,
                        departureCity,
                        arrivalCity,
                        'đi',
                        promoCode,
                    );
                    if (endPoint === 'select-flight') {
                        if (cheapFlight) {
                            router.replace('/booking/select-cheap-flight');
                        } else {
                            router.refresh();
                        }
                    } else {
                        if (cheapFlight) {
                            router.push('/booking/select-cheap-flight');
                        } else {
                            router.push(url);
                        }
                    }
                }
            } else {
                setLoadingStatus(true);
                saveSearchParams(
                    cityPair,
                    departmentDate,
                    returnDate,
                    roundTrip,
                    currency,
                    adult,
                    child,
                    infant,
                    departureCity,
                    arrivalCity,
                    'đi',
                    promoCode,
                );
                if (endPoint === 'select-flight') {
                    if (cheapFlight) {
                        router.replace('/booking/select-cheap-flight');
                    } else {
                        router.refresh();
                    }
                } else {
                    if (cheapFlight) {
                        router.push('/booking/select-cheap-flight');
                    } else {
                        router.push(url);
                    }
                }
            }
        }
    }, [
        departmentDate,
        returnDate,
        departureAirport,
        arrivalAirport,
        roundTrip,
        setLoadingStatus,
        saveSearchParams,
        currency,
        adult,
        child,
        infant,
        departureCity,
        arrivalCity,
        promoCode,
        cheapFlight,
        router,
    ]);

    const handleSwapAirport = () => {
        const departure = departureAirport;
        handleDepartureAirportChange(arrivalAirport);
        handleArrivalAirportChange(departure);
    };

    // Memoize dropdown toggle handlers
    const handlePassengerDropdownToggle = useCallback(() => {
        setOpenDropdownPassengers((prev) => !prev);
    }, []);

    const handleDepartureAirportDropdownToggle = useCallback((value) => {
        setOpenDropdownDepartureAirports(value);
        setOpenDropdownArrivalAirports(false);
    }, []);

    const handleArrivalAirportDropdownToggle = useCallback((value) => {
        setOpenDropdownArrivalAirports(value);
        setOpenDropdownDepartureAirports(false);
    }, []);

    // Update validation messages
    useEffect(() => {
        setMessageValidate(validationMessages.airport || '');
    }, [validationMessages.airport]);

    useEffect(() => {
        setReturnDateMessageValidate(validationMessages.returnDate || '');
    }, [validationMessages.returnDate]);

    // Initialize flatpickr date pickers
    useEffect(() => {
        const displayObjectDepartureDate = {
            enableTime: false,
            dateFormat: 'Y-m-d',
            altInput: true,
            minDate: 'today',
            locale: Vietnamese.vn,
            onChange: function (dateStr) {
                let selectedDate = new Date(dateStr);
                selectedDate.setDate(selectedDate.getDate() + 1);
                setDepartmentDate(selectedDate.toISOString().split('T')[0]);
            },
        };
        const displayObjectReturnDate = {
            enableTime: false,
            dateFormat: 'Y-m-d',
            altInput: true,
            minDate: 'today',
            locale: Vietnamese.vn,
            onChange: function (dateStr) {
                let selectedDate = new Date(dateStr);
                selectedDate.setDate(selectedDate.getDate() + 1);
                setReturnDate(selectedDate.toISOString().split('T')[0]);
            },
        };
        const departmentDateInput = flatpickr('#ngay-di', displayObjectDepartureDate);
        document.querySelector('#ngay-di').style.display = 'none';
        const returnDateInput = flatpickr('#ngay-ve', displayObjectReturnDate);
        document.querySelector('#ngay-ve').style.display = 'none';
    }, [setDepartmentDate, setReturnDate]);

    // Handle return date input disabled state
    useEffect(() => {
        const returnDateInput = document.querySelector('#ngay-ve').nextElementSibling;
        if (returnDateInput) {
            returnDateInput.disabled = !roundTrip;
            returnDateInput.style.backgroundColor = roundTrip ? '#F3F4F6' : '#D1D5DB';
        }
    }, [roundTrip]);

    // Handle click outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (passengerDropDownRef.current && !passengerDropDownRef.current.contains(event.target)) {
                setOpenDropdownPassengers(false);
            }

            if (
                (airpostInputDepartureRef.current && !airpostInputDepartureRef.current.contains(event.target)) ||
                (airpostInputArrivalRef.current && !airpostInputArrivalRef.current.contains(event.target))
            ) {
                setOpenDropdownDepartureAirports(false);
                setOpenDropdownArrivalAirports(false);
            }

            if (
                (airpostInputDepartureRef.current && airpostInputDepartureRef.current.contains(event.target)) ||
                (airpostDepartureDropDownRef.current && airpostDepartureDropDownRef.current.contains(event.target))
            ) {
                setOpenDropdownDepartureAirports('đi');
                setOpenDropdownArrivalAirports(false);
            } else if (
                (airpostInputArrivalRef.current && airpostInputArrivalRef.current.contains(event.target)) ||
                (airpostArrivalDropDownRef.current && airpostArrivalDropDownRef.current.contains(event.target))
            ) {
                setOpenDropdownArrivalAirports('về');
                setOpenDropdownDepartureAirports(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`rounded-md ${
                isFlightListPage
                    ? 'bg-white h-fit p-0 w-full'
                    : "bg-[url('/globalImages/plane-background.jpg')] h-screen grid justify-center pt-6 pb-6 sm:pt-16 sm:pb-16 w-full"
            } bg-cover p-4 relative`}
        >
            <div className={`w-full block items-center justify-start text-gray-600`}>
                <h2 className={`text-lg font-semibold mt-10 sm:mt-0 ${isFlightListPage ? 'hidden' : 'block'}`}>
                    <i>Tìm chuyến bay</i>
                </h2>
                <div className="w-full flex items-center text-sm">
                    <div className="sm:p-5 backdrop-blur-xl bg-white/30 border-black rounded-xl">
                        <div className="w-full grid grid-cols-7 rounded-t-lg overflow-hidden ">
                            <div className="col-span-7 rounded-t-lg p-2 sm:p-0 sm:py-2 flex flex-wrap justify-between items-center">
                                <div className="inline-flex items-center justify-between w-full sm:w-auto">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            onChange={handleRoundTripChange}
                                            type="checkbox"
                                            value=""
                                            className="sr-only peer"
                                            disabled={isBookingManagement}
                                        />
                                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ms-2 text-sm font-medium text-gray-600 ">Khứ hồi</span>
                                    </label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            onChange={handleCheapFlightChange}
                                            type="checkbox"
                                            value=""
                                            className="sr-only peer"
                                            disabled={isBookingManagement}
                                        />
                                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ms-2 text-sm font-medium text-gray-600">
                                            Tìm vé rẻ
                                        </span>
                                    </label>
                                </div>
                                <div className="p-2 mt-2 sm:mt-0 border rounded bg-white border-gray-300 flex items-center justify-between w-full sm:w-auto">
                                    <input
                                        value={promoCode}
                                        onChange={handlePromoCodeChange}
                                        type="text"
                                        placeholder=" Mã khuyến mãi"
                                        className="outline-none border-none"
                                    />
                                    <Percent className={'h-4 w-4 text-gray-500 ml-2'} strokeWidth={'2'} />
                                </div>
                            </div>
                            <div className="hidden sm:block sm:col-span-5 bg-transparent"></div>
                        </div>
                        <div className="w-full grid grid-cols-7 rounded-b-lg sm:rounded-tr-lg">
                            <div className="col-span-7 bg-white p-2">
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-8 relative">
                                    <div
                                        ref={airpostInputDepartureRef}
                                        className="col-span-2 san-bay-di-block relative"
                                    >
                                        <label
                                            htmlFor="san-bay-di"
                                            className="block pl-2 text-xs font-medium text-gray-900"
                                        >
                                            Từ
                                        </label>
                                        <div className="relative flex items-center border rounded">
                                            <input
                                                readOnly
                                                value={departureAirport}
                                                type="text"
                                                id="san-bay-di"
                                                className="p-2 w-full border rounded bg-gray-50 outline-none border-none font-semibold text-xs sm:text-sm"
                                                placeholder="Chọn điểm đi"
                                                required
                                            />
                                            <ChevronDown
                                                className={'w-4 h-4 ml-1 absolute right-2 hidden sm:block'}
                                                strokeWidth={'2'}
                                            />
                                        </div>
                                        <MemoizedListAirport
                                            setAirport={handleDepartureAirportChange}
                                            open={openDropDownDepartureAirports}
                                            searchAirport={searchAirport}
                                            setSearchAirport={setSearchAirport}
                                            href={pathname}
                                            airpostDropDownRef={airpostDepartureDropDownRef}
                                            setOpenDropDown={handleDepartureAirportDropdownToggle}
                                        />
                                        <span className="text-red-500 text-xs col-span-4 sm:col-span-5">
                                            {messageValidate}
                                        </span>
                                    </div>
                                    <div ref={airpostInputArrivalRef} className="col-span-2 san-bay-den-block relative">
                                        <label
                                            htmlFor="san-bay-den"
                                            className="block pl-2 text-xs font-medium text-gray-900"
                                        >
                                            Đến
                                        </label>
                                        <div className="relative flex items-center border rounded">
                                            <input
                                                readOnly
                                                value={arrivalAirport}
                                                type="text"
                                                id="san-bay-den"
                                                className="p-2 w-full border rounded bg-gray-50 outline-none border-none font-semibold text-xs sm:text-sm"
                                                placeholder="Chọn điểm đến"
                                                required
                                            />
                                            <ChevronDown
                                                className={'w-4 h-4 ml-1 absolute right-2 hidden sm:block'}
                                                strokeWidth={'2'}
                                            />
                                        </div>
                                        <MemoizedListAirport
                                            setAirport={handleArrivalAirportChange}
                                            open={openDropDownArrivalAirports}
                                            searchAirport={searchAirport}
                                            setSearchAirport={setSearchAirport}
                                            href={pathname}
                                            airpostDropDownRef={airpostArrivalDropDownRef}
                                            setOpenDropDown={handleArrivalAirportDropdownToggle}
                                        />
                                    </div>
                                    <div
                                        ref={passengerDropDownRef}
                                        className="sm:col-span-1 col-span-4 dropdown-hanh-khach-input relative mt-4 sm:mt-0"
                                    >
                                        <label
                                            htmlFor="first_name"
                                            className="block pl-2 text-xs font-medium text-gray-900"
                                        >
                                            Hành khách
                                        </label>
                                        <div className="border rounded">
                                            <input
                                                type="text"
                                                id="first_name"
                                                className="p-2 w-full border rounded bg-gray-50 outline-none border-none font-semibold text-xs sm:text-sm"
                                                style={{
                                                    backgroundColor: isBookingManagement
                                                        ? 'rgb(229, 231, 235)'
                                                        : 'rgb(249 250 251)',
                                                }}
                                                placeholder="Phổ thông"
                                                required
                                                readOnly
                                                value={totalPassengers}
                                                onClick={handlePassengerDropdownToggle}
                                                disabled={isBookingManagement}
                                            />
                                            <MemoizedPassengersDropDown
                                                adult={adult}
                                                child={child}
                                                infant={infant}
                                                openDropDownPassengers={openDropDownPassengers}
                                                setAdult={handleAdultChange}
                                                setChild={handleChildChange}
                                                setInfant={handleInfantChange}
                                                setOpenDropdownPassengers={setOpenDropdownPassengers}
                                                href={pathname}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            handleSwapAirport();
                                        }}
                                        className="z-20 group absolute top-4 left-1/2 -translate-x-1/2 sm:left-[40%] sm:top-1/2 sm:-translate-x-6 sm:-translate-y-3 w-8 h-8 sm:w-10 sm:h-10 sm:p-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full flex items-center justify-center"
                                    >
                                        <ArrowRightLeft
                                            className="size-5 transition-transform duration-300 group-hover:rotate-180"
                                            strokeWidth={'2'}
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="col-span-7 bg-white p-2">
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-8">
                                    <div className="col-span-4 sm:col-span-2 box-border">
                                        <label htmlFor="ngay-di" className="block text-xs font-medium text-gray-900">
                                            Ngày đi
                                        </label>
                                        <div className="relative flex items-center border rounded">
                                            <input
                                                type="datetime-local"
                                                id="ngay-di"
                                                name="ngay-di"
                                                className="w-full p-2 border h-[38px] rounded bg-gray-50 outline-none border-none font-semibold text-xs sm:text-sm"
                                                readOnly
                                                value={departmentDate}
                                            />
                                            <Calendar
                                                className={'bi bi-calendar-fill absolute right-2'}
                                                width={'16'}
                                                height={'16'}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-4 sm:col-span-2 box-border mt-4 sm:mt-0">
                                        <label htmlFor="ngay-ve" className="block text-xs font-medium text-gray-900">
                                            Ngày về
                                        </label>
                                        <div className="relative flex items-center border rounded">
                                            <input
                                                type="datetime-local"
                                                id="ngay-ve"
                                                name="ngay-ve"
                                                className="w-full p-2 border h-[38px] rounded bg-gray-200 outline-none border-none font-semibold sm:text-sm"
                                                readOnly
                                                value={returnDate}
                                                disabled={roundTrip ? false : true}
                                            />
                                            <Calendar
                                                className={'bi bi-calendar-fill absolute right-2'}
                                                width={'16'}
                                                height={'16'}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-4 sm:col-span-1 mt-4">
                                        <button
                                            onClick={handleSearchFlight}
                                            className="bg-sky-400 hover:bg-sky-300 h-10 w-full rounded-md flex justify-center items-center transition-all"
                                        >
                                            {loadingStatus ? (
                                                <div className="flex justify-center">
                                                    <Loading />
                                                </div>
                                            ) : (
                                                <Search className={'h-5 w-5 text-white'} strokeWidth={'2'} />
                                            )}
                                        </button>
                                    </div>
                                    <span className="text-red-500 text-xs col-span-4 sm:col-span-5">
                                        {returnDateMessageValidate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(HomePageSearchForm);
