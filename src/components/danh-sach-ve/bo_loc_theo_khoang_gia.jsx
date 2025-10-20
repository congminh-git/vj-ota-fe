'use client';

import { useState } from 'react';

const FilterByPrice = () => {
    const [value, setValue] = useState(10000000);

    const handleChange = (event) => {
        setValue(parseInt(event.target.value));
    };

    return (
        <div className="w-full border-b pb-4">
            <label htmlFor="" className="text-gray-400 text-sm font-medium">
                <i>Khoảng giá</i>
            </label>
            <input
                type="range"
                min="0"
                max="10000000"
                step="500000"
                value={value}
                onChange={handleChange}
                className="slider appearance-none bg-gray-200 h-1 rounded-lg w-full outline-none focus:outline-none"
            />
            <div className="text-gray-900 text-start text-sm font-medium mt-2">
                <span className="">
                    <i>
                        {value.toLocaleString()}
                        <u>đ</u>{' '}
                    </i>
                </span>
            </div>
        </div>
    );
};

export default FilterByPrice;