import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type Coords = { latitude: number; longitude: number };

type LocationState = {
    coords: Coords | null;
    loading: boolean;
    error: string | null;
};

const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
        return new Promise((resolve) => {
            Geolocation.requestAuthorization(
                () => resolve(true),
                () => resolve(false),
            );
        });
    }

    const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
    const fineGranted =
        permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;
    const coarseGranted =
        permissions[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

    if (fineGranted || coarseGranted) {
        return true;
    }

    if (
        permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        permissions[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
        Alert.alert(
            'Quyền vị trí đã bị chặn',
            'Hãy vào Cài đặt > ShopAI > Quyền > Vị trí để bật quyền vị trí.',
            [
                { text: 'Để sau', style: 'cancel' },
                { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
            ],
        );
    }

    return false;
};

const LOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0,
    distanceFilter: 10,
    interval: 5000,
    fastestInterval: 2000,
};

const getLocationErrorMessage = (code: number) => {
    const messages: Record<number, string> = {
        1: 'Bạn đã từ chối quyền vị trí. Hãy bật quyền vị trí cho ShopAI trong Cài đặt.',
        2: 'Chưa nhận được vị trí. Hãy bật GPS; trên máy ảo, đặt vị trí trong Extended Controls > Location.',
        3: 'GPS chưa có tín hiệu. Hãy thử lại ở nơi thoáng hoặc kiểm tra vị trí máy ảo.',
    };
    return messages[code] ?? 'Không lấy được vị trí';
};

export const useCurrentLocation = () => {
    const [state, setState] = useState<LocationState>({
        coords: null,
        loading: true,
        error: null,
    });
    const watchId = useRef<number | null>(null);
    const isMounted = useRef(false);

    const updatePosition = useCallback((position: { coords: Coords }) => {
        if (!isMounted.current) return;
        setState({
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            loading: false,
            error: null,
        });
    }, []);

    const handleLocationError = useCallback((err: { code: number }) => {
        if (!isMounted.current) return;
        setState((current) => ({
            ...current,
            loading: false,
            error: current.coords ? null : getLocationErrorMessage(err.code),
        }));
    }, []);

    const fetchLocation = useCallback(async () => {
        setState((current) => ({ ...current, loading: true, error: null }));

        const hasPermission = await requestLocationPermission();
        if (!isMounted.current) return;
        if (!hasPermission) {
            setState((current) => ({
                ...current,
                loading: false,
                error: 'Chưa được cấp quyền vị trí',
            }));
            return;
        }

        if (watchId.current !== null) {
            Geolocation.clearWatch(watchId.current);
        }

        watchId.current = Geolocation.watchPosition(
            updatePosition,
            handleLocationError,
            LOCATION_OPTIONS,
        );
        Geolocation.getCurrentPosition(updatePosition, handleLocationError, LOCATION_OPTIONS);
    }, [handleLocationError, updatePosition]);

    useEffect(() => {
        isMounted.current = true;
        fetchLocation();
        return () => {
            isMounted.current = false;
            if (watchId.current !== null) {
                Geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
        };
    }, [fetchLocation]);

    return { ...state, refresh: fetchLocation };
};