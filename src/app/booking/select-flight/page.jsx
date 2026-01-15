'use client';

import Breadcrumb from '@/components/breadcrumb';
import ConsecutiveDays from '@/components/select-flight/next_days';
import PriceInfomation from '@/components/passengers-info/price_info';
// import Filter from '@/components/select-flight/bo_loc';
import ListFlightTravelOptions from '@/components/select-flight/list_flight';
import SelectedFlight from '@/components/select-flight/selected_flight';
import Steps from '@/components/select-flight/steps';
import HomePageSearchForm from '@/components/home-page/search_form';
import { getTravelOptions, formatTravelOptions } from '@/services/travelOptions/functions';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getCompany } from '@/services/companies/functions';
import { toast } from 'react-hot-toast';

// Custom hook để đọc sessionStorage một lần
const useSessionStorageData = () => {
    return useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                cityPair: null,
                departmentDate: null,
                returnDate: null,
                roundTrip: null,
                currency: 'VND',
                adult: null,
                child: null,
                infant: null,
                departureCity: null,
                arrivalCity: null,
                activeSelectFlightParam: null,
                promoCode: null,
            };
        }

        return {
            cityPair: sessionStorage.getItem('cityPairSearchParam'),
            departmentDate: sessionStorage.getItem('departmentDateSearchParam'),
            returnDate: sessionStorage.getItem('returnDateSearchParam'),
            roundTrip: JSON.parse(sessionStorage.getItem('roundTripSearchParam')),
            currency: sessionStorage.getItem('currencySearchParam') ?? 'VND',
            adult: parseInt(sessionStorage.getItem('adultSearchParam')),
            child: parseInt(sessionStorage.getItem('childSearchParam')),
            infant: parseInt(sessionStorage.getItem('infantSearchParam')),
            departureCity: sessionStorage.getItem('departureCitySearchParam'),
            arrivalCity: sessionStorage.getItem('arrivalCitySearchParam'),
            activeSelectFlightParam: sessionStorage.getItem('activeSelectFlightSearchParam'),
            promoCode: sessionStorage.getItem('promoCodeSearchParam'),
        };
    }, []); // Empty dependency array - chỉ chạy một lần
};

export default function ListFlightPage() {
    const router = useRouter();
    const pathname = usePathname();
    
    // Sử dụng custom hook để đọc sessionStorage
    const sessionData = useSessionStorageData();
    const {
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
        activeSelectFlightParam,
        promoCode,
    } = sessionData;

    const [listFlightTraveloptions, setListFlightTravelOptions] = useState();
    const [activeSelectFlight, setActiveSelectFlight] = useState(activeSelectFlightParam);
    const [departureFlight, setDepartureFlight] = useState(null);
    const [returnFlight, setReturnFlight] = useState(null);
    const [typeSearchForm, setTypeSearchForm] = useState(null);
    const [companyKey, setCompanyKey] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [fareOptionsDepartureFlight, setFareOptionsDepartureFlight] = useState(null);
    const [fareOptionsReturnFlight, setFareOptionsReturnFlight] = useState(null);

    // Memoize breadcrumb để tránh tạo lại object
    const listBreadcrumb = useMemo(() => [
        { title: 'Tìm vé', uri: '/booking' },
        { title: 'Danh sách vé', uri: '/booking/select-flight' },
    ], []);

    // Memoize compareDates function
    const compareDates = useCallback((departureDay, returnDay) => {
        const date1 = new Date(departureDay);
        const date2 = new Date(returnDay);
        return date1 <= date2;
    }, []);

    // Memoize handleGetCompany function
    const handleGetCompany = useCallback(async () => {
        try {
            const data = await getCompany();
            setCompanyKey(data.key);
        } catch (error) {
            console.error('Error fetching company:', error);
        }
    }, []);

    // Memoize navigateToPassengerInfomationPage function
    const navigateToPassengerInfomationPage = useCallback(() => {
        if (roundTrip) {
            if (
                compareDates(
                    departureFlight.flights[0].departure.localScheduledTime,
                    returnFlight.flights[0].departure.localScheduledTime,
                )
            ) {
                const url = `/booking/passengers-info?cityPair=${cityPair}&departure=${departmentDate}&roundTrip=${roundTrip}&comeback=${returnDate}&currency=${currency}&adultCount=${adult}&childCount=${child}&infantCount=${infant}&departureCity=${departureCity}&arrivalCity=${arrivalCity}&activeSelectFlight=${'đi'}`;
                sessionStorage.setItem('departureFlight', JSON.stringify(departureFlight));
                sessionStorage.setItem('returnFlight', JSON.stringify(returnFlight));
                sessionStorage.setItem('fareOptionsDepartureFlight', fareOptionsDepartureFlight);
                sessionStorage.setItem('fareOptionsReturnFlight', fareOptionsReturnFlight);
                router.push(url);
            } else {
                toast.error("Chuyến bay đi phải trước chuyến bay về");
            }
        } else {
            const url = `/booking/passengers-info?cityPair=${cityPair}&departure=${departmentDate}&roundTrip=${roundTrip}&comeback=${returnDate}&currency=${currency}&adultCount=${adult}&childCount=${child}&infantCount=${infant}&departureCity=${departureCity}&arrivalCity=${arrivalCity}&activeSelectFlight=${'đi'}`;
            sessionStorage.setItem('departureFlight', JSON.stringify(departureFlight));
            sessionStorage.setItem('returnFlight', JSON.stringify(returnFlight));
            sessionStorage.setItem('fareOptionsDepartureFlight', fareOptionsDepartureFlight);
            sessionStorage.setItem('fareOptionsReturnFlight', fareOptionsReturnFlight);
            router.push(url);
        }
    }, [
        roundTrip,
        compareDates,
        departureFlight,
        returnFlight,
        cityPair,
        departmentDate,
        returnDate,
        currency,
        adult,
        child,
        infant,
        departureCity,
        arrivalCity,
        fareOptionsDepartureFlight,
        fareOptionsReturnFlight,
        router
    ]);

    // Memoize API call parameters để tránh call API không cần thiết
    const apiCallParams = useMemo(() => ({
        activeSelectFlight,
        date: activeSelectFlight === 'đi' ? departmentDate : returnDate,
        cityPair,
        currency,
        infant,
        adult,
        child,
        promoCode,
        companyKey,
    }), [activeSelectFlight, departmentDate, returnDate, cityPair, currency, infant, adult, child, promoCode, companyKey]);

    // Memoize scroll behavior
    const scrollToSelectFlight = useCallback(() => {
        const element = document.getElementById('select-flight');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, []);

    // Memoize computed values
    const numberOfPassengers = useMemo(() => adult + child + infant, [adult, child, infant]);
    const departureAirportText = useMemo(() => 
        `${departureCity?.replaceAll('_', ' ')} (${cityPair?.split('-')[0]})`, 
        [departureCity, cityPair]
    );
    const arrivalAirportText = useMemo(() => 
        `${arrivalCity?.replaceAll('_', ' ')} (${cityPair?.split('-')[1]})`, 
        [arrivalCity, cityPair]
    );
    const returnDepartureAirportText = useMemo(() => 
        `${arrivalCity?.replaceAll('_', ' ')} (${cityPair?.split('-')[1]})`, 
        [arrivalCity, cityPair]
    );
    const returnArrivalAirportText = useMemo(() => 
        `${departureCity?.replaceAll('_', ' ')} (${cityPair?.split('-')[0]})`, 
        [departureCity, cityPair]
    );

    // Memoize current flying day
    const currentFlyingDay = useMemo(() => 
        activeSelectFlight === 'đi' ? departmentDate : returnDate, 
        [activeSelectFlight, departmentDate, returnDate]
    );

    // Memoize selected flight and setter based on activeSelectFlight
    const selectedFlight = useMemo(() => 
        activeSelectFlight === 'đi' ? departureFlight : returnFlight, 
        [activeSelectFlight, departureFlight, returnFlight]
    );
    
    const setSelectedFlight = useCallback((flight) => {
        if (activeSelectFlight === 'đi') {
            setDepartureFlight(flight);
        } else {
            setReturnFlight(flight);
        }
    }, [activeSelectFlight]);

    const setFareOptionFlight = useCallback((fareOption) => {
        if (activeSelectFlight === 'đi') {
            setFareOptionsDepartureFlight(fareOption);
        } else {
            setFareOptionsReturnFlight(fareOption);
        }
    }, [activeSelectFlight]);

    useEffect(() => {
        if (pathname.includes('booking')) {
            setTypeSearchForm('Đặt vé');
        } else if (pathname.includes('booking-management')) {
            setTypeSearchForm('Quản lý đặt chỗ');
        }
        handleGetCompany();
    }, [pathname, handleGetCompany]);

    useEffect(() => {
        if (!roundTrip && departureFlight?.flights?.length) {
            scrollToSelectFlight();
        }
        if (roundTrip && departureFlight?.flights?.length && returnFlight?.flights?.length) {
            scrollToSelectFlight();
        }
    }, [departureFlight, returnFlight, roundTrip, scrollToSelectFlight]);

    useEffect(() => {
        if (listFlightTraveloptions) {
            setLoadingStatus(false);
        }
    }, [listFlightTraveloptions]);

    // Optimized API call with proper dependencies
    useEffect(() => {
        if (cityPair && companyKey) {
            setListFlightTravelOptions(null);
            const getListFlightTravelOptions = async () => {
                try {
                    const result = await getTravelOptions(
                        apiCallParams.activeSelectFlight,
                        apiCallParams.date,
                        apiCallParams.cityPair,
                        apiCallParams.currency,
                        apiCallParams.infant,
                        apiCallParams.adult,
                        apiCallParams.child,
                        apiCallParams.promoCode,
                        apiCallParams.companyKey
                    );
                    setListFlightTravelOptions(formatTravelOptions(result));
                } catch (error) {
                    router.replace('/');
                }
            };
            getListFlightTravelOptions();
        }
    }, [apiCallParams, cityPair, companyKey, router]);

    return (
        <>
        {
            cityPair && listFlightTraveloptions
            ?
            <section className="relative mt-[74px] sm:mt-0">
                <Steps />
                <div className="flex flex-wrap justify-center p-2 sm:p-4 min-h-screen bg-gray-100 border shadow">
                    <div className={` w-full max-w-[1200px]`}>
                        <Breadcrumb listBreadcrumb={listBreadcrumb} />
                        {/* <HomePageSearchForm
                            typeSearchForm={typeSearchForm}
                            loadingStatus={loadingStatus}
                            setLoadingStatus={setLoadingStatus}
                        /> */}
                        <div>
                            <div className="grid grid-cols-2 sm:gap-4 gap-2 mt-4 ">
                                <div id='select-flight' className={`${roundTrip ? 'col-span-2 md:col-span-1' : 'col-span-2'}`}>
                                    <SelectedFlight
                                        direction={'đi'}
                                        departureAirport={departureAirportText}
                                        arrivalAirport={arrivalAirportText}
                                        flyingDay={departmentDate}
                                        numberOfPassenger={numberOfPassengers}
                                        selectedFlight={departureFlight}
                                        activeSelectFlight={activeSelectFlight}
                                        setActiveSelectFlight={setActiveSelectFlight}
                                    />
                                </div>
                                {roundTrip ? (
                                    <div className="col-span-2 md:col-span-1">
                                        <SelectedFlight
                                            direction={'về'}
                                            departureAirport={returnDepartureAirportText}
                                            arrivalAirport={returnArrivalAirportText}
                                            flyingDay={returnDate}
                                            numberOfPassenger={numberOfPassengers}
                                            selectedFlight={returnFlight}
                                            activeSelectFlight={activeSelectFlight}
                                            setActiveSelectFlight={setActiveSelectFlight}
                                        />
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                {roundTrip && departureFlight && returnFlight ? (
                                    <button
                                        id="btn-confirm-round-trip"
                                        onClick={navigateToPassengerInfomationPage}
                                        className="col-span-2 py-3 font-bold flex justify-center items-center rounded-md text-white bg-blue-500 border-2 border-blue-500 hover:bg-white hover:text-blue-500"
                                    >
                                        Xác nhận
                                    </button>
                                ) : (
                                    <></>
                                )}
                                {!roundTrip && departureFlight ? (
                                    <button
                                        id="btn-confirm"
                                        onClick={navigateToPassengerInfomationPage}
                                        className="col-span-2 py-3 font-bold flex justify-center items-center rounded-md text-white bg-blue-500 border-2 border-blue-500 hover:bg-white hover:text-blue-500"
                                    >
                                        Xác nhận
                                    </button>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="grid grid-cols-7 gap-8 mt-4">
                                {/* <Filter /> */}
                                <div className="col-span-5">
                                    <ConsecutiveDays
                                        flyingDay={currentFlyingDay}
                                        activeSelectFlight={activeSelectFlight}
                                        cityPair={cityPair}
                                        currency={currency}
                                        departmentDate={departmentDate}
                                        returnDate={returnDate}
                                        adult={adult}
                                        child={child}
                                        infant={infant}
                                        departureCity={departureCity}
                                        arrivalCity={arrivalCity}
                                        roundTrip={roundTrip}
                                    />
                                    {listFlightTraveloptions ? (
                                        listFlightTraveloptions.length > 0 ? (
                                            <ListFlightTravelOptions
                                                listFlightTraveloptions={listFlightTraveloptions}
                                                adult={adult}
                                                child={child}
                                                infant={infant}
                                                setSelectedFlight={setSelectedFlight}
                                                selectedFlight={selectedFlight}
                                                setFareOptionFlight={setFareOptionFlight}
                                                roundTrip={roundTrip}
                                                direction={activeSelectFlight}
                                                setActiveSelectFlight={setActiveSelectFlight}
                                            />
                                        ) : (
                                            <div className="w-full flex justify-center items-center">
                                                <div className="flex flex-col items-center mt-12">
                                                    <div className="w-[100px] h-[120px] bg-[url('/globalImages/KhongTimThayKetQua.png')] bg-cover"></div>
                                                    <p className="my-1 text-md">Không có chuyến bay nào được tìm thấy</p>
                                                </div>
                                            </div>
                                        )
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            :
            <div className='min-h-screen'>
                <span>Loading...</span>
            </div>
        }
        </>
    );
}