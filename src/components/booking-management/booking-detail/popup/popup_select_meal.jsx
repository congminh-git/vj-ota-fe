'use client';

import SelectMealForm from '../form_select_meal';

function SelectMealPopup({
    openPopupSelectMealPack,
    setOpenPopupSelectMealPack,
    body,
    setRefetch,
    refetch,
    companyKey,
    listAllJourneyMealOptions,
    currency,
    exchangeRate
}) {
    return (
        <div
            className={`${
                openPopupSelectMealPack ? 'fixed' : 'hidden'
            } top-0 left-0 bottom-0 right-0 bg-gray-800 bg-opacity-50 flex justify-end z-20`}
        >
            <div className="h-full w-[600px] bg-white p-4 overflow-auto">
                <div className="flex justify-between">
                    <button
                        onClick={() => setOpenPopupSelectMealPack(false)}
                        className="border p-2 rounded hover:bg-blue-200 w-fit h-fit"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="text-center">
                        <p className="text-md font-bold text-gray-800">Thông tin suất ăn</p>
                        {/* <p className="text-sm font-medium text-gray-400">
                        <i>Chọn gói hành lý phù hợp với bạn</i>
                    </p> */}
                    </div>
                </div>
                <SelectMealForm
                    body={body}
                    setRefetch={setRefetch}
                    refetch={refetch}
                    companyKey={companyKey}
                    listAllJourneyMealOptions={listAllJourneyMealOptions}
                    currency={currency}
                    exchangeRate={exchangeRate}
                />
            </div>
        </div>
    );
}

export default SelectMealPopup;