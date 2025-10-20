import { getRequest } from '../apiService';

export const getTravelOptions = async (activeChonVe, ngayBay, cityPair, currency, emBe, nguoiLon, treEm, promoCode, company) => {
    const url = `/travelOptions`;

    const params = {
        cityPair: activeChonVe === 'đi' ? cityPair : `${cityPair?.split('-')[1]}-${cityPair?.split('-')[0]}`,
        departure: ngayBay,
        currency: currency,
        adultCount: nguoiLon,
        childCount: treEm,
        infantCount: emBe,
        promoCode: promoCode,
        company: company
    };
    return getRequest(url, params);
};

export const getTravelOptionsUpdateJourney = async (ngayBay, cityPair, reservationKey, journeyKey, company) => {
    const url = `/travelOptions`;
    const params = { cityPair, departure: ngayBay, reservation: reservationKey, journey: journeyKey, company: company };
    return getRequest(url, params);
};

export const getTravelOptionsAddJourney = async (ngayBay, cityPair, reservationKey, company) => {
    const url = `/travelOptions`;
    const params = { cityPair, departure: ngayBay, reservation: reservationKey, company: company };
    return getRequest(url, params);
};

export const getTravelOptionsAddPassenger = async (reservationKey, company) => {
    const url = `/travelOptions`;
    const params = { adultCount: 1, childCount: 0, infantCount: 0, reservation: reservationKey, company: company };
    return getRequest(url, params);
};

export const formatTravelOptions = (data) => {
    let resData = [];
    for (const element of data) {
        const flightCount = element.flights.length;
        let flightList = [];
        for (let j = 0; j < flightCount; j++) {
            const flight = {
                flightNumber: element.flights[j].flightNumber,
                departure: {
                    airportName: element.flights[j].departure.airport.name,
                    airportCode: element.flights[j].departure.airport.code,
                    utcOffset: element.flights[j].departure.airport.utcOffset,
                    scheduledTime: element.flights[j].departure.scheduledTime,
                    localScheduledTime: element.flights[j].departure.localScheduledTime,
                },
                arrival: {
                    airportName: element.flights[j].arrival.airport.name,
                    airportCode: element.flights[j].arrival.airport.code,
                    utcOffset: element.flights[j].arrival.airport.utcOffset,
                    scheduledTime: element.flights[j].arrival.scheduledTime,
                    localScheduledTime: element.flights[j].arrival.localScheduledTime,
                },
                airlineCode: element.flights[j].airlineCode.code,
                aircraftModel: {
                    name: element.flights[j].aircraftModel.name,
                    identifier: element.flights[j].aircraftModel.identifier,
                },
            };
            flightList = [...flightList, flight];
        }

        let fareOptions = [];
        const optionsCount = element.fareOptions.length;
        for (let j = 0; j < optionsCount; j++) {
            let priceAdult = 0;
            let priceChild = 0;
            let priceInfant = 0;
            let totalAdult = 0;
            let totalChild = 0;
            let totalInfant = 0;
            let discountAmount = 0;
            element.fareOptions[j].fareCharges.forEach((fareCharge, index) => {
                if (!fareCharge.bookingApplicability.optional) {
                    const totalAmount = fareCharge.currencyAmounts[0].totalAmount;
                    const discount = fareCharge.currencyAmounts[0].discountAmount;
                    discountAmount += discount;
                    if (index == 0) {
                        if (fareCharge.passengerApplicability.adult) {
                            priceAdult += totalAmount;
                        }
                        if (fareCharge.passengerApplicability.child) {
                            priceChild += totalAmount;
                        }
                        if (fareCharge.passengerApplicability.infant) {
                            priceInfant += totalAmount;
                        }
                    }
                    if (fareCharge.passengerApplicability.adult) {
                        totalAdult += totalAmount;
                    }
                    if (fareCharge.passengerApplicability.child) {
                        totalChild += totalAmount;
                    }
                    if (fareCharge.passengerApplicability.infant) {
                        totalInfant += totalAmount;
                    }
                }
            });

            const option = {
                bookingCode: {
                    code: element.fareOptions[j].bookingCode.code,
                    description: element.fareOptions[j].bookingCode.description,
                    key: element.fareOptions[j].bookingKey,
                },
                fareValidity: element.fareOptions[j].fareValidity,
                cabinClass: {
                    code: element.fareOptions[j].cabinClass.code,
                    description: element.fareOptions[j].cabinClass.description,
                },
                fareClass: {
                    code: element.fareOptions[j].fareClass.code,
                    description: element.fareOptions[j].fareClass.description,
                },
                priceAdult: priceAdult,
                totalAdult: totalAdult,
                priceChild: priceChild,
                totalChild: totalChild,
                priceInfant: priceInfant,
                totalInfant: totalInfant,
                promoCodeApplied: element.fareOptions[j].promoCodeApplied,
                fareCharges: element.fareOptions[j].fareCharges.filter((item) => !item.bookingApplicability.optional),
                discountAmount: discountAmount,
            };

            fareOptions = [...fareOptions, option];
        }

        const item = {
            key: element.key,
            flights: flightList,
            numberOfStops: element.numberOfStops,
            numberOfChanges: element.numberOfChanges,
            fareOptions: fareOptions,
        };
        resData = [...resData, item];
    }
    return resData;
};