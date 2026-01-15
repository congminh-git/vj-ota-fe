'use client';

import Breadcrumb from '@/components/breadcrumb';
import NextDays from '@/components/select-flight/next_days';
import PriceInfomation from '@/components/passengers-info/price_info';
import ListFlightTravelOptions from '@/components/select-flight/list_flight';
import SelectedFlight from '@/components/select-flight/selected_flight';
import Steps from '@/components/select-flight/steps';
import HomePageSearchForm from '@/components/home-page/search_form';
import { getTravelOptions, formatTravelOptions } from '@/services/travelOptions/functions';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getCompany } from '@/services/companies/functions';
import { toast } from 'react-hot-toast';
import Loading from '@/components/loading';
import ProgressLoading from '@/components/progress_loading';

export default function ListFlightPage() {
    const router = useRouter();
    const pathname = usePathname();

    const [sessionData, setSessionData] = useState(null);

    const readSessionStorage = useCallback(() => {
        if (typeof window === 'undefined') return null;

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
    }, []);

    useEffect(() => {
        setSessionData(readSessionStorage());
    }, [readSessionStorage]);

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
    } = sessionData || {};

    const [listFlightTraveloptions, setListFlightTravelOptions] = useState();
    const [activeSelectFlight, setActiveSelectFlight] = useState('đi');
    const [departureFlight, setDepartureFlight] = useState(null);
    const [returnFlight, setReturnFlight] = useState(null);
    const [typeSearchForm, setTypeSearchForm] = useState(null);
    const [companyKey, setCompanyKey] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [fareOptionsDepartureFlight, setFareOptionsDepartureFlight] = useState(null);
    const [fareOptionsReturnFlight, setFareOptionsReturnFlight] = useState(null);
    const [refetchData, setRefetchData] = useState(true);

    const listBreadcrumb = useMemo(
        () => [
            { title: 'Tìm vé', uri: '/booking' },
            { title: 'Danh sách vé', uri: '/booking/select-flight' },
        ],
        [],
    );

    const compareDates = useCallback((departureDay, returnDay) => {
        return new Date(departureDay) <= new Date(returnDay);
    }, []);

    const handleGetCompany = useCallback(async () => {
        try {
            const data = await getCompany();
            setCompanyKey(data.key);
        } catch (error) {
            console.error('Error fetching company:', error);
        }
    }, []);

    const scrollToSelectFlight = useCallback(() => {
        const el = document.getElementById('select-flight');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const numberOfPassengers = useMemo(() => (adult || 0) + (child || 0) + (infant || 0), [adult, child, infant]);
    const departureAirportText = useMemo(
        () => (departureCity && cityPair ? `${departureCity.replaceAll('_', ' ')} (${cityPair.split('-')[0]})` : ''),
        [departureCity, cityPair],
    );
    const arrivalAirportText = useMemo(
        () => (arrivalCity && cityPair ? `${arrivalCity.replaceAll('_', ' ')} (${cityPair.split('-')[1]})` : ''),
        [arrivalCity, cityPair],
    );
    const returnDepartureAirportText = useMemo(
        () => (arrivalCity && cityPair ? `${arrivalCity.replaceAll('_', ' ')} (${cityPair.split('-')[1]})` : ''),
        [arrivalCity, cityPair],
    );
    const returnArrivalAirportText = useMemo(
        () => (departureCity && cityPair ? `${departureCity.replaceAll('_', ' ')} (${cityPair.split('-')[0]})` : ''),
        [departureCity, cityPair],
    );
    const currentFlyingDay = useMemo(
        () => (activeSelectFlight === 'đi' ? departmentDate : returnDate),
        [activeSelectFlight, departmentDate, returnDate],
    );
    const selectedFlight = useMemo(
        () => (activeSelectFlight === 'đi' ? departureFlight : returnFlight),
        [activeSelectFlight, departureFlight, returnFlight],
    );

    const setSelectedFlight = useCallback(
        (flight) => {
            if (activeSelectFlight === 'đi') setDepartureFlight(flight);
            else setReturnFlight(flight);
        },
        [activeSelectFlight],
    );

    const setFareOptionFlight = useCallback(
        (fare) => {
            if (activeSelectFlight === 'đi') setFareOptionsDepartureFlight(fare);
            else setFareOptionsReturnFlight(fare);
        },
        [activeSelectFlight],
    );

    const navigateToPassengerInfomationPage = useCallback(() => {
        if (!departureFlight) return;

        if (roundTrip) {
            if (!returnFlight) return;

            const isValidDate = compareDates(
                departureFlight.flights[0].departure.localScheduledTime,
                returnFlight.flights[0].departure.localScheduledTime,
            );

            if (!isValidDate) {
                toast.error('Chuyến bay đi phải trước chuyến bay về');
                return;
            }
        }

        const url = `/booking/passengers-info?cityPair=${cityPair}&departure=${departmentDate}&roundTrip=${roundTrip}&comeback=${returnDate}&currency=${currency}&adultCount=${adult}&childCount=${child}&infantCount=${infant}&departureCity=${departureCity}&arrivalCity=${arrivalCity}&activeSelectFlight=đi`;

        sessionStorage.setItem('departureFlight', JSON.stringify(departureFlight));
        sessionStorage.setItem('returnFlight', JSON.stringify(returnFlight));
        sessionStorage.setItem('fareOptionsDepartureFlight', fareOptionsDepartureFlight);
        sessionStorage.setItem('fareOptionsReturnFlight', fareOptionsReturnFlight);

        router.push(url);
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
        router,
    ]);

    useEffect(() => {
        if (pathname.includes('booking')) setTypeSearchForm('Đặt vé');
        if (pathname.includes('booking-management')) setTypeSearchForm('Quản lý đặt chỗ');
        handleGetCompany();
    }, [pathname, handleGetCompany]);

    useEffect(() => {
        if (!roundTrip && departureFlight) scrollToSelectFlight();
        if (roundTrip && departureFlight && returnFlight) scrollToSelectFlight();
    }, [departureFlight, returnFlight, roundTrip, scrollToSelectFlight]);

    useEffect(() => {
        if (listFlightTraveloptions) setLoadingStatus(false);
    }, [listFlightTraveloptions]);

    useEffect(() => {
        if (refetchData) {
            setSessionData(readSessionStorage());
        }
    }, [refetchData, readSessionStorage]);

    useEffect(() => {
        if (!cityPair || !companyKey || !refetchData) return;
        setLoadingStatus(true);
        setListFlightTravelOptions(null);

        const fetchData = async () => {
            try {
                const result = await getTravelOptions(
                    activeSelectFlight,
                    activeSelectFlight === 'đi' ? departmentDate : returnDate,
                    cityPair,
                    currency,
                    infant,
                    adult,
                    child,
                    promoCode,
                    companyKey,
                );

                setListFlightTravelOptions(formatTravelOptions(result));
                setRefetchData(false);
            } catch (error) {
                router.replace('/');
            }
        };

        fetchData();
    }, [
        refetchData,
        activeSelectFlight,
        departmentDate,
        returnDate,
        cityPair,
        currency,
        infant,
        adult,
        child,
        promoCode,
        companyKey,
        router,
    ]);

    return (
        <div className="min-h-screen">
            {cityPair ? (
                <section className="relative mt-[74px] sm:mt-0">
                    <Steps />
                    <div className="flex flex-wrap justify-center p-2 sm:p-4 min-h-screen bg-gray-100 border shadow">
                        <div className={` w-full max-w-[1200px]`}>
                            <Breadcrumb listBreadcrumb={listBreadcrumb} />
                            <div>
                                <div className="grid grid-cols-8 gap-2 sm:gap-8 mt-4">
                                    <div className="col-span-8 mb-2 block sm:hidden">
                                        <div id="select-flight">
                                            <SelectedFlight
                                                direction={'đi'}
                                                departureAirport={departureAirportText}
                                                arrivalAirport={arrivalAirportText}
                                                flyingDay={departmentDate}
                                                numberOfPassenger={numberOfPassengers}
                                                selectedFlight={departureFlight}
                                                activeSelectFlight={activeSelectFlight}
                                                setActiveSelectFlight={setActiveSelectFlight}
                                                setRefetchData={setRefetchData}
                                            />
                                        </div>
                                        {roundTrip ? (
                                            <div className="mt-2">
                                                <SelectedFlight
                                                    direction={'về'}
                                                    departureAirport={returnDepartureAirportText}
                                                    arrivalAirport={returnArrivalAirportText}
                                                    flyingDay={returnDate}
                                                    numberOfPassenger={numberOfPassengers}
                                                    selectedFlight={returnFlight}
                                                    activeSelectFlight={activeSelectFlight}
                                                    setActiveSelectFlight={setActiveSelectFlight}
                                                    setRefetchData={setRefetchData}
                                                />
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                    {/* <Filter /> */}
                                    <div className="col-span-8 sm:col-span-5">
                                        <NextDays
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
                                            setRefetchData={setRefetchData}
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
                                                    setRefetchData={setRefetchData}
                                                />
                                            ) : (
                                                <div className="w-full flex justify-center items-center">
                                                    <div className="flex flex-col items-center mt-12">
                                                        <div className="w-[100px] h-[120px] bg-[url('/globalImages/KhongTimThayKetQua.png')] bg-cover"></div>
                                                        <p className="my-1 text-md">
                                                            Không có chuyến bay nào được tìm thấy
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="mt-20 flex justify-center">
                                                <Loading />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-3 hidden sm:block">
                                        <div className="mb-2">
                                            <div id="select-flight">
                                                <SelectedFlight
                                                    direction={'đi'}
                                                    departureAirport={departureAirportText}
                                                    arrivalAirport={arrivalAirportText}
                                                    flyingDay={departmentDate}
                                                    numberOfPassenger={numberOfPassengers}
                                                    selectedFlight={departureFlight}
                                                    activeSelectFlight={activeSelectFlight}
                                                    setActiveSelectFlight={setActiveSelectFlight}
                                                    setRefetchData={setRefetchData}
                                                />
                                            </div>
                                            {roundTrip ? (
                                                <div className="mt-2">
                                                    <SelectedFlight
                                                        direction={'về'}
                                                        departureAirport={returnDepartureAirportText}
                                                        arrivalAirport={returnArrivalAirportText}
                                                        flyingDay={returnDate}
                                                        numberOfPassenger={numberOfPassengers}
                                                        selectedFlight={returnFlight}
                                                        activeSelectFlight={activeSelectFlight}
                                                        setActiveSelectFlight={setActiveSelectFlight}
                                                        setRefetchData={setRefetchData}
                                                    />
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
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
                                        {roundTrip && departureFlight && returnFlight ? (
                                            <button
                                                id="btn-confirm-round-trip"
                                                onClick={navigateToPassengerInfomationPage}
                                                className="btn-continue mt-2 py-4 w-full font-bold flex justify-center items-center rounded-md text-white bg-yellow-400 border-yellow-400 hover:bg-yellow-500 transition-all"
                                            >
                                                Tiếp theo
                                            </button>
                                        ) : (
                                            <></>
                                        )}
                                        {!roundTrip && departureFlight ? (
                                            <button
                                                id="btn-confirm"
                                                onClick={navigateToPassengerInfomationPage}
                                                className="btn-continue mt-2 py-4 w-full font-bold flex justify-center items-center rounded-md text-white bg-yellow-400 border-yellow-400 hover:text-white hover:bg-yellow-500 transition-all"
                                            >
                                                Tiếp theo
                                            </button>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="block sm:hidden fixed bottom-0 left-0 w-full bg-white p-2 sm:p-4 border-t shadow">
                                {roundTrip && departureFlight && returnFlight ? (
                                    <button
                                        id="btn-confirm-round-trip"
                                        onClick={navigateToPassengerInfomationPage}
                                        className="btn-continue py-4 w-full font-bold flex justify-center items-center rounded-md text-white bg-yellow-400 border-yellow-400 hover:bg-yellow-500 transition-all"
                                    >
                                        Tiếp theo
                                    </button>
                                ) : (
                                    <></>
                                )}
                                {!roundTrip && departureFlight ? (
                                    <button
                                        id="btn-confirm"
                                        onClick={navigateToPassengerInfomationPage}
                                        className="btn-continue py-4 w-full font-bold flex justify-center items-center rounded-md text-white bg-yellow-400 border-yellow-400 hover:text-white hover:bg-yellow-500 transition-all"
                                    >
                                        Tiếp theo
                                    </button>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <ProgressLoading loading={loadingStatus} />
            )}
        </div>
    );
}
