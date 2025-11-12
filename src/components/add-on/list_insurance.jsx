'use client';

function ListInsurance({ openListInsurance, listInsurance, listSeleactedInsurance, setListSelectedInsurance }) {
    const handleCheck = (event) => {
        if (listSeleactedInsurance) {
            const isChecked = event.target.checked;
            const element = { purchaseKey: event.target.value };
            if (isChecked) {
                setListSelectedInsurance([...listSeleactedInsurance, element]);
            } else {
                const listStr = JSON.stringify(listSeleactedInsurance);
                const list = JSON.parse(listStr);
                let indexToRemove = listSeleactedInsurance.findIndex(
                    (item) => JSON.stringify(item) == JSON.stringify(element),
                );
                list.splice(indexToRemove, 1);
                if (indexToRemove !== -1) {
                    setListSelectedInsurance(list);
                }
            }
        }
    };
    return (
        <div className={`${openListInsurance ? 'block' : 'hidden'} mt-6 px-4 pb-2`}>
            {listInsurance?.map((element, index) => {
                return (
                    <div key={index + 1} className="flex justify-between">
                        <div className="flex items-center">
                            <input
                                onChange={handleCheck}
                                id={`element-${index + 1}`}
                                type="checkbox"
                                value={element.purchaseKey}
                                className="w-6 h-6 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            ></input>
                            <label htmlFor={`element-${index + 1}`}>{element.insuranceProvider.name}</label>
                        </div>
                        <div className="text-orange-500">{element.chargeAmount.totalAmount.toLocaleString()}đ</div>
                    </div>
                );
            })}
        </div>
    );
}

export default ListInsurance;