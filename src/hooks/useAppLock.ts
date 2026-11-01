import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from '@store/useAuthStore';

const APP_LOCK_TIMEOUT_MS = 2 * 60 * 1000;

type Params = {
    isUnlocked: boolean;
    setIsUnlocked: (value: boolean) => void;
};

export const useAppLock = ({ isUnlocked, setIsUnlocked }: Params) => {
    const token = useAuthStore((state) => state.token);
    const backgroundedAtRef = useRef<number | null>(null);

    useEffect(() => {
        if (token == null) return;

        const handleChange = (nextState: AppStateStatus) => {
            if (nextState === 'background' || nextState === 'inactive') {
                backgroundedAtRef.current = Date.now();
                return;
            }

            if (nextState === 'active' && backgroundedAtRef.current != null) {
                const elapsedMs = Date.now() - backgroundedAtRef.current;
                if (isUnlocked && elapsedMs > APP_LOCK_TIMEOUT_MS) {
                    setIsUnlocked(false);
                }
                backgroundedAtRef.current = null;
            }
        };

        const sub = AppState.addEventListener('change', handleChange);
        return () => sub.remove();
    }, [token, isUnlocked, setIsUnlocked]);
};