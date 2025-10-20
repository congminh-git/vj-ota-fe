import { getRequest } from "../apiService";

export const getSeatSelectionOptions = async (bookingKey) => {
    const url = `/seatSelectionOptions?bookingKey=${bookingKey}`;
    return getRequest(url);
};

export const getSeatSelectionOptionsReturn = async (bookingKey) => {
    const url = `/seatSelectionOptions?bookingKey=${bookingKey}`;
    return getRequest(url);
};