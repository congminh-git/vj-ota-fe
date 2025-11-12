'use client';

import { useRouter } from 'next/navigation';

function ConsecutiveDayItem({ active, monthAndYear, paramStr }) {
    const router = useRouter();
    const vietnameseMonths = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];

    const isMonthGreaterOrEqual = (inputMonth) => {
        const [inputYear, inputMonthPart] = inputMonth.split('-').map(Number);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        if (inputYear > currentYear) {
            return true;
        } else if (inputYear === currentYear && inputMonthPart >= currentMonth) {
            return true;
        } else {
            return false;
        }
    };

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

    const selectMonth = (month) => {
        sessionStorage.setItem(`${paramStr}SearchParam`, compareDates(month + '-' + '01'));
        sessionStorage.setItem(`${paramStr}SearchParamUpdate`, compareDates(month + '-' + '01'));
        router.refresh();
    };

    return (
        <button
            onClick={() => selectMonth(monthAndYear ? monthAndYear : '1999-01')}
            disabled={!isMonthGreaterOrEqual(monthAndYear)}
            className={`h-full w-full col-span-1 p-2 bg-opacity-50 rounded-md text-sm font-semibold cursor-pointer border-2 border-transparent
            ${
                active
                    ? 'bg-sky-500 text-white'
                    : isMonthGreaterOrEqual(monthAndYear)
                    ? 'bg-sky-200 text-sky-500 hover:bg-sky-100 hover:border-sky-500 hover:text-sky-500'
                    : 'bg-gray-300 text-gray-600'
            }`}
        >
            <p className="w-full text-center hidden sm:block">
                {vietnameseMonths[parseInt(monthAndYear?.split('-')[1]) - 1]}
            </p>
            <p className="w-full text-center">{monthAndYear?.split('-')[0]}</p>
        </button>
    );
}

export default ConsecutiveDayItem;