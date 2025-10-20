import { parseNgayThang } from './chuyen_bay_item';

function SelectedFlight({
    direction,
    departureAirport,
    arrivalAirport,
    flyingDay,
    numberOfPassenger,
    selectedFlight,
    activeSelectFlight,
    setActiveSelectFlight,
}) {
    return (
        <div
            onClick={() => {
                setActiveSelectFlight(direction);
            }}
            className={`col-span-1 bg-white sm:p-4 p-2 rounded cursor-pointer border-2 hover:border-2 hover:border-blue-400 text-sm ${
                activeSelectFlight == direction ? 'border-blue-400 ' : 'opacity-50'
            }`}
        >
            <h4 className="text-cyan-400 font-medium flex items-center">
                Chiều {direction}:
                <span className="flex justify-start items-center text-sm text-gray-400 ml-2">
                    <span>{flyingDay}</span>
                    <span className="bg-gray-500 block w-1 h-1 rounded-full mx-2"></span>
                    <span>{numberOfPassenger} hành khách</span>
                </span>
            </h4>
            <p className="flex justify-start items-center text-base text-gray-900 font-semibold mt-2">
                <i className="flex justify-start items-center mr-2">
                    <span>{departureAirport}</span>
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </span>
                    <span>{arrivalAirport}</span>
                </i>
            </p>
            <p
                className={`${
                    activeSelectFlight ? 'block' : 'hidden'
                } text-yellow-500 mt-2 w-fit font-semibold rounded`}
            >
                {selectedFlight
                    ? `Đã chọn: ${selectedFlight?.flights[1] ? 'Nối chuyến' : 'Bay thẳng'}`
                    : `Chưa chọn chuyến ${direction}...`}
            </p>
            {selectedFlight ? (
                <>
                    <p className="text-gray-700 font-bold md:text-lg">
                        {`${selectedFlight?.flights[0].airlineCode} ${selectedFlight?.flights[0].flightNumber}`}:
                        <span className="text-sky-400 ml-4">{selectedFlight?.flights[0].departure.airportCode}</span>
                        <span className="font-medium text-gray-400 ml-2 mr-4">
                            ({parseNgayThang(selectedFlight?.flights[0].departure.localScheduledTime).time})
                        </span>
                        -<span className="text-sky-400 ml-4">{selectedFlight?.flights[0].arrival.airportCode}</span>
                        <span className="font-medium text-gray-400 ml-2">
                            ({parseNgayThang(selectedFlight?.flights[0].arrival.localScheduledTime).time})
                        </span>
                    </p>
                    {selectedFlight?.flights[1] ? (
                        <p className="text-gray-700 font-bold md:text-lg">
                            {`${selectedFlight?.flights[1].airlineCode} ${selectedFlight?.flights[1].flightNumber}`}:
                            <span className="text-sky-400 ml-4">
                                {selectedFlight?.flights[1].departure.airportCode}
                            </span>
                            <span className="font-medium text-gray-400 ml-2 mr-4">
                                ({parseNgayThang(selectedFlight?.flights[1].departure.localScheduledTime).time})
                            </span>
                            -<span className="text-sky-400 ml-4">{selectedFlight?.flights[1].arrival.airportCode}</span>
                            <span className="font-medium text-gray-400 ml-2">
                                ({parseNgayThang(selectedFlight?.flights[1].arrival.localScheduledTime).time})
                            </span>
                        </p>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <></>
            )}
        </div>
    );
}

export default SelectedFlight;