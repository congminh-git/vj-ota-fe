
import { putRequest } from "../apiService";

export const putInsurancePolicyOptions = async (body) => {
    const url = `/insurancePolicyOptions?httpMethod=POST&requestUri=reservations`;
    return putRequest(url, body);
};
