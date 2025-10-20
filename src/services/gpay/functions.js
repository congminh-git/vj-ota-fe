import { postGpayRequest } from '../apiService';

export const postGpayPay = async (body) => {
    const url = `/gpay/pay`;
    return postGpayRequest(url, body);
};