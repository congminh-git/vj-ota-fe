'use client';

import { useState } from 'react';

const FilterDepartmentTime = () => {
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
                <i>Điểm dừng</i>
            </label>
            <div className="mt-4">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="sang-som"
                        checked={selectedOption === 'sang-som'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">
                        Sáng sớm <span className="text-gray-400">(00:00 - 06:00)</span>
                    </label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="buoi-sang"
                        checked={selectedOption === 'buoi-sang'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">
                        Buổi sáng <span className="text-gray-400">(06:00 - 12:00)</span>
                    </label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="buoi-chieu"
                        checked={selectedOption === 'buoi-chieu'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">
                        Buổi chiều <span className="text-gray-400">(12:00 - 18:00)</span>
                    </label>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="buoi-toi"
                        checked={selectedOption === 'buoi-toi'}
                        onChange={handleCheckboxChange}
                        className="mr-2 leading-tight w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 ml-2">
                        Buổi tối <span className="text-gray-400">(18:00 - 20:00)</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default FilterDepartmentTime;