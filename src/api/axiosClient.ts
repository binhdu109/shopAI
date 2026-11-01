import axios from 'axios';
import { useAuthStore } from '@store/useAuthStore';
import { API_BASE_URL } from '@constants/api';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && useAuthStore.getState().token) {
            console.warn('⚠️ Token hết hạn hoặc không hợp lệ — tự động đăng xuất!');
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default axiosClient;