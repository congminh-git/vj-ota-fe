'use client';

import ConsecutiveMonthItem from './next_months_item';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function ConsecutiveMonths({ monthAndYear, paramStr }) {
    const router = useRouter();
    const [listMonth, setListMonth] = useState(null);

    function compareDates(dateString) {
        const inputDate = new Date(dateString);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        if (
            inputDate.getFullYear() > currentYear ||
            (inputDate.getFullYear() === currentYear && inputDate.getMonth() > currentMonth) ||
            (inputDate.getFullYear() === currentYear &&
                inputDate.getMonth() === currentMonth &&
                inputDate.getDate() >= currentDay)
        ) {
            return dateString;
        } else {
            return `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDay
                .toString()
                .padStart(2, '0')}`;
        }
    }

    function previousMonth(yearMonth) {
        const [year, month] = yearMonth.split('-').map(Number);
        let newYear = year;
        let newMonth = month - 1;
        if (newMonth < 1) {
            newYear -= 1;
            newMonth = 12;
        }
        sessionStorage.setItem(
            `${paramStr}SearchParam`,
            compareDates(`${newYear}-${String(newMonth).padStart(2, '0')}-01`),
        );
        sessionStorage.setItem(
            `${paramStr}SearchParamUpdate`,
            compareDates(`${newYear}-${String(newMonth).padStart(2, '0')}-01`),
        );
        router.refresh();
    }

    function nextMonth(yearMonth) {
        const [year, month] = yearMonth.split('-').map(Number);
        let newYear = year;
        let newMonth = month + 1;
        if (newMonth > 12) {
            newYear += 1;
            newMonth = 1;
        }
        sessionStorage.setItem(
            `${paramStr}SearchParam`,
            compareDates(`${newYear}-${String(newMonth).padStart(2, '0')}-01`),
        );
        sessionStorage.setItem(
            `${paramStr}SearchParamUpdate`,
            compareDates(`${newYear}-${String(newMonth).padStart(2, '0')}-01`),
        );
        router.refresh();
    }

    useEffect(() => {
        function getAdjacentMonths(yearMonth) {
            const [year, month] = yearMonth.split('-').map(Number);
            let result = [];
            for (let i = -2; i <= 2; i++) {
                let newMonth = month + i;
                let newYear = year;
                if (newMonth < 1) {
                    newYear--;
                    newMonth += 12;
                } else if (newMonth > 12) {
                    newYear++;
                    newMonth -= 12;
                }
                result.push(`${newYear}-${String(newMonth).padStart(2, '0')}`);
            }
            return result;
        }
        setListMonth(getAdjacentMonths(monthAndYear));
    }, [monthAndYear]);

    return (
        <div className="p-2 bg-white rounded-lg relative">
            <div className="grid grid-cols-5 gap-2">
                <ConsecutiveMonthItem
                    monthAndYear={listMonth ? listMonth[0] : '1999-01'}
                    paramStr={paramStr}
                    active={false}
                />
                <ConsecutiveMonthItem
                    monthAndYear={listMonth ? listMonth[1] : '1999-01'}
                    paramStr={paramStr}
                    active={false}
                />
                <ConsecutiveMonthItem
                    monthAndYear={listMonth ? listMonth[2] : '1999-01'}
                    paramStr={paramStr}
                    active={true}
                />
                <ConsecutiveMonthItem
                    monthAndYear={listMonth ? listMonth[3] : '1999-01'}
                    paramStr={paramStr}
                    active={false}
                />
                <ConsecutiveMonthItem
                    monthAndYear={listMonth ? listMonth[4] : '1999-01'}
                    paramStr={paramStr}
                    active={false}
                />
            </div>
            <button
                onClick={() => previousMonth(monthAndYear)}
                className="p-2 w-fit h-fit flex justify-center items-center bg-white rounded-full border-2 hover:border-blue-400 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-0"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button
                onClick={() => nextMonth(monthAndYear)}
                className="p-2 w-fit h-fit flex justify-center items-center bg-white rounded-full border-2 hover:border-blue-400 absolute top-1/2 translate-x-1/2 -translate-y-1/2 right-0"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    );
}

export default ConsecutiveMonths;