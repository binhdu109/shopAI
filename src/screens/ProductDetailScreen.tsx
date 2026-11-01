import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShopButton from '@components/ShopButton';
import { useCartStore } from '@store/useCartStore';
import { useTheme } from '@contexts/ThemeContext';
import { Product } from '../types/product.schema';
import { ProductSchema } from '../types/product.schema';
import axiosClient from '@api/axiosClient';
import { COLORS, SIZES } from '@constants/theme';
import { hapticLight, hapticSuccess } from '@utils/haptics';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

interface ProductPage {
    items: Product[];
    nextPage: number | null;
}

const ProductDetailScreen = () => {
    const route = useRoute<ProductDetailRouteProp>();
    const { productId } = route.params;
    const queryClient = useQueryClient();
    const addItem = useCartStore((state) => state.addItem);
    const { colors, isDark } = useTheme();

    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);

    const cachedData = queryClient.getQueryData<{ pages: ProductPage[] }>(['productsInfinite']);
    const cachedProducts = cachedData?.pages.flatMap((page) => page.items) ?? [];
    const cachedProduct = cachedProducts.find((p) => p.id === productId);
    const { data: fetchedProduct, isLoading, isError, refetch } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await axiosClient.get<unknown>(
                `/api/products/${encodeURIComponent(productId)}`,
            );
            const result = ProductSchema.safeParse(response.data);
            if (!result.success) throw new Error('Dữ liệu chi tiết sản phẩm không hợp lệ');
            return result.data;
        },
        placeholderData: cachedProduct,
    });
    const product = fetchedProduct ?? cachedProduct;

    if (!product) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <View style={styles.center}>
                    {isLoading ? (
                        <Text style={styles.notFound}>Đang tải sản phẩm...</Text>
                    ) : (
                        <>
                            <Text style={styles.notFound}>
                                {isError ? 'Không tải được sản phẩm từ máy chủ' : `Không tìm thấy sản phẩm ${productId}`}
                            </Text>
                            <Pressable onPress={() => refetch()}>
                                <Text style={styles.hint}>Thử tải lại</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        hapticSuccess();
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2000);
    };

    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[styles.imageWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#F9F9F9' }]}>
                    <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{product.category || 'THIẾT BỊ CÔNG NGHỆ'}</Text>
                    </View>

                    <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
                    <Text style={styles.price}>{formattedPrice}</Text>
                    <Text style={styles.idNote}>Mã định danh (SKU): {product.id}</Text>

                    {/* Bộ chọn số lượng */}
                    <View style={styles.quantitySection}>
                        <Text style={[styles.quantityLabel, { color: colors.text }]}>Số lượng:</Text>
                        <View style={[styles.quantityBox, { borderColor: colors.border }]}>
                            <Pressable
                                style={styles.qtyBtn}
                                onPress={() => {
                                    if (quantity > 1) {
                                        hapticLight();
                                        setQuantity((q) => q - 1);
                                    }
                                }}
                            >
                                <Icon name="minus" size={18} color={quantity > 1 ? colors.text : COLORS.textLight} />
                            </Pressable>
                            <Text style={[styles.qtyValue, { color: colors.text }]}>{quantity}</Text>
                            <Pressable
                                style={styles.qtyBtn}
                                onPress={() => {
                                    hapticLight();
                                    setQuantity((q) => q + 1);
                                }}
                            >
                                <Icon name="plus" size={18} color={colors.text} />
                            </Pressable>
                        </View>
                    </View>

                    {/* Thông báo thêm giỏ hàng thành công */}
                    {addedToast && (
                        <View style={styles.toast}>
                            <Icon name="check-circle" size={18} color={COLORS.success} />
                            <Text style={styles.toastText}>  Đã thêm {quantity} sản phẩm vào giỏ hàng!</Text>
                        </View>
                    )}

                    <ShopButton
                        title={`Thêm vào giỏ (${formattedPrice})`}
                        onPress={handleAddToCart}
                        style={styles.buyBtn}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { padding: SIZES.padding },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
    imageWrapper: {
        width: '100%',
        height: 300,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginBottom: 16,
    },
    image: { width: '100%', height: '100%' },
    card: {
        padding: 18,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    categoryBadge: {
        backgroundColor: '#FFF0F6',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    categoryText: { fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase' },
    name: { fontSize: SIZES.h2, fontWeight: 'bold', marginBottom: 8 },
    price: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.primary, marginBottom: 6 },
    idNote: { fontSize: SIZES.body2, color: COLORS.textLight, marginBottom: 16 },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: 16,
    },
    quantityLabel: { fontSize: 14, fontWeight: '600' },
    quantityBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    qtyBtn: { paddingHorizontal: 12, paddingVertical: 6 },
    qtyValue: { fontSize: 15, fontWeight: '700', minWidth: 28, textAlign: 'center' },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6FFED',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#B7EB8F',
    },
    toastText: { color: '#389E0D', fontSize: 13, fontWeight: '600' },
    buyBtn: { marginTop: 4 },
    notFound: { fontSize: SIZES.body1, color: COLORS.error, textAlign: 'center', marginBottom: 8 },
    hint: { fontSize: SIZES.body2, color: COLORS.textLight, textAlign: 'center' },
});

export default ProductDetailScreen;