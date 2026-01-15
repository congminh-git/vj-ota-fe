'use client';

import { useEffect, useRef, useState } from 'react';

type ProgressLoadingProps = {
    loading: boolean;
    minHeight?: string;
    text?: string;
    minDuration?: number; // ms – thời gian tối thiểu hiển thị
};

export default function ProgressLoading({
    loading,
    minHeight = 'min-h-screen',
    text = 'Đang tải dữ liệu',
    minDuration = 800,
}: ProgressLoadingProps) {
    const [percent, setPercent] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (loading) {
            startTimeRef.current = Date.now();

            if (intervalRef.current) return;

            intervalRef.current = setInterval(() => {
                setPercent((prev) => {
                    if (prev >= 95) return prev; // KHÔNG lên 100 tự động
                    return prev + Math.floor(Math.random() * 4) + 1; // +1 → +4
                });
            }, 120);
        }

        if (!loading && startTimeRef.current) {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(minDuration - elapsed, 0);

            setTimeout(() => {
                setPercent(100); // lên 100 nhưng KHÔNG auto-hide

                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }, remaining);
        }

        return () => {};
    }, [loading, minDuration]);

    // ❗ Không auto unmount
    if (!loading && percent === 0) return null;

    return (
        <div className={`${minHeight} flex flex-col items-center justify-center gap-4`}>
            <div className="w-72 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <span className="text-sm text-gray-600">
                {text} {percent}%
            </span>
        </div>
    );
}
