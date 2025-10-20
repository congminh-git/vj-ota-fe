function ListBaggagePack({ listBaggagePack, journey, passenger, selectedBaggagePack, setSelectedBaggagePack, value }) {
    const add = (event) => {
        if (event.target.value != 'null') {
            if (selectedBaggagePack.length == 0) {
                setSelectedBaggagePack([
                    ...selectedBaggagePack,
                    {
                        purchaseKey: event.target.value,
                        journey: {
                            key: journey,
                        },
                        passenger: {
                            key: passenger,
                        },
                    },
                ]);
            } else {
                selectedBaggagePack?.forEach((element, i) => {
                    if (element.passenger.key == passenger && element.journey.key == journey) {
                        let newDataStr = JSON.stringify(selectedBaggagePack);
                        let newData = JSON.parse(newDataStr);
                        newData[i] = {
                            purchaseKey: event.target.value,
                            journey: {
                                key: journey,
                            },
                            passenger: {
                                key: passenger,
                            },
                        };
                        setSelectedBaggagePack(newData);
                    } else {
                        setSelectedBaggagePack([
                            ...selectedBaggagePack,
                            {
                                purchaseKey: event.target.value,
                                journey: {
                                    key: journey,
                                },
                                passenger: {
                                    key: passenger,
                                },
                            },
                        ]);
                    }
                });
            }
        } else {
            const removeIndex = selectedBaggagePack.findIndex(
                (hanhLy) => hanhLy.passenger.key == passenger && hanhLy.journey.key == journey,
            );
            if (removeIndex != -1) {
                const selectedBaggagePackStr = JSON.stringify(selectedBaggagePack);
                let newList = JSON.parse(selectedBaggagePackStr);
                newList.splice(removeIndex, 1);
                setSelectedBaggagePack(newList);
            }
        }
    };
    return (
        <select
            disabled={value}
            onChange={add}
            className={`border py-1 px-2 rounded text-sm w-full ${value ? 'bg-gray-100' : ''}`}
            name=""
            id=""
        >
            <option value="null">--Không--</option>
            {listBaggagePack?.map((item, index) => {
                let price = 0;
                item.ancillaryCharges[0].currencyAmounts.forEach((element) => {
                    price += element.totalAmount;
                });
                return (
                    <option selected={item.ancillaryItem.key == value} key={index} value={item.purchaseKey}>
                        {item.ancillaryItem.description} -- {price.toLocaleString()}đ
                    </option>
                );
            })}
        </select>
    );
}

export default ListBaggagePack;