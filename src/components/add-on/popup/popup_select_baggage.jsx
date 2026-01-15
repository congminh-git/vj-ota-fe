'use client';

import ListBaggagePack from '../list_baggage';
import { useEffect, useState } from 'react';

function SelectBaggagePopup({
    openPopupBaggage,
    setOpenPupupBaggage,
    body,
    listDepartureBaggagePack,
    listReturnBaggagePack,
    setBaggageConfirmed,
    setBaggageTotalPrice,
}) {
    const [currentlySelectedFlight, setCurrentlySelectedFlight] = useState('đi');
    const [selectedBaggage, setSelectedBaggage] = useState([]);
    const [price, setPrice] = useState({ departurePrice: 0, arrivalPrice: 0 });

    useEffect(() => {
        setBaggageTotalPrice({ departurePrice: 0, arrivalPrice: 0 });
        let totalPrice = { departurePrice: 0, arrivalPrice: 0 };
        selectedBaggage.forEach((element) => {
            for (let i = 0; i < listDepartureBaggagePack.length; i++) {
                if (listDepartureBaggagePack[i].purchaseKey == element.purchaseKey) {
                    totalPrice.departurePrice +=
                        listDepartureBaggagePack[i].ancillaryCharges[0].currencyAmounts[0].totalAmount;
                    break;
                }
            }
            if (listReturnBaggagePack) {
                for (let i = 0; i < listReturnBaggagePack.length; i++) {
                    if (listReturnBaggagePack[i].purchaseKey == element.purchaseKey) {
                        totalPrice.arrivalPrice +=
                            listReturnBaggagePack[i].ancillaryCharges[0].currencyAmounts[0].totalAmount;
                        break;
                    }
                }
            }
        });
        setPrice(totalPrice);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBaggage]);

    const continueSelect = () => {
        if (currentlySelectedFlight == 'đi') {
            setCurrentlySelectedFlight('về');
        }
    };

    const cancelSelected = () => {
        const newSelectedBaggage = selectedBaggage.filter(
            (item) => item.journey.index != (currentlySelectedFlight == 'đi' ? 1 : 2),
        );
        console.log(newSelectedBaggage);
        setSelectedBaggage(newSelectedBaggage);
    };
    return (
        <div
            className={`${
                openPopupBaggage ? 'fixed' : 'hidden'
            } top-0 left-0 bottom-0 right-0 bg-gray-800 bg-opacity-50 flex justify-end z-20`}
        >
            <div className="h-full w-[600px] bg-white p-4 pb-24 overflow-auto relative">
                <div className="flex justify-between">
                    <button
                        onClick={() => setOpenPupupBaggage(false)}
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
                        <p className="text-md font-bold text-gray-800">Thông tin hành lý</p>
                        <p className="text-sm font-medium text-gray-400">
                            <i>Chọn gói hành lý phù hợp với bạn</i>
                        </p>
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
                <div className="mt-8">
                    <ul className={currentlySelectedFlight == 'đi' ? 'block' : 'hidden'}>
                        {body?.passengers?.map((item, index) => {
                            return (
                                <li key={index} className="py-2 border-b grid grid-cols-2 gap-4">
                                    <span className="flex items-center justify-start">
                                        {item.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}
                                        <span className="bg-gray-200 h-2 w-2 block rounded-full mx-2"></span>
                                        {item.reservationProfile.firstName} {item.reservationProfile.lastName}
                                    </span>
                                    <div className="flex items-center justify-start">
                                        <ListBaggagePack
                                            listBaggagePack={listDepartureBaggagePack}
                                            journey={1}
                                            passenger={index + 1}
                                            selectedBaggage={selectedBaggage}
                                            setSelectedBaggage={setSelectedBaggage}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <ul className={currentlySelectedFlight == 'về' ? 'block' : 'hidden'}>
                        {body?.passengers?.map((item, index) => {
                            return (
                                <li key={index} className="py-2 border-b grid grid-cols-2 gap-4">
                                    <span className="flex items-center justify-start">
                                        {item.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}
                                        <span className="bg-gray-200 h-2 w-2 block rounded-full mx-2"></span>
                                        {item.reservationProfile.firstName} {item.reservationProfile.lastName}
                                    </span>
                                    <div className="flex items-center justify-start">
                                        <ListBaggagePack
                                            listBaggagePack={listReturnBaggagePack}
                                            journey={2}
                                            passenger={index + 1}
                                            selectedBaggage={selectedBaggage}
                                            setSelectedBaggage={setSelectedBaggage}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="w-[600px] p-4 shadow fixed bottom-0 right-0 rounded-t-lg bg-gradient-to-r from-blue-500 to-blue-400 flex justify-between items-center">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => {
                                setBaggageConfirmed(selectedBaggage);
                                setOpenPupupBaggage(false);
                                setBaggageTotalPrice(price);
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
                                selectedBaggage.findIndex(
                                    (item) => (item.journey.index == 1 ? 'đi' : 'về') == currentlySelectedFlight,
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
                                currentlySelectedFlight == (body?.journeys?.length > 1 ? 'về' : 'đi')
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

export default SelectBaggagePopup;