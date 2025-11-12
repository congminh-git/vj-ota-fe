'use client';

import ListMealPack from '../list_meal';
import { useEffect, useState } from 'react';

function SelectMealPopup({
    openPopupMeal,
    setOpenPopupMeal,
    body,
    listDepartureMealPack,
    listReturnMealPack,
    setMealTotalPrice,
    setMealConfirmed,
}) {
    const [currentlySelectedFlight, setCurrentlySelectedFlight] = useState('đi');
    const [currentlySelectedPassenger, setCurrentlySelectedPassenger] = useState(1);
    const [selectedMeal, setSelectedMeal] = useState([]);
    const [price, setPrice] = useState({ departurePrice: 0, arrivalPrice: 0 });

    useEffect(() => {
        let total = { departurePrice: 0, arrivalPrice: 0 };
        selectedMeal.forEach((element) => {
            for (let i = 0; i < listDepartureMealPack.length; i++) {
                if (listDepartureMealPack[i].purchaseKey == element.purchaseKey) {
                    total.departurePrice += listDepartureMealPack[i].ancillaryCharges[0].currencyAmounts[0].totalAmount;
                    break;
                }
            }
            if (listReturnMealPack) {
                for (let i = 0; i < listReturnMealPack.length; i++) {
                    if (listReturnMealPack[i].purchaseKey == element.purchaseKey) {
                        total.arrivalPrice += listReturnMealPack[i].ancillaryCharges[0].currencyAmounts[0].totalAmount;
                        break;
                    }
                }
            }
        });
        setPrice(total);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMeal]);

    const continueSelect = () => {
        if (currentlySelectedPassenger < body?.passengers.length) {
            setCurrentlySelectedPassenger(currentlySelectedPassenger + 1);
        } else {
            if (currentlySelectedFlight == 'đi') {
                setCurrentlySelectedFlight('về');
                setCurrentlySelectedPassenger(1);
            }
        }
    };

    const cancelSelected = () => {
        let newSelectedMeal = [];
        selectedMeal.map((item) => {
            if (
                (item.journey.index == (currentlySelectedFlight == 'đi' ? 1 : 2) &&
                    item.passenger.index != currentlySelectedPassenger) ||
                item.journey.index != (currentlySelectedFlight == 'đi' ? 1 : 2)
            ) {
                newSelectedMeal.push(item);
            }
        });
        setSelectedMeal(newSelectedMeal);
    };
    return (
        <div
            className={`${
                openPopupMeal ? 'fixed' : 'hidden'
            } top-0 left-0 bottom-0 right-0 bg-gray-800 bg-opacity-50 flex justify-end z-20`}
        >
            <div className="h-full w-[600px] bg-white p-4 pb-24 relative overflow-auto">
                <div className="flex justify-between">
                    <button
                        onClick={() => setOpenPopupMeal(false)}
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
                        <p className="text-md font-bold text-gray-800">Thông tin suất ăn</p>
                        {/* <p className="text-sm font-medium text-gray-400">
                            <i>Chọn gói hành lý phù hợp với bạn</i>
                        </p> */}
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
                            </button>
                        );
                    })}
                </div>
                <div className="mt-1">
                    <p>Chọn suất ăn</p>
                    {body?.passengers?.map((element, index) => {
                        return (
                            <div
                                key={index}
                                className={
                                    currentlySelectedFlight == 'đi' && currentlySelectedPassenger == index + 1
                                        ? 'block'
                                        : 'hidden'
                                }
                            >
                                <ListMealPack
                                    listMealPack={listDepartureMealPack}
                                    journey={1}
                                    passenger={index + 1}
                                    selectedMeal={selectedMeal}
                                    setSelectedMeal={setSelectedMeal}
                                />
                            </div>
                        );
                    })}

                    {body?.journeys?.length > 0 ? (
                        body.passengers.map((element, index) => {
                            return (
                                <div
                                    key={index}
                                    className={
                                        currentlySelectedFlight == 'về' && currentlySelectedPassenger == index + 1
                                            ? 'block'
                                            : 'hidden'
                                    }
                                >
                                    <ListMealPack
                                        listMealPack={listReturnMealPack}
                                        journey={2}
                                        passenger={index + 1}
                                        selectedMeal={selectedMeal}
                                        setSelectedMeal={setSelectedMeal}
                                    />
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
                                setMealConfirmed(selectedMeal);
                                setOpenPopupMeal(false);
                                setMealTotalPrice(price);
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
                                selectedMeal.findIndex(
                                    (item) =>
                                        (item.journey.index == 1 ? 'đi' : 'về') == currentlySelectedFlight &&
                                        item.passenger.index == currentlySelectedPassenger,
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
                                currentlySelectedPassenger == body?.passengers?.length
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

export default SelectMealPopup;