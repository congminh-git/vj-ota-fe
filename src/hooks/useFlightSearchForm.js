import { useState, useCallback, useMemo } from 'react';
import { useSessionStorage } from './useSessionStorage';

export function useFlightSearchForm(typeSearchForm) {
    // Form state
    const [departmentDate, setDepartmentDate] = useState(new Date().toISOString().split('T')[0]);
    const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
    const [departureAirport, setDepartureAirport] = useState('SGN (Ho Chi Minh)');
    const [arrivalAirport, setArrivalAirport] = useState('HAN (Ha Noi)');
    const [departureCity, setDepartureCity] = useState('(Ho_Chi_Minh)');
    const [arrivalCity, setArrivalCity] = useState('(Ha_Noi)');
    const [adult, setAdult] = useState(1);
    const [child, setChild] = useState(0);
    const [infant, setInfant] = useState(0);
    const [roundTrip, setRoundTrip] = useState(false);
    const [cheapFlight, setCheapFlight] = useState(false);
    const [promoCode, setPromoCode] = useState('');

    // Session storage for currency
    const [currency] = useSessionStorage('currencySearchParam', 'VND');

    // Computed values
    const totalPassengers = useMemo(() => adult + child + infant, [adult, child, infant]);

    // Validation messages
    const validationMessages = useMemo(() => {
        const messages = {};
        
        if (departureAirport === arrivalAirport) {
            messages.airport = 'Điểm đi và điểm đến phải khác nhau';
        }
        
        if (roundTrip) {
            const departmentDateCompare = new Date(departmentDate);
            const returnDateCompare = new Date(returnDate);
            if (departmentDateCompare > returnDateCompare) {
                messages.returnDate = 'Ngày về phải lớn hơn hoặc bằng ngày đi';
            }
        }
        
        return messages;
    }, [departureAirport, arrivalAirport, roundTrip, departmentDate, returnDate]);

    // Memoized handlers
    const handleDepartureAirportChange = useCallback((airport) => {
        setDepartureAirport(airport);
        // Update departure city
        const city = airport
            .substring(airport.indexOf('(') + 1, airport.indexOf(')'))
            .replaceAll(' ', '_');
        setDepartureCity(city);
    }, []);

    const handleArrivalAirportChange = useCallback((airport) => {
        setArrivalAirport(airport);
        // Update arrival city
        const city = airport
            .substring(airport.indexOf('(') + 1, airport.indexOf(')'))
            .replaceAll(' ', '_');
        setArrivalCity(city);
    }, []);

    const handleAdultChange = useCallback((value) => {
        setAdult(value);
    }, []);

    const handleChildChange = useCallback((value) => {
        setChild(value);
    }, []);

    const handleInfantChange = useCallback((value) => {
        setInfant(value);
    }, []);

    const handleRoundTripChange = useCallback((prev) => {
        setRoundTrip(prev => !prev);
    }, []);

    const handleCheapFlightChange = useCallback(() => {
        setCheapFlight(prev => !prev);
    }, []);

    const handlePromoCodeChange = useCallback((e) => {
        setPromoCode(e.target.value);
    }, []);

    // Function to save search parameters to session storage
    const saveSearchParams = useCallback((
        cityPair,
        departmentDate,
        returnDate,
        roundTrip,
        currency,
        adult,
        child,
        infant,
        departureCity,
        arrivalCity,
        activeSelectFlight,
        promoCode,
    ) => {
        const isBooking = typeSearchForm === 'Đặt vé';
        const prefix = isBooking ? '' : 'Update';
        
        const params = {
            [`cityPairSearchParam${prefix}`]: cityPair,
            [`departmentDateSearchParam${prefix}`]: departmentDate,
            [`returnDateSearchParam${prefix}`]: returnDate,
            [`roundTripSearchParam${prefix}`]: roundTrip,
            [`currencySearchParam${prefix}`]: currency,
            [`adultSearchParam${prefix}`]: adult,
            [`childSearchParam${prefix}`]: child,
            [`infantSearchParam${prefix}`]: infant,
            [`departureCitySearchParam${prefix}`]: departureCity,
            [`arrivalCitySearchParam${prefix}`]: arrivalCity,
            [`activeSelectFlightSearchParam${prefix}`]: activeSelectFlight,
            [`cheapFlightSearchParam${prefix}`]: cheapFlight,
            [`promoCodeSearchParam${prefix}`]: promoCode,
        };

        Object.entries(params).forEach(([key, value]) => {
            sessionStorage.setItem(key, value);
        });
    }, [typeSearchForm, cheapFlight]);

    return {
        // Form state
        departmentDate,
        setDepartmentDate,
        returnDate,
        setReturnDate,
        departureAirport,
        arrivalAirport,
        departureCity,
        arrivalCity,
        adult,
        child,
        infant,
        roundTrip,
        cheapFlight,
        promoCode,
        currency,
        
        // Computed values
        totalPassengers,
        validationMessages,
        
        // Handlers
        handleDepartureAirportChange,
        handleArrivalAirportChange,
        handleAdultChange,
        handleChildChange,
        handleInfantChange,
        handleRoundTripChange,
        handleCheapFlightChange,
        handlePromoCodeChange,
        saveSearchParams,
    };
} 