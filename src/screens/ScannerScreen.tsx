import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Alert, Linking, StyleSheet, Text, View, Pressable } from 'react-native';
import * as VisionCamera from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShopButton from '@components/ShopButton';
import { COLORS } from '@constants/theme';
import { hapticLight, hapticSuccess } from '@utils/haptics';

const Camera = VisionCamera.Camera as any;
const useCameraDevice = (VisionCamera as any).useCameraDevice;
const useCodeScanner = (VisionCamera as any).useCodeScanner;

type PermissionState = 'checking' | 'granted' | 'denied';

const ScannerScreen = ({ navigation }: any) => {
    const [permission, setPermission] = useState<PermissionState>('checking');
    const [torch, setTorch] = useState<'on' | 'off'>('off');
    const device = useCameraDevice ? useCameraDevice('back') : null;
    const isFocused = useIsFocused();
    const isScanning = useRef(false);

    // Reset cờ scanning khi màn hình được active trở lại
    useEffect(() => {
        if (isFocused) {
            isScanning.current = false;
        }
    }, [isFocused]);

    const requestPermission = useCallback(async () => {
        if (!Camera) return;
        const current = Camera.getCameraPermissionStatus ? Camera.getCameraPermissionStatus() : 'granted';
        if (current === 'granted') {
            setPermission('granted');
            return;
        }
        const status = Camera.requestCameraPermission ? await Camera.requestCameraPermission() : 'granted';
        setPermission(status === 'granted' ? 'granted' : 'denied');
    }, []);

    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    useEffect(() => {
        const sub = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'active') requestPermission();
        });
        return () => sub.remove();
    }, [requestPermission]);

    const openAppSettings = () => {
        Alert.alert(
            'Cần quyền Camera',
            'Bạn đã từ chối quyền Camera nên ShopAI không thể quét mã vạch. Hãy vào Cài đặt > ShopAI và bật lại quyền Camera nhé.',
            [
                { text: 'Để sau', style: 'cancel' },
                { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
            ],
        );
    };

    const toggleTorch = () => {
        hapticLight();
        setTorch((prev) => (prev === 'on' ? 'off' : 'on'));
    };

    const codeScanner = useCodeScanner ? useCodeScanner({
        codeTypes: ['qr', 'ean-13', 'code-128'],
        onCodeScanned: (codes: any[]) => {
            if (isScanning.current) return;
            if (!codes || codes.length === 0) return;

            const value = codes[0].value;
            if (!value) return;

            isScanning.current = true;
            console.log('Phát hiện mã:', value);
            hapticSuccess();
            navigation.navigate('Home', { scannedCode: value });
        },
    }) : undefined;

    if (permission === 'checking') {
        return (
            <View style={styles.center}>
                <Text style={styles.stateText}>Đang kiểm tra quyền Camera...</Text>
            </View>
        );
    }

    if (permission === 'denied') {
        return (
            <View style={styles.center}>
                <Text style={styles.deniedTitle}>Chưa có quyền Camera</Text>
                <Text style={styles.deniedDesc}>
                    ShopAI cần Camera để quét mã vạch sản phẩm. Ảnh chỉ được xử lý ngay trên máy
                    của bạn và không bao giờ được gửi đi đâu cả.
                </Text>
                <ShopButton title="Mở Cài đặt" onPress={openAppSettings} style={{ width: 200, marginBottom: 12 }} />
                <ShopButton title="Quay lại" onPress={() => navigation.goBack()} style={{ width: 200, backgroundColor: COLORS.secondary }} />
            </View>
        );
    }

    if (device == null) {
        return (
            <View style={styles.center}>
                <Text style={styles.stateText}>Thiết bị không có Camera sau!</Text>
                <Text style={styles.deniedDesc}>
                    Bạn có đang chạy trên máy ảo (Simulator/Emulator) không? Camera bắt buộc phải
                    chạy trên điện thoại thật.
                </Text>
                <ShopButton title="Quay lại" onPress={() => navigation.goBack()} style={{ width: 200 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isFocused}
                codeScanner={codeScanner}
                torch={torch}
            />

            {/* Header controls: Back & Torch Flash */}
            <View style={styles.topBar}>
                <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="white" />
                </Pressable>
                <Text style={styles.topTitle}>Quét mã sản phẩm</Text>
                <Pressable
                    style={[styles.iconBtn, torch === 'on' && styles.iconBtnActive]}
                    onPress={toggleTorch}
                >
                    <Icon
                        name={torch === 'on' ? 'flashlight' : 'flashlight-off'}
                        size={24}
                        color={torch === 'on' ? '#FFD700' : 'white'}
                    />
                </Pressable>
            </View>

            {/* Khung ngắm quét mã */}
            <View style={styles.frameWrapper} pointerEvents="none">
                <View style={styles.frame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>
            </View>

            {/* Hướng dẫn phía dưới */}
            <View style={styles.overlay}>
                <Text style={styles.instruction}>Căn chỉnh mã Barcode / QR vào giữa khung hình</Text>
                <ShopButton title="Đóng Camera" onPress={() => navigation.goBack()} style={{ width: 160, backgroundColor: 'rgba(255,77,79,0.85)' }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    topBar: {
        position: 'absolute',
        top: 48,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    topTitle: { color: 'white', fontSize: 16, fontWeight: '700' },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBtnActive: { backgroundColor: 'rgba(255,215,0,0.3)', borderWidth: 1, borderColor: '#FFD700' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: COLORS.background },
    stateText: { fontSize: 16, marginBottom: 12, textAlign: 'center' },
    deniedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: COLORS.error },
    deniedDesc: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
    frameWrapper: { ...(StyleSheet.absoluteFill as any), justifyContent: 'center', alignItems: 'center' },
    frame: { width: 260, height: 260, position: 'relative' },
    corner: { position: 'absolute', width: 24, height: 24, borderColor: COLORS.primary },
    topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
    topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
    bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
    bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
    overlay: { position: 'absolute', bottom: 44, alignSelf: 'center', alignItems: 'center', paddingHorizontal: 20 },
    instruction: {
        color: 'white', fontSize: 14, fontWeight: '600', marginBottom: 16,
        backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        textAlign: 'center',
    },
});

export default ScannerScreen;