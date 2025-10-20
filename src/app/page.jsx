'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Kiểm tra token và refreshToken trong cookie phía client
        const getCookie = (name) => {
            if (typeof document === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };
        const token = getCookie('token');
        const refreshToken = getCookie('refreshToken');
        const apikey = getCookie('apikey');
        if (!token && (!refreshToken || !apikey)) {
            router.replace('/login');
        } else {
            router.replace('/dat-ve');
        }
    }, [router]);

    return null;
}