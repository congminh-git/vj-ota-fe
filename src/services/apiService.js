import axios from 'axios';
import toast from 'react-hot-toast';
import { getCookie, saveCookie } from './userSessions/saveCookie';
import { putUserSessions } from './userSessions/functions';

const apiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PUBLICAPI_URL,
});

export const getRequest = async (url, params = {}, isRetry = false) => {
    try {
        const token = await getCookie('token');
        const apikey = await getCookie('apikey');

        const response = await apiService.get(url, {
            params,
            headers: {
                'Content-Type': 'application/json',
                token: token?.value ?? '',
                apikey: apikey?.value ?? '',
            },
        });

        return response.data.data;
    } catch (error) {
        if (error.response?.status === 401 && !isRetry) {
            try {
                const refreshToken = await getCookie('refreshToken');
                if (!refreshToken) {
                    window.location.href = '/login';
                    return;
                }

                const newToken = await putUserSessions(refreshToken.value);
                if (!newToken) {
                    window.location.href = '/login';
                    return;
                }

                await saveCookie({
                    name: 'token',
                    data: newToken,
                    time: 580,
                });

                return getRequest(url, params, true);
            } catch {
                window.location.href = '/login';
                return;
            }
        }

        const errorMessage =
            typeof error.response?.data?.message === 'string'
                ? error.response.data.message
                : 'Something went wrong';

        toast.error(errorMessage);
        throw error;
    }
};

export const postRequest = async (url, data, isRetry = false) => {
    try {
        const token = await getCookie('token');
        const apikey = await getCookie('apikey');

        const response = await apiService.post(url, data, {
            headers: {
                token: token?.value ?? '',
                apikey: apikey?.value ?? '',
            },
        });

        return response.data.data;
    } catch (error) {
        if (error.response?.status === 401 && !isRetry) {
            try {
                const refreshToken = await getCookie('refreshToken');
                if (!refreshToken) {
                    window.location.href = '/login';
                    return;
                }

                const newToken = await putUserSessions(refreshToken.value);
                if (!newToken) {
                    window.location.href = '/login';
                    return;
                }

                await saveCookie({
                    name: 'token',
                    data: newToken,
                    time: 580,
                });

                return postRequest(url, data, true);
            } catch {
                window.location.href = '/login';
                return;
            }
        }

        const errorMessage =
            typeof error.response?.data?.message === 'string'
                ? error.response.data.message
                : 'Something went wrong';

        toast.error(errorMessage);
        throw error;
    }
};

export const putRequest = async (url, data, isRetry = false) => {
    try {
        const token = await getCookie('token');
        const apikey = await getCookie('apikey');

        const response = await apiService.put(url, data, {
            headers: {
                token: token?.value ?? '',
                apikey: apikey?.value ?? '',
            },
        });

        return response.data.data;
    } catch (error) {
        if (error.response?.status === 401 && !isRetry) {
            try {
                const refreshToken = await getCookie('refreshToken');
                if (!refreshToken) {
                    window.location.href = '/login';
                    return;
                }

                const newToken = await putUserSessions(refreshToken.value);
                if (!newToken) {
                    window.location.href = '/login';
                    return;
                }

                await saveCookie({
                    name: 'token',
                    data: newToken,
                    time: 580,
                });

                return putRequest(url, data, true);
            } catch {
                window.location.href = '/login';
                return;
            }
        }

        const errorMessage =
            typeof error.response?.data?.message === 'string'
                ? error.response.data.message
                : 'Something went wrong';

        throw error;
    }
};

export const postRequestLogin = async (url, data) => {
    try {
        const response = await apiService.post(url, data);

        await saveCookie({
            name: 'token',
            data: response.data.accessToken,
            time: 580,
        });

        await saveCookie({
            name: 'refreshToken',
            data: JSON.stringify({
                refreshToken: response.data.refreshToken,
                auth: {
                    username: data.username,
                    password: data.password,
                    apikey: data.apikey,
                },
            }),
            time: 302380,
        });

        return response.data;
    } catch (error) {
        const errorMessage =
            typeof error.response?.data?.message === 'string'
                ? error.response.data.message
                : 'Something went wrong';

        toast.error(errorMessage);
        throw error;
    }
};

export const putRequestRefreshToken = async (url, refreshTokenCookie) => {
    try {
        const parsed = JSON.parse(refreshTokenCookie);

        const response = await apiService.put(url, {
            refreshToken: parsed.refreshToken,
            auth: parsed.auth,
        });

        if (response.data?.accessToken) {
            await saveCookie({
                name: 'token',
                data: response.data.accessToken,
                time: 580,
            });
            return response.data.accessToken;
        }
    } catch (error) {
        throw error;
    }
};
