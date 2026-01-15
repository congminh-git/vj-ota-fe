'use client';

import './scrollbar.css';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';

function ListAirport({
    setAirport,
    open, // false | 'đi' | 'về'
    searchAirport,
    setSearchAirport,
    airpostDropDownRef,
    setOpenDropDown,
}) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    // ✅ nhớ vị trí cuối cùng
    const lastPositionRef = useRef('left-0');

    // khi open thay đổi sang 'đi' hoặc 'về' → update position
    if (open === 'đi') lastPositionRef.current = 'left-0';
    if (open === 'về') lastPositionRef.current = 'right-0';

    function removeVietnameseDiacritics(str) {
        return str
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/Đ/g, 'D')
            .replace(/đ/g, 'd');
    }

    const filteredData = useMemo(() => {
        if (!data || !searchAirport) return data;

        const searchValue = removeVietnameseDiacritics(searchAirport.toLowerCase());

        return data
            .map((item) => {
                const itemCode = removeVietnameseDiacritics(item.code.toLowerCase());
                const itemName = removeVietnameseDiacritics(item.name.toLowerCase());

                const codeMatch = itemCode.includes(searchValue);
                const nameMatch = itemName.includes(searchValue);

                if (!codeMatch && !nameMatch) return null;

                return {
                    ...item,
                    _priority: codeMatch ? 1 : 2,
                };
            })
            .filter(Boolean)
            .sort((a, b) => a._priority - b._priority);
    }, [data, searchAirport]);

    const handleAirportSelect = useCallback(
        (airport) => {
            setAirport(`${airport.code} (${airport.name})`);
            setOpenDropDown(false);
            setSearchAirport('');
        },
        [setAirport, setOpenDropDown, setSearchAirport],
    );

    const handleSearchChange = useCallback(
        (e) => {
            setSearchAirport(e.target.value);
        },
        [setSearchAirport],
    );

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
                } catch {}
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

        pollAirports();

        return () => {
            clearInterval(polling);
            clearTimeout(timer);
        };
    }, []);

    if (timedOut && !data) {
        return <div className="p-4 text-red-500">Không lấy được dữ liệu sân bay!</div>;
    }

    const isOpen = Boolean(open);

    return (
        <div
            ref={airpostDropDownRef}
            className={`absolute min-w-full border rounded shadow-lg z-20 bg-white
                overflow-hidden transition-[max-height,opacity] duration-300 ease-out
                ${lastPositionRef.current}
                ${
                    isOpen
                        ? 'max-h-[520px] opacity-100 pointer-events-auto'
                        : 'max-h-0 opacity-0 pointer-events-none'
                }
            `}
        >
            <div className="p-2 border-b">
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
