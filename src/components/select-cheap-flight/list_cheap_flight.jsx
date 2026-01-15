'use client';

import { useEffect, useState } from 'react';

function ListLowFareFlight({ monthAndYear, departmentDate, setSelectDayConfirm, listLowFareFlight }) {
    const [calendar, setCalendar] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [minFare, setMinFare] = useState(null);
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;
    function getWeeksOfMonth(yearMonth, listLowFareFlight) {
        const [year, month] = yearMonth.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        let weeks = [];
        let currentWeek = [];
        let firstDay = new Date(year, month - 1, 1).getDay();
        let isoFirstDay = firstDay === 0 ? 7 : firstDay;
        let daysFromPrevMonth = isoFirstDay - 1;
        if (daysFromPrevMonth > 0) {
            const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
            for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
                currentWeek.push(`${year}-${String(month - 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
            }
        }
        for (let day = 1; day <= daysInMonth; day++) {
            currentWeek.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
            let dayOfWeek = new Date(year, month - 1, day).getDay();
            let isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
            if (isoDayOfWeek === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }
        if (currentWeek.length > 0) {
            let daysFromNextMonth = 7 - currentWeek.length;
            for (let i = 1; i <= daysFromNextMonth; i++) {
                currentWeek.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
            }
            weeks.push(currentWeek);
        }
        weeks = weeks.map((week) =>
            week.map((date) => {
                let [y, m, d] = date.split('-').map(Number);
                if (m < 1) {
                    y -= 1;
                    m = 12;
                } else if (m > 12) {
                    y += 1;
                    m = 1;
                }
                const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const index = listLowFareFlight.findIndex((element) => element.departureDate == dateStr);
                let totalAmount = 0;
                let discountAmount = 0;
                if (index != -1) {
                    totalAmount = listLowFareFlight[index].fareOption.fareCharges[0].currencyAmounts[0].baseAmount;
                    discountAmount = listLowFareFlight[index]?.promoCodeApplicability?.promoCodeRequested
                        ? listLowFareFlight[index].fareOption.fareCharges[0].currencyAmounts[0].discountAmount
                        : 0;
                }
                return { date: dateStr, index: index, totalAmount: totalAmount, discountAmount: discountAmount };
            }),
        );
        weeks = weeks.filter((week) => week.some((element) => parseInt(element.date.split('-')[1]) === month));
        return weeks;
    }

    function isFutureDate(inputDateString) {
        const inputDate = new Date(inputDateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inputDate >= today;
    }

    function formatNumber(numberStr) {
        return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    useEffect(() => {
        if (monthAndYear && listLowFareFlight) {
            setCalendar(getWeeksOfMonth(monthAndYear, listLowFareFlight));
            let min = 100000000000;
            listLowFareFlight.forEach((element) => {
                const fare = element.fareOption.fareCharges[0].currencyAmounts[0].baseAmount;
                if (fare < min) {
                    min = fare;
                }
            });
            setMinFare(min);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthAndYear, listLowFareFlight]);

    useEffect(() => {
        if (departmentDate) {
            setSelectedDay(departmentDate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentDate]);

    return (
        <div className="relative overflow-x-auto rounded-md shadow">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr className="border-gray-50">
                        <th scope="col" className="px-6 py-3 text-center" style={{ width: '14.28%' }}>
                            Thứ hai
                        </th>
                        <th scope="col" className="px-6 py-3 text-center" style={{ width: '14.28%' }}>
                            Thứ ba
                        </th>
                        <th scope="col" className="px-6 py-3 text-center" style={{ width: '14.28%' }}>
                            Thứ tư
                        </th>
                        <th scope="col" className="px-6 py-3 text-center" style={{ width: '14.28%' }}>
                            Thứ năm
                        </th>
                        <th scope="col" className="px-6 py-3 text-center" style={{ width: '14.28%' }}>
                            Thứ sáu
                        </th>
                        <th scope="col" className="px-6 py-3 text-center" style={{ width: '14.28%' }}>
                            Thứ bảy
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-red-400" style={{ width: '14.28%' }}>
                            Chủ nhật
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {calendar ? (
                        calendar.map((calendarRow, indexRow) => {
                            return (
                                <tr key={`week-${indexRow}`} className="border-b-4 border-gray-50">
                                    {calendarRow.map((calendarDay, indexDay) => {
                                        let active =
                                            calendarDay.date.split('-')[1] == monthAndYear.split('-')[1] &&
                                            isFutureDate(calendarDay.date);
                                        let totalAmount = 1000000;
                                        if (listLowFareFlight) {
                                            for (let lowFareFlight of listLowFareFlight) {
                                                if (lowFareFlight.departureDate == calendarDay.date) {
                                                    totalAmount =
                                                        lowFareFlight.fareOption.fareCharges[0].currencyAmounts[0]
                                                            .baseAmount;
                                                }
                                                break;
                                            }
                                        }
                                        return (
                                            <td
                                                key={`day-${indexDay}`}
                                                className={`relative px-2 py-1 border-r-4 bg-white border-gray-50 rounded ${
                                                    indexDay == 0 ? 'border-l-4' : ''
                                                } `}
                                            >
                                                <button
                                                    className={`block w-full text-end px-2 py-1 rounded-md ${
                                                        calendarDay.date == selectedDay
                                                            ? 'text-gray-700 bg-gradient-to-r from-rose-300 to-rose-100'
                                                            : calendarDay.totalAmount == minFare
                                                            ? ' text-white bg-gradient-to-r from-lime-500 to-lime-300'
                                                            : 'bg-white text-gray-700'
                                                    }`}
                                                    disabled={active ? false : true}
                                                    onClick={() => {
                                                        setSelectedDay(calendarDay.date);
                                                        setSelectDayConfirm(calendarDay.date);
                                                    }}
                                                >
                                                    <div className={`${active ? 'opacity-100' : 'opacity-0'} relative`}>
                                                        <span
                                                            className={`${
                                                                active ? 'text-gray-500' : 'text-gray-200'
                                                            } absolute top-0 right-0`}
                                                        >
                                                            {calendarDay.date.split('-')[2]}
                                                        </span>
                                                        <br />
                                                        {listLowFareFlight ? (
                                                            <>
                                                                {calendarDay.discountAmount ? (
                                                                    <>
                                                                        <p className="w-full text-sm text-end italic mt-1 line-through">
                                                                            {calendarDay.totalAmount.toLocaleString()}
                                                                        </p>
                                                                        <p className="w-full text-xl text-end font-bold mt-1">
                                                                            {formatNumber(
                                                                                (
                                                                                    calendarDay.totalAmount -
                                                                                    calendarDay.discountAmount
                                                                                )
                                                                                    .toString()
                                                                                    .slice(0, -3),
                                                                            )}{' '}
                                                                        </p>
                                                                        <p className="w-full text-md text-end font-medium">
                                                                            {(
                                                                                calendarDay.totalAmount -
                                                                                calendarDay.discountAmount
                                                                            )
                                                                                .toString()
                                                                                .slice(-3)}
                                                                            <i>{currency}</i>
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <p className="w-full text-xl text-end font-bold mt-1">
                                                                            {formatNumber(
                                                                                calendarDay.totalAmount
                                                                                    .toString()
                                                                                    .slice(0, -3),
                                                                            )}{' '}
                                                                        </p>
                                                                        <p className="w-full text-md text-end font-medium">
                                                                            {calendarDay.totalAmount
                                                                                .toString()
                                                                                .slice(-3)}
                                                                            <i>{currency}</i>
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="w-full text-xl text-end font-bold mt-1">
                                                                    1,000
                                                                </p>
                                                                <p className="w-full text-md text-end font-medium">
                                                                    000 <i>{currency}</i>
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    ) : (
                        <></>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ListLowFareFlight;