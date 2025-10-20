import { getRequest } from "../apiService";

export const getCompany = async () => {
    const agencies = sessionStorage.getItem('agencies');
    if (agencies) {
        try {
            var company = JSON.parse(agencies)[0].agencyAccount.company
            console.log(company);
            return company;
        } catch (e) {
            return null;
        }
    }
    return null;
};