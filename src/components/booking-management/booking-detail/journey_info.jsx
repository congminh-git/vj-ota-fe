'use client';

import { putQuotationReservationUpdateJourney } from '@/services/quotations/functions';
import { parseNgayThang, tinhThoiGianBay } from '@/components/select-flight/flight_item';
import { useEffect, useState } from 'react';
import CancelLegQuotationPopup from '@/components/booking-management/booking-detail/popup/popup_cancel_journey';
import { toast } from 'react-hot-toast';
import { getCurrencySymbol } from '@/lib/parseCurrency';

export default function FlightInfomation({
    legNumber,
    setSearchFlightPopup,
    reservation,
    journeyInfo,
    setJourneyUpdate,
    price,
    listCharge,
    reservationByKey,
    companyKey,
}) {
    const [cancelledBody, setCancelledBody] = useState(null);
    const [cancelledResult, setCancelledResult] = useState(null);
    const [openCancelLegQuotationPopup, setOpenCancelLegQuotationPopup] = useState(false);
    const [quotations, setQuotations] = useState(null);
    const [listPassengerCharges, setListPassengerCharges] = useState(null);
    const [open, setOpen] = useState(false);
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;
    const [currencySymbol, setCurrencySymbol] = useState('');

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        setCancelledBody({
            ...journeyInfo,
            reservationStatus: {
                ...journeyInfo.reservationStatus,
                cancelled: true,
            },
        });
    }, [journeyInfo]);

    useEffect(() => {
        if (cancelledResult) {
            location.reload();
        }
    }, [cancelledResult]);

    useEffect(() => {
        if (cancelledResult) {
            if (cancelledResult.reservationStatus.cancelled) {
                toast.success('Hủy chặng bay thành công');
                location.reload();
            } else {
                toast.error('Hủy chặng bay thất bại');
            }
        }
    }, [cancelledResult]);

    useEffect(() => {
        if (quotations) {
            setOpenCancelLegQuotationPopup(true);
        }
    }, [quotations]);

    useEffect(() => {
        if (listCharge) {
            let listPassengers = [];
            reservationByKey.passengers.forEach((passenger) => {
                let list = [];
                listCharge.forEach((charge) => {
                    if (charge.passenger.key == passenger.key) {
                        list.push(charge);
                    }
                });
                listPassengers.push(list);
            });
            setListPassengerCharges(listPassengers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listCharge]);

    const handleCancel = () => {
        const reservationByKeyStr = JSON.stringify(reservationByKey);
        const quotationBody = JSON.parse(reservationByKeyStr);
        let cancelJourney = {};
        let cancelIndex = 0;
        for (let i = 0; i < quotationBody.journeys.length; i++) {
            if (quotationBody.journeys[i].key == journeyInfo.key) {
                cancelJourney = quotationBody.journeys[i];
                cancelIndex = i;
            }
        }
        cancelJourney.reservationStatus.cancelled = true;
        quotationBody.journeys[cancelIndex] = cancelJourney;
        quotationBody.paymentTransactions = [
            {
                paymentMethod: {
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                    identifier: 'AG',
                },
                paymentMethodCriteria: {},
                currencyAmounts: [
                    {
                        totalAmount: 0,
                        currency: {
                            href: 'https://vietjet-api.intelisystraining.ca/RESTv1/currencies/VND',
                            code: currency,
                            description: 'Vietnam Dong',
                            baseCurrency: true,
                        },
                        exchangeRate: exchangeRate,
                    },
                ],
                refundTransactions: [],
                notes: '',
            },
        ];
        handlePutQuotationReservationUpdateJourney(reservation.key, journeyInfo.key, quotationBody);
    };

    const handlePutQuotationReservationUpdateJourney= async (reservationKey, journeyKey, body) => {
        const data = await putQuotationReservationUpdateJourney(reservationKey, journeyKey, body)
        setQuotations(data)
    }

    useEffect(() => {
        if (quotations) {
            setOpenCancelLegQuotationPopup(true);
        }
    }, [quotations]);

    return (
        <div className="border p-4 rounded-lg text-start h-full bg-white">
            <div>
                <div className="flex justify-between mb-4">
                    <div className="flex justify-start items-center">
                        <p className="font-medium text-sky-400">Chặng {legNumber + 1}:</p>
                        <p className="text-gray-500 font-medium ml-6">
                            <span>Chuyến bay:</span>
                            <span className="ml-2">
                                {journeyInfo.segments[0].flight.airlineCode?.code}
                                {journeyInfo.segments[0].flight.flightNumber}
                            </span>
                        </p>
                        <p className="text-gray-500 font-medium ml-6">
                            <span className="">Airbus:</span>
                            <span className="text-gray-500 ml-2">
                                A{journeyInfo.segments[0].flight.aircraftModel.identifier}
                            </span>
                        </p>
                        <div className="flex justify-between items-center"></div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                setSearchFlightPopup('update');
                                setJourneyUpdate(journeyInfo);
                            }}
                            className="px-4 py-2 rounded-md bg-blue-200 hover:bg-blue-100 hover:bg-opacity-50 bg-opacity-50 text-blue-400 font-semibold"
                        >
                            <i>Đổi chặng bay</i>
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 ml-2 rounded-md bg-blue-200 hover:bg-blue-100 hover:bg-opacity-50 bg-opacity-50 text-blue-400 font-semibold"
                        >
                            <i>Hủy chặng bay</i>
                        </button>
                    </div>
                </div>
                <div className="h-full grid grid-cols-8 py-4 border-t border-b">
                    <div className="col-span-2">
                        <div className="h-1/3 font-semibold mb-1">
                            <i>
                                {journeyInfo.segments[0].departure.airport.name} (
                                {journeyInfo.segments[0].departure.airport.code})
                            </i>
                        </div>
                        <div className="h-1/3"></div>
                        <div className="h-1/3 text-gray-500 text-sm flex items-center">
                            {parseNgayThang(journeyInfo.segments[0].departure.localScheduledTime).time}{' '}
                            <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                            {parseNgayThang(journeyInfo.segments[0].departure.localScheduledTime).date} (Giờ địa phương)
                        </div>
                    </div>
                    <div className="col-span-4 flex-grow mx-4">
                        <div className="h-1/3 text-sky-400 text-sm w-full text-center mb-1">
                            {tinhThoiGianBay(
                                journeyInfo.segments[0].departure.localScheduledTime,
                                journeyInfo.segments[0].arrival.localScheduledTime,
                            )}
                        </div>
                        <div className="h-1/3 flex justify-between items-center relative">
                            <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                            <div className="bg-[url('/Vector1.png')] h-[1px] flex-grow"></div>
                            <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                            <div className="w-5 h-5 bg-[url('/airplane1.png')] bg-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                        <div className="h-1/3 text-gray-500 text-xs w-full text-center mt-1">Bay thẳng</div>
                    </div>
                    <div className="col-span-2 flex flex-col items-end">
                        <div className="h-1/3 font-semibold mb-1">
                            <i>
                                {journeyInfo.segments[0].arrival.airport.name} (
                                {journeyInfo.segments[0].arrival.airport.code})
                            </i>
                        </div>
                        <div className="h-1/3"></div>
                        <div className="h-1/3 text-gray-500 text-sm flex items-center">
                            {parseNgayThang(journeyInfo.segments[0].arrival.localScheduledTime).time}{' '}
                            <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                            {parseNgayThang(journeyInfo.segments[0].arrival.localScheduledTime).date} (Giờ địa phương)
                        </div>
                    </div>
                </div>
                {journeyInfo.segments[1] ? (
                    <div className="h-full grid grid-cols-8 py-4 border-t border-b">
                        <div className="col-span-2">
                            <div className="h-1/3 font-semibold mb-1">
                                <i>
                                    {journeyInfo.segments[1].departure.airport.name} (
                                    {journeyInfo.segments[1].departure.airport.code})
                                </i>
                            </div>
                            <div className="h-1/3"></div>
                            <div className="h-1/3 text-gray-500 text-sm flex items-center">
                                {parseNgayThang(journeyInfo.segments[1].departure.localScheduledTime).time}{' '}
                                <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                                {parseNgayThang(journeyInfo.segments[1].departure.localScheduledTime).date} (Giờ địa
                                phương)
                            </div>
                        </div>
                        <div className="col-span-4 flex-grow mx-4">
                            <div className="h-1/3 text-sky-400 text-sm w-full text-center mb-1">
                                {tinhThoiGianBay(
                                    journeyInfo.segments[1].departure.localScheduledTime,
                                    journeyInfo.segments[1].arrival.localScheduledTime,
                                )}
                            </div>
                            <div className="h-1/3 flex justify-between items-center relative">
                                <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                                <div className="bg-[url('/Vector1.png')] h-[1px] flex-grow"></div>
                                <div className="w-2 h-2 bg-[url('/Group16.png')] bg-cover"></div>
                                <div className="w-5 h-5 bg-[url('/airplane1.png')] bg-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                            <div className="h-1/3 text-gray-500 text-xs w-full text-center mt-1">Bay thẳng</div>
                        </div>
                        <div className="col-span-2 flex flex-col items-end">
                            <div className="h-1/3 font-semibold mb-1">
                                <i>
                                    {journeyInfo.segments[1].arrival.airport.name} (
                                    {journeyInfo.segments[1].arrival.airport.code})
                                </i>
                            </div>
                            <div className="h-1/3"></div>
                            <div className="h-1/3 text-gray-500 text-sm flex items-center">
                                {parseNgayThang(journeyInfo.segments[1].arrival.localScheduledTime).time}{' '}
                                <span className="block h-2 w-2 rounded-full bg-gray-300 mx-2"></span>{' '}
                                {parseNgayThang(journeyInfo.segments[1].arrival.localScheduledTime).date} (Giờ địa
                                phương)
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                <div className={`grid sm:grid-cols-2 grid-cols-1 mt-2 gap-8 ${open ? 'block' : 'hidden'}`}>
                    {listPassengerCharges ? (
                        listPassengerCharges.map((charges, indexCharges) => {
                            return (
                                <div key={`passenger-${indexCharges}`} className="border rounded overflow-hidden">
                                    <div className="p-2 bg-gray-200 text-gray-700">
                                        {reservationByKey.passengers.map((passenger, index) => {
                                            if (passenger.key == charges[0].passenger.key) {
                                                return (
                                                    <div key={index} className="flex items-center">
                                                        <span>
                                                            {passenger.reservationProfile.gender.toUpperCase() == 'MALE'
                                                                ? 'Ông'
                                                                : 'Bà'}
                                                        </span>
                                                        <span className="block mx-2 rounded-full w-2 h-2 bg-gray-700"></span>
                                                        <span>
                                                            {passenger.reservationProfile.firstName +
                                                                ' ' +
                                                                passenger.reservationProfile.lastName}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                    <div className="p-2">
                                        <div className="flex justify-between items-center font-bold">Giá vé:</div>
                                        {charges.map((charge, chargeIndex) => {
                                            if (charge.chargeType.code == 'FA') {
                                                return (
                                                    <>
                                                        <div
                                                            key={`charge-${chargeIndex}`}
                                                            className="flex justify-between items-center"
                                                        >
                                                            <span>{charge.description}</span>
                                                            <span>
                                                                {charge.currencyAmounts[0].baseAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div
                                                            key={`vat-${chargeIndex}`}
                                                            className="flex justify-between items-center"
                                                        >
                                                            <span>Thuế VAT</span>
                                                            <span>
                                                                {charge.currencyAmounts[0].taxAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </>
                                                );
                                            }
                                        })}
                                        <div className="flex justify-between items-center font-bold">Thuế phí:</div>
                                        {charges.map((charge, chargeIndex) => {
                                            if (
                                                charge.chargeType.code != 'FA' &&
                                                charge.chargeType.code != 'SR' &&
                                                charge.chargeType.code != 'IN'
                                            ) {
                                                return (
                                                    <div
                                                        key={`charge-${chargeIndex}`}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <span>{charge.description}</span>
                                                        <span>
                                                            {charge.currencyAmounts[0].baseAmount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        })}
                                        <div className="flex justify-between items-center">
                                            <span>Thuế VAT</span>
                                            <span>
                                                {charges
                                                    .reduce((total, charge) => {
                                                        if (
                                                            charge.chargeType.code !== 'FA' &&
                                                            charge.chargeType.code != 'SR' &&
                                                            charge.chargeType.code != 'IN'
                                                        ) {
                                                            const taxAmount = charge.currencyAmounts[0]?.taxAmount || 0;
                                                            return total + taxAmount;
                                                        }
                                                        return total;
                                                    }, 0)
                                                    .toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center font-bold">Dịch vụ:</div>
                                        {charges.map((charge, chargeIndex) => {
                                            if (
                                                charge.chargeType.code != 'FA' &&
                                                (charge.chargeType.code == 'SR' || charge.chargeType.code == 'IN')
                                            ) {
                                                if (chargeIndex != charges.length - 1) {
                                                    return (
                                                        <div
                                                            key={`charge-${chargeIndex}`}
                                                            className="flex justify-between items-center"
                                                        >
                                                            <span>{charge.description}</span>
                                                            <span>
                                                                {charge.currencyAmounts[0].baseAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <>
                                                            <div
                                                                key={`charge-${chargeIndex}`}
                                                                className="flex justify-between items-center"
                                                            >
                                                                <span>{charge.description}</span>
                                                                <span>
                                                                    {charge.currencyAmounts[0].baseAmount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span>Thuế VAT</span>
                                                                <span>
                                                                    {charges
                                                                        .reduce((total, charge) => {
                                                                            if (
                                                                                charge.chargeType.code !== 'FA' &&
                                                                                (charge.chargeType.code == 'SR' ||
                                                                                    charge.chargeType.code == 'IN')
                                                                            ) {
                                                                                const taxAmount =
                                                                                    charge.currencyAmounts[0]
                                                                                        ?.taxAmount || 0;
                                                                                return total + taxAmount;
                                                                            }
                                                                            return total;
                                                                        }, 0)
                                                                        .toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </>
                                                    );
                                                }
                                            }
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <></>
                    )}
                </div>
                <div className="flex justify-between mt-4 text-sm">
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-sky-400 flex justify-between items-center font-semibold"
                    >
                        <span>Chi tiết</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className={`size-4 ml-2 ${open ? 'hidden' : 'block'}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className={`size-4 ml-2 ${open ? 'block' : 'hidden'}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                    </button>
                    <div>
                        Tổng tiền:{' '}
                        <i className="ml-2">
                            {price?.toLocaleString()} {currencySymbol}
                        </i>
                    </div>
                </div>
            </div>

            <CancelLegQuotationPopup
                openCancelLegQuotationPopup={openCancelLegQuotationPopup}
                setOpenCancelLegQuotationPopup={setOpenCancelLegQuotationPopup}
                quotations={quotations}
                cancelledBody={cancelledBody}
                journeyKey={journeyInfo.key}
                reservationKey={reservation.key}
                setCancelledResult={setCancelledResult}
                companyKey={companyKey}
                journeyInfo={journeyInfo}
            />
        </div>
    );
}