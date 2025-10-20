'use client';

import Breadcrumb from '@/components/breadcrumb';
import Steps from '@/components/danh-sach-ve/steps';
import ConsecutiveMonths from '@/components/tim-ve-re/cac_thang_ke_tiep';
import ListLowFareFlight from '@/components/tim-ve-re/danh_sach_chuyen_gia_re';
import PriceInfomation from '@/components/thong-tin-hanh-khach/thong_tin_gia';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLowFareOptions } from '@/services/lowFareOptions/functions';
import { getCompany } from '@/services/companies/functions';
import { toast } from 'react-hot-toast';

export default function AddService() {
    const listBreadcrumb = [
        { title: 'Tìm vé', uri: '/dat-ve' },
        { title: 'Tìm vé rẻ', uri: '/dat-ve/tim-ve-re' },
    ];
    const router = useRouter();
    const [selectDepartureDay, setSelectDepartureDay] = useState(null);
    const [selectReturnDay, setSelectReturnDay] = useState(null);
    const [lowFareOptionsDeparture, setLowFareOptionsDeparture] = useState(null);
    const [lowFareOptionsReturn, setLowFareOptionsReturn] = useState(null);
    const [companyKey, setCompanyKey] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_PUBLICAPI_URL;
    const cheapFlight = typeof window !== 'undefined' ? sessionStorage.getItem('cheapFlightSearchParam') : null;
    const departmentDate = typeof window !== 'undefined' ? sessionStorage.getItem('departmentDateSearchParam') : null;
    const returnDate = typeof window !== 'undefined' ? sessionStorage.getItem('returnDateSearchParam') : null;
    const roundTrip = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('roundTripSearchParam')) : null;
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') : null;
    const cityPair = typeof window !== 'undefined' ? sessionStorage.getItem('cityPairSearchParam') : null;
    const departureCity = typeof window !== 'undefined' ? sessionStorage.getItem('departureCitySearchParam') : null;
    const arrivalCity = typeof window !== 'undefined' ? sessionStorage.getItem('arrivalCitySearchParam') : null;
    const adult = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('adultSearchParam')) : null;
    const child = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('childSearchParam')) : null;
    const infant = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('infantSearchParam')) : null;
    const promoCode = typeof window !== 'undefined' ? sessionStorage.getItem('promoCodeSearchParam') : null;

    const navigateToListFlight = () => {
        if (roundTrip) {
            if (
                compareDates(
                    selectDepartureDay ? selectDepartureDay : departmentDate,
                    selectReturnDay ? selectReturnDay : returnDate,
                )
            ) {
                sessionStorage.setItem(
                    'departmentDateSearchParam',
                    selectDepartureDay ? selectDepartureDay : departmentDate,
                );
                sessionStorage.setItem('returnDateSearchParam', selectReturnDay ? selectReturnDay : returnDate);
                sessionStorage.setItem(
                    'departmentDateSearchParamUpdate',
                    selectDepartureDay ? selectDepartureDay : departmentDate,
                );
                sessionStorage.setItem('returnDateSearchParamUpdate', selectReturnDay ? selectReturnDay : returnDate);
                router.push('/dat-ve/danh-sach-ve');
            } else {
                toast.error("Ngày về phải lớn hơn hoặc bằng ngày đi");
            }
        } else {
            sessionStorage.setItem(
                'departmentDateSearchParam',
                selectDepartureDay ? selectDepartureDay : departmentDate,
            );
            sessionStorage.setItem('returnDateSearchParam', selectReturnDay ? selectReturnDay : returnDate);
            sessionStorage.setItem(
                'departmentDateSearchParamUpdate',
                selectDepartureDay ? selectDepartureDay : departmentDate,
            );
            sessionStorage.setItem('returnDateSearchParamUpdate', selectReturnDay ? selectReturnDay : returnDate);
            router.push('/dat-ve/danh-sach-ve');
        }
    };

    function compareDates(departureDay, returnDay) {
        const date1 = new Date(departureDay);
        const date2 = new Date(returnDay);
        return date1 <= date2;
    }

    const handleGetCompany = async () => {
        const data = await getCompany();
        setCompanyKey(data.key);
    };

    const handleGetLowFareOptions = async (
        apiUrl,
        cityPair,
        departmentDate,
        currency,
        adult,
        child,
        infant,
        promoCode,
        companyKey,
        setDataFunc,
    ) => {
        const data = await getLowFareOptions(
            apiUrl,
            cityPair,
            departmentDate,
            currency,
            adult,
            child,
            infant,
            promoCode,
            companyKey,
        );
        setDataFunc(data);
    };

    useEffect(() => {
        handleGetCompany();
    }, []);

    useEffect(() => {
        if (cityPair && companyKey) {
            handleGetLowFareOptions(
                apiUrl,
                cityPair,
                departmentDate,
                currency,
                adult,
                child,
                infant,
                promoCode,
                companyKey,
                setLowFareOptionsDeparture,
            );
            handleGetLowFareOptions(
                apiUrl,
                cityPair.split('-').reverse().join('-'),
                returnDate,
                currency,
                adult,
                child,
                infant,
                promoCode,
                companyKey,
                setLowFareOptionsReturn,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl, cityPair, departmentDate, returnDate, currency, adult, child, infant, companyKey]);

    return (
        <>
            {cityPair ? (
                <main className="relative">
                    <Steps />
                    <div className="flex flex-wrap justify-center p-4 min-h-screen bg-gray-100 border shadow">
                        <div className={` w-full max-w-[1200px]`}>
                            <div className="">
                                <Breadcrumb listBreadcrumb={listBreadcrumb} />
                            </div>
                            <div className="grid grid-cols-7 gap-8">
                                <div className="col-span-5">
                                    {departmentDate ? (
                                        <div>
                                            <p className="mb-2 text-gray-700 font-semibold">
                                                Chuyến đi: {departureCity.replaceAll('_', ' ')} (
                                                {cityPair.split('-')[0]}) - {arrivalCity.replaceAll('_', ' ')} (
                                                {cityPair.split('-')[1]})
                                            </p>
                                            <div>
                                                <ConsecutiveMonths
                                                    monthAndYear={
                                                        departmentDate?.split('-')[0] +
                                                        '-' +
                                                        departmentDate?.split('-')[1]
                                                    }
                                                    paramStr={'departmentDate'}
                                                />
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="block w-8 h-8 bg-lime-300 rounded"></span>
                                                    <span className="ml-2">Giá vé thấp nhất</span>
                                                </div>
                                                <div className="flex justify-between items-center ml-10">
                                                    <span className="block w-8 h-8 bg-rose-200 rounded"></span>
                                                    <span className="ml-2">Đang chọn</span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <ListLowFareFlight
                                                    monthAndYear={
                                                        departmentDate?.split('-')[0] +
                                                        '-' +
                                                        departmentDate?.split('-')[1]
                                                    }
                                                    departmentDate={departmentDate}
                                                    setSelectDayConfirm={setSelectDepartureDay}
                                                    listLowFareFlight={lowFareOptionsDeparture}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    {returnDate && roundTrip ? (
                                        <div className="mt-20">
                                            <p className="mb-2 text-gray-700 font-semibold">
                                                Chuyến về: {arrivalCity.replaceAll('_', ' ')} ({cityPair.split('-')[1]})
                                                - {departureCity.replaceAll('_', ' ')} ({cityPair.split('-')[0]})
                                            </p>
                                            <div>
                                                <ConsecutiveMonths
                                                    monthAndYear={
                                                        returnDate?.split('-')[0] + '-' + returnDate?.split('-')[1]
                                                    }
                                                    paramStr={'returnDate'}
                                                />
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="block w-8 h-8 bg-lime-300 rounded"></span>
                                                    <span className="ml-2">Giá vé thấp nhất</span>
                                                </div>
                                                <div className="flex justify-between items-center ml-10">
                                                    <span className="block w-8 h-8 bg-rose-200 rounded"></span>
                                                    <span className="ml-2">Đang chọn</span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <ListLowFareFlight
                                                    monthAndYear={
                                                        returnDate?.split('-')[0] + '-' + returnDate?.split('-')[1]
                                                    }
                                                    departmentDate={returnDate}
                                                    setSelectDayConfirm={setSelectReturnDay}
                                                    listLowFareFlight={lowFareOptionsReturn}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={navigateToListFlight}
                                            className={`bg-sky-500 rounded text-white text-sm font-semibold px-10 py-2 mt-4`}
                                        >
                                            Tiếp theo
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <PriceInfomation
                                        adult={adult}
                                        child={child}
                                        infant={infant}
                                        roundTrip={roundTrip}
                                        cityPair={cityPair}
                                        departureCity={departureCity}
                                        arrivalCity={arrivalCity}
                                    />
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
