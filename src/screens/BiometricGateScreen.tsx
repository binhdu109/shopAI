import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';

const rnBiometrics = new ReactNativeBiometrics();

type Props = {
    onUnlock: () => void;
};

const BiometricGateScreen = ({ onUnlock }: Props) => {
    const [checking, setChecking] = useState(true);
    const [failed, setFailed] = useState(false);
    const [label, setLabel] = useState('sinh trắc học');
    const logout = useAuthStore((state) => state.logout);

    const authenticate = useCallback(async () => {
        setChecking(true);
        setFailed(false);

        try {
            const { available, biometryType } = await rnBiometrics.isSensorAvailable();

            if (!available) {
                onUnlock();
                return;
            }

            if (biometryType === BiometryTypes.FaceID) {
                setLabel('Face ID');
            } else if (biometryType === BiometryTypes.TouchID || biometryType === BiometryTypes.Biometrics) {
                setLabel('vân tay');
            }

            const { success } = await rnBiometrics.simplePrompt({
                promptMessage: 'Xác thực để mở ShopAI',
                cancelButtonText: 'Huỷ',
            });

            if (success) {
                onUnlock();
            } else {
                setFailed(true);
            }
        } catch (e) {
            console.log('[biometric] Lỗi xác thực:', e);
            setFailed(true);
        } finally {
            setChecking(false);
        }
    }, [onUnlock]);

    useEffect(() => {
        authenticate();
    }, [authenticate]);

    if (checking) {
        return (
            <View style={styles.container}>
                <Text style={styles.hint}>Đang xác thực...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>🔒</Text>
            <Text style={styles.title}>ShopAI đang khoá</Text>
            <Text style={styles.hint}>
                {failed
                    ? `Xác thực ${label} chưa thành công. Bạn có thể thử lại hoặc đăng nhập lại bằng mật khẩu.`
                    : `Hãy xác thực bằng ${label} để tiếp tục.`}
            </Text>

            <ShopButton title="Thử lại" onPress={authenticate} style={{ width: 220, marginBottom: 12 }} />
            <ShopButton
                title="Đăng nhập bằng mật khẩu"
                onPress={logout}
                style={{ width: 220, backgroundColor: COLORS.secondary }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding * 2,
        backgroundColor: COLORS.background,
    },
    icon: { fontSize: 56, marginBottom: 16 },
    title: { fontSize: SIZES.h2, fontWeight: 'bold', marginBottom: 8 },
    hint: { fontSize: 14, textAlign: 'center', color: '#555', marginTop: 8, marginBottom: 28, lineHeight: 20 },
});

export default BiometricGateScreen;