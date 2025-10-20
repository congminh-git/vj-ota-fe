'use client';

import Icon from '@/components/icon';
import { faPerson, faChild } from '@fortawesome/free-solid-svg-icons';

export default function PassengerInfomationBookingSuccess({ bookingSuccessResult }) {
    return (
        <div>
            <div className="rounded-lg text-start">
                <h3 className="mb-2">
                    Thông tin hành khách
                    <span className="text-xs text-gray-500 ml-4">
                        ({bookingSuccessResult?.passengers.length} hành khách)
                    </span>
                </h3>
                <div
                    className={`grid gap-8 ${
                        bookingSuccessResult?.journeys.length > 1 ? 'grid-cols-2' : 'grid-cols-3'
                    }`}
                >
                    {bookingSuccessResult?.passengers.map((passenger, index) => {
                        return (
                            <div key={`passenger-${index}`} className={`border rounded`}>
                                <div className="bg-gray-100 p-2">
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
                                {/* <div
                                    className={`${
                                        bookingSuccessResult?.journeys.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                                    } grid`}
                                >
                                    {bookingSuccessResult?.journeys.map((element, index) => {
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
                                                                <span className="block w-5 h-5 bg-[url('/airplane1.png')] bg-cover"></span>
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