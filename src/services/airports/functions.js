export const getAirports = async () => {
    const airportsData = sessionStorage.getItem('airports');
    if (airportsData) {
        try {
            return JSON.parse(airportsData);
        } catch (e) {
            return null;
        }
    }
    return null;
};