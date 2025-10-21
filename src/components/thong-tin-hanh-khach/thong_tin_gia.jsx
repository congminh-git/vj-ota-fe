import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseNgayThang } from '../danh-sach-ve/chuyen_bay_item';
import { getCurrencySymbol } from '@/lib/parseCurrency';

export default function PriceInfomation({
    departureFlight,
    returnFlight,
    roundTrip,
    adult,
    child,
    infant,
    cityPair,
    departureCity,
    arrivalCity,
    fareOptionsDepartureFlight,
    fareOptionsReturnFlight,
    baggageTotalPrice,
    seatTotalPrice,
    mealTotalPrice,
    insuranceTotalPrice,
    processingAmount
}) {
    const pathname = usePathname();
    const [showDeparturePrices, setShowDeparturePrices] = useState(false);
    const [showDepartureFees, setShowDepartureFees] = useState(false);
    const [showDepartureServices, setShowDepartureServices] = useState(false);
    const [showReturnPrices, setShowReturnPrices] = useState(false);
    const [showReturnFees, setShowReturnFees] = useState(false);
    const [showReturnServices, setShowReturnServices] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [formatDeparturePrice, setFormatDeparturePrice] = useState(null);
    const [formatReturnPrice, setFormatReturnPrice] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState('');
    const currency = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') ?? 'VND' : 'VND';
    const exchangeRate = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('exchangeRate')) ?? 1 : 1;

    useEffect(() => {
        if (currency) {
            setCurrencySymbol(getCurrencySymbol(currency));
        }
    }, [currency]);

    useEffect(() => {
        console.log(fareOptionsDepartureFlight)
        const departureTotal =
            departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.totalAdult * adult +
            departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.totalChild * child +
            departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.totalInfant * infant;
        const returnTotal =
            returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.totalAdult * adult +
            returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.totalChild * child +
            returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.totalInfant * infant;
        const price =
            (departureTotal ? departureTotal : 0) +
            (returnTotal ? returnTotal : 0) +
            (baggageTotalPrice ? baggageTotalPrice.departurePrice + baggageTotalPrice.arrivalPrice : 0) +
            (seatTotalPrice ? seatTotalPrice.departurePrice + seatTotalPrice.arrivalPrice : 0) +
            (mealTotalPrice ? mealTotalPrice.departurePrice + mealTotalPrice.arrivalPrice : 0) +
            (insuranceTotalPrice ? insuranceTotalPrice : 0);
        setTotalPrice(price);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        departureFlight,
        returnFlight,
        adult,
        child,
        infant,
        fareOptionsDepartureFlight,
        fareOptionsReturnFlight,
        baggageTotalPrice,
        seatTotalPrice,
        mealTotalPrice,
        insuranceTotalPrice,
    ]);

    return (
        <div className="bg-white p-4 rounded-md">
            <h3 className="mb-2 p-2 text-center bg-sky-400 text-white font-bold rounded">THÔNG TIN ĐẶT CHỖ</h3>
            <div className="">
                <div className="text-sm font-medium">
                    <div className="text-sky-400 flex justify-between items-end text-base">Chuyến đi:</div>
                    {departureFlight ? (
                        <>
                            <div className="text-sm mt-1">
                                <p>
                                    {`${departureFlight.flights[0].departure.airportName} (${departureFlight.flights[0].departure.airportCode})` +
                                        ' - ' +
                                        `${departureFlight.flights[0].arrival.airportName} (${departureFlight.flights[0].arrival.airportCode})`}
                                </p>
                                <p>
                                    {`${
                                        parseNgayThang(departureFlight.flights[0].departure.localScheduledTime).date
                                    } | ${
                                        parseNgayThang(departureFlight.flights[0].departure.localScheduledTime).time
                                    } - ${
                                        parseNgayThang(departureFlight.flights[0].arrival.localScheduledTime).time
                                    } | ${departureFlight.flights[0].airlineCode}${
                                        departureFlight.flights[0].flightNumber
                                    }`}
                                </p>
                            </div>
                            {departureFlight.flights.length > 1 ? (
                                <div className="text-sm mt-1">
                                    <p>
                                        {`${departureFlight.flights[1].departure.airportName} (${departureFlight.flights[1].departure.airportCode})` +
                                            ' - ' +
                                            `${departureFlight.flights[1].arrival.airportName} (${departureFlight.flights[1].arrival.airportCode})`}
                                    </p>
                                    <p>
                                        {`${
                                            parseNgayThang(departureFlight.flights[1].departure.localScheduledTime).date
                                        } | ${
                                            parseNgayThang(departureFlight.flights[1].departure.localScheduledTime).time
                                        } - ${
                                            parseNgayThang(departureFlight.flights[1].arrival.localScheduledTime).time
                                        } | ${departureFlight.flights[1].airlineCode}${
                                            departureFlight.flights[1].flightNumber
                                        }`}
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <div className="text-sm mt-1">
                            <p>
                                {`${departureCity?.replaceAll('_', ' ')} (${cityPair?.split('-')[0]})` +
                                    ' - ' +
                                    `${arrivalCity?.replaceAll('_', ' ')} (${cityPair?.split('-')[1]})`}
                            </p>
                        </div>
                    )}
                    <div className="border border-gray-300 rounded-md overflow-hidden mt-1">
                        <div>
                            <button
                                onClick={() => {
                                    setShowDeparturePrices(!showDeparturePrices);
                                }}
                                className="flex items-center justify-between bg-gray-50 w-full p-3 border-b"
                            >
                                Giá vé
                                <div className="flex justify-between items-center">
                                    {departureFlight ? (
                                        <span className="font-semibold">
                                            {(
                                                departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.priceAdult *
                                                    adult +
                                                departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.priceChild *
                                                    child +
                                                departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.priceInfant *
                                                    infant
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showDeparturePrices ? 'hidden' : 'block'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showDeparturePrices ? 'block' : 'hidden'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            </button>
                            {departureFlight ? (
                                <div className={`p-2 border-b ${showDeparturePrices ? 'block' : 'hidden'}`}>
                                    <p className="flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Hạng vé</span>
                                        <span>
                                            {
                                                departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareClass
                                                    .description
                                            }
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Người lớn x {adult}</span>
                                        <span>
                                            {(departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0]
                                                .passengerApplicability.adult
                                                ? departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0].currencyAmounts[0].baseAmount * adult
                                                : 0
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                    {child ? (
                                        <p className="mt-2 flex justify-between items-center">
                                            <span className="font-medium text-gray-500">Trẻ em x {child}</span>
                                            <span>
                                                {(departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0].passengerApplicability.child
                                                    ? departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0].currencyAmounts[0].baseAmount * child
                                                    : 0
                                                ).toLocaleString()}{' '}
                                                {currencySymbol}
                                            </span>
                                        </p>
                                    ) : null}
                                    {infant ? (
                                        <p className="mt-2 flex justify-between items-center">
                                            <span className="font-medium text-gray-500">Em bé x {infant}</span>
                                            <span>
                                                {(departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0].passengerApplicability.infant
                                                    ? departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0].currencyAmounts[0].baseAmount * infant
                                                    : 0
                                                ).toLocaleString()}{' '}
                                                {currencySymbol}
                                            </span>
                                        </p>
                                    ) : null}
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Thuế VAT</span>
                                        <span>
                                            {(
                                                departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0]
                                                    .currencyAmounts[0].taxAmount *
                                                ((departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0].passengerApplicability.adult
                                                    ? adult
                                                    : 0) +
                                                    (departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0].passengerApplicability.child
                                                        ? child
                                                        : 0) +
                                                    (departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges[0].passengerApplicability.infant
                                                        ? infant
                                                        : 0))
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setShowDepartureFees(!showDepartureFees);
                                }}
                                className="flex items-center justify-between bg-gray-50 w-full p-3 border-b"
                            >
                                Thuế phí
                                <div className="flex justify-between items-center">
                                    {departureFlight ? (
                                        <span className="font-semibold">
                                            {(
                                                departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.totalAdult *
                                                    adult +
                                                departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.totalChild *
                                                    child +
                                                departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.totalInfant *
                                                    infant -
                                                (departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.priceAdult *
                                                    adult +
                                                    departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.priceChild *
                                                        child +
                                                    departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.priceInfant *
                                                        infant)
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showDepartureFees ? 'hidden' : 'block'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showDepartureFees ? 'block' : 'hidden'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            </button>
                            {departureFlight ? (
                                <div className={`p-2 border-b ${showDepartureFees ? 'block' : 'hidden'}`}>
                                    {departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges.map(
                                        (charge, indexCharge) => {
                                            if (indexCharge > 0) {
                                                const count =
                                                    (charge.passengerApplicability.adult ? adult : 0) +
                                                    (charge.passengerApplicability.child ? child : 0) +
                                                    (charge.passengerApplicability.infant ? infant : 0);
                                                return (
                                                    <div key={`charge-${indexCharge}`}>
                                                        <p className="flex justify-between items-center mb-2">
                                                            <span className="font-medium text-gray-500">
                                                                {charge.description} x {count}
                                                            </span>
                                                            <span>
                                                                {(
                                                                    charge.currencyAmounts[0].baseAmount * count
                                                                ).toLocaleString()}{' '}
                                                                {currencySymbol}
                                                            </span>
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        },
                                    )}
                                    <p className="flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Thuế VAT</span>
                                        <span>
                                            {departureFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsDepartureFlight)?.fareCharges
                                                .reduce((total, charge, indexCharge) => {
                                                    if (indexCharge > 0) {
                                                        const count =
                                                            (charge.passengerApplicability.adult ? adult : 0) +
                                                            (charge.passengerApplicability.child ? child : 0) +
                                                            (charge.passengerApplicability.infant ? infant : 0);
                                                        return total + charge.currencyAmounts[0].taxAmount * count;
                                                    }
                                                    return total;
                                                }, 0)
                                                .toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setShowDepartureServices(!showDepartureServices);
                                }}
                                className="flex items-center justify-between bg-gray-50 w-full p-3 border-b"
                            >
                                Dịch vụ
                                <div className="flex justify-between items-center">
                                    {departureFlight ? (
                                        <span className="font-semibold">
                                            {(
                                                (baggageTotalPrice ? baggageTotalPrice.departurePrice : 0) +
                                                (seatTotalPrice ? seatTotalPrice.departurePrice : 0) +
                                                (mealTotalPrice ? mealTotalPrice.departurePrice : 0) +
                                                (insuranceTotalPrice
                                                    ? roundTrip
                                                        ? insuranceTotalPrice / 2
                                                        : insuranceTotalPrice
                                                    : 0)
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showDepartureServices ? 'hidden' : 'block'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showDepartureServices ? 'block' : 'hidden'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            </button>
                            {departureFlight ? (
                                <div className={`p-2 ${showDepartureServices ? 'block' : 'hidden'}`}>
                                    <p className="flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Hành lý</span>
                                        <span>
                                            {baggageTotalPrice ? baggageTotalPrice.departurePrice.toLocaleString() : 0}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Suất ăn</span>
                                        <span>
                                            {mealTotalPrice ? mealTotalPrice.departurePrice.toLocaleString() : 0}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Chỗ ngồi</span>
                                        <span>
                                            {seatTotalPrice ? seatTotalPrice.departurePrice.toLocaleString() : 0}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Bảo hiểm</span>
                                        <span>
                                            {(insuranceTotalPrice
                                                ? roundTrip
                                                    ? insuranceTotalPrice / 2
                                                    : insuranceTotalPrice
                                                : 0
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {roundTrip ? (
                <div className="text-sm font-medium mt-6 pb-4">
                    <div className="text-sky-400 flex justify-between items-end text-base">Chuyến về:</div>
                    {returnFlight ? (
                        <>
                            <div className="text-sm mt-1">
                                <p>
                                    {`${returnFlight.flights[0].departure.airportName} (${returnFlight.flights[0].departure.airportCode})` +
                                        ' - ' +
                                        `${returnFlight.flights[0].arrival.airportName} (${returnFlight.flights[0].arrival.airportCode})`}
                                </p>
                                <p>
                                    {`${parseNgayThang(returnFlight.flights[0].departure.localScheduledTime).date} | ${
                                        parseNgayThang(returnFlight.flights[0].departure.localScheduledTime).time
                                    } - ${parseNgayThang(returnFlight.flights[0].arrival.localScheduledTime).time} | ${
                                        returnFlight.flights[0].airlineCode
                                    }${returnFlight.flights[0].flightNumber}`}
                                </p>
                            </div>
                            {returnFlight.flights.length > 1 ? (
                                <div className="text-sm mt-1">
                                    <p>
                                        {`${returnFlight.flights[1].departure.airportName} (${returnFlight.flights[1].departure.airportCode})` +
                                            ' - ' +
                                            `${returnFlight.flights[1].arrival.airportName} (${returnFlight.flights[1].arrival.airportCode})`}
                                    </p>
                                    <p>
                                        {`${
                                            parseNgayThang(returnFlight.flights[1].departure.localScheduledTime).date
                                        } | ${
                                            parseNgayThang(returnFlight.flights[1].departure.localScheduledTime).time
                                        } - ${
                                            parseNgayThang(returnFlight.flights[1].arrival.localScheduledTime).time
                                        } | ${returnFlight.flights[1].airlineCode}${
                                            returnFlight.flights[1].flightNumber
                                        }`}
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <div className="text-sm mt-1">
                            <p>
                                {`${arrivalCity?.replaceAll('_', ' ')} (${cityPair?.split('-')[1]})` +
                                    ' - ' +
                                    `${departureCity?.replaceAll('_', ' ')} (${cityPair?.split('-')[0]})`}
                            </p>
                        </div>
                    )}
                    <div className="border border-gray-300 rounded-md overflow-hidden mt-1">
                        <div>
                            <button
                                onClick={() => {
                                    setShowReturnPrices(!showReturnPrices);
                                }}
                                className="flex items-center justify-between bg-gray-50 w-full p-3 border-b"
                            >
                                Giá vé
                                <div className="flex justify-between items-center">
                                    {returnFlight ? (
                                        <span className="font-semibold">
                                            {(
                                                returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.priceAdult * adult +
                                                returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.priceChild * child +
                                                returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.priceInfant * infant
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showReturnPrices ? 'hidden' : 'block'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showReturnPrices ? 'block' : 'hidden'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            </button>
                            {returnFlight ? (
                                <div className={`p-2 border-b ${showReturnPrices ? 'block' : 'hidden'}`}>
                                    <p className="flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Hạng vé</span>
                                        <span>
                                            {returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareClass.description}
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Người lớn x {adult}</span>
                                        <span>
                                            {(returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                .passengerApplicability.adult
                                                ? returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                      .currencyAmounts[0].baseAmount * adult
                                                : 0
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                    {child ? (
                                        <p className="mt-2 flex justify-between items-center">
                                            <span className="font-medium text-gray-500">Trẻ em x {child}</span>
                                            <span>
                                                {(returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                    .passengerApplicability.child
                                                    ? returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                          .currencyAmounts[0].baseAmount * child
                                                    : 0
                                                ).toLocaleString()}{' '}
                                                {currencySymbol}
                                            </span>
                                        </p>
                                    ) : null}
                                    {infant ? (
                                        <p className="mt-2 flex justify-between items-center">
                                            <span className="font-medium text-gray-500">Em bé x {infant}</span>
                                            <span>
                                                {(returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                    .passengerApplicability.infant
                                                    ? returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                          .currencyAmounts[0].baseAmount * infant
                                                    : 0
                                                ).toLocaleString()}{' '}
                                                {currencySymbol}
                                            </span>
                                        </p>
                                    ) : null}
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Thuế VAT</span>
                                        <span>
                                            {(
                                                returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                    .currencyAmounts[0].taxAmount *
                                                ((returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                    .passengerApplicability.adult
                                                    ? adult
                                                    : 0) +
                                                    (returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                        .passengerApplicability.child
                                                        ? child
                                                        : 0) +
                                                    (returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges[0]
                                                        .passengerApplicability.infant
                                                        ? infant
                                                        : 0))
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setShowReturnFees(!showReturnFees);
                                }}
                                className="flex items-center justify-between bg-gray-50 w-full p-3 border-b"
                            >
                                Thuế phí
                                <div className="flex justify-between items-center">
                                    {returnFlight ? (
                                        <span className="font-semibold">
                                            {(
                                                returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.totalAdult * adult +
                                                returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.totalChild * child +
                                                returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.totalInfant *
                                                    infant -
                                                (returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.priceAdult * adult +
                                                    returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.priceChild *
                                                        child +
                                                    returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.priceInfant *
                                                        infant)
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showReturnFees ? 'hidden' : 'block'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showReturnFees ? 'block' : 'hidden'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            </button>
                            {returnFlight ? (
                                <div className={`p-2 border-b ${showReturnFees ? 'block' : 'hidden'}`}>
                                    {returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges.map(
                                        (charge, indexCharge) => {
                                            if (indexCharge > 0) {
                                                const count =
                                                    (charge.passengerApplicability.adult ? adult : 0) +
                                                    (charge.passengerApplicability.child ? child : 0) +
                                                    (charge.passengerApplicability.infant ? infant : 0);
                                                return (
                                                    <div key={`charge-${indexCharge}`}>
                                                        <p className="flex justify-between items-center mb-2">
                                                            <span className="font-medium text-gray-500">
                                                                {charge.description} x {count}
                                                            </span>
                                                            <span>
                                                                {(
                                                                    charge.currencyAmounts[0].baseAmount * count
                                                                ).toLocaleString()}{' '}
                                                                {currencySymbol}
                                                            </span>
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        },
                                    )}
                                    <p className="flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Thuế VAT</span>
                                        <span>
                                            {returnFlight?.fareOptions.find((element)=>element.bookingCode.key == fareOptionsReturnFlight)?.fareCharges
                                                .reduce((total, charge, indexCharge) => {
                                                    if (indexCharge > 0) {
                                                        const count =
                                                            (charge.passengerApplicability.adult ? adult : 0) +
                                                            (charge.passengerApplicability.child ? child : 0) +
                                                            (charge.passengerApplicability.infant ? infant : 0);
                                                        return total + charge.currencyAmounts[0].taxAmount * count;
                                                    }
                                                    return total;
                                                }, 0)
                                                .toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setShowReturnServices(!showReturnServices);
                                }}
                                className="flex items-center justify-between bg-gray-50 w-full p-3 border-b"
                            >
                                Dịch vụ
                                <div className="flex justify-between items-center">
                                    {returnFlight ? (
                                        <span className="font-semibold">
                                            {(
                                                (baggageTotalPrice ? baggageTotalPrice.arrivalPrice : 0) +
                                                (seatTotalPrice ? seatTotalPrice.arrivalPrice : 0) +
                                                (mealTotalPrice ? mealTotalPrice.arrivalPrice : 0) +
                                                (insuranceTotalPrice
                                                    ? roundTrip
                                                        ? insuranceTotalPrice / 2
                                                        : insuranceTotalPrice
                                                    : 0)
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showReturnServices ? 'hidden' : 'block'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className={`size-4 ml-2 ${showReturnServices ? 'block' : 'hidden'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            </button>
                            {returnFlight ? (
                                <div className={`p-2 ${showReturnServices ? 'block' : 'hidden'}`}>
                                    <p className="flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Hành lý</span>
                                        <span>
                                            {baggageTotalPrice ? baggageTotalPrice.arrivalPrice.toLocaleString() : 0}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Suất ăn</span>
                                        <span>
                                            {mealTotalPrice ? mealTotalPrice.arrivalPrice.toLocaleString() : 0}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Chỗ ngồi</span>
                                        <span>
                                            {seatTotalPrice ? seatTotalPrice.arrivalPrice.toLocaleString() : 0}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                    <p className="mt-2 flex justify-between items-center">
                                        <span className="font-medium text-gray-500">Bảo hiểm</span>
                                        <span>
                                            {(insuranceTotalPrice
                                                ? roundTrip
                                                    ? insuranceTotalPrice / 2
                                                    : insuranceTotalPrice
                                                : 0
                                            ).toLocaleString()}{' '}
                                            {currencySymbol}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <div className="border-gray-300 mt-4">
                {
                    processingAmount > 0
                    ?
                    <div className="flex justify-between items-center mt-1">
                        <span>Phí tiện ích</span>
                        <span className="font-bold">
                            {processingAmount.toLocaleString()} {currencySymbol}
                        </span>
                    </div>
                    :
                    <></>
                }
                <div className="flex justify-between items-center mt-1">
                    <span>Tổng tiền</span>
                    <span className="font-bold">
                        {totalPrice.toLocaleString()} {currencySymbol}
                    </span>
                </div>
            </div>
        </div>
    );
}