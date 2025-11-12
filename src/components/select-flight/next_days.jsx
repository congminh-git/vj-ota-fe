import ConsecutiveDayItem from './next_days_item';
import { usePathname, useRouter } from 'next/navigation';

function ConsecutiveDays({ flyingDay, activeSelectFlight, departmentDate, returnDate, roundTrip }) {
    const pathname = usePathname();
    const router = useRouter();
    function generateDateRange(dateStr) {
        let date = new Date(dateStr);
        let dateList = [];
        for (let i = -1; i <= 2; i++) {
            let newDate = new Date(date);
            newDate.setDate(date.getDate() + i);
            let formattedDate = newDate.toISOString().split('T')[0];
            dateList.push(formattedDate);
        }

        return dateList;
    }

    const handleSearch = (date) => {
        const departmentDateCompare = new Date(departmentDate);
        const returnDateCompare = new Date(returnDate);
        const endPoint = pathname && pathname.includes('select-flight') ? 'select-flight' : 'booking/select-flight';
        const url = `${endPoint}`;
        if (activeSelectFlight == 'đi') {
            sessionStorage.setItem(
                pathname.includes('booking') ? 'departmentDateSearchParam' : 'departmentDateSearchParamUpdate',
                date,
            );
        } else {
            sessionStorage.setItem(
                pathname.includes('booking') ? 'returnDateSearchParam' : 'returnDateSearchParamUpdate',
                date,
            );
        }
        if (roundTrip) {
            if (departmentDateCompare <= returnDateCompare) {
                if (endPoint === 'select-flight') {
                    router.refresh();
                } else {
                    router.push(url);
                }
            }
        } else {
            if (endPoint === 'select-flight') {
                router.refresh();
            } else {
                router.push(url);
            }
        }
    };

    const oneDayBack = (flyingDay) => {
        let date = new Date(flyingDay);
        date.setDate(date.getDate() - 1);
        let formattedDate = date.toISOString().split('T')[0];
        if (activeSelectFlight == 'đi') {
            sessionStorage.setItem(
                pathname.includes('booking') ? 'departmentDateSearchParam' : 'departmentDateSearchParamUpdate',
                formattedDate,
            );
        } else {
            sessionStorage.setItem(
                pathname.includes('booking') ? 'returnDateSearchParam' : 'returnDateSearchParamUpdate',
                formattedDate,
            );
        }
        router.refresh();
    };
    const oneDayForward = () => {
        let date = new Date(flyingDay);
        date.setDate(date.getDate() + 1);
        let formattedDate = date.toISOString().split('T')[0];
        if (activeSelectFlight == 'đi') {
            sessionStorage.setItem(
                pathname.includes('booking') ? 'departmentDateSearchParam' : 'departmentDateSearchParamUpdate',
                formattedDate,
            );
        } else {
            sessionStorage.setItem(
                pathname.includes('booking') ? 'returnDateSearchParam' : 'returnDateSearchParamUpdate',
                formattedDate,
            );
        }
        router.refresh();
    };
    const dateRange = generateDateRange(flyingDay);

    return (
        <div className="p-2 bg-white rounded-lg">
            <div className="relative">
                <div className="grid grid-cols-4 gap-2">
                    <button
                        className={`${dateRange[0] < new Date().toISOString().split('T')[0] ? 'grayscale' : ''}`}
                        disabled={dateRange[0] < new Date().toISOString().split('T')[0] ? true : false}
                        onClick={() => handleSearch(dateRange[0])}
                    >
                        <ConsecutiveDayItem flyingDay={dateRange[0]} active={false} />
                    </button>
                    <button>
                        <ConsecutiveDayItem flyingDay={dateRange[1]} active={true} />
                    </button>
                    <button
                        className={`${
                            roundTrip
                                ? activeSelectFlight == 'đi'
                                    ? dateRange[2] > returnDate
                                        ? 'grayscale'
                                        : ''
                                    : dateRange[2] < departmentDate
                                    ? 'grayscale'
                                    : ''
                                : ''
                        }`}
                        disabled={
                            roundTrip &&
                            ((activeSelectFlight === 'đi' && dateRange[2] > returnDate) ||
                                (activeSelectFlight === 'về' && dateRange[2] < departmentDate))
                        }
                        onClick={() => handleSearch(dateRange[2])}
                    >
                        <ConsecutiveDayItem flyingDay={dateRange[2]} active={false} />
                    </button>
                    <button
                        className={`${
                            roundTrip
                                ? activeSelectFlight == 'đi'
                                    ? dateRange[3] > returnDate
                                        ? 'grayscale'
                                        : ''
                                    : dateRange[3] < departmentDate
                                    ? 'grayscale'
                                    : ''
                                : ''
                        }`}
                        disabled={
                            roundTrip &&
                            ((activeSelectFlight === 'đi' && dateRange[3] > returnDate) ||
                                (activeSelectFlight === 'về' && dateRange[3] < departmentDate))
                        }
                        onClick={() => handleSearch(dateRange[3])}
                    >
                        <ConsecutiveDayItem flyingDay={dateRange[3]} active={false} />
                    </button>
                </div>
                <button
                    onClick={() => oneDayBack(flyingDay)}
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
                    onClick={() => oneDayForward(flyingDay)}
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
        </div>
    );
}

export default ConsecutiveDays;