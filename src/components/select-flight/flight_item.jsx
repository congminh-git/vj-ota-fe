'use client';

import Icon from '../icon';
import { faSuitcase, faPercent, faTicket, faShield, faSlash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { fareRule } from '@/lib/fareRule';
import { getCurrencySymbol } from '@/lib/parseCurrency';

function FlightItem({
    flightItemData,
    adult,
    child,
    infant,
    setSelectedFlight,
    selectedFlight,
    setFareOptionFlight,
    roundTrip,
    direction,
    setActiveSelectFlight,
}) {
    const [tab, setTab] = useState(0);
    const [tabFareOption, setTabFareOption] = useState(0);
    const [fareOptions, setFareOptions] = useState([]);

    const classFlight = ['ECO', 'DLX', 'SBoss', 'Boss'];
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;

    const getFareClass = (code) => {
        if (code.includes('ECO')) return 'Eco';
        if (code.includes('DLX')) return 'Deluxe';
        if (code.includes('SBoss')) return 'SkyBoss';
        if (code.includes('Boss')) return 'Business';
        return '';
    };

    const showFlightDetail = (event) => {
        const button = event.target;
        const element = button.closest('.ticket-item');
        const detail = element.querySelector('.chi-tiet-item');
        detail.style.display = 'grid';
        button.style.display = 'none';
    };

    const hideFlightDetail = (event) => {
        const button = event.target;
        const element = button.closest('.ticket-item');
        const detail = element.querySelector('.chi-tiet-item');
        const showBtn = element.querySelector('.show-detail-btn');
        detail.style.display = 'none';
        showBtn.style.display = 'flex';
    };

    const handleSelect = (event) => {
        const button = event.target;
        const element = button.closest('.ticket-item');
        const showDetailBtn = element.querySelector('.show-detail-btn');
        const detail = element.querySelector('.chi-tiet-item');
        detail.style.display = 'grid';
        showDetailBtn.style.display = 'none';
        setTab(1);
    };

    const handleSelectThisFlight = (event) => {
        setSelectedFlight(flightItemData);
        const validFareOptions = flightItemData.fareOptions.filter((item) => item.fareValidity.valid);
            validFareOptions.sort((a, b) => {
                return (
                    classFlight.indexOf(a.fareClass.code.split('_')[1]) -
                    classFlight.indexOf(b.fareClass.code.split('_')[1])
                );
            });
        setFareOptionFlight(validFareOptions[tabFareOption].bookingCode.key);
        const button = event.target;
        const element = button.closest('.ticket-item');
        const showDetailBtn = element.querySelector('.show-detail-btn');
        const detail = element.querySelector('.chi-tiet-item');
        detail.style.display = 'none';
        showDetailBtn.style.display = 'block';
        if (direction == 'đi' && roundTrip) {
            setActiveSelectFlight('về');
        }
    };

    const [currencySymbol, setCurrencySymbol] = useState('');

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (flightItemData?.fareOptions) {
            const validFareOptions = flightItemData.fareOptions.filter((item) => item.fareValidity.valid);
            validFareOptions.sort((a, b) => {
                return (
                    classFlight.indexOf(a.fareClass.code.split('_')[1]) -
                    classFlight.indexOf(b.fareClass.code.split('_')[1])
                );
            });
            setFareOptions(validFareOptions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={`${
                selectedFlight == flightItemData
                    ? 'hover:border-yellow-400 border-yellow-400'
                    : 'hover:border-sky-400 border-transparent'
            } ticket-item border-2 mb-2 rounded-md`}
        >
            <div className="sm:p-4 p-2 bg-white rounded-md grid grid-cols-3 cursor-pointer">
                <div className="flex justify-start items-center">
                    <div className='w-[44px] h-[44px] bg-cover bg-[url("/VJ.png")]'></div>
                    <div className="ml-4">
                        <p className="font-medium">
                            <i>Vietjet Air</i>
                        </p>
                        <p className="text-sm text-gray-700">{`${flightItemData?.flights[0].airlineCode} ${flightItemData?.flights[0].flightNumber}`}</p>
                        <button
                            onClick={(event) => showFlightDetail(event)}
                            className="show-detail-btn text-xs text-blue-400 font-semibold flex justify-start items-center"
                        >
                            Chi tiết vé
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-3 h-3 ml-1"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <div className={`grid grid-cols-5 ${flightItemData?.flights[1] ? 'h-1/2' : 'h-full'}`}>
                        <div className="col-span-1">
                            <div className="h-1/3 font-semibold">
                                {parseNgayThang(flightItemData?.flights[0].departure.localScheduledTime).time}
                            </div>
                            <div className="h-1/3"></div>
                            <div className="h-1/3 text-gray-500 text-sm">
                                {flightItemData?.flights[0].departure.airportCode}
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="h-1/3 text-sky-400 text-sm w-full text-center mb-1">
                                {tinhThoiGianBay(
                                    flightItemData?.flights[0].departure.localScheduledTime,
                                    flightItemData?.flights[0].arrival.localScheduledTime,
                                )}
                            </div>
                            <div className="h-1/3 flex justify-between items-center relative">
                                <div className="w-2 h-2 bg-[url('/globalImages/Group16.png')] bg-cover"></div>
                                <div className="bg-[url('/globalImages/Vector1.png')] h-[1px] flex-grow"></div>
                                <div className="w-2 h-2 bg-[url('/globalImages/Group16.png')] bg-cover"></div>
                                <div className="w-5 h-5 bg-[url('/globalImages/airplane1.png')] bg-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                            <div className="h-1/3 text-gray-500 text-xs w-full text-center mt-1">
                                {flightItemData.flights[1] ? 'Nối chuyến' : 'Bay thẳng'}
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="h-1/3 font-semibold">
                                {parseNgayThang(flightItemData?.flights[0].arrival.localScheduledTime).time}
                            </div>
                            <div className="h-1/3"></div>
                            <div className="h-1/3 text-gray-500 text-sm">
                                {flightItemData?.flights[0].arrival.airportCode}
                            </div>
                        </div>
                    </div>
                </div>

                {flightItemData?.flights[1] ? (
                    <>
                        <br />
                        <div className="flex justify-start items-center mt-4">
                            <div className='w-[44px] h-[44px] bg-cover bg-[url("/VJ.png")]'></div>
                            <div className="ml-4">
                                <p className="font-medium">
                                    <i>Vietjet Air</i>
                                </p>
                                <p className="text-sm text-gray-700">{`${flightItemData?.flights[1].airlineCode} ${flightItemData?.flights[1].flightNumber}`}</p>
                                <button
                                    onClick={(event) => showFlightDetail(event)}
                                    className="show-detail-btn text-xs text-blue-400 font-semibold flex justify-start items-center"
                                >
                                    Chi tiết vé
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-3 h-3 ml-1"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className={`grid grid-cols-5 mt-4 ${flightItemData?.flights[1] ? 'h-1/2' : 'h-full'}`}>
                                <div className="col-span-1">
                                    <div className="h-1/3 font-semibold">
                                        {parseNgayThang(flightItemData?.flights[1].departure.localScheduledTime).time}
                                    </div>
                                    <div className="h-1/3"></div>
                                    <div className="h-1/3 text-gray-500 text-sm">
                                        {flightItemData?.flights[1].departure.airportCode}
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div className="h-1/3 text-sky-400 text-sm w-full text-center mb-1">
                                        {tinhThoiGianBay(
                                            flightItemData?.flights[1].departure.localScheduledTime,
                                            flightItemData?.flights[1].arrival.localScheduledTime,
                                        )}
                                    </div>
                                    <div className="h-1/3 flex justify-between items-center relative">
                                        <div className="w-2 h-2 bg-[url('/globalImages/Group16.png')] bg-cover"></div>
                                        <div className="bg-[url('/globalImages/Vector1.png')] h-[1px] flex-grow"></div>
                                        <div className="w-2 h-2 bg-[url('/globalImages/Group16.png')] bg-cover"></div>
                                        <div className="w-5 h-5 bg-[url('/globalImages/airplane1.png')] bg-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                    </div>
                                    <div className="h-1/3 text-gray-500 text-xs w-full text-center mt-1">
                                        {flightItemData.flights[1] ? 'Nối chuyến' : 'Bay thẳng'}
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="h-1/3 font-semibold">
                                        {parseNgayThang(flightItemData?.flights[1].arrival.localScheduledTime).time}
                                    </div>
                                    <div className="h-1/3"></div>
                                    <div className="h-1/3 text-gray-500 text-sm">
                                        {flightItemData?.flights[1].arrival.airportCode}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                <div className="flex justify-end items-center">
                    <div className="mr-2">
                        {fareOptions?.[tabFareOption]?.promoCodeApplied ? (
                            <>
                                <p className="text-md font-semibold text-sky-400 text-end">
                                    <span>
                                        {fareOptions?.[tabFareOption]?.totalAdult.toLocaleString()} {currencySymbol}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500 text-end line-through">
                                    {(
                                        fareOptions?.[tabFareOption]?.totalAdult +
                                        fareOptions?.[tabFareOption]?.discountAmount +
                                        fareOptions?.[tabFareOption]?.discountAmount * 0.1
                                    ).toLocaleString()}{' '}
                                    {currencySymbol}
                                </p>
                            </>
                        ) : (
                            <p className="text-md font-semibold text-sky-400 text-end">
                                {fareOptions?.[tabFareOption]?.totalAdult.toLocaleString()} {currencySymbol}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={(event) => handleSelect(event)}
                            className={` bg-sky-400 text-white text-sm font-semibold rounded-md hover:bg-sky-300 py-4 px-6 flex justify-between items-center`}
                        >
                            <i>Chọn</i>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className="chi-tiet-item p-4 bg-white rounded-md text-xs font-medium border-t"
                style={{ display: 'none' }}
            >
                <div className="w-full flex justify-start mb-4 text-sm border-b">
                    <button
                        className={`px-4 border-b-2 ${tab == 0 ? 'border-sky-400 text-sky-400' : 'border-transparent'}`}
                        onClick={() => setTab(0)}
                    >
                        Chi tiết vé
                    </button>
                    <button
                        className={`px-4 border-b-2 ${tab == 1 ? 'border-sky-400 text-sky-400' : 'border-transparent'}`}
                        onClick={() => setTab(1)}
                    >
                        Giá vé
                    </button>
                </div>

                <div className="flex justify-around border">
                    {classFlight.map((item, index) => {
                        const isDisabled = !fareOptions?.[index]?.fareClass.code.includes(item);
                        return (
                            <div
                                key={index}
                                className={`w-1/4 h-full ${
                                    tabFareOption === index ? 'bg-sky-300 text-white-400' : 'border-transparent'
                                }`}
                            >
                                <button
                                    disabled={isDisabled}
                                    className={`p-4 border w-full text-gray-700 font-semibold ${
                                        isDisabled
                                            ? 'cursor-not-allowed opacity-50 bg-gray-300 text-gray-400'
                                            : 'cursor-pointer'
                                    }`}
                                    key={index}
                                    value={index}
                                    onClick={() => setTabFareOption(index)}
                                >
                                    {getFareClass(item)}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Tab 1 */}
                <div className={`${tab == 0 ? 'block' : 'hidden'}`}>
                    <div className="">
                        <p className="mt-4 text-sm">Bao gồm:</p>
                        {fareRule[
                            fareOptions?.[tabFareOption]?.fareClass.code.includes('_ECO')
                                ? 'eco'
                                : fareOptions?.[tabFareOption]?.fareClass.code.includes('_DLX')
                                ? 'deluxe'
                                : fareOptions?.[tabFareOption]?.fareClass.code.includes('_SBoss')
                                ? 'skyBoss'
                                : 'business'
                        ].apply.map((rule, index) => {
                            return (
                                <p key={`rule-apply-${index}`} className="mt-2 flex justify-start items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="h-6 w-6 text-green-500 block flex-shrink-0"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                    <span className="ml-2 text-sm">{rule}</span>
                                </p>
                            );
                        })}
                        {fareRule[
                            fareOptions?.[tabFareOption]?.fareClass.code.includes('ECO')
                                ? 'eco'
                                : fareOptions?.[tabFareOption]?.fareClass.code.includes('DLX')
                                ? 'deluxe'
                                : fareOptions?.[tabFareOption]?.fareClass.code.includes('SBoss')
                                ? 'skyBoss'
                                : 'business'
                        ].notApply.length > 0 ? (
                            <>
                                <p className="mt-4 text-sm">Không bao gồm:</p>
                                {fareRule[
                                    fareOptions?.[tabFareOption]?.fareClass.code.includes('ECO')
                                        ? 'eco'
                                        : fareOptions?.[tabFareOption]?.fareClass.code.includes('DLX')
                                        ? 'deluxe'
                                        : fareOptions?.[tabFareOption]?.fareClass.code.includes('SBoss')
                                        ? 'skyBoss'
                                        : 'business'
                                ].notApply.map((rule, index) => {
                                    return (
                                        <p
                                            key={`rule-not-apply-${index}`}
                                            className="mt-2 flex justify-start items-center"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="h-6 w-6 text-red-500 block flex-shrink-0"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                            </svg>
                                            <span className="ml-2 text-sm">{rule}</span>
                                        </p>
                                    );
                                })}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                {/* Tab 2 */}
                <div className={`${tab == 1 ? 'block' : 'hidden'} p-4 rounded border bg-gray-50`}>
                    <div className="relative overflow-x-auto mt-4">
                        <table className="w-full text-sm text-center rtl:text-right text-gray-500 border">
                            <thead className="text-xs text-gray-700 bg-gray-50 border">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Loại vé
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Giá vé
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Thuế, phí
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Thành tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        Người lớn
                                    </th>
                                    <td className="px-6 py-4">
                                        {fareOptions?.[tabFareOption]?.priceAdult.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(
                                            fareOptions?.[tabFareOption]?.totalAdult -
                                            fareOptions?.[tabFareOption]?.priceAdult
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {fareOptions?.[tabFareOption]?.totalAdult.toLocaleString()}
                                    </td>
                                </tr>
                                {child ? (
                                    <tr className="bg-white border-b">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                        >
                                            Trẻ em
                                        </th>
                                        <td className="px-6 py-4">
                                            {fareOptions?.[tabFareOption]?.priceChild.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(
                                                fareOptions?.[tabFareOption]?.totalChild -
                                                fareOptions?.[tabFareOption]?.priceChild
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {fareOptions?.[tabFareOption]?.totalChild.toLocaleString()}
                                        </td>
                                    </tr>
                                ) : null}
                                {infant ? (
                                    <tr className="bg-white">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                        >
                                            Em bé
                                        </th>
                                        <td className="px-6 py-4">
                                            {fareOptions?.[tabFareOption]?.priceInfant.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(
                                                fareOptions?.[tabFareOption]?.totalInfant -
                                                fareOptions?.[tabFareOption]?.priceInfant
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {fareOptions?.[tabFareOption]?.totalInfant.toLocaleString()}
                                        </td>
                                    </tr>
                                ) : null}
                                {/* <tr className="bg-white">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        Tổng cộng
                                    </th>
                                    <td className="px-6 py-4">
                                        {(
                                            fareOptions?.[tabFareOption]?.priceAdult * adult +
                                            fareOptions?.[tabFareOption]?.priceChild * child +
                                            fareOptions?.[tabFareOption]?.priceInfant * infant
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(
                                            fareOptions?.[tabFareOption]?.totalAdult * adult +
                                            fareOptions?.[tabFareOption]?.totalChild * child +
                                            fareOptions?.[tabFareOption]?.totalInfant * infant -
                                            fareOptions?.[tabFareOption]?.priceAdult * adult -
                                            fareOptions?.[tabFareOption]?.priceChild * child -
                                            fareOptions?.[tabFareOption]?.priceInfant * infant
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(
                                            fareOptions?.[tabFareOption]?.totalAdult * adult +
                                            fareOptions?.[tabFareOption]?.totalChild * child +
                                            fareOptions?.[tabFareOption]?.totalInfant * infant
                                        ).toLocaleString()}
                                    </td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={`mt-4 ${tab == 0 ? 'block' : 'hidden'}`}>
                    <button
                        onClick={(event) => hideFlightDetail(event)}
                        className="hide-detail-btn text-xs text-blue-400 font-semibold flex justify-start items-center"
                    >
                        Ẩn
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-3 h-3 ml-1"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                    </button>
                </div>
                <div className={`mt-4 flex justify-between ${tab == 1 ? 'block' : 'hidden'}`}>
                    <button
                        onClick={(event) => hideFlightDetail(event)}
                        className="hide-detail-btn text-xs text-blue-400 font-semibold flex justify-start items-center"
                    >
                        Ẩn
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-3 h-3 ml-1"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                    </button>

                    <button
                        onClick={(event) => handleSelectThisFlight(event)}
                        className="py-2 px-4 rounded font-semibold text-white bg-sky-400 hover:bg-sky-300"
                    >
                        Chọn vé
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FlightItem;

export const parseNgayThang = (input) => {
    if (typeof input === 'string') {
        let [datePart, timePart] = input.split(' ');
        let [year, month, day] = datePart.split('-');
        return {
            date: `${day}-${month}-${year}`,
            time: timePart.split(':').slice(0, 2).join(':'),
        };
    } else {
        return {
            date: null,
            time: null,
        };
    }
};

export function tinhThoiGianBay(startTime, endTime) {
    let start = new Date(startTime);
    let end = new Date(endTime);
    let timeDiff = Math.abs(end - start);
    let hours = Math.floor(timeDiff / 3600000);
    let minutes = Math.floor((timeDiff % 3600000) / 60000);
    return `${hours}h${minutes}`;
}