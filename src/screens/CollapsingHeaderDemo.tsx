// src/screens/CollapsingHeaderDemo.tsx
// Màn hình minh họa Collapsing Header dùng Reanimated 3 theo Chương 4 (Mục 4.4.2)
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import ProductCard from '@components/ProductCard';
import { MOCK_PRODUCTS, Product } from '@data/mockProducts';
import { COLORS, SIZES } from '@constants/theme';

// FlashList bọc bằng createAnimatedComponent để useAnimatedScrollHandler gắn được vào onScroll
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList as any) as React.ComponentType<any>;

const HEADER_MAX_HEIGHT = 180;
const HEADER_MIN_HEIGHT = 64;
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function CollapsingHeaderDemo() {
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const height = interpolate(
            scrollY.value,
            [0, SCROLL_RANGE],
            [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            Extrapolation.CLAMP,
        );
        return { height };
    });

    const titleAnimatedStyle = useAnimatedStyle(() => {
        const fontSize = interpolate(
            scrollY.value,
            [0, SCROLL_RANGE],
            [28, 18],
            Extrapolation.CLAMP,
        );
        const opacity = interpolate(
            scrollY.value,
            [0, SCROLL_RANGE * 0.8],
            [1, 0.5],
            Extrapolation.CLAMP,
        );
        return { fontSize, opacity };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
                <Animated.Text style={[styles.headerTitle, titleAnimatedStyle]}>
                    Khám phá
                </Animated.Text>
            </Animated.View>

            <AnimatedFlashList
                data={MOCK_PRODUCTS}
                keyExtractor={(item: Product) => item.id}
                renderItem={({ item }: { item: Product }) => <ProductCard product={item} />}
                numColumns={2}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{ padding: SIZES.padding / 2 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        justifyContent: 'flex-end',
        paddingHorizontal: SIZES.padding,
        paddingBottom: 16,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
});
