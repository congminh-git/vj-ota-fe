import { useState, useEffect, useCallback } from 'react';

export function useSessionStorage(key, initialValue) {
    // Get from session storage then parse stored json or return initialValue
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
    const setValue = useCallback((value) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            
            // Save to session storage
            if (typeof window !== 'undefined') {
                window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // Listen for changes to sessionStorage from other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.warn(`Error parsing sessionStorage key "${key}":`, error);
                }
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, [key]);

    return [storedValue, setValue];
}

// Hook for managing multiple session storage values at once
export function useSessionStorageBatch(initialValues) {
    const [values, setValues] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValues;
        }
        
        const result = {};
        Object.keys(initialValues).forEach(key => {
            try {
                const item = window.sessionStorage.getItem(key);
                result[key] = item ? JSON.parse(item) : initialValues[key];
            } catch (error) {
                console.warn(`Error reading sessionStorage key "${key}":`, error);
                result[key] = initialValues[key];
            }
        });
        return result;
    });

    const setBatchValues = useCallback((newValues) => {
        const valueToStore = newValues instanceof Function ? newValues(values) : newValues;
        setValues(valueToStore);
        
        if (typeof window !== 'undefined') {
            Object.entries(valueToStore).forEach(([key, value]) => {
                try {
                    window.sessionStorage.setItem(key, JSON.stringify(value));
                } catch (error) {
                    console.warn(`Error setting sessionStorage key "${key}":`, error);
                }
            });
        }
    }, [values]);

    return [values, setBatchValues];
} 