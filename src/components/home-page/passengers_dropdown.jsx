'use client';

import { useEffect, useCallback } from 'react';
import Icon from '../icon';
import { faPerson, faChild, faBaby, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

function PassengersDropDown({
    adult,
    child,
    infant,
    setAdult,
    setChild,
    setInfant,
    openDropDownPassengers,
    setOpenDropdownPassengers,
    href,
}) {
    useEffect(() => {
        const dropdownElement = document.querySelector('.dropdown-hanh-khach');
        if (dropdownElement) {
            dropdownElement.style.display = openDropDownPassengers ? 'block' : 'none';
        }
    }, [openDropDownPassengers]);

    // Memoize passenger change handlers
    const handleAdultDecrease = useCallback(() => {
        if (adult > 1 && adult > infant) {
            setAdult(adult - 1);
        }
    }, [adult, infant, setAdult]);

    const handleAdultIncrease = useCallback(() => {
        if (adult + infant < 9) {
            setAdult(adult + 1);
        }
    }, [adult, infant, setAdult]);

    const handleChildDecrease = useCallback(() => {
        if (child > 0) {
            setChild(child - 1);
        }
    }, [child, setChild]);

    const handleChildIncrease = useCallback(() => {
        if (adult + child < 9) {
            setChild(child + 1);
        }
    }, [adult, child, setChild]);

    const handleInfantDecrease = useCallback(() => {
        if (infant > 0) {
            setInfant(infant - 1);
        }
    }, [infant, setInfant]);

    const handleInfantIncrease = useCallback(() => {
        if (infant < adult) {
            setInfant(infant + 1);
        }
    }, [infant, adult, setInfant]);

    return (
        <div
            className={`hidden absolute top-full left-auto right-0 w-full sm:w-[300px] border rounded shadow-lg z-10 bg-white p-4 dropdown-hanh-khach`}
        >
            <h4 className="">Chọn số lượng đối tượng phù hợp</h4>
            <div className="mt-6 w-full text-gray-600">
                <div className="w-full flex justify-between items-center">
                    <div className="flex justify-start items-center pr-16">
                        <div className="bg-gray-200 flex justify-center items-center w-10 h-10 rounded-full mr-2">
                            <Icon icon={faPerson} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Người lớn</p>
                            <p className="text-sm">12 tuổi trở lên</p>
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        <button
                            onClick={handleAdultDecrease}
                            className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center hover:bg-gray-100"
                        >
                            <Icon icon={faMinus} style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <input type="text" value={adult} readOnly className="w-10 outline-none border-b text-center" />
                        <button
                            onClick={handleAdultIncrease}
                            className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center hover:bg-gray-100"
                        >
                            <Icon icon={faPlus} style={{ width: '1rem', height: '1rem' }} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-6 w-full text-gray-600">
                <div className="w-full flex justify-between items-center">
                    <div className="flex justify-start items-center pr-16">
                        <div className="bg-gray-200 flex justify-center items-center w-10 h-10 rounded-full mr-2">
                            <Icon icon={faChild} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Trẻ em</p>
                            <p className="text-sm">2-11 tuổi</p>
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        <button
                            onClick={handleChildDecrease}
                            className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center hover:bg-gray-100"
                        >
                            <Icon icon={faMinus} style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <input type="text" value={child} readOnly className="w-10 outline-none border-b text-center" />
                        <button
                            onClick={handleChildIncrease}
                            className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center hover:bg-gray-100"
                        >
                            <Icon icon={faPlus} style={{ width: '1rem', height: '1rem' }} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-6 w-full text-gray-600">
                <div className="w-full flex justify-between items-center">
                    <div className="flex justify-start items-center pr-16">
                        <div className="bg-gray-200 flex justify-center items-center w-10 h-10 rounded-full mr-2">
                            <Icon icon={faBaby} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Em bé</p>
                            <p className="text-sm">Dưới 1 tuổi</p>
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        <button
                            onClick={handleInfantDecrease}
                            className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center hover:bg-gray-100"
                        >
                            <Icon icon={faMinus} style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <input type="text" value={infant} readOnly className="w-10 outline-none border-b text-center" />
                        <button
                            onClick={handleInfantIncrease}
                            className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center hover:bg-gray-100"
                        >
                            <Icon icon={faPlus} style={{ width: '1rem', height: '1rem' }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PassengersDropDown;