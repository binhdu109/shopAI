import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    Pressable,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { useAuthStore } from '@store/useAuthStore';
import { useTheme } from '@contexts/ThemeContext';
import { useCartStore } from '@store/useCartStore';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@services/orderApi';
import { hapticLight, hapticSuccess, setHapticsEnabled } from '@utils/haptics';

const rnBiometrics = new ReactNativeBiometrics();

interface Props {
    navigation?: any;
}

const ProfileScreen = ({ navigation }: Props) => {
    const logout = useAuthStore((state) => state.logout);
    const { isDark, toggleTheme, colors } = useTheme();
    const { data: orders = [] } = useQuery({ queryKey: ['orders'], queryFn: getOrders });
    const totalCartItems = useCartStore((state) => state.totalQuantity());

    const [biometricType, setBiometricType] = useState<string>('Đang kiểm tra...');
    const [hapticsOn, setHapticsOn] = useState(true);

    const paidOrders = orders.filter((o) => o.status === 'PAID').length;
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

    useEffect(() => {
        const checkBio = async () => {
            try {
                const { available, biometryType } = await rnBiometrics.isSensorAvailable();
                if (!available) {
                    setBiometricType('Mã PIN / Mật khẩu máy');
                } else if (biometryType === BiometryTypes.FaceID) {
                    setBiometricType('Face ID (Khuôn mặt)');
                } else if (biometryType === BiometryTypes.TouchID || biometryType === BiometryTypes.Biometrics) {
                    setBiometricType('Vân tay (Touch ID / Fingerprint)');
                } else {
                    setBiometricType('Sinh trắc học');
                }
            } catch {
                setBiometricType('Không khả dụng');
            }
        };
        checkBio();
    }, []);

    const handleToggleHaptics = (val: boolean) => {
        setHapticsOn(val);
        setHapticsEnabled(val);
        if (val) hapticSuccess();
    };

    const handleLogoutConfirm = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất khỏi ShopAI?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: () => {
                        hapticLight();
                        logout();
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header Profile */}
                <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.avatarWrapper}>
                        <Icon name="account-circle" size={72} color={COLORS.primary} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[styles.userName, { color: colors.text }]}>Khách hàng Thân thiết</Text>
                        <Text style={styles.userEmail}>user@shopai.com</Text>
                        <View style={styles.vipBadge}>
                            <Icon name="crown" size={14} color="#FFD700" />
                            <Text style={styles.vipText}>Thành viên VIP</Text>
                        </View>
                    </View>
                </View>

                {/* Thống kê đơn hàng & giỏ hàng */}
                <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
                    <Pressable
                        style={styles.statItem}
                        onPress={() => navigation?.navigate('Orders')}
                    >
                        <Text style={[styles.statValue, { color: COLORS.primary }]}>{orders.length}</Text>
                        <Text style={styles.statLabel}>Đơn hàng</Text>
                    </Pressable>

                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: '#FAAD14' }]}>{pendingOrders}</Text>
                        <Text style={styles.statLabel}>Chờ thanh toán</Text>
                    </View>

                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: COLORS.success }]}>{paidOrders}</Text>
                        <Text style={styles.statLabel}>Đã thanh toán</Text>
                    </View>

                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                    <Pressable
                        style={styles.statItem}
                        onPress={() => navigation?.navigate('Cart')}
                    >
                        <Text style={[styles.statValue, { color: colors.text }]}>{totalCartItems}</Text>
                        <Text style={styles.statLabel}>Trong giỏ</Text>
                    </Pressable>
                </View>

                {/* Tiện ích & Lối tắt nhanh */}
                <Text style={styles.sectionHeader}>TIỆN ÍCH NHANH</Text>
                <View style={[styles.menuGroup, { backgroundColor: colors.surface }]}>
                    <Pressable
                        style={styles.menuItem}
                        onPress={() => navigation?.navigate('HomeTab', { screen: 'AIChat' })}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: '#E6F7FF' }]}>
                            <Icon name="robot" size={20} color="#1890FF" />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Trợ lý AI Gemini</Text>
                        <Icon name="chevron-right" size={20} color={COLORS.textLight} />
                    </Pressable>

                    <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

                    <Pressable
                        style={styles.menuItem}
                        onPress={() => navigation?.navigate('HomeTab', { screen: 'Scanner' })}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: '#F6FFED' }]}>
                            <Icon name="barcode-scan" size={20} color="#52C41A" />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Quét mã Barcode / QR</Text>
                        <Icon name="chevron-right" size={20} color={COLORS.textLight} />
                    </Pressable>

                    <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

                    <Pressable
                        style={styles.menuItem}
                        onPress={() => navigation?.navigate('RTKDemo')}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: '#FFF0F6' }]}>
                            <Icon name="flask-outline" size={20} color="#EB2F96" />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Thực hành Redux Toolkit (Đề cương)</Text>
                        <Icon name="chevron-right" size={20} color={COLORS.textLight} />
                    </Pressable>
                </View>

                {/* Cài đặt ứng dụng */}
                <Text style={styles.sectionHeader}>CÀI ĐẶT & BẢO MẬT</Text>
                <View style={[styles.menuGroup, { backgroundColor: colors.surface }]}>
                    <View style={styles.menuItem}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#FFF7E6' }]}>
                            <Icon name="theme-light-dark" size={20} color="#FA8C16" />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Giao diện Tối (Dark Mode)</Text>
                        <Switch
                            value={isDark}
                            onValueChange={() => {
                                hapticLight();
                                toggleTheme();
                            }}
                            trackColor={{ false: '#d9d9d9', true: COLORS.primary }}
                        />
                    </View>

                    <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

                    <View style={styles.menuItem}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#F0F5FF' }]}>
                            <Icon name="vibrate" size={20} color="#2F54EB" />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Rung phản hồi (Haptics)</Text>
                        <Switch
                            value={hapticsOn}
                            onValueChange={handleToggleHaptics}
                            trackColor={{ false: '#d9d9d9', true: COLORS.primary }}
                        />
                    </View>

                    <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

                    <View style={styles.menuItem}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#E6FFFB' }]}>
                            <Icon name="fingerprint" size={20} color="#13C2C2" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.menuLabel, { color: colors.text }]}>Khóa sinh trắc học</Text>
                            <Text style={styles.menuSubLabel}>{biometricType}</Text>
                        </View>
                        <Icon name="shield-check" size={20} color={COLORS.success} />
                    </View>

                    <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

                    <View style={styles.menuItem}>
                        <View style={[styles.menuIconBox, { backgroundColor: '#FFF1F0' }]}>
                            <Icon name="lock-clock" size={20} color="#F5222D" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.menuLabel, { color: colors.text }]}>Tự động khóa (App Lock)</Text>
                            <Text style={styles.menuSubLabel}>Khi ở nền quá 2 phút</Text>
                        </View>
                        <Icon name="check-circle" size={18} color={COLORS.success} />
                    </View>
                </View>

                {/* Nút đăng xuất */}
                <ShopButton
                    title="Đăng xuất tài khoản"
                    onPress={handleLogoutConfirm}
                    style={styles.logoutBtn}
                />

                {/* Footer thông tin */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>ShopAI Enterprise v1.0.0</Text>
                    <Text style={styles.footerSubText}>React Navigation V7 · TanStack Query · Zustand & Keystore</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { padding: SIZES.padding, paddingBottom: 40 },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    avatarWrapper: { marginRight: 14 },
    profileInfo: { flex: 1 },
    userName: { fontSize: 18, fontWeight: '800' },
    userEmail: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
    vipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBE6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#FFE58F',
    },
    vipText: { fontSize: 11, fontWeight: '700', color: '#D48806', marginLeft: 4 },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 14,
        borderRadius: 14,
        marginBottom: 20,
        elevation: 1,
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 18, fontWeight: '800' },
    statLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
    statDivider: { width: 1, height: 24 },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textLight,
        letterSpacing: 0.8,
        marginBottom: 8,
        marginLeft: 4,
    },
    menuGroup: {
        borderRadius: 14,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    menuIconBox: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuLabel: { fontSize: 14, fontWeight: '600', flex: 1 },
    menuSubLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
    menuDivider: { height: 1, marginLeft: 60 },
    logoutBtn: {
        backgroundColor: COLORS.primary,
        marginTop: 6,
        marginBottom: 24,
    },
    footer: { alignItems: 'center', marginTop: 8 },
    footerText: { fontSize: 12, fontWeight: '600', color: COLORS.textLight },
    footerSubText: { fontSize: 10, color: '#999', marginTop: 2 },
});

export default ProfileScreen;
