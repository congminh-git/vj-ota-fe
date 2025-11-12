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

// Memoize PassengersDropDown component
const MemoizedPassengersDropDown = React.memo(PassengersDropDown);
// Memoize ListAirport component  
const MemoizedListAirport = React.memo(ListAirport);

function HomePageSearchForm({ typeSearchForm, loadingStatus, setLoadingStatus }) {
    // Use custom hook for form state management
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
                            router.push('booking/select-cheap-flight');
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
                        router.push('booking/select-cheap-flight');
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
        router
    ]);

    // Memoize dropdown toggle handlers
    const handlePassengerDropdownToggle = useCallback(() => {
        setOpenDropdownPassengers(prev => !prev);
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
            returnDateInput.style.backgroundColor = roundTrip ? '#f8fafc' : 'rgb(229, 231, 235)';
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
                    : "bg-[url('/plane-background.jpg')] h-screen grid justify-center pt-6 pb-6 sm:pt-16 sm:pb-16 w-full"
            } bg-cover p-4 relative z-[20]`}
        >
            <div className={`w-full block items-center justify-start text-gray-600`}>
                <h2
                    className={`text-lg font-semibold  ${
                        isFlightListPage ? 'hidden' : 'block'
                    }`}
                >
                    <i>Tìm chuyến bay</i>
                </h2>
                <div className="w-full flex items-center text-sm">
                    <div className="p-5 backdrop-blur-xl bg-white/30 border-black rounded-xl">
                        <div className="w-full grid grid-cols-7 rounded-t-lg overflow-hidden ">
                            <div className="col-span-7 rounded-t-lg p-2 flex justify-between items-center border-b">
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
                                    <span className="ms-2 text-sm font-medium text-gray-600 ">
                                        Tìm chuyến bay rẻ nhất
                                    </span>
                                </label>
                                <div className="p-2 border rounded bg-white border-gray-300 flex items-center">
                                    <input
                                        value={promoCode}
                                        onChange={handlePromoCodeChange}
                                        type="text"
                                        placeholder=" Mã khuyến mãi"
                                        className="outline-none border-none"
                                    />
                                    <svg
                                        className="h-4 w-4 text-gray-500 ml-2"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {' '}
                                        <line x1="19" y1="5" x2="5" y2="19" /> <circle cx="6.5" cy="6.5" r="2.5" />{' '}
                                        <circle cx="17.5" cy="17.5" r="2.5" />
                                    </svg>
                                </div>
                            </div>
                            <div className="hidden sm:block sm:col-span-5 bg-transparent border-b"></div>
                        </div>
                        <div className="w-full grid grid-cols-7 rounded-b-lg sm:rounded-tr-lg">
                            <div className="col-span-7 bg-white p-2">
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
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
                                        <div className="relative flex items-center">
                                            <input
                                                readOnly
                                                value={departureAirport}
                                                type="text"
                                                id="san-bay-di"
                                                className="p-2 w-full border rounded bg-gray-50 outline-none border-none font-semibold"
                                                placeholder="Chọn điểm đi"
                                                required
                                            />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-4 h-4 ml-1 absolute right-2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                />
                                            </svg>
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
                                        <div className="relative flex items-center">
                                            <input
                                                readOnly
                                                value={arrivalAirport}
                                                type="text"
                                                id="san-bay-den"
                                                className="p-2 w-full border rounded bg-gray-50 outline-none border-none font-semibold"
                                                placeholder="Chọn điểm đến"
                                                required
                                            />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-4 h-4 ml-1 absolute right-2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                />
                                            </svg>
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
                                        className="sm:col-span-1 col-span-4 dropdown-hanh-khach-input relative"
                                    >
                                        <label
                                            htmlFor="first_name"
                                            className="block pl-2 text-xs font-medium text-gray-900"
                                        >
                                            Hành khách
                                        </label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            className="p-2 w-full border rounded bg-gray-50 outline-none border-none font-semibold"
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
                            </div>
                            <div className="col-span-7 bg-white p-2">
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-4">
                                    <div className="col-span-2 box-border">
                                        <label htmlFor="ngay-di" className="block text-xs font-medium text-gray-900">
                                            Ngày đi
                                        </label>
                                        <div className="relative flex items-center">
                                            <input
                                                type="datetime-local"
                                                id="ngay-di"
                                                name="ngay-di"
                                                className="w-full p-2 border h-[38px] rounded bg-gray-50 outline-none border-none font-semibold"
                                                readOnly
                                                value={departmentDate}
                                            />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-calendar-fill absolute right-2"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="col-span-2 box-border">
                                        <label htmlFor="ngay-ve" className="block text-xs font-medium text-gray-900">
                                            Ngày về
                                        </label>
                                        <div className="relative flex items-center">
                                            <input
                                                type="datetime-local"
                                                id="ngay-ve"
                                                name="ngay-ve"
                                                className="w-full p-2 border h-[38px] rounded bg-gray-200 outline-none border-none font-semibold"
                                                readOnly
                                                value={returnDate}
                                                disabled={roundTrip ? false : true}
                                            />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-calendar-fill absolute right-2"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="col-span-4 sm:col-span-1 mt-4">
                                        <button
                                            onClick={handleSearchFlight}
                                            className="bg-blue-500 hover:bg-blue-400 h-10 w-full rounded-md flex justify-center items-center"
                                        >
                                            {loadingStatus ? (
                                                <div className="flex justify-center">
                                                    <div role="status">
                                                        <svg
                                                            aria-hidden="true"
                                                            className="inline w-6 h-6 text-gray-200 animate-spin fill-green-500"
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
                                            ) : (
                                                <svg
                                                    className="h-5 w-5 text-white"
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
                                                    <path stroke="none" d="M0 0h24v24H0z" />{' '}
                                                    <circle cx="10" cy="10" r="7" />{' '}
                                                    <line x1="21" y1="21" x2="15" y2="15" />
                                                </svg>
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