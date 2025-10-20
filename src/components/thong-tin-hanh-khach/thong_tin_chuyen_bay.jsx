import Icon from '../icon';
import { faCouch, faPercent, faSuitcase, faTicket } from '@fortawesome/free-solid-svg-icons';
import { parseNgayThang, tinhThoiGianBay } from '../danh-sach-ve/chuyen_bay_item';

export default function FlightInfomation({ departureFlight, returnFlight }) {
    const showDetail = (event) => {
        const button = event.target;
        const block = button.closest('.detail-block');
        const listHideElement = block.querySelectorAll('.detail-item');
        listHideElement.forEach((item) => {
            item.style.display = 'block';
        });
        const hideButton = block.querySelector('.hide-button');
        hideButton.style.display = 'flex';
        const showButton = block.querySelector('.show-button');
        showButton.style.display = 'none';
    };

    const hideDetail = (event) => {
        const button = event.target;
        const block = button.closest('.detail-block');
        const listHideElement = block.querySelectorAll('.detail-item');
        listHideElement.forEach((item) => {
            item.style.display = 'none';
        });
        const hideButton = block.querySelector('.hide-button');
        hideButton.style.display = 'none';
        const showButton = block.querySelector('.show-button');
        showButton.style.display = 'flex';
    };
    return (
        <div className="bg-white p-4 rounded-md mt-4">
            <h3 className="mb-2 font-medium">
                <i>Thông tin chuyến bay</i>
            </h3>
            <div className="pb-2 border-b border-gray-200 detail-block">
                <p className="text-sm font-medium mb-2 pb-2 border-b border-dashed">
                    <span className="text-sky-400 font-bold text-lg">Chiều đi:</span>
                    <span className="ml-4">AA Airlines</span>
                    <span className="ml-4 text-gray-400">{`${departureFlight?.flights[0].airlineCode} ${departureFlight?.flights[0].flightNumber}`}</span>
                </p>
                <div className="flex h-full font-medium">
                    <div className="font-medium flex flex-col justify-between w-2/6">
                        <div>
                            <p>
                                <i>{parseNgayThang(departureFlight?.flights[0].departure.localScheduledTime).time}</i>
                            </p>
                            <p className="text-sm text-gray-400">
                                {parseNgayThang(departureFlight?.flights[0].departure.localScheduledTime).date}
                            </p>
                        </div>
                        <div className="text-sky-400 text-sm text-end hidden detail-item">
                            {tinhThoiGianBay(
                                departureFlight?.flights[0].departure.localScheduledTime,
                                departureFlight?.flights[0].arrival.localScheduledTime,
                            )}
                        </div>
                        <div>
                            <p>
                                <i>{parseNgayThang(departureFlight?.flights[0].arrival.localScheduledTime).time}</i>
                            </p>
                            <p className="text-sm text-gray-400">
                                {parseNgayThang(departureFlight?.flights[0].arrival.localScheduledTime).date}
                            </p>
                        </div>
                    </div>
                    <div className="mx-2 flex flex-col justify-between items-center relative w-1/6">
                        <div className="w-4 h-4 bg-[url('/Group16.png')] bg-cover"></div>
                        <div className="bg-[url('/Vector1-doc.png')] w-[2px] flex-grow"></div>
                        <div className="w-4 h-4 bg-[url('/Group16.png')] bg-cover"></div>
                        <div className="w-5 h-5 bg-[url('/airplane1.png')] hidden detail-item bg-cover rotate-90 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="w-3/6">
                        <div>
                            <p>
                                <i>{departureFlight?.flights[0].departure.airportName}</i>
                            </p>
                            <p className="text-sm text-gray-400">
                                ({departureFlight?.flights[0].departure.airportCode})
                            </p>
                        </div>
                        <div className="text-sky-400 text-sm text-start my-4 hidden detail-item">
                            <p className="mt-2 flex justify-start items-center text-gray-500">
                                <span className="block">
                                    <Icon icon={faCouch} style={{ width: '12px', height: '12px' }} />
                                </span>
                                <span className="ml-2">Phổ thông</span>
                            </p>
                            <p className="mt-2 flex justify-start items-center text-gray-500">
                                <span className="block">
                                    <Icon icon={faSuitcase} style={{ width: '12px', height: '12px' }} />
                                </span>
                                <span className="ml-2">Hành lý xách tay 1x12 kg</span>
                            </p>
                            <p className="mt-2 flex justify-start items-center text-gray-500">
                                <span className="block">
                                    <Icon icon={faPercent} style={{ width: '12px', height: '12px' }} />
                                </span>
                                <span className="ml-2">
                                    Miễn phí đổi vé 360.000 VND và chênh lệch tiền vé (nếu có), thời gian 3h so với giờ
                                    khởi hành.
                                </span>
                            </p>
                            <p className="mt-2 flex justify-start items-center text-red-500">
                                <span className="block">
                                    <Icon icon={faTicket} style={{ width: '12px', height: '12px' }} />
                                </span>
                                <span className="ml-2">Không hoàn vé</span>
                            </p>
                        </div>
                        <div>
                            <p>
                                <i>{departureFlight?.flights[0].arrival.airportName}</i>
                            </p>
                            <p className="text-sm text-gray-400">({departureFlight?.flights[0].arrival.airportCode})</p>
                        </div>
                    </div>
                </div>
                {departureFlight?.flights[1] ? (
                    <>
                        <p className="text-sm font-medium mb-2 pb-2 border-b border-dashed mt-10">
                            <span className="ml-4">Vietjet Air</span>
                            <span className="ml-4 text-gray-400">{`${departureFlight?.flights[1].airlineCode} ${departureFlight?.flights[1].flightNumber}`}</span>
                        </p>
                        <div className="flex h-full font-medium">
                            <div className="font-medium flex flex-col justify-between w-2/6">
                                <div>
                                    <p>
                                        <i>
                                            {
                                                parseNgayThang(departureFlight?.flights[1].departure.localScheduledTime)
                                                    .time
                                            }
                                        </i>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {parseNgayThang(departureFlight?.flights[1].departure.localScheduledTime).date}
                                    </p>
                                </div>
                                <div className="text-sky-400 text-sm text-end hidden detail-item">
                                    {tinhThoiGianBay(
                                        departureFlight?.flights[1].departure.localScheduledTime,
                                        departureFlight?.flights[1].arrival.localScheduledTime,
                                    )}
                                </div>
                                <div>
                                    <p>
                                        <i>
                                            {
                                                parseNgayThang(departureFlight?.flights[1].arrival.localScheduledTime)
                                                    .time
                                            }
                                        </i>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {parseNgayThang(departureFlight?.flights[1].arrival.localScheduledTime).date}
                                    </p>
                                </div>
                            </div>
                            <div className="mx-2 flex flex-col justify-between items-center relative w-1/6">
                                <div className="w-4 h-4 bg-[url('/Group16.png')] bg-cover"></div>
                                <div className="bg-[url('/Vector1-doc.png')] w-[2px] flex-grow"></div>
                                <div className="w-4 h-4 bg-[url('/Group16.png')] bg-cover"></div>
                                <div className="w-5 h-5 bg-[url('/airplane1.png')] hidden detail-item bg-cover rotate-90 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                            <div className="w-3/6">
                                <div>
                                    <p>
                                        <i>{departureFlight?.flights[1].departure.airportName}</i>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        ({departureFlight?.flights[1].departure.airportCode})
                                    </p>
                                </div>
                                <div className="text-sky-400 text-sm text-start my-4 hidden detail-item">
                                    <p className="mt-2 flex justify-start items-center text-gray-500">
                                        <span className="block">
                                            <Icon icon={faCouch} style={{ width: '12px', height: '12px' }} />
                                        </span>
                                        <span className="ml-2">Phổ thông</span>
                                    </p>
                                    <p className="mt-2 flex justify-start items-center text-gray-500">
                                        <span className="block">
                                            <Icon icon={faSuitcase} style={{ width: '12px', height: '12px' }} />
                                        </span>
                                        <span className="ml-2">Hành lý xách tay 1x12 kg</span>
                                    </p>
                                    <p className="mt-2 flex justify-start items-center text-gray-500">
                                        <span className="block">
                                            <Icon icon={faPercent} style={{ width: '12px', height: '12px' }} />
                                        </span>
                                        <span className="ml-2">
                                            Miễn phí đổi vé 360.000 VND và chênh lệch tiền vé (nếu có), thời gian 3h so
                                            với giờ khởi hành.
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-start items-center text-red-500">
                                        <span className="block">
                                            <Icon icon={faTicket} style={{ width: '12px', height: '12px' }} />
                                        </span>
                                        <span className="ml-2">Không hoàn vé</span>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <i>{departureFlight?.flights[1].arrival.airportName}</i>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        ({departureFlight?.flights[1].arrival.airportCode})
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <button
                                onClick={(event) => showDetail(event)}
                                className="show-detail-btn text-xs text-blue-400 font-semibold flex justify-start items-center show-button"
                            >
                                Xem thêm
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
                        <div className="mt-2">
                            <button
                                onClick={(event) => hideDetail(event)}
                                className="show-detail-btn text-xs text-blue-400 font-semibold justify-start items-center hide-button hidden"
                            >
                                Thu gọn
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
                    </>
                ) : (
                    <>
                        <div className="mt-2">
                            <button
                                onClick={(event) => showDetail(event)}
                                className="show-detail-btn text-xs text-blue-400 font-semibold flex justify-start items-center show-button"
                            >
                                Xem thêm
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
                        <div className="mt-2">
                            <button
                                onClick={(event) => hideDetail(event)}
                                className="show-detail-btn text-xs text-blue-400 font-semibold justify-start items-center hide-button hidden"
                            >
                                Thu gọn
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
                    </>
                )}
            </div>
            {returnFlight ? (
                <div className="pb-2 border-b border-gray-200 detail-block mt-8">
                    <p className="text-sm font-medium mb-2 pb-2 border-b border-dashed">
                        <span className="text-sky-400 font-bold text-lg">Chiều về:</span>
                        <span className="ml-4">Vietjet Air</span>
                        <span className="ml-4 text-gray-400">{`${returnFlight?.flights[0].airlineCode} ${returnFlight?.flights[0].flightNumber}`}</span>
                    </p>
                    <div className="flex h-full font-medium">
                        <div className="font-medium flex flex-col justify-between w-2/6">
                            <div>
                                <p>
                                    <i>{parseNgayThang(returnFlight?.flights[0].departure.localScheduledTime).time}</i>
                                </p>
                                <p className="text-sm text-gray-400">
                                    {parseNgayThang(returnFlight?.flights[0].departure.localScheduledTime).date}
                                </p>
                            </div>
                            <div className="text-sky-400 text-sm text-end hidden detail-item">
                                {tinhThoiGianBay(
                                    returnFlight?.flights[0].departure.localScheduledTime,
                                    returnFlight?.flights[0].arrival.localScheduledTime,
                                )}
                            </div>
                            <div>
                                <p>
                                    <i>{parseNgayThang(returnFlight?.flights[0].arrival.localScheduledTime).time}</i>
                                </p>
                                <p className="text-sm text-gray-400">
                                    {parseNgayThang(returnFlight?.flights[0].arrival.localScheduledTime).date}
                                </p>
                            </div>
                        </div>
                        <div className="mx-2 flex flex-col justify-between items-center relative w-1/6">
                            <div className="w-4 h-4 bg-[url('/Group16.png')] bg-cover"></div>
                            <div className="bg-[url('/Vector1-doc.png')] w-[2px] flex-grow"></div>
                            <div className="w-4 h-4 bg-[url('/Group16.png')] bg-cover"></div>
                            <div className="w-5 h-5 bg-[url('/airplane1.png')] hidden detail-item bg-cover rotate-90 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                        <div className="w-3/6">
                            <div>
                                <p>
                                    <i>{returnFlight?.flights[0].departure.airportName}</i>
                                </p>
                                <p className="text-sm text-gray-400">
                                    ({returnFlight?.flights[0].departure.airportCode})
                                </p>
                            </div>
                            <div className="text-sky-400 text-sm text-start my-4 hidden detail-item">
                                <p className="mt-2 flex justify-start items-center text-gray-500">
                                    <span className="block">
                                        <Icon icon={faCouch} style={{ width: '12px', height: '12px' }} />
                                    </span>
                                    <span className="ml-2">Phổ thông</span>
                                </p>
                                <p className="mt-2 flex justify-start items-center text-gray-500">
                                    <span className="block">
                                        <Icon icon={faSuitcase} style={{ width: '12px', height: '12px' }} />
                                    </span>
                                    <span className="ml-2">Hành lý xách tay 1x12 kg</span>
                                </p>
                                <p className="mt-2 flex justify-start items-center text-gray-500">
                                    <span className="block">
                                        <Icon icon={faPercent} style={{ width: '12px', height: '12px' }} />
                                    </span>
                                    <span className="ml-2">
                                        Miễn phí đổi vé 360.000 VND và chênh lệch tiền vé (nếu có), thời gian 3h so với
                                        giờ khởi hành.
                                    </span>
                                </p>
                                <p className="mt-2 flex justify-start items-center text-red-500">
                                    <span className="block">
                                        <Icon icon={faTicket} style={{ width: '12px', height: '12px' }} />
                                    </span>
                                    <span className="ml-2">Không hoàn vé</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <i>{returnFlight?.flights[0].arrival.airportName}</i>
                                </p>
                                <p className="text-sm text-gray-400">
                                    ({returnFlight?.flights[0].arrival.airportCode})
                                </p>
                            </div>
                        </div>
                    </div>

                    {returnFlight?.flights[1] ? (
                        <>
                            <p className="text-sm font-medium mb-2 pb-2 border-b border-dashed mt-10">
                                <span className="ml-4">Vietjet Air</span>
                                <span className="ml-4 text-gray-400">{`${returnFlight?.flights[1].airlineCode} ${returnFlight?.flights[1].flightNumber}`}</span>
                            </p>
                            <div className="flex h-full font-medium">
                                <div className="font-medium flex flex-col justify-between w-2/6">
                                    <div>
                                        <p>
                                            <i>
                                                {
                                                    parseNgayThang(
                                                        returnFlight?.flights[1].departure.localScheduledTime,
                                                    ).time
                                                }
                                            </i>
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {parseNgayThang(returnFlight?.flights[1].departure.localScheduledTime).date}
                                        </p>
                                    </div>
                                    <div className="text-sky-400 text-sm text-end hidden detail-item">
                                        {tinhThoiGianBay(
                                            returnFlight?.flights[1].departure.localScheduledTime,
                                            returnFlight?.flights[1].arrival.localScheduledTime,
                                        )}
                                    </div>
                                    <div>
                                        <p>
                                            <i>
                                                {
                                                    parseNgayThang(returnFlight?.flights[1].arrival.localScheduledTime)
                                                        .time
                                                }
                                            </i>
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {parseNgayThang(returnFlight?.flights[1].arrival.localScheduledTime).date}
                                        </p>
                                    </div>
                                </div>
                                <div className="mx-2 flex flex-col justify-between items-center relative w-1/6">
                                    <div className="w-4 h-4 bg-[url('/Group16.png')] bg-cover"></div>
                                    <div className="bg-[url('/Vector1-doc.png')] w-[2px] flex-grow"></div>
                                    <div className="w-4 h-4 bg-[url('/Group16.png')] bg-cover"></div>
                                    <div className="w-5 h-5 bg-[url('/airplane1.png')] hidden detail-item bg-cover rotate-90 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                                <div className="w-3/6">
                                    <div>
                                        <p>
                                            <i>{returnFlight?.flights[1].departure.airportName}</i>
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            ({returnFlight?.flights[1].departure.airportCode})
                                        </p>
                                    </div>
                                    <div className="text-sky-400 text-sm text-start my-4 hidden detail-item">
                                        <p className="mt-2 flex justify-start items-center text-gray-500">
                                            <span className="block">
                                                <Icon icon={faCouch} style={{ width: '12px', height: '12px' }} />
                                            </span>
                                            <span className="ml-2">Phổ thông</span>
                                        </p>
                                        <p className="mt-2 flex justify-start items-center text-gray-500">
                                            <span className="block">
                                                <Icon icon={faSuitcase} style={{ width: '12px', height: '12px' }} />
                                            </span>
                                            <span className="ml-2">Hành lý xách tay 1x12 kg</span>
                                        </p>
                                        <p className="mt-2 flex justify-start items-center text-gray-500">
                                            <span className="block">
                                                <Icon icon={faPercent} style={{ width: '12px', height: '12px' }} />
                                            </span>
                                            <span className="ml-2">
                                                Miễn phí đổi vé 360.000 VND và chênh lệch tiền vé (nếu có), thời gian 3h
                                                so với giờ khởi hành.
                                            </span>
                                        </p>
                                        <p className="mt-2 flex justify-start items-center text-red-500">
                                            <span className="block">
                                                <Icon icon={faTicket} style={{ width: '12px', height: '12px' }} />
                                            </span>
                                            <span className="ml-2">Không hoàn vé</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <i>{returnFlight?.flights[1].arrival.airportName}</i>
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            ({returnFlight?.flights[1].arrival.airportCode})
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <button
                                    onClick={(event) => showDetail(event)}
                                    className="show-detail-btn text-xs text-blue-400 font-semibold flex justify-start items-center show-button"
                                >
                                    Xem thêm
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
                            <div className="mt-2">
                                <button
                                    onClick={(event) => hideDetail(event)}
                                    className="show-detail-btn text-xs text-blue-400 font-semibold justify-start items-center hide-button hidden"
                                >
                                    Thu gọn
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-3 h-3 ml-1"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mt-2">
                                <button
                                    onClick={(event) => showDetail(event)}
                                    className="show-detail-btn text-xs text-blue-400 font-semibold flex justify-start items-center show-button"
                                >
                                    Xem thêm
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
                            <div className="mt-2">
                                <button
                                    onClick={(event) => hideDetail(event)}
                                    className="show-detail-btn text-xs text-blue-400 font-semibold justify-start items-center hide-button hidden"
                                >
                                    Thu gọn
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-3 h-3 ml-1"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}