import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCartStore } from '@store/useCartStore';
import { useTheme } from '@contexts/ThemeContext';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { hapticLight, hapticSuccess } from '@utils/haptics';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const CartScreen = ({ navigation }: any) => {
    const items = useCartStore((state) => state.items);
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const totalPrice = useCartStore((state) => state.totalPrice());
    const totalQuantity = useCartStore((state) => state.totalQuantity());
    const { colors, isDark } = useTheme();

    if (items.length === 0) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.emptyContainer}>
                    <Icon name="cart-off" size={72} color={COLORS.textLight} style={{ marginBottom: 16 }} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Giỏ hàng đang trống!</Text>
                    <Text style={styles.emptyText}>Hãy dạo một vòng cửa hàng và chọn cho mình những món đồ ưng ý nhé.</Text>
                    <ShopButton
                        title="Khám phá ngay"
                        onPress={() => navigation.navigate('HomeTab')}
                        style={{ marginTop: 24, width: 200 }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Giỏ hàng</Text>
                <Text style={styles.headerSubtitle}>{totalQuantity} sản phẩm</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: SIZES.padding }}
                renderItem={({ item }) => (
                    <View style={[styles.cartItem, { backgroundColor: colors.surface }]}>
                        {item.image ? (
                            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                        ) : (
                            <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? '#333' : '#EEE' }]}>
                                <Icon name="package-variant-closed" size={24} color={COLORS.textLight} />
                            </View>
                        )}

                        <View style={{ flex: 1, marginHorizontal: 12 }}>
                            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                                {item.name}
                            </Text>
                            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>

                            {/* Bộ đếm số lượng */}
                            <View style={styles.qtyControlRow}>
                                <Pressable
                                    style={[styles.qtyBtn, { borderColor: colors.border }]}
                                    onPress={() => {
                                        hapticLight();
                                        removeItem(item.id);
                                    }}
                                >
                                    <Icon name={item.quantity === 1 ? 'trash-can-outline' : 'minus'} size={16} color={item.quantity === 1 ? COLORS.error : colors.text} />
                                </Pressable>

                                <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>

                                <Pressable
                                    style={[styles.qtyBtn, { borderColor: colors.border }]}
                                    onPress={() => {
                                        hapticLight();
                                        addItem(item);
                                    }}
                                >
                                    <Icon name="plus" size={16} color={colors.text} />
                                </Pressable>
                            </View>
                        </View>

                        <Text style={styles.itemSubtotal}>
                            {formatCurrency(item.price * item.quantity)}
                        </Text>
                    </View>
                )}
            />

            <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <View style={styles.footerRow}>
                    <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
                </View>
                <ShopButton
                    title="Tiến hành thanh toán"
                    onPress={() => {
                        hapticSuccess();
                        navigation.navigate('Checkout');
                    }}
                    style={styles.checkoutBtn}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding * 2 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    emptyText: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 20 },
    header: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: 14,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    headerTitle: { fontSize: 22, fontWeight: '800' },
    headerSubtitle: { fontSize: 13, color: COLORS.textLight },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    itemImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#F9F9F9' },
    imagePlaceholder: { width: 64, height: 64, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    itemName: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
    itemPrice: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginTop: 2 },
    qtyControlRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: { marginHorizontal: 10, fontSize: 14, fontWeight: '700', minWidth: 16, textAlign: 'center' },
    itemSubtotal: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, alignSelf: 'center' },
    footer: {
        padding: SIZES.padding,
        borderTopWidth: 1,
    },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    totalLabel: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
    totalValue: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
    checkoutBtn: { height: 48, borderRadius: 12 },
});

export default CartScreen;