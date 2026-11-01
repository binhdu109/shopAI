import { Platform } from 'react-native';

// Android Emulator reaches the development machine through 10.0.2.2.
// Replace this with the computer's LAN IP when running on a physical phone.
export const API_BASE_URL =
    Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
