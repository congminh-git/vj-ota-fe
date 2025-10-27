import { getRequest, postRequest, putRequest } from '../apiService';
import { getBaseURL } from '@/lib/getBaseUrl';
import { toast } from 'react-hot-toast';

export const getReservationByLocatorForSearch = async (locator) => {
    const url = `/reservations?reservationLocator=${locator}`;
    return getRequest(url);
};

export const getReservationByLocator = async (locator) => {
    const url = `/reservations?reservationLocator=${locator}`;
    return getRequest(url);
};

export const getReservationByKey = async (reservationKey) => {
    const url = `/reservations/${reservationKey}`;
    return getRequest(url);
};

export const getReservationPassengers = async (reservationKey, passengerSelect) => {
    const url = `/reservations/${reservationKey}/passengers`;
    const response = await getRequest(url);
    const list = response.filter((passenger) => passenger.key == passengerSelect.key);
    return list;
};

export const putUpdateReservationPassengerByKey = async (reservationKey, reservationBody) => {
    const url = `/reservations/${reservationKey}/passengers/${reservationBody.key}`;
    return putRequest(url, reservationBody);
};

export const putUpdateReservationJourneyByKey = async (reservationKey, journeykey, reservationBody) => {
    const url = `/reservations/${reservationKey}/journeys/${journeykey}`;
    return putRequest(url, reservationBody);
};

export const postReservationDatVe = async (body, quotations, creditCard) => {
    try {
        const url = `/reservations`;
        body.paymentTransactions[0].currencyAmounts = quotations.paymentTransactions[0].currencyAmounts;
        body.paymentTransactions[0].processingCurrencyAmounts =
            quotations.paymentTransactions[0].processingCurrencyAmounts;
        body.paymentTransactions.forEach((element) => {
            if (['MC', 'VI'].includes(element.paymentMethod.identifier)) {
                const newCreditCard = { ...creditCard };
                delete newCreditCard.expiryDate;
                element.paymentMethodCriteria = {
                    creditCard: newCreditCard,
                };
            }
        });
        const response = await postRequest(url, body);
        if (response) {
            sessionStorage.setItem('bookingSuccessResult', JSON.stringify(response));
            await postEmailingItineraries(response.key, response.bookingInformation.contactInformation.email, true);
        }
        return true;
    } catch (error) {
        console.error(error);
    }
};

export const postReservationByInternationalCard = async (body, quotations, billing, cardInfo) => {
    try {
        console.log(billing, cardInfo);
        const url = `/reservations`;
        const baseUrl = getBaseURL();
        body.paymentTransactions[0].currencyAmounts = quotations.paymentTransactions[0].currencyAmounts;
        body.paymentTransactions[0].processingCurrencyAmounts =
            quotations.paymentTransactions[0].processingCurrencyAmounts;
        body.paymentTransactions[0].callbackURLs = {
            // successURL: `${baseUrl}/dat-ve/thanh-toan/success`,
            // failureURL: `${baseUrl}/dat-ve/thanh-toan/failure`,
            // cancelURL: `${baseUrl}/dat-ve/thanh-toan/cancel`,
            // pendingURL: `${baseUrl}/dat-ve/thanh-toan/pending`,
            // ipnURL: ``,

            successURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/success',
            failureURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/failure',
            cancelURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/cancel',
            pendingURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/pending',
            ipnURL: '',
        };
        body.paymentTransactions[0].billingInfo = billing;
        body.paymentTransactions[0].cardInfo = cardInfo;
        const response = await postRequest(url, body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const postReservationCheck = async (transactionID) => {
    try {
        const url = `/transactions/${transactionID}/paymentTransactions`;
        const response = await postRequest(url, {});
        return response;
    } catch (error) {}
};

export const postReservationSplitPassengers = async (body) => {
    try {
        const url = `/reservations`;
        const response = await postRequest(url, body);
        if (response) {
            sessionStorage.setItem('bookingSuccessResult', JSON.stringify(response));
            postEmailingItineraries(response.key, response.bookingInformation.contactInformation.email, true);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const postReservationPaymentTransaction = async (
    reservationByKey,
    companyKey,
    quotations,
    currency,
    exchangeRate,
) => {
    try {
        const body = {
            reservationKey: reservationByKey?.key,
            data: {
                paymentMethod: {
                    href: 'https://vietjet-api.intelisystraining.ca/RESTv1/paymentMethods/tfCeB5%C2%A5mircWvs2CC2%A59VaH1zFawFw==',
                    key: 'tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==',
                    identifier: 'AG',
                    description: 'Agency Credit',
                },
                paymentMethodCriteria: {
                    account: {
                        company: {
                            key: companyKey,
                        },
                    },
                },
                currencyAmounts: [
                    {
                        totalAmount: quotations?.paymentTransactions[0].currencyAmounts[0].totalAmount,
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
            },
        };
        const url = `/reservations/paymentTransactions`;
        const response = await postRequest(url, body);
        if (response) {
            toast.success('Thanh toán thành công');
            await postEmailingItineraries(
                reservationByKey.key,
                reservationByKey.bookingInformation.contactInformation.email,
                true,
            );
            location.reload();
        } else {
            toast.error('Thanh toán thất bại');
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message?.message || 'Something went wrong');
    }
};

export const postReservationPaymentTransactionByInternationalCard = async (
    reservationByKey,
    companyKey,
    quotations,
    currency,
    exchangeRate,
    billing,
    cardInfo,
    paymentMethod
) => {
    try {
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
        var paymentObjIndex = -1
        for ( let i =0; i < quotations.paymentTransactions.length; i++ ) {
            if (!quotations.paymentTransactions[i].receiptNumber) {
                paymentObjIndex = i
            }
        }
        const body = {
            reservationKey: reservationByKey?.key,
            data: {
                paymentMethod: internationalPaymentMethod[methodIndex],
                paymentMethodCriteria: {
                    account: {
                        company: {
                            key: companyKey,
                        },
                    },
                },
                currencyAmounts: [
                    {
                        totalAmount: quotations?.paymentTransactions[paymentObjIndex].currencyAmounts[0].totalAmount,
                        currency: {
                            code: currency,
                            baseCurrency: true,
                        },
                        exchangeRate: exchangeRate,
                    },
                ],
                processingCurrencyAmounts: [
                    {
                        totalAmount: quotations?.paymentTransactions[paymentObjIndex].processingCurrencyAmounts[0].totalAmount,
                        currency: {
                            code: currency,
                            baseCurrency: true,
                        },
                        exchangeRate: exchangeRate,
                    },
                ],
                billingInfo: billing,
                cardInfo: cardInfo,
                callbackURLs: {
                    successURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/success',
                    failureURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/failure',
                    cancelURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/cancel',
                    pendingURL: 'https://ota-booking-demo.vercel.app/dat-ve/thanh-toan/pending',
                    ipnURL: '',
                },
                payerDescription: null,
                receiptNumber: null,
                payments: null,
                refundTransactions: null,
                notes: null,
            },
        };
        const url = `/reservations/paymentTransactions`;
        const response = await postRequest(url, body);
        console.log("A")
        return response
    } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message?.message || 'Something went wrong');
    }
};

export const postEmailingItineraries = async (reservationKey, email, passive) => {
    try {
        const url = `/reservations/${reservationKey}/emailItinerary?languageCode=vi&includeAllPassengers=true&itineraryTypeCode=D&emailAddresses=${email}&senderAddress=noreply.itinerary@vietjetair.com&passengerKey=&includeLogo=true&includeTermsAndConditions=true`;
        console.log(url);
        const response = await postRequest(url, {});
        console.log(response);
        if (response == '') {
            if (passive) {
                toast.success('Đã gửi email hành trình');
            } else {
                toast.success('Gửi email hành trình thành công');
            }
        } else {
            if (passive) {
                toast.error('Gửi email hành trình thất bại');
            } else {
                toast.error('Gửi email hành trình thất bại');
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message?.message || 'Something went wrong');
    }
};

export const postReservationAncillaryBulk = async (reservationKey, body, setRefetch, refetch) => {
    try {
        const url = `/reservations/${reservationKey}/ancillaryPurchases/bulk`;
        const response = await postRequest(url, body);
        if (response) {
            setRefetch(refetch + 1);
            toast.success('Mua dịch vụ thành công');
        } else {
            toast.error('Mua dịch vụ thất bại');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message?.message || 'Something went wrong');
    }
};

export const postReservationSeatBulk = async (reservationKey, body, setRefetch, refetch) => {
    try {
        const url = `/reservations/${reservationKey}/seatSelections/bulk`;
        const response = await postRequest(url, body);
        if (response.data.data) {
            setRefetch(refetch + 1);
            toast.success('Thanh toán chọn chỗ thành công');
        } else {
            toast.error('Thanh toán chọn chỗ thất bại');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

export const postReservationAddJourney = async (reservationKey, body) => {
    try {
        const url = `/reservations/${reservationKey}/journeys`;
        const response = await postRequest(url, body);
        if (response) {
            toast.success('Thêm chặng bay thành công');
            setHandleResult(response);
        } else {
            toast.error('Thêm chặng bay thất bại');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message?.message || 'Something went wrong');
    }
};

export const postReservationAddPassenger = async (reservationKey, body) => {
    try {
        const url = `/reservations/${reservationKey}/passengers`;
        const response = await postRequest(url, body);
        if (response) {
            toast.success('Thêm hành khách thành công');
            setHandleResult(response);
        } else {
            toast.error('Thêm hành khách thất bại');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message?.message || 'Something went wrong');
    }
};

export const getReservationBookingInfomation = async (reservationKey, bookingInformationKey) => {
    try {
        const url = `/reservations/${reservationKey}/bookingInformation/${bookingInformationKey}`;
        const response = await getRequest(url);
        if (response) {
            return response;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message?.message || 'Something went wrong');
    }
};

export const putReservationBookingInformation = async (reservationKey, bookingInformationKey, body) => {
    try {
        const url = `/reservations/${reservationKey}/bookingInformation/${bookingInformationKey}`;
        const response = await putRequest(url, body);
        if (response) {
            toast.success('Đổi thông tin thành công');
            return response;
        } else {
            toast.error('Đổi thông tin thất bại');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message?.message || 'Something went wrong');
    }
};
