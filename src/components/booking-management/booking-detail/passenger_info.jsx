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
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}