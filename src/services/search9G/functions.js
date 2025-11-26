import { getRequest, postRequest, putRequest } from '../apiService';
import { getBaseURL } from '@/lib/getBaseUrl';
import { toast } from 'react-hot-toast';
import { postRequest9G } from '../apiService';

export const post9GSearch = async (body) => {
    try {
        const url = `/travelOptions/9g/search`;
        const response = await postRequest9G(url, body);
        return response;
    } catch (error) {
        console.error(error);
    }
};