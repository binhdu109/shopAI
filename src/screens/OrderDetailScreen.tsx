import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShopButton from '@components/ShopButton';
import { getOrder, payOrder } from '@services/orderApi';
import { getApiErrorMessage } from '@api/errors';
import { useTheme } from '@contexts/ThemeContext';
import { COLORS, SIZES } from '@constants/theme';
import { hapticSuccess } from '@utils/haptics';
import { RootStackParamList } from '@navigation/RootStackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const OrderDetailScreen = ({ route }: Props) => {
    const { orderId } = route.params;
    const { colors } = useTheme();
    const queryClient = useQueryClient();
    const { data: order, isLoading, isError, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrder(orderId),
    });
    const payment = useMutation({
        mutationFn: () => payOrder(orderId),
        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(['order', orderId], updatedOrder);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
                <View style={styles.missingBox}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (!order || isError) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
                <View style={styles.missingBox}>
                    <Icon name="alert-circle-outline" size={48} color={COLORS.error} />
                    <Text style={[styles.missing, { color: colors.text }]}>
                        {isError
                            ? getApiErrorMessage(error, 'Không tải được hóa đơn')
                            : `Không tìm thấy hóa đơn #${orderId}`}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const isPaid = order.status === 'PAID';

    const handlePay = () => {
        hapticSuccess();
        payment.mutate();
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Thẻ trạng thái & mã hóa đơn */}
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.headerLabel}>MÃ HÓA ĐƠN</Text>
                            <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                        </View>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: isPaid ? '#F6FFED' : '#FFFBE6', borderColor: isPaid ? '#B7EB8F' : '#FFE58F' },
                            ]}
                        >
                            <Icon
                                name={isPaid ? 'check-circle' : 'clock-outline'}
                                size={14}
                                color={isPaid ? COLORS.success : '#D48806'}
                            />
                            <Text style={[styles.statusText, { color: isPaid ? COLORS.success : '#D48806' }]}>
                                {isPaid ? ' ĐÃ THANH TOÁN' : ' CHỜ THANH TOÁN'}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Thời gian tạo:</Text>
                        <Text style={[styles.metaValue, { color: colors.text }]}>
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Phương thức:</Text>
                        <Text style={[styles.metaValue, { color: colors.text }]}>Thanh toán khi nhận hàng (COD / Demo)</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Phí vận chuyển:</Text>
                        <Text style={[styles.metaValue, { color: colors.text }]}>
                            {formatCurrency(order.shippingFee ?? 0)}
                        </Text>
                    </View>
                </View>

                {/* Chi tiết từng mặt hàng */}
                <View style={[styles.card, { backgroundColor: colors.surface, marginTop: 16 }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Danh sách sản phẩm</Text>

                    {order.items?.map((it, idx) => (
                        <View key={`${it.id}-${idx}`} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.itemName, { color: colors.text }]}>{it.name}</Text>
                                <Text style={styles.itemMeta}>Đơn giá: {formatCurrency(it.price)} · SL: {it.quantity}</Text>
                            </View>
                            <Text style={styles.itemTotal}>
                                {formatCurrency(it.price * it.quantity)}
                            </Text>
                        </View>
                    ))}

                    <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>Tổng hóa đơn:</Text>
                        <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
                    </View>
                </View>

                {/* Nút hành động thanh toán giả lập */}
                {!isPaid ? (
                    <View style={styles.actionBox}>
                        {payment.isError && (
                            <Text style={[styles.payHint, { color: COLORS.error }]}>
                                {getApiErrorMessage(payment.error, 'Thanh toán thất bại. Vui lòng thử lại.')}
                            </Text>
                        )}
                        <ShopButton
                            title="Thanh toán giả lập (Chuyển → PAID)"
                            onPress={handlePay}
                            isLoading={payment.isPending}
                            style={styles.payBtn}
                        />
                        <Text style={styles.payHint}>
                            * Nhấn vào đây để giả lập cổng thanh toán VNPay/Momo xác nhận giao dịch thành công.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.paidNotice}>
                        <Icon name="shield-check" size={24} color={COLORS.success} />
                        <Text style={styles.paidText}>  Đơn hàng đã được thanh toán thành công!</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: { padding: SIZES.padding },
    card: {
        padding: 16,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: '700', letterSpacing: 0.5 },
    orderId: { fontSize: 18, fontWeight: '800', marginTop: 2 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusText: { fontSize: 11, fontWeight: '700' },
    divider: { height: 1, marginVertical: 12 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    metaLabel: { fontSize: 13, color: COLORS.textLight },
    metaValue: { fontSize: 13, fontWeight: '600' },
    cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    itemName: { fontSize: 14, fontWeight: '600' },
    itemMeta: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
    itemTotal: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        marginTop: 12,
        paddingTop: 12,
    },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalValue: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
    actionBox: { marginTop: 20 },
    payBtn: { height: 48, borderRadius: 12 },
    payHint: { fontSize: 12, color: COLORS.textLight, textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
    paidNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6FFED',
        padding: 14,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#B7EB8F',
    },
    paidText: { color: '#389E0D', fontSize: 14, fontWeight: '700' },
    missingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    missing: { fontSize: 16, marginTop: 12, fontWeight: 'bold' },
});

export default OrderDetailScreen;