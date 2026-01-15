import { ChevronLeft } from '../icons/chevronLeft';
import { ChevronRight } from '../icons/chevronRight';
import NextDayItem from './next_days_item';
import { usePathname, useRouter } from 'next/navigation';

function NextDays({ flyingDay, activeSelectFlight, departmentDate, returnDate, roundTrip, setRefetchData }) {
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
                    // window.location.reload();
                    setRefetchData(true);
                } else {
                    // router.push(url);
                    setRefetchData(true);
                }
            }
        } else {
            if (endPoint === 'select-flight') {
                // window.location.reload();
                setRefetchData(true);
            } else {
                // router.push(url);
                setRefetchData(true);
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

        setRefetchData(true);

        // window.location.reload();
    };
    const oneDayForward = (flyingDay) => {
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

        setRefetchData(true);

        // window.location.reload();
    };
    const dateRange = generateDateRange(flyingDay);

    return (
        <div className="p-2 bg-white rounded-lg">
            <div className="relative">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    <button
                        className={`${dateRange[0] < new Date().toISOString().split('T')[0] ? 'grayscale' : ''}`}
                        disabled={dateRange[0] < new Date().toISOString().split('T')[0] ? true : false}
                        onClick={() => handleSearch(dateRange[0])}
                    >
                        <NextDayItem flyingDay={dateRange[0]} active={false} />
                    </button>
                    <button>
                        <NextDayItem flyingDay={dateRange[1]} active={true} />
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
                        <NextDayItem flyingDay={dateRange[2]} active={false} />
                    </button>
                    <button
                        className={`hidden sm:block ${
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
                        <NextDayItem flyingDay={dateRange[3]} active={false} />
                    </button>
                </div>
                <button
                    onClick={() => oneDayBack(flyingDay)}
                    className="p-2 w-fit h-fit flex justify-center items-center bg-white rounded-full border-2 hover:border-blue-400 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-0"
                >
                    <ChevronLeft className={'size-4'} strokeWidth={'2'} />
                </button>
                <button
                    onClick={() => oneDayForward(flyingDay)}
                    className="p-2 w-fit h-fit flex justify-center items-center bg-white rounded-full border-2 hover:border-blue-400 absolute top-1/2 translate-x-1/2 -translate-y-1/2 right-0"
                >
                    <ChevronRight className={'size-4'} strokeWidth={'2'} />
                </button>
            </div>
        </div>
    );
}

export default NextDays;
