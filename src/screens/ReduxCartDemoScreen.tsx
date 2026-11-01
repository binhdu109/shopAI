import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '@store/redux/cartSlice';
import type { ReduxRootState } from '@store/redux/store';
import ShopButton from '@components/ShopButton';
import { MOCK_PRODUCTS } from '@data/mockProducts';

const ReduxCartDemoScreen = () => {
    const items = useSelector((state: ReduxRootState) => state.cartRedux.items);
    const dispatch = useDispatch();

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                [Demo Bắt Buộc Đề Cương] Redux Toolkit Cart
            </Text>

            <ShopButton
                title="Thêm sản phẩm mẫu vào Redux Cart"
                onPress={() => dispatch(addItem(MOCK_PRODUCTS[0]))}
                style={{ marginBottom: 16 }}
            />

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text>{item.name} x {item.quantity}</Text>
                        <ShopButton title="Xóa" onPress={() => dispatch(removeItem(item.id))} style={{ width: 70, height: 32 }} />
                    </View>
                )}
                ListEmptyComponent={<Text style={{ color: '#999' }}>Chưa có sản phẩm nào trong Redux Cart demo.</Text>}
            />
        </SafeAreaView>
    );
};

export default ReduxCartDemoScreen;