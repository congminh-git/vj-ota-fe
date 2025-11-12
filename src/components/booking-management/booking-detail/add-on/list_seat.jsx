'use client';

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
                    <div role="status">
                        <svg
                            aria-hidden="true"
                            className="inline w-10 h-10 text-gray-200 animate-spin fill-green-500"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListSeatOptions;