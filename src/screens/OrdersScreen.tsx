import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShopButton from '@components/ShopButton';
import { getOrders } from '@services/orderApi';
import { useTheme } from '@contexts/ThemeContext';
import { COLORS, SIZES } from '@constants/theme';

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const OrdersScreen = () => {
    const navigation = useNavigation<any>();
    const { data: orders = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
    });
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Lịch sử Đơn hàng</Text>
                <Text style={styles.subtitle}>Tổng cộng: {orders.length} đơn</Text>
            </View>

            {isLoading ? (
                <View style={styles.empty}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : isError ? (
                <View style={styles.empty}>
                    <Text style={[styles.emptyText, { color: colors.text }]}>
                        Không tải được lịch sử đơn hàng. Kiểm tra kết nối hoặc đăng nhập lại.
                    </Text>
                    <ShopButton title="Thử lại" onPress={() => refetch()} style={{ marginTop: 16, width: 160 }} />
                </View>
            ) : orders.length === 0 ? (
                <View style={styles.empty}>
                    <Icon name="receipt" size={64} color={COLORS.textLight} style={{ marginBottom: 12 }} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa có đơn hàng nào</Text>
                    <Text style={styles.emptyText}>Các đơn hàng của bạn sẽ xuất hiện tại đây sau khi bạn đặt hàng.</Text>
                    <ShopButton
                        title="Khám phá sản phẩm ngay"
                        onPress={() => navigation.navigate('HomeTab')}
                        style={{ marginTop: 20, width: 220 }}
                    />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: SIZES.padding }}
                    renderItem={({ item }) => {
                        const isPaid = item.status === 'PAID';
                        return (
                            <Pressable
                                style={[styles.card, { backgroundColor: colors.surface }]}
                                onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={[styles.orderId, { color: colors.text }]}>{item.id}</Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: isPaid ? '#F6FFED' : '#FFFBE6', borderColor: isPaid ? '#B7EB8F' : '#FFE58F' },
                                        ]}
                                    >
                                        <Icon
                                            name={isPaid ? 'check-circle' : 'clock-outline'}
                                            size={12}
                                            color={isPaid ? COLORS.success : '#D48806'}
                                        />
                                        <Text style={[styles.statusText, { color: isPaid ? COLORS.success : '#D48806' }]}>
                                            {isPaid ? ' ĐÃ THANH TOÁN' : ' CHỜ THANH TOÁN'}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.itemCountNote}>
                                    {item.items?.length || 0} mặt hàng · {formatCurrency(item.total)}
                                </Text>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
                                    <Text style={styles.viewDetail}>Xem chi tiết →</Text>
                                </View>
                            </Pressable>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { paddingHorizontal: SIZES.padding, paddingTop: 12, paddingBottom: 8 },
    title: { fontSize: 22, fontWeight: '800' },
    subtitle: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
    emptyText: { color: COLORS.textLight, textAlign: 'center', lineHeight: 20 },
    card: {
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { fontWeight: '700', fontSize: 15 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusText: { fontSize: 10, fontWeight: '700' },
    itemCountNote: { marginTop: 8, fontSize: 14, fontWeight: '600', color: COLORS.primary },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    date: { color: COLORS.textLight, fontSize: 12 },
    viewDetail: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
});

export default OrdersScreen;