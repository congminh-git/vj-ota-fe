function ListMealPack({ listMealPack, journey, passenger, selectedMeal, setSelectedMeal }) {
    function handleCheckboxChange(event, index) {
        if (selectedMeal) {
            const isChecked = event.target.checked;
            const element = {
                purchaseKey: event.target.value,
                journey: {
                    index: journey,
                },
                passenger: {
                    index: passenger,
                },
            };
            const selectCountElement = document.querySelector(
                `.select-count-meal-pack-${journey}-${passenger}-${index}`,
            );
            if (isChecked) {
                setSelectedMeal([...selectedMeal, element]);
                selectCountElement.style.display = 'flex';
                const countElement = selectCountElement.querySelector(`.count-input-${index}`);
                countElement.innerHTML = '1';
            } else {
                selectCountElement.style.display = 'none';
                const listStr = JSON.stringify(selectedMeal);
                const list = JSON.parse(listStr);
                let listIndexToRemove = [];
                selectedMeal.forEach((item, index) => {
                    if (JSON.stringify(item) == JSON.stringify(element)) {
                        listIndexToRemove.push(index);
                    }
                });
                const newList = list.filter((_, index) => !listIndexToRemove.includes(index));
                setSelectedMeal(newList);
            }
        }
    }

    const increase = (event, index, purchaseKey) => {
        const selectedMealStr = JSON.stringify(selectedMeal);
        const newSelectedMeal = JSON.parse(selectedMealStr);
        const i = newSelectedMeal.findIndex((element) => element.purchaseKey == purchaseKey);
        const newElementStr = JSON.stringify(newSelectedMeal[i]);
        const inputElement = event.target
            .closest(`.select-count-meal-pack-container-${index}`)
            .querySelector(`.count-input-${index}`);
        let count = parseInt(inputElement.innerHTML);
        if(count < 2) {
            inputElement.innerHTML = count + 1;
            newSelectedMeal.push(JSON.parse(newElementStr));
            setSelectedMeal(newSelectedMeal);
        }
    };

    const decrease = (event, index, purchaseKey) => {
        const container = event.target.closest(`.select-count-meal-pack-container-${index}`);
        const inputElement = container.querySelector(`.count-input-${index}`);
        let count = parseInt(inputElement.innerHTML);

        const listStr = JSON.stringify(selectedMeal);
        const list = JSON.parse(listStr);
        let indexToRemove = selectedMeal.findIndex((item) => item.purchaseKey == purchaseKey);
        list.splice(indexToRemove, 1);
        if (indexToRemove !== -1) {
            setSelectedMeal(list);
        }
        if (count > 0) {
            inputElement.innerHTML = count - 1;
        }
        if (parseInt(inputElement.innerHTML) === 0) {
            const checkbox = container.querySelector(`.checkbox-meal-${index}`);
            checkbox.checked = false;
            const selectCountElement = container.querySelector(
                `.select-count-meal-pack-${journey}-${passenger}-${index}`,
            );
            selectCountElement.style.display = 'none';
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
                    return (
                        <div className="border text-sm rounded" key={index}>
                            <div className="relative w-full h-60 bg-[url('/meal.jpg')] bg-cover">
                                <p className="w-fit text-end mt-1 bg-white text-orange-500 font-medium absolute top-1 left-2">
                                    {price.toLocaleString()}đ
                                </p>
                                <div
                                    className={`absolute top-1 right-2 flex justify-between items-center select-count-meal-pack-container-${index}`}
                                >
                                    <div
                                        className={`${
                                            selectedMeal.findIndex(
                                                (element) =>
                                                    element.passenger.index == passenger &&
                                                    element.journey.index == journey &&
                                                    element.purchaseKey == item.purchaseKey,
                                            ) == -1
                                                ? 'hidden'
                                                : 'flex'
                                        } bg-white p-1 rounded-full mr-2 hidden justify-between items-center select-count-meal-pack-${journey}-${passenger}-${index}`}
                                    >
                                        <button
                                            onClick={(event) => decrease(event, index, item.purchaseKey)}
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
                                        <div className={`w-4 text-center outline-none mx-2 count-input-${index}`}>
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
                                        checked={
                                            selectedMeal.findIndex(
                                                (element) =>
                                                    element.passenger.index == passenger &&
                                                    element.journey.index == journey &&
                                                    element.purchaseKey == item.purchaseKey,
                                            ) == -1
                                                ? false
                                                : true
                                        }
                                        className={`w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 checkbox-meal-${index}`}
                                    ></input>
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