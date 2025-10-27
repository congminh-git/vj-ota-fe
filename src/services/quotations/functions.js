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
    exchangeRate,paymentMethod) => {
        var methodIndex = -1
        const internationalPaymentMethod = [
            {identifier: "VJPVI", key: "tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p2BJwZ8wTc4ExeJCtCEj4Hz7MHM1X8JzpsHK7LUkJqndw=="},
            {identifier: "VJPMC", key: "tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p194mAGlhM8hHzyNub1xGLall2SNuloDtpyhWuaoDeoPA=="},
            {identifier: "VJPAMEX", key: "tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p104nzxRaOCpOkEMnƒuqo2oi1d¥9h0pvhMOuUOg7P4ƒmA=="},
            {identifier: "VJPJCB", key: "tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1Ur12p0B7xIkkX8eFGwIjU0ZKUMgZƒDSk4CLyF3vJ0EQ=="}
        ]
        for (let i = 0; i<=internationalPaymentMethod.length; i++) {
            if (internationalPaymentMethod[i].identifier === paymentMethod.identifier) {
                methodIndex = i
                break;
            }
        }
    const url = `/quotations?httpMethod=POST&requestUri=reservations/${reservationKey}/paymentTransactions`;
    const body = thongTinVeByKey;
        body.paymentTransactions[0] = {
            paymentMethod: internationalPaymentMethod[methodIndex],
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
