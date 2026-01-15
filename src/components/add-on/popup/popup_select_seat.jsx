'use client';

import { useEffect, useState } from 'react';
import { parseNgayThang } from '@/components/select-flight/flight_item';
import ListSeatOptions from '@/components/add-on/list_seat';

function SelectSeatPopup({
    openPopupSeat,
    setOpenPopupSeat,
    departureFlightSeatOptions,
    returnFlightSeatOptions,
    departureFlight,
    returnFlight,
    setSeatConfirmed,
    setSeatTotalPrice,
    body,
}) {
    const [currentlySelectedFlight, setCurrentlySelectedFlight] = useState('đi');
    const [currentlySelectedPassenger, setCurrentlySelectedPassenger] = useState(1);
    const [selectedSegment, setSelectedSegment] = useState(1);
    const [selectedSeat, setSelectedSeat] = useState([]);
    const [listSeatRowOfDepartureFlightSegment, setListSeatRowOfDepartureFlightSegment] = useState([]);
    const [listSeatRowOfReturnFlightSegment, setListSeatRowOfReturnFlightSegment] = useState([]);
    const [price, setPrice] = useState({ departurePrice: 0, arrivalPrice: 0 });

    useEffect(() => {
        if (departureFlightSeatOptions) {
            let listRow1 = [];
            let listElementOfRow = [];
            let index = 1;
            let maxLength = 0;
            departureFlightSeatOptions[0].seatOptions.forEach((element) => {
                if (element.seatMapCell.rowIdentifier == index) {
                    listElementOfRow.push(element);
                } else {
                    index = element.seatMapCell.rowIdentifier;
                    if (listElementOfRow.length > 0) {
                        listRow1.push(listElementOfRow);
                        if (listElementOfRow.length > maxLength) {
                            maxLength = listElementOfRow.length;
                        }
                    }
                    listElementOfRow = [];
                    listElementOfRow.push(element);
                }
            });
            let listRow2 = [];
            listElementOfRow = [];
            index = 1;
            maxLength = 0;
            departureFlightSeatOptions[1]?.seatOptions.forEach((element) => {
                if (element.seatMapCell.rowIdentifier == index) {
                    listElementOfRow.push(element);
                } else {
                    index = element.seatMapCell.rowIdentifier;
                    if (listElementOfRow.length > 0) {
                        listRow2.push(listElementOfRow);
                        if (listElementOfRow.length > maxLength) {
                            maxLength = listElementOfRow.length;
                        }
                    }
                    listElementOfRow = [];
                    listElementOfRow.push(element);
                }
            });
            setListSeatRowOfDepartureFlightSegment([
                listRow1.sort((a, b) => a[0].seatMapCell.rowIdentifier - b[0].seatMapCell.rowIdentifier),
                listRow2.sort((a, b) => a[0].seatMapCell.rowIdentifier - b[0].seatMapCell.rowIdentifier),
            ]);
        }
        if (returnFlightSeatOptions) {
            let listRow1 = [];
            let listElementOfRow = [];
            let index = 1;
            let maxLength = 0;
            returnFlightSeatOptions[0].seatOptions.forEach((element) => {
                if (element.seatMapCell.rowIdentifier == index) {
                    listElementOfRow.push(element);
                } else {
                    index = element.seatMapCell.rowIdentifier;
                    if (listElementOfRow.length > 0) {
                        listRow1.push(listElementOfRow);
                        if (listElementOfRow.length > maxLength) {
                            maxLength = listElementOfRow.length;
                        }
                    }
                    listElementOfRow = [];
                    listElementOfRow.push(element);
                }
            });
            let listRow2 = [];
            listElementOfRow = [];
            index = 1;
            maxLength = 0;
            returnFlightSeatOptions[1]?.seatOptions.forEach((element) => {
                if (element.seatMapCell.rowIdentifier == index) {
                    listElementOfRow.push(element);
                } else {
                    index = element.seatMapCell.rowIdentifier;
                    if (listElementOfRow.length > 0) {
                        listRow2.push(listElementOfRow);
                        if (listElementOfRow.length > maxLength) {
                            maxLength = listElementOfRow.length;
                        }
                    }
                    listElementOfRow = [];
                    listElementOfRow.push(element);
                }
            });
            setListSeatRowOfReturnFlightSegment([
                listRow1.sort((a, b) => a[0].seatMapCell.rowIdentifier - b[0].seatMapCell.rowIdentifier),
                listRow2.sort((a, b) => a[0].seatMapCell.rowIdentifier - b[0].seatMapCell.rowIdentifier),
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departureFlightSeatOptions, returnFlightSeatOptions]);

    useEffect(() => {
        let total = { departurePrice: 0, arrivalPrice: 0 };
        selectedSeat.forEach((element) => {
            for (let i = 0; i < departureFlightSeatOptions[0].seatOptions.length; i++) {
                if (departureFlightSeatOptions[0].seatOptions[i].selectionKey == element.selectionKey) {
                    total.departurePrice +=
                        departureFlightSeatOptions[0].seatOptions[i].seatCharges[0].currencyAmounts[0].totalAmount;
                    break;
                }
            }
            for (let i = 0; i < departureFlightSeatOptions[1]?.seatOptions.length; i++) {
                if (departureFlightSeatOptions[1]?.seatOptions[i].selectionKey == element.selectionKey) {
                    total.departurePrice +=
                        departureFlightSeatOptions[1]?.seatOptions[i].seatCharges[0].currencyAmounts[0].totalAmount;
                    break;
                }
            }
            if (returnFlightSeatOptions) {
                for (let i = 0; i < returnFlightSeatOptions[0].seatOptions.length; i++) {
                    if (returnFlightSeatOptions[0].seatOptions[i].selectionKey == element.selectionKey) {
                        total.arrivalPrice +=
                            returnFlightSeatOptions[0].seatOptions[i].seatCharges[0].currencyAmounts[0].totalAmount;
                        break;
                    }
                }
                for (let i = 0; i < returnFlightSeatOptions[1]?.seatOptions.length; i++) {
                    if (returnFlightSeatOptions[1]?.seatOptions[i].selectionKey == element.selectionKey) {
                        total.arrivalPrice +=
                            returnFlightSeatOptions[1]?.seatOptions[i].seatCharges[0].currencyAmounts[0].totalAmount;
                        break;
                    }
                }
            }
        });
        setPrice(total);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSeat]);

    const continueSelect = () => {
        if (currentlySelectedPassenger < body?.passengers.length) {
            setCurrentlySelectedPassenger(currentlySelectedPassenger + 1);
        } else {
            if (selectedSegment < (currentlySelectedFlight == 'đi' ? departureFlight : returnFlight).flights.length) {
                if (currentlySelectedPassenger < body?.passengers.length) {
                    setCurrentlySelectedPassenger(currentlySelectedPassenger + 1);
                } else {
                    setSelectedSegment(selectedSegment + 1);
                    setCurrentlySelectedPassenger(1);
                }
            } else {
                if (currentlySelectedFlight == 'đi') {
                    setCurrentlySelectedFlight('về');
                    setSelectedSegment(1);
                    setCurrentlySelectedPassenger(1);
                }
            }
        }
    };

    const cancelSelected = () => {
        const newSelectedSeat = [];
        selectedSeat.map((item) => {
            if (
                !(
                    item.journey.index == (currentlySelectedFlight == 'đi' ? 1 : 2) &&
                    item.passenger.index == currentlySelectedPassenger &&
                    item.segment.index == selectedSegment
                )
            ) {
                newSelectedSeat.push(item);
            }
        });
        setSelectedSeat(newSelectedSeat);
    };
    return (
        <div
            className={`${
                openPopupSeat ? 'fixed' : 'hidden'
            } top-0 left-0 bottom-0 right-0 bg-gray-800 bg-opacity-50 flex justify-end z-20`}
        >
            <div className="h-full w-[600px] bg-white p-4 pb-20 relative overflow-auto">
                <div className="flex justify-between">
                    <button
                        onClick={() => setOpenPopupSeat(false)}
                        className="border p-2 rounded hover:bg-blue-200 w-fit h-fit"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="text-center">
                        <p className="text-md font-bold text-gray-800">Chọn chỗ ngồi</p>
                    </div>
                </div>
                <div className="flex justify-center items-center border-b mt-2">
                    <button
                        onClick={() => setCurrentlySelectedFlight('đi')}
                        className={`${
                            currentlySelectedFlight == 'đi' ? 'border-blue-400' : 'border-transparent'
                        } py-2 px-4 border-b-4 hover:bg-gray-100`}
                    >
                        Chuyến đi
                    </button>
                    {body?.journeys?.length > 1 ? (
                        <button
                            onClick={() => setCurrentlySelectedFlight('về')}
                            className={`${
                                currentlySelectedFlight == 'về' ? 'border-blue-400' : 'border-transparent'
                            } py-2 px-4 border-b-4 hover:bg-gray-100`}
                        >
                            Chuyến về
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
                <div
                    className={`mt-4 grid grid-cols-${
                        departureFlight?.flights?.length < 2 ? `${departureFlight?.flights?.length}` : '2'
                    } gap-4 pb-4 border-b`}
                >
                    {currentlySelectedFlight == 'đi'
                        ? departureFlight?.flights.map((element, index) => {
                              return (
                                  <button
                                      className={`${
                                          selectedSegment == index + 1
                                              ? 'border-yellow-400 bg-yellow-400 text-white'
                                              : ''
                                      } text-sm border-2 hover:border-blue-400 bg-gray-100 p-2 rounded`}
                                      key={index}
                                      onClick={() => setSelectedSegment(index + 1)}
                                  >
                                      <p>{`${element.airlineCode} ${element.flightNumber}`}</p>
                                      <p>
                                          <span className="ml-4">{element?.departure.airportCode}</span>
                                          <span className="font-medium ml-2 mr-4">
                                              ({parseNgayThang(element?.departure.localScheduledTime).time})
                                          </span>
                                          -<span className="ml-4">{element?.arrival.airportCode}</span>
                                          <span className="font-medium ml-2">
                                              ({parseNgayThang(element?.arrival.localScheduledTime).time})
                                          </span>
                                      </p>
                                  </button>
                              );
                          })
                        : returnFlight?.flights.map((element, index) => {
                              return (
                                  <button
                                      className={`${
                                          selectedSegment == index + 1
                                              ? 'border-yellow-400 bg-yellow-400 text-white'
                                              : ''
                                      } text-sm border-2 hover:border-blue-400 bg-gray-100 p-2 rounded`}
                                      key={index}
                                      onClick={() => setSelectedSegment(index + 1)}
                                  >
                                      <p>{`${element.airlineCode} ${element.flightNumber}`}</p>
                                      <p>
                                          <span className="ml-4">{element?.departure.airportCode}</span>
                                          <span className="font-medium ml-2 mr-4">
                                              ({parseNgayThang(element?.departure.localScheduledTime).time})
                                          </span>
                                          -<span className="ml-4">{element?.arrival.airportCode}</span>
                                          <span className="font-medium ml-2">
                                              ({parseNgayThang(element?.arrival.localScheduledTime).time})
                                          </span>
                                      </p>
                                  </button>
                              );
                          })}
                </div>
                {body?.journey?.length > 1 ? (
                    <div
                        className={`mt-4 grid grid-cols-${
                            returnFlight?.flights?.length < 2 ? `${returnFlight?.flights?.length}` : '2'
                        } gap-4 pb-4 border-b`}
                    >
                        {returnFlight?.flights.map((element, index) => {
                            return (
                                <button
                                    className={`${
                                        selectedSegment == index + 1 ? 'border-yellow-400 bg-yellow-400 text-white' : ''
                                    } text-sm border-2 hover:border-blue-400 bg-gray-100 p-2 rounded`}
                                    key={index}
                                    onClick={() => setSelectedSegment(index + 1)}
                                >
                                    <p>{`${element.airlineCode} ${element.flightNumber}`}</p>
                                    <p>
                                        <span className="ml-4">{element?.departure.airportCode}</span>
                                        <span className="font-medium ml-2 mr-4">
                                            ({parseNgayThang(element?.departure.localScheduledTime).time})
                                        </span>
                                        -<span className="ml-4">{element?.arrival.airportCode}</span>
                                        <span className="font-medium ml-2">
                                            ({parseNgayThang(element?.arrival.localScheduledTime).time})
                                        </span>
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <></>
                )}
                <div
                    className={`mt-4 grid grid-cols-${
                        body?.passengers?.length < 3 ? `${body?.passengers?.length}` : '3'
                    } gap-4 pb-4 border-b`}
                >
                    {body?.passengers?.map((item, index) => {
                        return (
                            <button
                                onClick={() => setCurrentlySelectedPassenger(index + 1)}
                                className={`${
                                    currentlySelectedPassenger == index + 1
                                        ? 'border-yellow-400 bg-yellow-400 text-white'
                                        : ''
                                } text-sm border-2 hover:border-blue-400 bg-gray-100 p-2 rounded`}
                                key={index + 1}
                            >
                                <p>{item.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}</p>
                                <p className="font-bold">
                                    {item.reservationProfile.firstName} {item.reservationProfile.lastName}
                                </p>
                                {selectedSeat?.map((seat) => {
                                    if (
                                        seat.passenger.index == index + 1 &&
                                        seat.segment.index == selectedSegment &&
                                        (seat.journey.index == 1 ? 'đi' : 'về') == currentlySelectedFlight
                                    ) {
                                        return (
                                            <p key={index}>
                                                Đã chọn:{' '}
                                                {(seat.journey.index == 1
                                                    ? departureFlightSeatOptions
                                                    : returnFlightSeatOptions)[seat.segment.index - 1].seatOptions.map(
                                                    (seatOption) => {
                                                        if (seatOption.selectionKey == seat.selectionKey) {
                                                            return (
                                                                seatOption.seatMapCell.rowIdentifier +
                                                                seatOption.seatMapCell.seatIdentifier
                                                            );
                                                        }
                                                    },
                                                )}
                                            </p>
                                        );
                                    }
                                })}
                            </button>
                        );
                    })}
                </div>
                <div className="my-4">
                    <div className="flex items-center justify-center text-sm">
                        <div className="flex justify-start items-center mx-4">
                            <div className="w-8 h-8 flex justify-center items-center rounded-xl border-2 font-medium mr-2 bg-gray-300 text-gray-600">
                                A
                            </div>
                            <span>Đã bị chọn</span>
                        </div>
                        <div className="flex justify-start items-center mx-4">
                            <div className="w-8 h-8 flex justify-center items-center rounded-xl border-2 font-medium mr-2 bg-white">
                                A
                            </div>
                            <span>Còn trống</span>
                        </div>
                        <div className="flex justify-start items-center mx-4">
                            <div className="w-8 h-8 flex justify-center items-center rounded-xl border-2 font-medium mr-2 bg-orange-500 text-white">
                                A
                            </div>
                            <span>Đang chọn</span>
                        </div>
                    </div>

                    {body?.passengers?.map((element, index) => {
                        return (
                            <div key={`element-${index}`}>
                                {departureFlight.flights.map((segment, segmentIndex) => {
                                    return (
                                        <div
                                            key={`${index}-${segmentIndex}`}
                                            className={`${
                                                currentlySelectedFlight === 'đi' &&
                                                currentlySelectedPassenger === index + 1 &&
                                                selectedSegment === segmentIndex + 1
                                                    ? 'block'
                                                    : 'hidden'
                                            } mt-8 px-8`}
                                        >
                                            <ListSeatOptions
                                                listSeatRow={listSeatRowOfDepartureFlightSegment[segmentIndex]}
                                                journey={1}
                                                passenger={index + 1}
                                                segment={segmentIndex + 1}
                                                selectedSeat={selectedSeat}
                                                setSelectedSeat={setSelectedSeat}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {body?.journeys?.length > 1 ? (
                        body.passengers.map((element, index) => {
                            return (
                                <div key={`element-${index}`}>
                                    {returnFlight?.flights.map((segment, segmentIndex) => {
                                        return (
                                            <div
                                                key={`${index}-${segmentIndex}`}
                                                className={`${
                                                    currentlySelectedFlight == 'về' &&
                                                    currentlySelectedPassenger == index + 1 &&
                                                    selectedSegment == segmentIndex + 1
                                                        ? 'block'
                                                        : 'hidden'
                                                } mt-8 px-8`}
                                            >
                                                <ListSeatOptions
                                                    listSeatRow={listSeatRowOfReturnFlightSegment[segmentIndex]}
                                                    journey={2}
                                                    passenger={index + 1}
                                                    segment={segmentIndex + 1}
                                                    selectedSeat={selectedSeat}
                                                    setSelectedSeat={setSelectedSeat}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })
                    ) : (
                        <></>
                    )}
                </div>

                <div className="w-[600px] p-4 shadow fixed bottom-0 right-0 rounded-t-lg bg-gradient-to-r from-blue-500 to-blue-400 flex justify-between items-center">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => {
                                setSeatConfirmed(selectedSeat);
                                setOpenPopupSeat(false);
                                setSeatTotalPrice(price);
                            }}
                            className="bg-white p-2 rounded border-2 border-transparent hover:bg-gray-100 hover:border-gray-600"
                        >
                            <p className="font-bold">Xác nhận</p>
                        </button>
                        <div className="ml-2">
                            <p className="text-xl font-bold text-white">
                                Tổng: {(price.departurePrice + price.arrivalPrice)?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={cancelSelected}
                            className={`${
                                selectedSeat.findIndex(
                                    (item) =>
                                        (item.journey.index == 1 ? 'đi' : 'về') == currentlySelectedFlight &&
                                        item.passenger.index == currentlySelectedPassenger &&
                                        item.segment.index == selectedSegment,
                                ) != -1
                                    ? 'block'
                                    : 'hidden'
                            } bg-white p-2 rounded border-2 border-transparent hover:bg-gray-100 hover:border-gray-600`}
                        >
                            <p className="font-bold">Bỏ chọn</p>
                        </button>
                        <button
                            onClick={continueSelect}
                            className={`${
                                currentlySelectedFlight == (body?.journeys?.length > 1 ? 'về' : 'đi') &&
                                currentlySelectedPassenger == body?.passengers?.length &&
                                selectedSegment ==
                                    (currentlySelectedFlight == 'đi' ? departureFlight : returnFlight).flights.length
                                    ? 'hidden'
                                    : 'block'
                            } bg-white p-2 rounded border-2 border-transparent hover:bg-gray-100 hover:border-gray-600 ml-2`}
                        >
                            <p className="font-bold">Tiếp theo</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectSeatPopup;