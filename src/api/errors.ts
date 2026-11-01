import axios, { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error)) return fallback;
    const apiError = error as AxiosError<{ message?: string | string[] }>;
    const message = apiError.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (message) return message;
    if (!apiError.response) return 'Không kết nối được máy chủ ShopAI. Kiểm tra địa chỉ API và thử lại.';
    return fallback;
}
