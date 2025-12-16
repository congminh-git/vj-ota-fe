'use client';

import { useState, useRef, useEffect } from 'react';

export default function DateInputMask({ mask = "99/99/9999", placeholder = "DD/MM/YYYY", maskChar = "_", value, onChange, ...props }) {
    const [displayValue, setDisplayValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        // Chỉ sync từ value prop khi không đang nhập
        if (isTyping) {
            return;
        }

        // Nếu value là undefined/null/empty hoặc có chứa "undefined", reset
        if (!value || value === null || value === '' || value === 'undefined' || (typeof value === 'string' && value.includes('undefined'))) {
            setDisplayValue('');
            return;
        }

        if (typeof value === 'string') {
            // Nếu value không có "/" nhưng có số, hiển thị trực tiếp (đang nhập)
            if (!value.includes('/') && value.match(/\d/)) {
                setDisplayValue(value);
                return;
            }

            if (value.includes('/')) {
                const parts = value.split('/').filter(p => p && p !== 'undefined');
                
                // Nếu có đủ 3 phần hợp lệ, có thể là MM/DD/YYYY (đã convert) hoặc DD/MM/YYYY (đang nhập)
                if (parts.length === 3) {
                    const firstPart = parseInt(parts[0], 10);
                    const secondPart = parseInt(parts[1], 10);
                    
                    // Nếu phần đầu <= 12 và phần thứ 2 <= 31, có thể là MM/DD/YYYY format
                    // Convert về DD/MM/YYYY để hiển thị
                    if (firstPart <= 12 && secondPart <= 31 && parts[2].length === 4) {
                        const [month, day, year] = parts;
                        setDisplayValue(`${day}/${month}/${year}`);
                    } else {
                        // Có thể là DD/MM/YYYY đang nhập, hiển thị trực tiếp
                        setDisplayValue(value);
                    }
                } else {
                    // Chưa đủ 3 phần, hiển thị giá trị hiện tại (đang nhập DD/MM/YYYY)
                    setDisplayValue(value);
                }
            }
        }
    }, [value, isTyping]);

    const formatInput = (inputValue) => {
        // Remove all non-digit characters
        const digits = inputValue.replace(/\D/g, '');
        
        // Apply mask pattern
        let formatted = '';
        let digitIndex = 0;
        
        for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
            if (mask[i] === '9') {
                formatted += digits[digitIndex];
                digitIndex++;
            } else {
                formatted += mask[i];
            }
        }
        
        return formatted;
    };

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const formatted = formatInput(inputValue);
        setDisplayValue(formatted);
        
        // Đánh dấu đang nhập
        setIsTyping(true);
        
        // Clear timeout cũ nếu có
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Sau 300ms không nhập nữa thì đánh dấu không còn đang nhập
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 300);
        
        // Call the original onChange with the formatted value
        if (onChange) {
            // Create a synthetic event with the formatted value
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: formatted
                }
            };
            onChange(syntheticEvent);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <input
            {...props}
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={mask.length}
        />
    );
}
