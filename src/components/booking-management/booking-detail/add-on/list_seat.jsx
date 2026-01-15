'use client';

import Loading from '@/components/loading';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function ListSeatOptions({
    listSeatRow,
    journey,
    passenger,
    segment,
    selectedSeatOptions,
    setSelectedSeatOptions,
    listPurchasedSeat,
    selectedJourney,
}) {
    const identifierListOfRow6 = ['A', 'B', 'C', 'D', 'E', 'F'];
    const identifierListOfRow9 = ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K'];
    const [maxLength, setMaxlength] = useState(0);
    const [listFormated, setListFormarted] = useState(null);
    useEffect(() => {
        if (listSeatRow) {
            const max = listSeatRow.reduce((max, arr) => Math.max(max, arr.length), 0);
            setMaxlength(max);
            if (max == 6) {
                let tempListFormated = [];
                listSeatRow.forEach((seatRow) => {
                    if (seatRow.length == max) {
                        tempListFormated.push(seatRow);
                    } else {
                        let newSeatRow = [];
                        let index = 0;
                        identifierListOfRow6.forEach((identifier) => {
                            if (index < seatRow.length && identifier == seatRow[index].seatMapCell.seatIdentifier) {
                                newSeatRow.push(seatRow[index]);
                                index += 1;
                            } else {
                                newSeatRow.push(null);
                            }
                        });
                        tempListFormated.push(newSeatRow);
                    }
                });
                setListFormarted(tempListFormated);
            } else if (max == 9) {
                let tempListFormated = [];
                listSeatRow.forEach((seatRow) => {
                    if (seatRow.length == max) {
                        tempListFormated.push(seatRow);
                    } else {
                        let newSeatRow = [];
                        let index = 0;
                        identifierListOfRow9.forEach((identifier) => {
                            if (index < seatRow.length && identifier == seatRow[index].seatMapCell.seatIdentifier) {
                                newSeatRow.push(seatRow[index]);
                                index += 1;
                            } else {
                                newSeatRow.push(null);
                            }
                        });
                        tempListFormated.push(newSeatRow);
                    }
                });
                setListFormarted(tempListFormated);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listSeatRow]);

    const handleSelect = (selectionKey) => {
        if (
            listPurchasedSeat?.findIndex(
                (element) =>
                    element.passenger.key == passenger &&
                    element.journey.key == journey &&
                    element.segment.key == segment,
            ) == -1
        ) {
            const findIndex = selectedSeatOptions.findIndex(
                (element) =>
                    element.journey.key == journey &&
                    element.passenger.key == passenger &&
                    element.segment.key == segment,
            );
            if (findIndex == -1) {
                setSelectedSeatOptions([
                    ...selectedSeatOptions,
                    {
                        selectionKey: selectionKey,
                        passenger: {
                            key: passenger,
                        },
                        journey: {
                            key: journey,
                        },
                        segment: {
                            key: segment,
                        },
                    },
                ]);
            } else {
                const selectedSeatOptionsStr = JSON.stringify(selectedSeatOptions);
                let newListPurchasedSeat = JSON.parse(selectedSeatOptionsStr);
                newListPurchasedSeat.splice(findIndex, 1);
                setSelectedSeatOptions([
                    ...newListPurchasedSeat,
                    {
                        selectionKey: selectionKey,
                        passenger: {
                            key: passenger,
                        },
                        journey: {
                            key: journey,
                        },
                        segment: {
                            key: segment,
                        },
                    },
                ]);
            }
        } else {
            toast.error(`Hành khách này đã mua chỗ cho chuyến ${selectedJourney}`);
        }
    };
    return (
        <div className="grid grid-cols-1 gap-8">
            {listFormated ? (
                listFormated?.map((row, indexRow) => {
                    let seatRowIdentifier = 0;
                    for (let i = 0; i < row.length; i++) {
                        if (row[i]) {
                            seatRowIdentifier = row[i].seatMapCell.rowIdentifier;
                        }
                    }
                    return (
                        <div key={indexRow} className={`grid ${maxLength == 9 ? 'grid-cols-11' : 'grid-cols-7'} gap-4`}>
                            {row.map((seat, indexSeat) => {
                                if (indexSeat % 3 == 0 && indexSeat > 0) {
                                    return seat != null ? (
                                        <>
                                            <div className="flex justify-center items-center font-bold text-xl text-gray-600">
                                                {seatRowIdentifier}
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <button
                                                    onClick={() => handleSelect(seat.selectionKey)}
                                                    disabled={
                                                        !seat.selectionValidity.available ||
                                                        listPurchasedSeat.findIndex(
                                                            (element) =>
                                                                element.seatMapCell.key == seat.seatMapCell.key,
                                                        ) != -1
                                                    }
                                                    key={indexSeat}
                                                    className={`group ${
                                                        !seat.selectionValidity.available
                                                            ? 'bg-gray-300 text-gray-700'
                                                            : 'hover:bg-blue-400 hover:text-white'
                                                    } ${
                                                        selectedSeatOptions.findIndex(
                                                            (element) => element.selectionKey == seat.selectionKey,
                                                        ) != -1
                                                            ? 'bg-orange-500'
                                                            : ''
                                                    } ${
                                                        listPurchasedSeat.findIndex(
                                                            (element) =>
                                                                element.seatMapCell.key == seat.seatMapCell.key,
                                                        ) != -1
                                                            ? 'bg-green-500'
                                                            : ''
                                                    } h-10 w-10 flex justify-center items-center rounded-xl border-2 font-medium relative`}
                                                >
                                                    <span className="">{`${seat.seatMapCell.seatIdentifier}`}</span>
                                                    <div className="absolute -top-full p-4 shadow text-white border-gray-200 bg-purple-400 rounded-3xl -translate-y-4 hidden group-hover:flex justify-center items-center">
                                                        <p>
                                                            {seat.seatCharges[0].currencyAmounts[0].totalAmount.toLocaleString()}
                                                            đ
                                                        </p>
                                                        <div className="absolute bottom-0 translate-y-full border-8 border-t-purple-400 border-b-transparent border-l-transparent border-r-transparent"></div>
                                                    </div>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-center items-center font-bold text-xl text-gray-600">
                                                {seatRowIdentifier}
                                            </div>{' '}
                                            <div></div>
                                        </>
                                    );
                                } else {
                                    return seat != null ? (
                                        <div className="flex justify-center items-center">
                                            <button
                                                onClick={() => handleSelect(seat.selectionKey)}
                                                disabled={
                                                    !seat.selectionValidity.available ||
                                                    listPurchasedSeat.findIndex(
                                                        (element) => element.seatMapCell.key == seat,
                                                    ) != -1
                                                }
                                                key={indexSeat}
                                                className={`group ${
                                                    !seat.selectionValidity.available
                                                        ? 'bg-gray-300 text-gray-700'
                                                        : 'hover:bg-blue-400 hover:text-white'
                                                } ${
                                                    selectedSeatOptions.findIndex(
                                                        (element) => element.selectionKey == seat.selectionKey,
                                                    ) != -1
                                                        ? 'bg-orange-500'
                                                        : ''
                                                } ${
                                                    listPurchasedSeat.findIndex(
                                                        (element) => element.seatMapCell.key == seat.seatMapCell.key,
                                                    ) != -1
                                                        ? 'bg-green-500'
                                                        : ''
                                                } h-10 w-10 flex justify-center items-center rounded-xl border-2 font-medium relative`}
                                            >
                                                <span className="">{`${seat.seatMapCell.seatIdentifier}`}</span>
                                                <div className="absolute -top-full p-4 shadow text-white border-gray-200 bg-purple-400 rounded-3xl -translate-y-4 hidden group-hover:flex justify-center items-center">
                                                    <p>
                                                        {seat.seatCharges[0].currencyAmounts[0].totalAmount.toLocaleString()}
                                                        đ
                                                    </p>
                                                    <div className="absolute bottom-0 translate-y-full border-8 border-t-purple-400 border-b-transparent border-l-transparent border-r-transparent"></div>
                                                </div>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div></div>
                                        </>
                                    );
                                }
                            })}
                        </div>
                    );
                })
            ) : (
                <div className="mt-20 flex justify-center min-h-screen">
                    <Loading/>
                </div>
            )}
        </div>
    );
}

export default ListSeatOptions;