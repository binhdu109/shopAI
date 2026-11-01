// src/screens/StyleSheetWalkthrough.tsx
// File CHẠY ĐƯỢC theo Chương 3 (Mục 3.2.0)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StyleSheetWalkthrough = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chào mừng đến ShopAI!</Text>

            <View style={styles.button}>
                <Text style={styles.buttonText}>Mua ngay</Text>
            </View>
        </View>
    );
};

// StyleSheet.create LUÔN đặt Ở DƯỚI CÙNG file, BÊN NGOÀI Component
const styles = StyleSheet.create({
    container: {
        flex: 1, // Chiếm toàn bộ chiều cao màn hình
        alignItems: 'center', // Canh giữa các con theo chiều NGANG
        justifyContent: 'center', // Canh giữa các con theo chiều DỌC
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 20, // Cỡ chữ — SỐ THUẦN, KHÔNG có đơn vị 'px'
        color: '#2C3E50', // Màu chữ
        marginBottom: 16,
    },
    button: {
        backgroundColor: 'red', // Màu nền nút
        paddingVertical: 12, // Khoảng đệm trên/dưới bên trong nút
        paddingHorizontal: 24, // Khoảng đệm trái/phải bên trong nút
        borderRadius: 8, // Bo góc
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default StyleSheetWalkthrough;
