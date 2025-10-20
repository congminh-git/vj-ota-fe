'use client';

import { useState } from 'react';

const FilterByStopPoint = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        if (checked) {
            setSelectedOption(name);
        } else {
            setSelectedOption(null);
        }
    };
    return (
        <div className="w-full border-b py-4 font-medium">
            <label htmlFor="" className="text-gray-400 text-sm font-medium">
                <i>Thời gian</i>
            </label>
            <div className="mt-4">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="bay-thang"
                        checked={selectedOption === 'bay-thang'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">Bay thẳng</label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="noi-chuyen"
                        checked={selectedOption === 'noi-chuyen'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">Nối chuyến</label>
                </div>
            </div>
        </div>
    );
};

export default FilterByStopPoint;