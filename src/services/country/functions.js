export const getCountries = async () => {
    const countries = sessionStorage.getItem('countries');
    if (countries) {
        try {
            return JSON.parse(countries);
        } catch (e) {
            return null;
        }
    }
    return null;
};