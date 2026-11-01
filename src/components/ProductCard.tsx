import React, { memo, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { COLORS, SIZES } from '@constants/theme';
import ShopButton from '@components/ShopButton';
import { Product } from '../types/product.schema';
import { useCartStore } from '@store/useCartStore';
import { useTheme } from '@contexts/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SIZES.padding * 3) / 2;

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const addItem = useCartStore((state) => state.addItem);
    const { colors, isDark } = useTheme();
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 400 });
    }, [opacity]);

    const fadeInStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price) + ' đ';

    return (
        <Animated.View
            style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: isDark ? '#2C2C2C' : '#EFEFEF' },
                fadeInStyle,
            ]}
        >
            <View style={[styles.imageWrapper, { backgroundColor: isDark ? '#1F1F1F' : '#F9F9F9' }]}>
                <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.category}>{product.category || 'SẢN PHẨM'}</Text>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                    {product.name}
                </Text>
                <Text style={styles.price}>{formattedPrice}</Text>

                <ShopButton
                    title="Mua ngay"
                    onPress={() => addItem(product)}
                    style={styles.button}
                    textStyle={styles.buttonText}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        marginBottom: SIZES.padding,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        // Đổ bóng nhẹ sang trọng
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    imageWrapper: {
        width: '100%',
        height: CARD_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: 12,
    },
    category: {
        fontSize: 10,
        color: '#8C8C8C',
        fontWeight: '700',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        height: 38,
        lineHeight: 18,
    },
    price: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginVertical: 6,
    },
    button: {
        height: 34,
        borderRadius: 17,
        backgroundColor: COLORS.primary,
        shadowOpacity: 0,
        elevation: 0,
        marginTop: 4,
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '700',
    },
});

export default memo(ProductCard);
