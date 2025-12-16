'use client';

import Icon from '@/components/icon';
import { faPerson, faChild } from '@fortawesome/free-solid-svg-icons';

export default function PassengerInfomation({ setChangePassengerInfoPopup, reservation, setPassengerSelect }) {
    return (
        <div className="bg-white p-4 border rounded-md">
            <div className="rounded-lg text-start">
                <h3 className="mb-2">
                    Thông tin hành khách
                    <span className="text-xs text-gray-500 ml-4">({reservation?.passengers.length} hành khách)</span>
                </h3>
                <div className={`grid gap-8 ${reservation?.journeys.length > 1 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {reservation?.passengers.map((passenger, index) => {
                        return (
                            <div key={`passenger-${index}`} className={`border rounded`}>
                                <div className="bg-gray-100 p-2 flex justify-between items-center">
                                    <div>
                                        <span className="mr-2">
                                            {passenger.fareApplicability.adult ? (
                                                <Icon icon={faPerson} />
                                            ) : (
                                                <Icon icon={faChild} />
                                            )}
                                            {passenger.fareApplicability.adult ? 'Người lớn:' : 'Trẻ em:'}
                                        </span>
                                        <span>
                                            {passenger.reservationProfile.gender.toUpperCase() == 'MALE' ? 'Ông' : 'Bà'}{' '}
                                            {`${passenger.reservationProfile.firstName} ${passenger.reservationProfile.lastName}`}{' '}
                                        </span>
                                        {passenger.infants.length > 0 ? <span>+ Em bé</span> : <></>}
                                    </div>
                                    {/* <div>
                                        <button
                                            onClick={() => {
                                                setChangePassengerInfoPopup(true);
                                                setPassengerSelect(passenger);
                                            }}
                                            title="Chỉnh sửa"
                                            className="p-1 border rounded bg-white"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                                />
                                            </svg>
                                        </button>
                                    </div> */}
                                </div>
                                {/* <div
                                    className={`${
                                        reservation?.journeys.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                                    } grid`}
                                >
                                    {reservation?.journeys.map((element, index) => {
                                        if (!element.reservationStatus.cancelled) {
                                            return (
                                                <div
                                                    key={`journey-${index}`}
                                                    className="p-3 text-gray-400 flex justify-between"
                                                >
                                                    {element.segments.map((segments, indexSegment) => {
                                                        return (
                                                            <div
                                                                key={`segment-${indexSegment}`}
                                                                className="flex justify-star items-center"
                                                            >
                                                                <span className="mr-2">
                                                                    {segments.departure.airport.code}
                                                                </span>
                                                                <span className="block w-5 h-5 bg-[url('/globalImages/airplane1.png')] bg-cover"></span>
                                                                <span className="ml-2">
                                                                    {segments.arrival.airport.code}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        }
                                    })}
                                </div> */}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}