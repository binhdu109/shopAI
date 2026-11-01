import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    TextInput,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import ProductCard from '@components/ProductCard';
import ShopButton from '@components/ShopButton';
import LocationBadge from '@components/LocationBadge';
import { COLORS, SIZES } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';
import { useDebounce } from '@hooks/useDebounce';
import { Product, ProductListSchema } from '../types/product.schema';
import axiosClient from '@api/axiosClient';
import { API_BASE_URL } from '@constants/api';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';
import type { MainTabParamList } from '@navigation/MainTabNavigator';

type HomeScreenNavProp = NativeStackScreenProps<HomeStackParamList, 'Home'>;
type HomeScreenTabProp = BottomTabScreenProps<MainTabParamList>;
type Props = CompositeScreenProps<HomeScreenNavProp, HomeScreenTabProp>;

const PAGE_SIZE = 8;
const CATEGORIES = ['Tất cả', 'Tai nghe', 'Điện thoại', 'Đồng hồ', 'Laptop', 'Phụ kiện'] as const;
type CategoryTab = typeof CATEGORIES[number];

interface ProductPage {
    items: Product[];
    nextPage: number | null;
}

class ZodValidationError extends Error { }
class NetworkError extends Error { }

const fetchProductsPage = async ({ pageParam, queryKey }: { pageParam: number; queryKey: any }): Promise<ProductPage> => {
    const category = queryKey[1] as CategoryTab | undefined;
    let response;
    try {
        response = await axiosClient.get<unknown>('/api/products');
    } catch (error) {
        throw new NetworkError(error instanceof Error ? error.message : 'Không kết nối được Backend');
    }

    const result = ProductListSchema.safeParse(response.data);
    if (!result.success) {
        console.error('❌ Zod chặn dữ liệu sản phẩm từ NestJS:', result.error.format());
        throw new ZodValidationError('Dữ liệu sản phẩm từ Server không hợp lệ (Zod validation failed)!');
    }

    const categoryUpper = category?.toUpperCase();
    const sourceProducts =
        !categoryUpper || categoryUpper === 'TẤT CẢ'
            ? result.data
            : result.data.filter((item) =>
                  item.category?.toUpperCase().includes(categoryUpper) ||
                  categoryUpper.includes(item.category?.toUpperCase() ?? ''),
              );
    const start = (pageParam - 1) * PAGE_SIZE;
    const items = sourceProducts.slice(start, start + PAGE_SIZE);
    const hasMore = start + PAGE_SIZE < sourceProducts.length;
    return { items, nextPage: hasMore ? pageParam + 1 : null };
};

type PriceFilter = 'all' | 'under1m' | '1mto5m' | 'above5m';
type SortOrder = 'default' | 'asc' | 'desc';

const HomeScreen = ({ navigation, route }: Props) => {
    const scannedCode = route.params?.scannedCode;
    const { colors, isDark, toggleTheme } = useTheme();

    // Category Tab State
    const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('Tất cả');

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [selectedPriceFilter, setSelectedPriceFilter] = useState<PriceFilter>('all');
    const [selectedSort, setSelectedSort] = useState<SortOrder>('default');

    // Temp state for modal
    const [tempPriceFilter, setTempPriceFilter] = useState<PriceFilter>('all');
    const [tempSort, setTempSort] = useState<SortOrder>('default');

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['productsInfinite', selectedCategory],
        queryFn: fetchProductsPage,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    const {
        data: health,
        isError: isHealthError,
        isPending: isHealthPending,
    } = useQuery({
        queryKey: ['health'],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/api/health`);
            if (!response.ok) {
                throw new Error(`Health check failed with HTTP ${response.status}`);
            }

            const result: unknown = await response.json();
            if (
                typeof result !== 'object' ||
                result === null ||
                !('status' in result) ||
                result.status !== 'ok'
            ) {
                throw new Error('Health check returned an invalid status');
            }
            return result;
        },
        retry: false,
        refetchInterval: 30_000,
    });

    const allProducts = useMemo(() => {
        return data?.pages.flatMap((page) => page.items) ?? [];
    }, [data]);

    // Client-side Search, Price Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        // 1. Filter by search keyword
        if (debouncedSearch.trim()) {
            const query = debouncedSearch.toLowerCase().trim();
            result = result.filter(item =>
                item.name.toLowerCase().includes(query) ||
                (item.category && item.category.toLowerCase().includes(query))
            );
        }

        // 2. Filter by price range
        if (selectedPriceFilter === 'under1m') {
            result = result.filter(item => item.price < 1000000);
        } else if (selectedPriceFilter === '1mto5m') {
            result = result.filter(item => item.price >= 1000000 && item.price <= 5000000);
        } else if (selectedPriceFilter === 'above5m') {
            result = result.filter(item => item.price > 5000000);
        }

        // 3. Sort
        if (selectedSort === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (selectedSort === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [allProducts, debouncedSearch, selectedPriceFilter, selectedSort]);

    const activeFilterCount = (selectedPriceFilter !== 'all' ? 1 : 0) + (selectedSort !== 'default' ? 1 : 0);

    const openFilterModal = () => {
        setTempPriceFilter(selectedPriceFilter);
        setTempSort(selectedSort);
        setIsFilterModalVisible(true);
    };

    const applyFilter = () => {
        setSelectedPriceFilter(tempPriceFilter);
        setSelectedSort(tempSort);
        setIsFilterModalVisible(false);
    };

    const resetFilter = () => {
        setTempPriceFilter('all');
        setTempSort('default');
        setSelectedPriceFilter('all');
        setSelectedSort('default');
        setIsFilterModalVisible(false);
    };

    const errorMessage =
        error instanceof ZodValidationError
            ? '⚠️ Dữ liệu sản phẩm từ Server không hợp lệ — báo kỹ thuật viên!'
            : '📡 Không kết nối được ShopAI Backend. Hãy kiểm tra Server và địa chỉ API.';
    const isServerOnline = health?.status === 'ok';
    const serverStatusLabel = isServerOnline
        ? 'Máy chủ online'
        : isHealthPending
          ? 'Đang kiểm tra máy chủ'
          : 'Máy chủ offline';

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header (Khớp mẫu) */}
                <View style={[styles.header, { backgroundColor: colors.surface }]}>
                    <View>
                    <View style={styles.brandTitleRow}>
                        <Text style={[styles.headerTitle, { color: COLORS.primary }]}>ShopAI</Text>
                        <View
                            accessibilityRole="image"
                            accessibilityLabel={serverStatusLabel}
                            style={[
                                styles.healthDot,
                                {
                                    backgroundColor: isServerOnline
                                        ? COLORS.success
                                        : isHealthError
                                          ? COLORS.error
                                          : colors.textLight,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.headerSub, { color: colors.textLight }]}>
                        {filteredProducts.length} sản phẩm · {serverStatusLabel}
                    </Text>
                    </View>

                    <View style={styles.headerRightActions}>
                        {/* Quick action: Hỏi AI */}
                        <TouchableOpacity
                            style={[styles.circleActionBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F0F2F5' }]}
                            onPress={() => navigation.navigate('AIChat')}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text style={styles.circleActionIcon}>🤖</Text>
                        </TouchableOpacity>

                        {/* Quick action: Quét mã */}
                        <TouchableOpacity
                            style={[styles.circleActionBtn, { backgroundColor: isDark ? '#2A2A2A' : '#F0F2F5' }]}
                            onPress={() => navigation.navigate('Scanner')}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text style={styles.circleActionIcon}>📷</Text>
                        </TouchableOpacity>

                        {/* Dark/Light mode moon button (khớp mẫu) */}
                        <TouchableOpacity
                            style={[styles.moonButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFF9E6' }]}
                            onPress={toggleTheme}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.moonIcon}>{isDark ? '☀️' : '🌙'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location Badge */}
                <LocationBadge />

                {/* Search Bar & Filter Button (Khớp mẫu) */}
                <View style={[styles.searchBarRow, { backgroundColor: colors.surface }]}>
                    <View style={[styles.searchInputContainer, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F7' }]}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Tìm kiếm tai nghe, điện thoại..."
                            placeholderTextColor={colors.textLight}
                            style={[styles.searchInput, { color: colors.text }]}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                <Text style={[styles.clearIcon, { color: colors.textLight }]}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={openFilterModal}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.filterButtonText}>
                            ⚙️ Lọc{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Horizontal Category Tabs (Khớp mẫu) */}
                <View style={[styles.categoryScrollContainer, { backgroundColor: colors.surface }]}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryScrollContent}
                    >
                        {CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        isSelected
                                            ? styles.categoryChipActive
                                            : [styles.categoryChipInactive, { backgroundColor: isDark ? '#2A2A2A' : '#F0F2F5' }],
                                    ]}
                                    onPress={() => setSelectedCategory(cat)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            isSelected
                                                ? styles.categoryChipTextActive
                                                : [styles.categoryChipTextInactive, { color: colors.text }],
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {scannedCode && (
                    <View style={{ backgroundColor: '#FFFBE6', borderColor: '#FFE58F', borderWidth: 1, padding: 8, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: '#D48806', fontSize: 12 }}>Mã vừa quét: {scannedCode}</Text>
                    </View>
                )}

                {isLoading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />}
                {isError && <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>{errorMessage}</Text>}

                {/* Product Grid (2 columns) */}
                {!isLoading && (
                    filteredProducts.length > 0 ? (
                        <FlashList
                            data={filteredProducts}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
                                    <ProductCard product={item} />
                                </Pressable>
                            )}
                            numColumns={2}
                            contentContainerStyle={{ padding: SIZES.padding }}
                            refreshing={isRefetching}
                            onRefresh={refetch}
                            onEndReached={() => {
                                if (hasNextPage && !isFetchingNextPage && !searchQuery.trim() && selectedPriceFilter === 'all') {
                                    fetchNextPage();
                                }
                            }}
                            onEndReachedThreshold={0.5}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={
                                isFetchingNextPage ? (
                                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 16 }} />
                                ) : null
                            }
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyEmoji}>🔎</Text>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>Không tìm thấy sản phẩm</Text>
                            <Text style={[styles.emptySub, { color: colors.textLight }]}>
                                Không có sản phẩm nào thuộc danh mục "{selectedCategory}" khớp với tìm kiếm.
                            </Text>
                            {(searchQuery || selectedCategory !== 'Tất cả' || activeFilterCount > 0) && (
                                <ShopButton
                                    title="Xóa bộ lọc & tìm kiếm"
                                    onPress={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('Tất cả');
                                        resetFilter();
                                    }}
                                    style={{ marginTop: 16, width: 200 }}
                                    variant="outline"
                                />
                            )}
                        </View>
                    )
                )}

                {/* Filter Modal / Bottom Sheet */}
                <Modal
                    visible={isFilterModalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setIsFilterModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                            {/* Modal Header */}
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Bộ Lọc Nâng Cao</Text>
                                <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                                    <Text style={[styles.modalClose, { color: colors.textLight }]}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Section: Khoảng giá */}
                            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Khoảng Giá</Text>
                            <View style={styles.chipRow}>
                                {[
                                    { label: 'Tất cả', value: 'all' as PriceFilter },
                                    { label: 'Dưới 1 triệu', value: 'under1m' as PriceFilter },
                                    { label: '1 triệu - 5 triệu', value: '1mto5m' as PriceFilter },
                                    { label: 'Trên 5 triệu', value: 'above5m' as PriceFilter },
                                ].map((chip) => (
                                    <TouchableOpacity
                                        key={chip.value}
                                        style={[
                                            styles.chip,
                                            tempPriceFilter === chip.value
                                                ? [styles.chipSelected, { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]
                                                : { borderColor: isDark ? '#444' : '#E0E0E0' },
                                        ]}
                                        onPress={() => setTempPriceFilter(chip.value)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                { color: tempPriceFilter === chip.value ? '#FFFFFF' : colors.text },
                                            ]}
                                        >
                                            {chip.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Section: Sắp xếp */}
                            <Text style={[styles.filterSectionTitle, { color: colors.text, marginTop: 16 }]}>Sắp Xếp Giá</Text>
                            <View style={styles.chipRow}>
                                {[
                                    { label: 'Mặc định', value: 'default' as SortOrder },
                                    { label: 'Giá: Thấp → Cao ⬆️', value: 'asc' as SortOrder },
                                    { label: 'Giá: Cao → Thấp ⬇️', value: 'desc' as SortOrder },
                                ].map((chip) => (
                                    <TouchableOpacity
                                        key={chip.value}
                                        style={[
                                            styles.chip,
                                            tempSort === chip.value
                                                ? [styles.chipSelected, { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]
                                                : { borderColor: isDark ? '#444' : '#E0E0E0' },
                                        ]}
                                        onPress={() => setTempSort(chip.value)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                { color: tempSort === chip.value ? '#FFFFFF' : colors.text },
                                            ]}
                                        >
                                            {chip.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Modal Action Buttons */}
                            <View style={styles.modalActions}>
                                <ShopButton
                                    title="Đặt lại"
                                    onPress={resetFilter}
                                    variant="outline"
                                    style={{ flex: 1, marginRight: 8, height: 44 }}
                                />
                                <ShopButton
                                    title="Áp dụng"
                                    onPress={applyFilter}
                                    variant="primary"
                                    style={{ flex: 1, marginLeft: 8, height: 44, backgroundColor: COLORS.primary }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    header: {
        paddingHorizontal: SIZES.padding,
        paddingTop: 12,
        paddingBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    brandTitleRow: { flexDirection: 'row', alignItems: 'center' },
    healthDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 7 },
    headerSub: {
        fontSize: 13,
        marginTop: 2,
    },
    headerRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    circleActionBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleActionIcon: {
        fontSize: 17,
    },
    moonButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moonIcon: {
        fontSize: 18,
    },
    searchBarRow: {
        flexDirection: 'row',
        paddingHorizontal: SIZES.padding,
        paddingVertical: 8,
        gap: 10,
        alignItems: 'center',
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 42,
    },
    searchIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        height: 42,
        fontSize: 14,
        paddingVertical: 0,
    },
    clearIcon: {
        fontSize: 14,
        paddingHorizontal: 4,
    },
    filterButton: {
        paddingHorizontal: 14,
        height: 42,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    categoryScrollContainer: {
        paddingBottom: 8,
    },
    categoryScrollContent: {
        paddingHorizontal: SIZES.padding,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    categoryChipActive: {
        backgroundColor: COLORS.primary,
    },
    categoryChipInactive: {
        backgroundColor: '#F0F2F5',
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
    },
    categoryChipTextInactive: {},
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: 60,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySub: {
        fontSize: SIZES.body2,
        textAlign: 'center',
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 34,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
    },
    modalClose: {
        fontSize: 20,
        padding: 4,
    },
    filterSectionTitle: {
        fontSize: SIZES.body1,
        fontWeight: '600',
        marginBottom: 10,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
    },
    chipSelected: {
        borderColor: 'transparent',
    },
    chipText: {
        fontSize: SIZES.body2,
        fontWeight: '500',
    },
    modalActions: {
        flexDirection: 'row',
        marginTop: 24,
    },
});

export default HomeScreen;
