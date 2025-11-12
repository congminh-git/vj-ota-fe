'use client';

import './scrollbar.css';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getAirports } from '@/services/airports/functions';

function ListAirport({ setAirport, open, searchAirport, setSearchAirport, airpostDropDownRef, setOpenDropDown }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    function removeVietnameseDiacritics(str) {
        return str
            ?.normalize('NFD')
            .replace(/[  - 6f]/g, '')
            .replace(/Đ/g, 'D')
            .replace(/đ/g, 'd');
    }

    // Memoize filtered data to avoid recalculating on every render
    const filteredData = useMemo(() => {
        if (!data || !searchAirport) return data;
        
        const searchValue = removeVietnameseDiacritics(searchAirport.toLowerCase());
        
        return data.filter(item => {
            const itemCode = removeVietnameseDiacritics(item.code.toLowerCase());
            const itemName = removeVietnameseDiacritics(item.name.toLowerCase());
            
            return itemCode.includes(searchValue) || itemName.includes(searchValue);
        });
    }, [data, searchAirport]);

    // Memoize airport selection handler
    const handleAirportSelect = useCallback((airport) => {
        setAirport(`${airport.code} (${airport.name})`);
        setOpenDropDown(false);
        setSearchAirport('');
    }, [setAirport, setOpenDropDown, setSearchAirport]);

    // Memoize search input change handler
    const handleSearchChange = useCallback((event) => {
        setSearchAirport(event.target.value);
    }, [setSearchAirport]);

    useEffect(() => {
        let polling;
        let timer;
        let stopped = false;
        setIsLoading(true);
        const pollAirports = () => {
            const cachedData = sessionStorage.getItem('airports');
            if (cachedData) {
                try {
                    setData(JSON.parse(cachedData));
                } catch (error) {
                    console.warn('Failed to parse cached airports data:', error);
                }
                stopped = true;
                setIsLoading(false);
                clearInterval(polling);
                clearTimeout(timer);
            }
        };
        polling = setInterval(() => {
            if (!stopped) pollAirports();
        }, 500);
        timer = setTimeout(() => {
            setTimedOut(true);
            stopped = true;
            setIsLoading(false);
            clearInterval(polling);
        }, 30000);
        // Kiểm tra ngay lần đầu
        pollAirports();
        return () => {
            clearInterval(polling);
            clearTimeout(timer);
        };
    }, []);

    // Don't render if not open
    if (!open) return null;
    if (timedOut && !data) {
        return <div className="p-4 text-red-500">Không lấy được dữ liệu sân bay!</div>;
    }
    return (
        <div
            ref={airpostDropDownRef}
            className={`absolute w-[200%] ${
                open ? `${open == 'đi' ? 'left-0' : 'right-0'} block` : 'hidden'
            } border rounded shadow-lg z-20 bg-white`}
        >
            <div className="p-2">
                <input
                    type="text"
                    value={searchAirport}
                    onChange={handleSearchChange}
                    className="outline-none border py-2 px-4 w-full rounded"
                    placeholder="Tìm kiếm sân bay..."
                />
            </div>
            <div className="pr-2 pb-2">
                <ul className="max-h-[400px] overflow-y-auto" id="scrollbar">
                    {isLoading ? (
                        <li className="p-2 pl-4 text-gray-500">Đang tải...</li>
                    ) : filteredData && filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <li
                                key={`${item.code}-${index}`}
                                onClick={() => handleAirportSelect(item)}
                                className="p-2 pl-4 border-b border-gray-50 hover:bg-gray-200 cursor-pointer"
                            >
                                {`${item.code} (${item.name})`}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 pl-4 text-gray-500">
                            {searchAirport ? 'Không tìm thấy sân bay' : 'Đang tải dữ liệu...'}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default ListAirport;