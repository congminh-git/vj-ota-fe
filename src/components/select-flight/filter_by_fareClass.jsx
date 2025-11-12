'use client';

import { useState } from 'react';

const FilterBySeatClass = () => {
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
                <i>Theo hạng vé</i>
            </label>
            <div className="mt-4">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="pho-thong"
                        checked={selectedOption === 'pho-thong'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">Phổ thông</label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="pho-thong-dac-biet"
                        checked={selectedOption === 'pho-thong-dac-biet'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">Phổ thông đặc biệt</label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="thuong-gia"
                        checked={selectedOption === 'thuong-gia'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">Thương gia</label>
                </div>
            </div>
        </div>
    );
};

export default FilterBySeatClass;