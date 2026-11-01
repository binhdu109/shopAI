import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShopButton from '@components/ShopButton';
import { useCartStore } from '@store/useCartStore';
import { useTheme } from '@contexts/ThemeContext';
import { useCurrentLocation } from '@hooks/useCurrentLocation';
import {
    DEFAULT_SHIPPING_FEE,
    WAREHOUSE_COORDS,
    getDistanceKm,
    getShippingTier,
} from '@constants/shipping';
import { COLORS, SIZES } from '@constants/theme';
import { hapticSuccess } from '@utils/haptics';
import { createOrder } from '@services/orderApi';
import { getApiErrorMessage } from '@api/errors';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const CheckoutScreen = () => {
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const { colors } = useTheme();
    const { coords } = useCurrentLocation();

    const items = useCartStore((state) => state.items);
    const totalQuantity = useCartStore((state) => state.totalQuantity());
    const subtotal = useCartStore((state) => state.totalPrice());
    const clearCart = useCartStore((state) => state.clearCart);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Tính phí ship theo toạ độ GPS
    const shippingInfo = useMemo(() => {
        if (!coords) {
            return { fee: DEFAULT_SHIPPING_FEE, label: 'Giao hàng tiêu chuẩn' };
        }
        const dist = getDistanceKm(
            coords.latitude,
            coords.longitude,
            WAREHOUSE_COORDS.latitude,
            WAREHOUSE_COORDS.longitude,
        );
        const tier = getShippingTier(dist);
        return { fee: tier.fee, label: `${tier.label} (${dist.toFixed(1)} km)` };
    }, [coords]);

    const grandTotal = subtotal + shippingInfo.fee;

    const { mutate, isPending, isSuccess, data } = useMutation({
        mutationFn: () =>
            createOrder(items, grandTotal, coords),
        onSuccess: () => {
            hapticSuccess();
            clearCart();
            queryClient.invalidateQueries({ queryKey: ['productsInfinite'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (err) => {
            console.error('❌ Đặt hàng thất bại:', err);
            setErrorMessage(getApiErrorMessage(err, 'Đặt hàng thất bại — vui lòng thử lại!'));
        },
    });

    const handleConfirm = () => {
        setErrorMessage(null);
        mutate();
    };

    if (isSuccess && data) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <View style={styles.center}>
                    <Icon name="check-circle" size={64} color={COLORS.success} />
                    <Text style={[styles.successText, { color: colors.text }]}>Đặt hàng thành công!</Text>
                    <Text style={styles.orderInfo}>Mã đơn hàng: <Text style={{ fontWeight: 'bold' }}>{data.id}</Text></Text>
                    <Text style={styles.orderStatus}>Trạng thái: PENDING (Chờ thanh toán)</Text>

                    <ShopButton
                        title="Xem chi tiết hóa đơn"
                        onPress={() => {
                            navigation.replace('OrderDetail', { orderId: data.id });
                        }}
                        style={{ marginTop: 24, width: 220 }}
                    />
                    <ShopButton
                        title="Về trang chủ"
                        onPress={() => navigation.goBack()}
                        style={{ marginTop: 12, width: 220, backgroundColor: COLORS.secondary }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>Xác nhận đơn hàng</Text>

                {/* Danh sách tóm tắt sản phẩm */}
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Sản phẩm ({totalQuantity})</Text>
                    {items.map((item) => (
                        <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={styles.itemQty}>Số lượng: {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>
                                {formatCurrency(item.price * item.quantity)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Chi tiết thanh toán & vận chuyển */}
                <View style={[styles.card, { backgroundColor: colors.surface, marginTop: 16 }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Chi tiết thanh toán</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.label}>Tạm tính</Text>
                        <Text style={[styles.value, { color: colors.text }]}>{formatCurrency(subtotal)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <View>
                            <Text style={styles.label}>Phí vận chuyển</Text>
                            <Text style={styles.shippingNote}>{shippingInfo.label}</Text>
                        </View>
                        <Text style={[styles.value, { color: colors.text }]}>{formatCurrency(shippingInfo.fee)}</Text>
                    </View>

                    <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>Tổng thanh toán</Text>
                        <Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text>
                    </View>
                </View>

                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                {isPending ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 24 }} />
                ) : (
                    <ShopButton
                        title={`Đặt hàng ngay · ${formatCurrency(grandTotal)}`}
                        onPress={handleConfirm}
                        disabled={totalQuantity === 0}
                        style={styles.confirmBtn}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { padding: SIZES.padding },
    title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
    card: {
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    itemName: { fontSize: 13, fontWeight: '600' },
    itemQty: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
    itemPrice: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    label: { fontSize: 13, color: COLORS.textLight },
    shippingNote: { fontSize: 11, color: '#888', marginTop: 2 },
    value: { fontSize: 14, fontWeight: '600' },
    totalRow: {
        borderTopWidth: 1,
        marginTop: 8,
        paddingTop: 12,
    },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalValue: { fontSize: 18, color: COLORS.primary, fontWeight: 'bold' },
    confirmBtn: { marginTop: 24, marginBottom: 20 },
    errorText: { color: COLORS.error, textAlign: 'center', marginTop: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    successText: { fontSize: 22, fontWeight: 'bold', marginTop: 16 },
    orderInfo: { marginTop: 8, fontSize: 14, color: COLORS.textLight },
    orderStatus: { marginTop: 4, fontSize: 13, color: '#FAAD14', fontWeight: '600' },
});

export default CheckoutScreen;