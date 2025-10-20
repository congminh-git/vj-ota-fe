import { putRequest } from "../apiService";

export const putQuotationReservation = async (body) => {
    const url = `/quotations?httpMethod=POST&requestUri=reservations`;
    return putRequest(url, body);
};

export const putQuotationPaymentTransaction = async (
    reservationKey,
    thongTinVeByKey,
    companyKey,
    currency,
    exchangeRate,) => {
    const url = `/quotations?httpMethod=POST&requestUri=reservations/${reservationKey}/paymentTransactions`;
    const body = thongTinVeByKey;
        body.paymentTransactions[0] = {
            paymentMethod: {
                href: 'https://vietjet-api.intelisystraining.ca/RESTv1/paymentMethods/tfCeB5%C2%A5mircWvs2CC2%A59VaH1zFawFw==',
                key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                identifier: 'AG',
            },
            paymentMethodCriteria: {},
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
            processingCurrencyAmounts: [
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
        };
    return putRequest(url, body);
};

export const putQuotationReservationUpdatePassenger = async (reservationKey, passengerKey, body) => {
    const url = `/quotations?httpMethod=PUT&requestUri=reservations/${reservationKey}/passengers/${passengerKey}`;
    return putRequest(url, body);
};

export const putQuotationReservationUpdateJourney = async (reservationKey, journeyKey, body) => {
    const url = `/quotations?httpMethod=PUT&requestUri=reservations/${reservationKey}/journeys/${journeyKey}`;
    return putRequest(url, body);
};

export const putQuotationEditReservationSeatSelections = async (body) => {
    const url = `/quotations?httpMethod=POST&requestUri=reservations/${body.key}/seatSelections/bulk`;
    return putRequest(url, body);
};

export const putQuotationEditReservationAncillaryPurchases = async (body) => {
    const url = `/quotations?httpMethod=POST&requestUri=reservations/${body.key}/ancillaryPurchases/bulk`;
    return putRequest(url, body);
};

export const putQuotationReservationAddJourney = async (body) => {
    const url = `/quotations?httpMethod=POST&requestUri=reservations/${body.key}/journeys`;
    return putRequest(url, body);
};

export const putQuotationReservationAddPassenger = async (body) => {
    const url = `/quotations?httpMethod=POST&requestUri=reservations/${body.key}/passengers`;
    return putRequest(url, body);
};

export const putQuotationReservationUpdateBookingInformation = async (body) => {
    const url = `/quotations?httpMethod=PUT&requestUri=reservations/${body.key}/bookingInformation/${body.bookingInformation.key}`;
    return putRequest(url, body);
};
