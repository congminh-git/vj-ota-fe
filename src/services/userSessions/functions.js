import { postRequestLogin, putRequestRefreshToken } from "../apiService";

export const postUserSessions = async (body) => {
    const url = `/userSessions`;
    return postRequestLogin(url, body);
};

export const putUserSessions = async (refreshToken) => {
    const url = `/userSessions`;
    return putRequestRefreshToken(url, refreshToken);
};