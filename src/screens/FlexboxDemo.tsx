// src/screens/FlexboxDemo.tsx
// Màn hình Demo trực quan hóa Flexbox React Native theo Chương 4 (Mục 4.1.0)
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const Box = ({
    label,
    color = '#4F46E5',
}: {
    label: string | number;
    color?: string;
}) => (
    <View style={[styles.box, { backgroundColor: color }]}>
        <Text style={styles.boxText}>{label}</Text>
    </View>
);

const JUSTIFY_OPTIONS = [
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
] as const;

type AlignType = 'flex-start' | 'center' | 'flex-end' | 'stretch';

const ALIGN_OPTIONS: AlignType[] = [
    'flex-start',
    'center',
    'flex-end',
    'stretch',
];

export default function FlexboxDemo() {
    const [justify, setJustify] = useState<(typeof JUSTIFY_OPTIONS)[number]>('flex-start');
    const [align, setAlign] = useState<AlignType>('stretch');

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* ===== DEMO 1: flexDirection column (mặc định) ===== */}
            <Text style={styles.sectionTitle}>1. flexDirection: 'column' (mặc định)</Text>
            <View style={[styles.demoFrame, { flexDirection: 'column' }]}>
                <Box label={1} />
                <Box label={2} />
                <Box label={3} />
            </View>

            {/* ===== DEMO 2: flexDirection row ===== */}
            <Text style={styles.sectionTitle}>2. flexDirection: 'row'</Text>
            <View style={[styles.demoFrame, { flexDirection: 'row' }]}>
                <Box label={1} />
                <Box label={2} />
                <Box label={3} />
            </View>

            {/* ===== DEMO 3: justifyContent (có nút bấm đổi giá trị) ===== */}
            <Text style={styles.sectionTitle}>
                3. justifyContent (Trục Chính) — đang là: {justify}
            </Text>
            <View style={styles.toggleRow}>
                {JUSTIFY_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.toggleBtn, justify === option && styles.toggleBtnActive]}
                        onPress={() => setJustify(option)}
                    >
                        <Text style={[styles.toggleText, justify === option && styles.toggleTextActive]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={[styles.demoFrame, { flexDirection: 'row', justifyContent: justify }]}>
                <Box label={1} />
                <Box label={2} />
                <Box label={3} />
            </View>

            {/* ===== DEMO 4: alignItems (có nút bấm đổi giá trị) ===== */}
            <Text style={styles.sectionTitle}>
                4. alignItems (Trục Phụ) — đang là: {align}
            </Text>
            <View style={styles.toggleRow}>
                {ALIGN_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.toggleBtn, align === option && styles.toggleBtnActive]}
                        onPress={() => setAlign(option)}
                    >
                        <Text style={[styles.toggleText, align === option && styles.toggleTextActive]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View
                style={[
                    styles.demoFrame,
                    styles.tallFrame,
                    { flexDirection: 'row', alignItems: align },
                ]}
            >
                <Box label={1} />
                <Box label={2} />
                <Box label={3} />
            </View>

            {/* ===== DEMO 5: flex: 1 vs flex: 2 (chia tỉ lệ) ===== */}
            <Text style={styles.sectionTitle}>5. flex: 1 vs flex: 2 (chia tỉ lệ không gian)</Text>
            <View style={[styles.demoFrame, { flexDirection: 'row', height: 80 }]}>
                <View style={[styles.flexBox, { flex: 1, backgroundColor: '#F59E0B' }]}>
                    <Text style={styles.boxText}>flex: 1</Text>
                </View>
                <View style={[styles.flexBox, { flex: 2, backgroundColor: '#EF4444' }]}>
                    <Text style={styles.boxText}>flex: 2</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 8,
        color: '#111827',
    },
    demoFrame: {
        minHeight: 90,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
        padding: 8,
    },
    tallFrame: {
        minHeight: 140,
    },
    box: {
        width: 56,
        height: 56,
        marginRight: 6,
        marginBottom: 6,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    flexBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
        borderRadius: 6,
    },
    toggleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    toggleBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
        marginRight: 6,
        marginBottom: 6,
    },
    toggleBtnActive: {
        backgroundColor: '#4F46E5',
    },
    toggleText: {
        fontSize: 12,
        color: '#374151',
    },
    toggleTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
