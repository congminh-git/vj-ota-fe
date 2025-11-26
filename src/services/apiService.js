import axios from 'axios';
import toast from 'react-hot-toast';
import { getCookie, saveCookie } from './userSessions/saveCookie';
import { putUserSessions } from './userSessions/functions';

const apiService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PUBLICAPI_URL,
});

// Hàm GET chung
export const getRequest = async (url, params = {}, isRetry = false) => {
    try {
        const token = await getCookie('token');
        const apikey = await getCookie('apikey');
        if (token) {
            const response = await apiService.get(url, {
                params,
                headers: {
                    'Content-Type': 'application/json',
                    token: `${token.value}`,
                    apikey: `${apikey?.value ?? ''}`,
                },
            });
            return response.data.data;
        } else {
            const refreshToken = await getCookie('refreshToken');
            if (!refreshToken) {
                window.location.href = '/login';
            } else {
                const refreshed = await putUserSessions(refreshToken.value)
                if (refreshed) {
                    const response = await apiService.get(url, {
                        params,
                        headers: {
                            'Content-Type': 'application/json',
                            token: `${refreshed}`,
                            apikey: `${apikey?.value ?? ''}`,
                        },
                    });
                    return response.data.data;
                } else {
                    window.location.href = '/login';
                }
            }
        }
    } catch (error) {
        const errorMessage =
            typeof error.response?.data?.message === 'string' ? error.response.data.message : 'Something went wrong';
        toast.error(errorMessage);
        console.log(error);
        throw error;
    }
};

// Hàm POST chung
export const postRequest = async (url, data, isRetry = false) => {
    try {
        const token = await getCookie('token');
        const apikey = await getCookie('apikey');
        if (token) {
            const response = await apiService.post(url, data, {
                headers: {
                    token: `${token.value}`,
                    apikey: `${apikey.value}`,
                },
            });
            return response.data.data;
        } else {
            const refreshToken = await getCookie('refreshToken');
            if (!refreshToken) {
                window.location.href = '/login';
            } else {
                const refreshed = await putUserSessions(refreshToken.value)
                if (refreshed) {
                    const response = await apiService.post(url, data, {
                        headers: {
                            token: `${refreshed}`,
                        },
                    });
                    return response.data.data;
                } else {
                    window.location.href = '/login';
                }
            }
        }
    } catch (error) {
        const errorMessage =
            typeof error.response?.data?.message === 'string' ? error.response.data.message : 'Something went wrong';
        toast.error(errorMessage);
        throw error;
    }
};

// Hàm PUT chung
export const putRequest = async (url, data, isRetry = false) => {
    try {
        const token = await getCookie('token');
        const apikey = await getCookie('apikey');
        if (token) {
            const response = await apiService.put(url, data, {
                headers: {
                    token: `${token.value}`,
                    apikey: `${apikey.value}`,
                },
            });
            return response.data.data;
        } else {
            const refreshToken = await getCookie('refreshToken');
            if (!refreshToken) {
                window.location.href = '/login';
            } else {
                const refreshed = await putUserSessions(refreshToken.value)
                if (refreshed) {
                    const response = await apiService.put(url, data, {
                        headers: {
                            token: `${refreshed}`,
                            apikey: `${apikey.value}`,
                        },
                    });
                    return response.data.data;
                } else {
                    window.location.href = '/login';
                }
            }
        }
    } catch (error) {
        const errorMessage =
            typeof error.response?.data?.message === 'string' ? error.response.data.message : 'Something went wrong';
        // toast.error(errorMessage);
        throw error;
    }
};

export const postRequestLogin = async (url, data) => {
    try {
        const response = await apiService.post(url, data);
        await saveCookie({ name: 'token', data: response.data.accessToken, time: 580 });
        await saveCookie({
            name: 'refreshToken',
            data: JSON.stringify({
                refreshToken: response.data.refreshToken,
                auth: { username: data.username, password: data.password, apikey: data.apikey },
            }),
            time: 302380,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        const errorMessage =
            typeof error.response?.data?.message === 'string' ? error.response.data.message : 'Something went wrong';

        toast.error(errorMessage);
        throw error;
    }
};

export const putRequestRefreshToken = async (url, refreshTokenCookie) => {
    try {
        const response = await apiService.put(url, {
            refreshToken: JSON.parse(refreshTokenCookie).refreshToken,
            auth: JSON.parse(refreshTokenCookie).auth,
        });
        if (response.data.accessToken) {
            await saveCookie({ name: 'token', data: response.data.accessToken, time: 580 });
            return response.data.accessToken;
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
        const errorMessage =
            typeof error.response?.data?.message === 'string' ? error.response.data.message : 'Something went wrong';

        toast.error(errorMessage);
        throw error;
    }
};
