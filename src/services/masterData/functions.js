import { getRequest } from "../apiService";

export const getMasterData = async () => {
    const url = `/masterData`;
    const response = await getRequest(url);
    console.log(response);
    if (response && typeof response === 'object') {
        Object.keys(response).forEach(key => {
            if (key !== 'agencies') {
                if (key === 'airports') {
                    sessionStorage.setItem("airportData", JSON.stringify(response[key])); 
                }
                try {
                    sessionStorage.setItem(key, JSON.stringify(response[key]));
                } catch (e) {
                    // Có thể log lỗi nếu cần
                }
            } else {
                sessionStorage.setItem("agencies", JSON.stringify(response[key]));
            }
        });
        sessionStorage.setItem("masterData", "true");
    }
};