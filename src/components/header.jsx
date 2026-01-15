'use client';
import { getCurrency } from '@/services/currency/functions';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from 'hooks/useAuth';
import { SignalBars } from './icons/signalBars';

function Header() {
    useAuth();
    const currencyParam = typeof window !== 'undefined' ? sessionStorage.getItem('currencySearchParam') : 'VND';
    const [currencies, setCurrencies] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [currenciesTimedOut, setCurrenciesTimedOut] = useState(false);
    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        let polling;
        let timer;
        let stopped = false;
        const pollCurrencies = () => {
            const cachedData = sessionStorage.getItem('currencies');
            if (cachedData) {
                try {
                    setCurrencies(JSON.parse(cachedData));
                } catch (error) {
                    console.warn('Failed to parse cached currencies data:', error);
                }
                stopped = true;
                clearInterval(polling);
                clearTimeout(timer);
            }
        };
        polling = setInterval(() => {
            if (!stopped) pollCurrencies();
        }, 500);
        timer = setTimeout(() => {
            setCurrenciesTimedOut(true);
            stopped = true;
            clearInterval(polling);
        }, 30000);
        // Kiểm tra ngay lần đầu
        pollCurrencies();
        return () => {
            clearInterval(polling);
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (!pathName.includes('booking-management')) {
            sessionStorage.removeItem('managementLocator');
        }
    }, [pathName]);

    useEffect(() => {
        if (currencyParam) {
            setSelectedCurrency(currencyParam);
            sessionStorage.setItem('currencySearchParam', currencyParam);
            console.log(currencyParam)
            if (currencies) {
                const idx = currencies.findIndex((item) => item.code === currencyParam);
                if (idx > -1) {
                    const exchangeRate = currencies[idx].currentExchangeRate;
                    sessionStorage.setItem('exchangeRate', exchangeRate);
                }
            }
        } else {
            setSelectedCurrency('VND');
            sessionStorage.setItem('currencySearchParam', 'VND');
            sessionStorage.setItem('exchangeRate', 1);
        }
    }, [currencies, currencyParam]);

    const handleChange = (event) => {
        // Fix tạm gán VND khi chọn currency khác VND và USD
        let currency = event.target.value ?? event
        // if(!['VND','USD'].includes(currency)) {
        //     currency = 'VND'
        // }
        setSelectedCurrency(currency);
        sessionStorage.setItem('currencySearchParam', currency);
        const idx = currencies.findIndex((item) => item.code === currency);
        if (idx > -1) {
            const exchangeRate = currencies[idx].currentExchangeRate;
            sessionStorage.setItem('exchangeRate', exchangeRate);
        }
        location.reload();
    };

    if (currenciesTimedOut && !currencies) {
        return <div className="p-4 text-red-500">Không lấy được dữ liệu tiền tệ!</div>;
    }

    return (
        <div
            className="w-full bg-white border-b justify-between items-center box-border p-4 font-medium text-gray-600 hidden sm:flex z-[1000]"
            style={{ height: '72px' }}
        >
            <h1 className="hidden sm:block">Booking demo - Đặt vé</h1>
            <div className="flex items-center">
                <div className="px-4 cursor-pointer">
                    <div className="flex items-center p-2 hover:bg-gray-200 rounded-full text-sm">
                        <select value={selectedCurrency} onChange={handleChange}>
                            {currencies ? (
                                currencies.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.code}
                                    </option>
                                ))
                            ) : (
                                <option key="VND" value="VND">
                                    VND
                                </option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="px-4 cursor-pointer border-l">
                    <div className="flex items-center p-2 hover:bg-gray-200 rounded-full text-sm">
                        <div className="w-4 h-4 bg-[url('/globalImages/vietnamicon.png')] bg-cover rounded-full"></div>
                        <SignalBars className={"w-5 h-5 ml-1"} strokeWidth={"1.5"} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;