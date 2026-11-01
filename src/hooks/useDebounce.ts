import { useState, useEffect } from 'react';

/**
 * Custom Hook Debounce (Chương 4 - Mục 4.6.2)
 * Giúp trì hoãn việc cập nhật giá trị cho đến khi người dùng ngừng gõ sau khoảng thời gian delay.
 * Chống spam render và spam gọi API khi tìm kiếm.
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
