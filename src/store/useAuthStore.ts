import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'SHOP_ACCESS_TOKEN';

interface AuthState {
    token: string | null;
    isLoading: boolean;
    login: (newToken: string) => Promise<void>;
    logout: () => Promise<void>;
    checkLocalToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoading: true,

    login: async (newToken) => {
        await Keychain.setGenericPassword('shopai_user', newToken, { service: SERVICE_NAME });
        set({ token: newToken });
    },

    logout: async () => {
        await Keychain.resetGenericPassword({ service: SERVICE_NAME });
        set({ token: null });
    },

    checkLocalToken: async () => {
        try {
            const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
            if (credentials) {
                set({ token: credentials.password });
            }
        } catch (e) {
            console.log('Lỗi Keychain', e);
        } finally {
            set({ isLoading: false });
        }
    },
}));