import { getRequest } from "../apiService";

export const getLowFareOptions = async (
    apiUrl,
    cityPair,
    ngayBay,
    currency,
    adult,
    child,
    infant,
    promoCode,
    company,
    ) => {
    const url = `${apiUrl}/lowFareOptions?cityPair=${cityPair}&departure=${ngayBay}&currency=${currency}&cabinClass=Y&adultCount=${adult}&childCount=${child}&infantCount=${infant}&daysBeforeDeparture=${
        daysBeforeAndAfter(ngayBay)[0]
    }&daysAfterDeparture=${daysBeforeAndAfter(ngayBay)[1]}&promoCode=${promoCode}&company=${company}`;
    return getRequest(url);
};

function daysBeforeAndAfter(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysBefore = day - 1;
    const daysAfter = daysInMonth - day;
    return [daysBefore, daysAfter];
}
