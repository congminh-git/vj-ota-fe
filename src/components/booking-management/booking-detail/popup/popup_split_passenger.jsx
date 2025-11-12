'use client';

import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postReservationSplitPassengers } from '@/services/reservations/functions';

export default function SplitPassengersPopup({
    openSplitPassengersPopup,
    setOpenSplitPassengersPopup,
    reservationByKey,
}) {
    const router = useRouter();
    const [listSelectedPassenger, setListSelectedPassenger] = useState([]);
    const [sendEmailResult, setSendEmailResult] = useState(null);
    const selectPassenger = (e) => {
        if (e.target.checked) {
            setListSelectedPassenger([...listSelectedPassenger, e.target.value]);
        } else {
            const tempStr = JSON.stringify(listSelectedPassenger);
            const list = JSON.parse(tempStr);
            const removeIndex = listSelectedPassenger.findIndex((element) => element == e.target.value);
            if (removeIndex != -1) {
                list.splice(removeIndex, 1);
            }
            setListSelectedPassenger(list);
        }
    };

    const handleSplit = () => {
        toast.fire({
            title: 'Xác nhận muốn tách hành khách',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const body = {
                    directParentReservation: {
                        key: reservationByKey.key,
                    },
                    passengers: listSelectedPassenger.map((element) => ({ key: element })),
                };
                const data = await postReservationSplitPassengers(body);
                if (data.locator) {
                    setSendEmailResult(true)
                    router.push('/booking/payment/booking-success');
                }
            }
        });
    };

    return (
        <div
            className={`${
                openSplitPassengersPopup ? 'flex' : 'hidden'
            } h-screen w-screen bg-gray-700 bg-opacity-50 fixed z-20 top-0 right-0 flex justify-end`}
        >
            <div className="h-full p-8 bg-white overflow-auto">
                <div className="flex justify-between items-center pb-4 border-b">
                    <button
                        onClick={() => setOpenSplitPassengersPopup(false)}
                        className="bg-white p-2 rounded-md hover:bg-gray-100 border"
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
                    <h4 className="font-bold">Tách hành khách</h4>
                </div>
                <div className="mt-4">
                    <p>
                        (<i>Chọn các hành khách muốn tách chuyến</i>)
                    </p>
                    <div>
                        {reservationByKey ? (
                            reservationByKey.passengers.map((passenger, index) => {
                                return (
                                    <div key={`passenger-${index}`} className="flex items-center mt-4 pb-2 border-b">
                                        <input
                                            id="default-checkbox"
                                            type="checkbox"
                                            value={passenger.key}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            onChange={selectPassenger}
                                        />
                                        <label
                                            htmlFor="default-checkbox"
                                            className="ms-2 text-sm font-medium text-gray-900 flex items-center"
                                        >
                                            {passenger.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}{' '}
                                            <span className="w-2 h-2 block rounded-full bg-gray-200 mx-4"></span>{' '}
                                            {`${passenger.reservationProfile.firstName} ${passenger.reservationProfile.lastName}`}
                                        </label>
                                    </div>
                                );
                            })
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleSplit}
                        disabled={listSelectedPassenger.length > 0 ? false : true}
                        className={`mt-8 w-full rounded py-2 text-white ${
                            listSelectedPassenger.length > 0 ? 'bg-blue-500 hover:bg-blue-400' : 'bg-gray-200'
                        }`}
                    >
                        <p className="font-bold">Xác nhận</p>
                    </button>
                </div>
            </div>
        </div>
    );
}