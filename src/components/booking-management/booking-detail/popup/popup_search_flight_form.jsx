'use client';

import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import Vietnamese from 'flatpickr/dist/l10n/vn';
import PassengersDropDown from '@/components/home-page/passengers_dropdown';
import ListAirport from '@/components/home-page/list_airports';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SearchFlightPopup({
    searchFlightPopup,
    setSearchFlightPopup,
    reservationByKey,
    journeyUpdate,
}) {
    const [departmentDate, setDepartmentDate] = useState(new Date().toISOString().split('T')[0]);
    const [departureAirport, setDepartureAirport] = useState('SGN (Ho Chi Minh)');
    const [arrivalAirport, setArrivalAirport] = useState('HAN (Ha Noi)');
    const [departureCity, setDepartureCity] = useState('(Ho_Chi_Minh)');
    const [arrivalCity, setArrivalCity] = useState('(Ha_Noi)');
    const [searchAirport, setSearchAirport] = useState('');
    const [adult, setAdult] = useState(1);
    const [child, setChild] = useState(0);
    const [infant, setInfant] = useState(0);
    const [openDropDownPassengers, setOpenDropdownPassengers] = useState(false);
    const [openDropDownDepartureAirports, setOpenDropdownDepartureAirports] = useState(false);
    const [openDropDownArrivalAirports, setOpenDropdownArrivalAirports] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const passengerDropDownRef = useRef(null);
    const airpostInputDepartureRef = useRef(null);
    const airpostInputArrivalRef = useRef(null);
    const airpostDepartureDropDownRef = useRef(null);
    const airpostArrivalDropDownRef = useRef(null);

    useEffect(() => {
        if (reservationByKey) {
            let countNguoiLon = 0;
            let countTreEm = 0;
            let countEmBe = 0;
            reservationByKey.passengers.forEach((element) => {
                if (element.fareApplicability.adult) {
                    countNguoiLon += 1;
                    if (element.infants[0]) {
                        countEmBe += 1;
                    }
                } else {
                    countTreEm += 1;
                }
            });

            setAdult(countNguoiLon);
            setChild(countTreEm);
            setInfant(countEmBe);
        }
    }, [reservationByKey]);

    useEffect(() => {
        if (journeyUpdate) {
            setDepartmentDate(journeyUpdate.departure.localScheduledTime.split(' ')[0]);
            setDepartureAirport(
                journeyUpdate.segments[0].departure.airport.code +
                    ' ' +
                    `(${journeyUpdate.segments[0].departure.airport.name})`,
            );
            setArrivalAirport(
                journeyUpdate.segments[0].arrival.airport.code +
                    ' ' +
                    `(${journeyUpdate.segments[0].arrival.airport.name})`,
            );
        }
    }, [journeyUpdate]);

    useEffect(() => {
        const displayObjectNgayDi = {
            enableTime: false,
            dateFormat: 'Y-m-d',
            altInput: true,
            minDate: 'today',
            locale: Vietnamese.vn,
            onChange: function (dateStr) {
                let departmentDate = new Date(dateStr);
                departmentDate.setDate(departmentDate.getDate() + 1);
                let departmentDateMoi = departmentDate.toISOString().split('T')[0];
                setDepartmentDate(departmentDateMoi);
            },
        };

        const departmentDateInput = flatpickr('#ngay-di', displayObjectNgayDi);
        document.querySelector('#ngay-di').style.display = 'none';
    }, [departmentDate]);

    useEffect(() => {
        setDepartureCity(
            departureAirport
                .substring(departureAirport.indexOf('(') + 1, departureAirport.indexOf(')'))
                .replaceAll(' ', '_'),
        );
        setArrivalCity(
            arrivalAirport.substring(arrivalAirport.indexOf('(') + 1, arrivalAirport.indexOf(')')).replaceAll(' ', '_'),
        );
    }, [departureAirport, arrivalAirport]);

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
                (airpostDepartureDropDownRef.current && airpostDepartureDropDownRef.current.contains(event.target))
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

    const setSearchParams = (cityPair, departmentDate, reservationKey, journeyKey) => {
        sessionStorage.setItem('cityPairSearchParamUpdate', cityPair);
        sessionStorage.setItem('departmentDateSearchParamUpdate', departmentDate);
        sessionStorage.setItem('reservationKeySearchParamUpdate', reservationKey);
        sessionStorage.setItem('journeyKeySearchParamUpdate', journeyKey);
        sessionStorage.setItem('departureCitySearchParamUpdate', departureCity);
        sessionStorage.setItem('arrivalCitySearchParamUpdate', arrivalCity);
        sessionStorage.setItem('adultSearchParamUpdate', adult);
        sessionStorage.setItem('childSearchParamUpdate', child);
        sessionStorage.setItem('infantSearchParamUpdate', infant);
    };

    const searchFlightChange = () => {
        setLoadingStatus(true);
        const cityPair = departureAirport.split(' ')[0] + '-' + arrivalAirport.split(' ')[0];
        const url = '/booking-management/update-journey/select-flight';
        setSearchParams(
            cityPair,
            departmentDate,
            reservationByKey?.key,
            journeyUpdate?.key,
            departureCity,
            arrivalCity,
            adult,
            child,
            infant,
        );
        sessionStorage.setItem('updateJourneysStatus', searchFlightPopup);
        router.push(url);
    };

    return (
        <div
            className={`${
                searchFlightPopup ? 'flex' : 'hidden'
            } bg-gray-700 bg-opacity-50 h-screen w-full top-0 left-0 fixed justify-center items-center p-8 z-20 popup-tim-chuyen-bay`}
        >
            <div
                className={` rounded-2xl ${
                    pathname && pathname.includes('select-flight')
                        ? 'bg-white h-fit p-0 w-full'
                        : "bg-[url('/plane-background.jpg')] pt-16 pb-16 md:w-4/5 w-full"
                } bg-cover p-4 relative`}
            >
                <div className={`w-full text-gray-600 relative`}>
                    <h2
                        className={`text-lg font-semibold ${
                            pathname && pathname.includes('select-flight') ? 'hidden' : 'block'
                        }`}
                    >
                        <i>Tìm chuyến bay</i>
                    </h2>
                    <div className="w-full text-sm">
                        <div className="w-full grid grid-cols-12 rounded-b-lg rounded-tr-lg">
                            <div className="col-span-12 md:col-span-7 bg-white p-2">
                                <div className="grid grid-cols-2 gap-8">
                                    <div
                                        ref={airpostInputDepartureRef}
                                        className="grid-col-1 san-bay-di-block relative"
                                    >
                                        <label
                                            htmlFor="san-bay-di"
                                            className="block pl-2 text-xs font-medium text-gray-900"
                                        >
                                            Từ
                                        </label>
                                        <input
                                            readOnly
                                            value={departureAirport}
                                            type="text"
                                            id="san-bay-di"
                                            className="p-2 w-full border rounded bg-gray-50 outline-none border-none font-semibold"
                                            placeholder="SGN (Hồ Chí Minh)"
                                            required
                                        />
                                        <ListAirport
                                            setAirport={setDepartureAirport}
                                            open={openDropDownDepartureAirports}
                                            searchAirport={searchAirport}
                                            setSearchAirport={setSearchAirport}
                                            href={pathname}
                                            airpostDropDownRef={airpostDepartureDropDownRef}
                                            setOpenDropDown={setOpenDropdownDepartureAirports}
                                        />
                                    </div>
                                    <div ref={airpostInputArrivalRef} className="grid-col-1 san-bay-den-block relative">
                                        <label
                                            htmlFor="san-bay-den"
                                            className="block pl-2 text-xs font-medium text-gray-900"
                                        >
                                            Đến
                                        </label>
                                        <input
                                            readOnly
                                            value={arrivalAirport}
                                            type="text"
                                            id="san-bay-den"
                                            className="p-2 w-full border rounded bg-gray-50 outline-none border-none font-semibold"
                                            placeholder="HAN (Hà Nội)"
                                            required
                                        />
                                        <ListAirport
                                            setAirport={setArrivalAirport}
                                            open={openDropDownArrivalAirports}
                                            searchAirport={searchAirport}
                                            setSearchAirport={setSearchAirport}
                                            href={pathname}
                                            airpostDropDownRef={airpostArrivalDropDownRef}
                                            setOpenDropDown={setOpenDropdownArrivalAirports}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-5 bg-white">
                                <div className="grid grid-cols-5 gap-x-4 p-2">
                                    <div className="col-span-2 box-border">
                                        <label
                                            htmlFor="ngay-di"
                                            className="block text-xs font-medium text-gray-900"
                                        >
                                            Ngày đi
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="ngay-di"
                                            name="ngay-di"
                                            className="w-full p-2 border h-[38px] rounded bg-gray-50 outline-none border-none font-semibold"
                                            readOnly
                                            value={departmentDate}
                                        />
                                    </div>
                                    {/* <div className="col-span-2 box-border">
                                        <label
                                            htmlFor="ngay-ve"
                                            className="block text-xs font-medium text-gray-900"
                                        >
                                            Ngày về
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="ngay-ve"
                                            name="ngay-ve"
                                            className="w-full p-2 border h-[38px] rounded bg-gray-200 outline-none border-none font-semibold"
                                            readOnly
                                            value={ngayVe}
                                            // disabled={khuHoi ? false : true}
                                            disabled
                                        />
                                    </div> */}
                                    <div
                                        ref={passengerDropDownRef}
                                        className="col-span-2 dropdown-hanh-khach-input relative"
                                    >
                                        <label
                                            htmlFor="first_name"
                                            className="block pl-2 text-xs font-medium text-gray-900"
                                        >
                                            Hành khách
                                        </label>
                                        <input
                                            type="text"
                                            disabled={true}
                                            id="first_name"
                                            className="p-2 w-full border rounded bg-gray-100 outline-none border-none font-semibold"
                                            placeholder="Phổ thông"
                                            required
                                            readOnly
                                            value={adult + child + infant}
                                            onClick={() => setOpenDropdownPassengers(!openDropDownPassengers)}
                                            style={{ backgroundColor: 'rgb(229, 231, 235)' }}
                                        />
                                        <PassengersDropDown
                                            adult={adult}
                                            child={child}
                                            infant={infant}
                                            openDropDownPassengers={openDropDownPassengers}
                                            setAdult={setAdult}
                                            setChild={setChild}
                                            setInfant={setInfant}
                                            setOpenDropdownPassengers={setOpenDropdownPassengers}
                                            href={pathname}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <button
                                            onClick={() => searchFlightChange()}
                                            className="bg-blue-500 hover:bg-blue-400 h-full w-full rounded-md flex justify-center items-center"
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
                                    {/* <span className="text-red-500 text-xs col-span-5">{ngayVeMessageValidate}</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setSearchFlightPopup(false)}
                        className="bg-white p-2 rounded-md hover:bg-gray-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}