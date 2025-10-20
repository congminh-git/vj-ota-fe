'use client';

import { useEffect, useState } from 'react';
import { putQuotationEditReservationSeatSelections } from '@/services/quotations/functions';
import { postReservationSeatBulk } from '@/services/reservations/functions';
import { parseNgayThang } from '@/components/danh-sach-ve/chuyen_bay_item';
import ListSeatOptions from '@/components/quan-ly-dat-cho/chi-tiet-dat-cho/them-dich-vu/list_cho_ngoi';
import ListPaymentMethod from '@/components/thanh-toan/listPaymentMethod';
import { getCurrencySymbol } from '@/lib/parseCurrency';

function SelectSeatForm({ setRefetch, refetch, body, companyKey, listAllJourneySeatOptions, currency, exchangeRate }) {
    const [selectedJourney, setSelectedJourney] = useState(1);
    const [selectedPassenger, setSelectedPassenger] = useState(1);
    const [selectedSeatOptions, setSelectedSeatOptions] = useState([]);
    const [selectedSegment, setSelectedSegment] = useState(1);
    const [allJourneyListRow, setAllJourneyListRow] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [quotations, setQuotations] = useState(null);
    const [postPaymentTransactions, setPostPaymentTransactions] = useState(null);
    const [listPurchasedSeat, setListPurchasedSeat] = useState(null);
    const [price, setPrice] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('');

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        if (listAllJourneySeatOptions) {
            let tempList = [];
            listAllJourneySeatOptions.map((journeyInfo) => {
                if (journeyInfo) {
                    let listRow1 = [];
                    let listElementOfRow = [];
                    let index = 1;
                    let maxLength = 0;
                    journeyInfo[0].seatOptions.forEach((element) => {
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
                    journeyInfo[1]?.seatOptions.forEach((element) => {
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
                    tempList.push([
                        listRow1.sort((a, b) => a[0].seatMapCell.rowIdentifier - b[0].seatMapCell.rowIdentifier),
                        listRow2.sort((a, b) => a[0].seatMapCell.rowIdentifier - b[0].seatMapCell.rowIdentifier),
                    ]);
                } else {
                    tempList.push([[], []]);
                }
            });
            setAllJourneyListRow(tempList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listAllJourneySeatOptions]);

    const xuLyThanhToan = () => {
        if (paymentMethod.identifier == 'AG') {
            const selectedSeatOptionsStr = JSON.stringify(selectedSeatOptions);
            let bodyPost = JSON.parse(selectedSeatOptionsStr);
            bodyPost[0].paymentTransactions = postPaymentTransactions;
            bodyPost[0].paymentTransactions.map((item) => {
                item.paymentMethodCriteria = {
                    account: {
                        company: {
                            key: companyKey,
                        },
                    },
                };
            });
            postReservationSeatBulk(body.key, bodyPost, setRefetch, refetch);
        }
    };

    const handlePutQuotationEditReservationSeatSelections = async (body) => {
        const data = await putQuotationEditReservationSeatSelections(body)
        setQuotations(data)
    }

    useEffect(() => {
        if (body) {
            const bodyStr = JSON.stringify(body);
            let newBody = JSON.parse(bodyStr);
            newBody.paymentTransactions = [
                {
                    paymentMethod: {
                        key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                        identifier: 'AG',
                    },
                    paymentMethodCriteria: {
                        account: {
                            company: {
                                key: companyKey,
                            },
                        },
                    },
                    currencyAmounts: [
                        {
                            totalAmount: 0,
                            currency: {
                                code: currency,

                                baseCurrency: true,
                            },
                            exchangeRate: exchangeRate,
                        },
                    ],
                    payerDescription: null,
                    receiptNumber: null,
                    payments: null,
                    refundTransactions: null,
                    notes: null,
                },
            ];
            selectedSeatOptions.forEach((element) => {
                newBody.seatSelections.push(element);
            });

            handlePutQuotationEditReservationSeatSelections(newBody);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSeatOptions]);

    useEffect(() => {
        if (body) {
            setListPurchasedSeat(body.seatSelections);
            for (let i = 0; i < body.journeys.length; i++) {
                if (!body.journeys[i].reservationStatus.cancelled) {
                    setSelectedJourney(i + 1);
                    break;
                }
            }
        }
    }, [body]);

    useEffect(() => {
        if (quotations) {
            let tong = 0;
            let paymentTrans = [];
            quotations.paymentTransactions.map((item) => {
                if (!item.receiptNumber) {
                    tong += item.currencyAmounts[0].totalAmount;
                    paymentTrans.push(item);
                }
            });
            setPrice(tong);
            setPostPaymentTransactions(paymentTrans);
        }
    }, [quotations]);
    return (
        <>
            <div className="flex justify-center items-center border-b mt-2">
                {body?.journeys.map((journey, index) => {
                    if (!journey.reservationStatus.cancelled) {
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedJourney(index + 1)}
                                className={`${
                                    selectedJourney == index + 1 ? 'border-blue-400' : 'border-transparent'
                                } py-2 px-4 border-b-4 hover:bg-gray-100`}
                            >
                                Chặng {index + 1}
                            </button>
                        );
                    }
                })}
            </div>
            <div
                className={`mt-4 grid grid-cols-${
                    body?.journeys[0].segments?.length < 2 ? `${body.journeys[0].segments?.length}` : '2'
                } gap-4 pb-4 border-b`}
            >
                {body?.journeys[selectedJourney - 1].segments.map((element, index) => {
                    return (
                        <button
                            className={`${
                                selectedSegment == index + 1 ? 'border-yellow-400 bg-yellow-400 text-white' : ''
                            } text-sm border-2 hover:border-blue-400 bg-gray-100 p-2 rounded`}
                            key={index}
                            onClick={() => setSelectedSegment(index + 1)}
                        >
                            <p>{`${element.flight.airlineCode.code} ${element.flight.flightNumber}`}</p>
                            <p>
                                <span className="ml-4">{element?.departure.airport.code}</span>
                                <span className="font-medium ml-2 mr-4">
                                    ({parseNgayThang(element?.departure.localScheduledTime).time})
                                </span>
                                -<span className="ml-4">{element?.arrival.airport.code}</span>
                                <span className="font-medium ml-2">
                                    ({parseNgayThang(element?.arrival.localScheduledTime).time})
                                </span>
                            </p>
                        </button>
                    );
                })}
            </div>
            <div
                className={`mt-4 grid grid-cols-${
                    body?.passengers?.length < 3 ? `${body?.passengers?.length}` : '3'
                } gap-4 pb-4 border-b`}
            >
                {body?.passengers?.map((item, index) => {
                    if (
                        body.journeys[selectedJourney - 1].passengerJourneyDetails.findIndex(
                            (itemPassenger) => itemPassenger.passenger.key == item.key,
                        ) != -1
                    ) {
                        return (
                            <button
                                onClick={() => setSelectedPassenger(index + 1)}
                                className={`${
                                    selectedPassenger == index + 1 ? 'border-yellow-400 bg-yellow-400 text-white' : ''
                                } text-sm border-2 hover:border-blue-400 bg-gray-100 p-2 rounded`}
                                key={index + 1}
                            >
                                <p>{item.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}</p>
                                <p className="font-bold">
                                    {item.reservationProfile.firstName} {item.reservationProfile.lastName}
                                </p>
                                {selectedSeatOptions?.map((seat) => {
                                    if (
                                        seat.passenger.key == item.key &&
                                        seat.segment.key ==
                                            body.journeys[selectedJourney - 1].segments[selectedSegment - 1].key &&
                                        seat.journey.key == body.journeys[selectedJourney - 1].key
                                    ) {
                                        return (
                                            <p key={index}>
                                                Đã chọn:{' '}
                                                {listAllJourneySeatOptions[selectedJourney - 1][
                                                    selectedSegment - 1
                                                ].seatOptions.map((seatOption) => {
                                                    if (seatOption.selectionKey == seat.selectionKey) {
                                                        return (
                                                            seatOption.seatMapCell.rowIdentifier +
                                                            seatOption.seatMapCell.seatIdentifier
                                                        );
                                                    }
                                                })}
                                            </p>
                                        );
                                    }
                                })}
                                {listPurchasedSeat?.map((seat) => {
                                    if (
                                        seat.passenger.key == item.key &&
                                        seat.segment.key ==
                                            body.journeys[selectedJourney - 1].segments[selectedSegment - 1].key &&
                                        seat.journey.key == body.journeys[selectedJourney - 1].key
                                    ) {
                                        return (
                                            <p key={index}>
                                                Đã mua:{' '}
                                                {seat.seatMapCell.rowIdentifier + seat.seatMapCell.seatIdentifier}
                                            </p>
                                        );
                                    }
                                })}
                            </button>
                        );
                    }
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
                        <div className="w-8 h-8 flex justify-center items-center rounded-xl border-2 font-medium mr-2 bg-green-500 text-white">
                            A
                        </div>
                        <span>Đã mua</span>
                    </div>
                    <div className="flex justify-start items-center mx-4">
                        <div className="w-8 h-8 flex justify-center items-center rounded-xl border-2 font-medium mr-2 bg-orange-500 text-white">
                            A
                        </div>
                        <span>Đang chọn</span>
                    </div>
                </div>
                {allJourneyListRow ? (
                    allJourneyListRow?.map((journey, journeyIndex) => {
                        if (!body?.journeys[journeyIndex].reservationStatus.cancelled) {
                            return (
                                <div key={`journey-${journeyIndex}`}>
                                    {body?.passengers?.map((element, index) => {
                                        return (
                                            <div key={`element-${index}`}>
                                                {body?.journeys[journeyIndex]?.segments.map((segment, segmentIndex) => {
                                                    return (
                                                        <div
                                                            key={`${index}-${segmentIndex}`}
                                                            className={`${
                                                                selectedJourney === journeyIndex + 1 &&
                                                                selectedPassenger === index + 1 &&
                                                                selectedSegment === segmentIndex + 1
                                                                    ? 'block'
                                                                    : 'hidden'
                                                            } mt-8 px-8`}
                                                        >
                                                            <ListSeatOptions
                                                                listSeatRow={journey[segmentIndex]}
                                                                journey={body.journeys[journeyIndex].key}
                                                                passenger={element.key}
                                                                segment={segment.key}
                                                                selectedSeatOptions={selectedSeatOptions}
                                                                setSelectedSeatOptions={setSelectedSeatOptions}
                                                                listPurchasedSeat={listPurchasedSeat}
                                                                selectedJourney={selectedJourney}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }
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

            <ListPaymentMethod setPaymentMethod={setPaymentMethod} listPaymentMethod={['AG']} />

            <button
                onClick={() => xuLyThanhToan()}
                disabled={selectedSeatOptions.length > 0 && paymentMethod != null ? false : true}
                className={`mt-8 w-full rounded py-2 text-white ${
                    selectedSeatOptions.length > 0 && paymentMethod != null
                        ? 'bg-blue-500 hover:bg-blue-400'
                        : 'bg-gray-300 text-gray-700'
                }`}
            >
                <p className="text-sm">
                    Tổng: {price?.toLocaleString()} {currencySymbol} (Đã bao gồm dư nợ)
                </p>
                <p className="font-bold">Xác nhận</p>
            </button>
        </>
    );
}

export default SelectSeatForm;