import { getRequest } from "../apiService";

export const getPaymentMethods = async (bookingKey) => {
    const url = `/paymentMethods?bookingKey=${bookingKey}`;
    return getRequest(url);
};
