function ListMealPack({
    listMealPack,
    journey,
    passenger,
    selectedMealPack,
    setSelectedMealPack,
    body,
    journeyIndex,
    passengerIndex,
}) {
    function handleCheckboxChange(event, index) {
        if (selectedMealPack) {
            const isChecked = event.target.checked;
            const element = {
                purchaseKey: event.target.value,
                journey: {
                    key: journey,
                },
                passenger: {
                    key: passenger,
                },
            };
            const selectCountElement = document.querySelector(
                `.select-count-meal-pack-${journeyIndex}-${passengerIndex}-${index}`,
            );
            if (isChecked) {
                setSelectedMealPack([...selectedMealPack, element]);
                selectCountElement.style.display = 'flex';
                const countElement = selectCountElement.querySelector(`.count-input-${index}`);
                countElement.innerHTML = '1';
            } else {
                selectCountElement.style.display = 'none';
                const listStr = JSON.stringify(selectedMealPack);
                const list = JSON.parse(listStr);
                let listIndexToRemove = [];
                selectedMealPack.forEach((item, index) => {
                    if (JSON.stringify(item) == JSON.stringify(element)) {
                        listIndexToRemove.push(index);
                    }
                });
                const newList = list.filter((_, index) => !listIndexToRemove.includes(index));
                setSelectedMealPack(newList);
            }
        }
    }

    const increase = (event, index, purchaseKey) => {
        const inputElement = event.target
            .closest(`.select-count-meal-pack-container-${index}`)
            .querySelector(`.count-input-${index}`);
        let count = parseInt(inputElement.innerHTML);
        if(count < 2) {
            inputElement.innerHTML = count + 1;
            const selectedMealStr = JSON.stringify(selectedMealPack);
            const newSelectedMeal = JSON.parse(selectedMealStr);
            const element = {
                purchaseKey: purchaseKey,
                journey: {
                    key: journey,
                },
                passenger: {
                    key: passenger,
                },
            };
            newSelectedMeal.push(element);
            setSelectedMealPack(newSelectedMeal);
        }
    };

    const decrease = (event, index, purchaseKey, min) => {
        const container = event.target.closest(`.select-count-meal-pack-container-${index}`);
        const inputElement = container.querySelector(`.count-input-${index}`);
        let count = parseInt(inputElement.innerHTML);
        if (count > min) {
            if (count > 0) {
                inputElement.innerHTML = count - 1;
            }
            const selectedMealStr = JSON.stringify(selectedMealPack);
            const newSelectedMeal = JSON.parse(selectedMealStr);
            const element = {
                purchaseKey: purchaseKey,
                journey: {
                    key: journey,
                },
                passenger: {
                    key: passenger,
                },
            };
            let indexToRemove = newSelectedMeal.findIndex((item) => JSON.stringify(item) == JSON.stringify(element));
            newSelectedMeal.splice(indexToRemove, 1);
            if (indexToRemove !== -1) {
                setSelectedMealPack(newSelectedMeal);
            }
            if (parseInt(inputElement.innerHTML) === 0) {
                const checkbox = container.querySelector(`.checkbox-meal-${index}`);
                checkbox.checked = false;
                const selectCountElement = container.querySelector(
                    `.select-count-meal-pack-${journeyIndex}-${passengerIndex}-${index}`,
                );
                selectCountElement.style.display = 'none';
            }
        }
    };

    return (
        <div className="mt-2 grid grid-cols-2 gap-4">
            {listMealPack?.length > 0 ? (
                listMealPack?.map((item, index) => {
                    let price = 0;
                    item.ancillaryCharges[0].currencyAmounts.forEach((element) => {
                        price += element.totalAmount;
                    });
                    let count = 0;
                    body.ancillaryPurchases.forEach((itemDaMua) => {
                        if (
                            itemDaMua.ancillaryItem.key == item.ancillaryItem.key &&
                            itemDaMua.passenger.key == passenger &&
                            itemDaMua.journey.key == journey
                        ) {
                            count += 1;
                        }
                    });
                    return (
                        <div className={`border text-sm rounded relative`} key={index}>
                            <div className="relative w-full h-60 bg-[url('/globalImages/meal.jpg')] bg-cover">
                                <p className="w-fit text-end mt-1 bg-white text-orange-500 font-medium absolute top-1 left-2">
                                    {price.toLocaleString()}đ
                                </p>
                                <div
                                    className={`absolute top-1 right-2 flex justify-between items-center select-count-meal-pack-container-${index}`}
                                >
                                    {count > 0 ? (
                                        <>
                                            <div
                                                className={`bg-white p-1 rounded-full mr-2 flex justify-between items-center select-count-meal-pack-${journeyIndex}-${passengerIndex}-${index}`}
                                            >
                                                <button
                                                    onClick={(event) => decrease(event, index, item.purchaseKey, count)}
                                                    className="inline-flex items-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                </button>
                                                <div
                                                    className={`w-4 text-center outline-none mx-2 count-input-${index}`}
                                                >
                                                    {count}
                                                </div>
                                                <button
                                                    onClick={(event) => increase(event, index, item.purchaseKey)}
                                                    className="inline-flex items-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <input
                                                onChange={(event) => handleCheckboxChange(event, index)}
                                                id={`suat-an-${journey}-${passenger}-${index}`}
                                                type="checkbox"
                                                value={item.purchaseKey}
                                                name={`suat-an-${journey}-${passenger}`}
                                                checked={true}
                                                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            ></input>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={`bg-white p-1 rounded-full mr-2 hidden justify-between items-center select-count-meal-pack-${journeyIndex}-${passengerIndex}-${index}`}
                                            >
                                                <button
                                                    onClick={(event) => decrease(event, index, item.purchaseKey, 0)}
                                                    className="inline-flex items-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                </button>
                                                <div
                                                    className={`w-4 text-center outline-none mx-2 count-input-${index}`}
                                                >
                                                    1
                                                </div>
                                                <button
                                                    onClick={(event) => increase(event, index, item.purchaseKey)}
                                                    className="inline-flex items-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <input
                                                onChange={(event) => handleCheckboxChange(event, index)}
                                                id={`suat-an-${journey}-${passenger}-${index}`}
                                                type="checkbox"
                                                value={item.purchaseKey}
                                                name={`suat-an-${journey}-${passenger}`}
                                                className={`w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 checkbox-meal-${index}`}
                                            ></input>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="p-2">
                                <label htmlFor={`suat-an-${journey}-${passenger}-${index}`} className="w-full">
                                    {item.ancillaryItem.description}
                                </label>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="mt-4 col-span-2">
                    <i>Chuyến bay này không được chọn suất ăn</i>
                </div>
            )}
        </div>
    );
}

export default ListMealPack;