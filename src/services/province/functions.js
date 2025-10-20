import { getRequest } from "../apiService";

export const getProvinces = async (countryCode) => {
    const url = `/countries/${countryCode}/provinces`;
    return getRequest(url);
};