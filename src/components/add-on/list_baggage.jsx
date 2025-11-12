function ListBaggagePack({ listBaggagePack, journey, passenger, selectedBaggage, setSelectedBaggage }) {
    const add = (event) => {
        if (event.target.value != 'null') {
            if (selectedBaggage.length == 0) {
                setSelectedBaggage([
                    ...selectedBaggage,
                    {
                        purchaseKey: event.target.value,
                        journey: {
                            index: journey,
                        },
                        passenger: {
                            index: passenger,
                        },
                    },
                ]);
            } else {
                selectedBaggage?.forEach((element, i) => {
                    if (parseInt(element.passenger.index) == passenger && parseInt(element.journey.index) == journey) {
                        let newDataStr = JSON.stringify(selectedBaggage);
                        let newData = JSON.parse(newDataStr);
                        newData[i] = {
                            purchaseKey: event.target.value,
                            journey: {
                                index: journey,
                            },
                            passenger: {
                                index: passenger,
                            },
                        };
                        setSelectedBaggage(newData);
                    } else {
                        setSelectedBaggage([
                            ...selectedBaggage,
                            {
                                purchaseKey: event.target.value,
                                journey: {
                                    index: journey,
                                },
                                passenger: {
                                    index: passenger,
                                },
                            },
                        ]);
                    }
                });
            }
        } else {
            const removeIndex = selectedBaggage.findIndex(
                (baggage) => baggage.passenger.index == passenger && baggage.journey.index == journey,
            );
            if (removeIndex != -1) {
                const selectedBaggageStr = JSON.stringify(selectedBaggage);
                let newList = JSON.parse(selectedBaggageStr);
                newList.splice(removeIndex, 1);
                setSelectedBaggage(newList);
            }
        }
    };
    return (
        <select onChange={add} className="border py-1 px-2 rounded text-sm w-full" name="" id="">
            <option
                selected={
                    selectedBaggage.findIndex(
                        (item) => item.passenger.index == passenger && item.journey.index == journey,
                    ) == -1
                        ? true
                        : false
                }
                value="null"
            >
                --Không--
            </option>
            {listBaggagePack?.map((item, index) => {
                let gia = 0;
                item.ancillaryCharges[0].currencyAmounts.forEach((element) => {
                    gia += element.totalAmount;
                });
                return (
                    <option
                        selected={
                            selectedBaggage.findIndex(
                                (item) => item.passenger.index == passenger && item.journey.index == journey,
                            ) != -1
                                ? true
                                : false
                        }
                        key={index}
                        value={item.purchaseKey}
                    >
                        {item.ancillaryItem.description} -- {gia.toLocaleString()}đ
                    </option>
                );
            })}
        </select>
    );
}

export default ListBaggagePack;