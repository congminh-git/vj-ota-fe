import { getRequest } from "../apiService";

export const getAncillaryOptions = async (bookingKey) => {
    const url = `/ancillaryOptions?bookingKey=${bookingKey}`;
    const response = await getRequest(url);
    if (response) {
        let listBaggage = [];
        let listMeal = [];
        response.forEach((element) => {
            if (element.ancillaryItem.ancillaryCategory.name == 'Baggage') {
                listBaggage.push(element);
            } else if (element.ancillaryItem.ancillaryCategory.name == 'Meal') {
                listMeal.push(element);
            }
        });
        return [listBaggage, listMeal]
    }

    return []
};

export const getAncillaryOptionsReturn = async (bookingKey) => {
    const url = `/ancillaryOptions?bookingKey=${bookingKey}`;
    const response = await getRequest(url);
    if (response) {
        let listBaggage = [];
        let listMeal = [];
        response.forEach((element) => {
            if (element.ancillaryItem.ancillaryCategory.name == 'Baggage') {
                listBaggage.push(element);
            } else if (element.ancillaryItem.ancillaryCategory.name == 'Meal') {
                listMeal.push(element);
            }
        });
        return [listBaggage, listMeal]
    }

    return []
};