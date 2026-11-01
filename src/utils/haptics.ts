import { Vibration, Platform } from 'react-native';

let hapticsEnabled = true;

export const setHapticsEnabled = (value: boolean) => {
    hapticsEnabled = value;
};

const safeVibrate = (pattern: number | number[]) => {
    if (!hapticsEnabled) return;
    try {
        Vibration.vibrate(pattern);
    } catch (e) {
        console.log('[haptics] Thiết bị không hỗ trợ rung:', e);
    }
};

export const hapticLight = () => safeVibrate(20);
export const hapticMedium = () => safeVibrate(40);

export const hapticSuccess = () => {
    if (Platform.OS === 'ios') {
        safeVibrate(1);
    } else {
        safeVibrate([0, 30, 60, 30]);
    }
};

export const hapticError = () => safeVibrate([0, 60, 80, 60, 80, 60]);