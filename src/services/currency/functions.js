export const getCurrency = async () => {
    const countries = sessionStorage.getItem('currencies');
    if (countries) {
        try {
            return JSON.parse(countries);
        } catch (e) {
            return null;
        }
    }
    return null;
};