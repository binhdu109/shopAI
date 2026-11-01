import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { AI_GREETING, AI_SUGGESTIONS } from '@constants/aiPrompt';
import { askShopAI, toFriendlyError, type ChatTurn } from '@services/geminiService';
import { useTheme } from '@contexts/ThemeContext';
import { hapticLight } from '@utils/haptics';

type Message = {
    id: string;
    text: string;
    isBot: boolean;
    status?: 'sent' | 'error';
};

export default function AIChatScreen() {
    const { colors, isDark } = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        { id: 'greeting', text: AI_GREETING, isBot: true, status: 'sent' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const listRef = useRef<FlatList<Message>>(null);
    const lastQuestionRef = useRef<string>('');

    const scrollToEnd = () => {
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const buildHistory = useCallback((list: Message[]): ChatTurn[] => {
        return list
            .filter((m) => m.id !== 'greeting' && m.status !== 'error')
            .map((m) => ({
                role: m.isBot ? ('model' as const) : ('user' as const),
                parts: [{ text: m.text }],
            }));
    }, []);

    const send = useCallback(
        async (question: string, historySource: Message[]) => {
            lastQuestionRef.current = question;
            setIsTyping(true);
            scrollToEnd();

            try {
                const reply = await askShopAI(question, buildHistory(historySource.slice(0, -1)));
                setMessages((prev) => [
                    ...prev,
                    { id: `bot-${Date.now()}`, text: reply, isBot: true, status: 'sent' },
                ]);
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    { id: `err-${Date.now()}`, text: toFriendlyError(error), isBot: true, status: 'error' },
                ]);
            } finally {
                setIsTyping(false);
                scrollToEnd();
            }
        },
        [buildHistory],
    );

    const handleSend = useCallback(
        (overrideText?: string) => {
            const text = (overrideText ?? inputText).trim();
            if (!text || isTyping) return;

            hapticLight();
            const userMsg: Message = { id: `user-${Date.now()}`, text, isBot: false, status: 'sent' };
            const next = [...messages, userMsg];

            setMessages(next);
            setInputText('');
            send(text, next);
        },
        [inputText, isTyping, messages, send],
    );

    const handleRetry = useCallback(() => {
        if (isTyping || !lastQuestionRef.current) return;
        hapticLight();
        const cleaned = messages.filter((m) => m.status !== 'error');
        setMessages(cleaned);
        send(lastQuestionRef.current, cleaned);
    }, [isTyping, messages, send]);

    const handleClearChat = () => {
        Alert.alert(
            'Xóa lịch sử',
            'Bạn có chắc chắn muốn xóa toàn bộ đoạn hội thoại này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        hapticLight();
                        setMessages([{ id: 'greeting', text: AI_GREETING, isBot: true, status: 'sent' }]);
                    },
                },
            ],
        );
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View>
            <View
                style={[
                    styles.bubble,
                    item.isBot
                        ? [styles.botBubble, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]
                        : styles.userBubble,
                    item.status === 'error' && styles.errorBubble,
                ]}
            >
                <Text
                    selectable
                    style={{
                        color: item.isBot ? (isDark ? '#FFFFFF' : '#1F1F1F') : '#FFFFFF',
                        fontSize: 14,
                        lineHeight: 20,
                    }}
                >
                    {item.text}
                </Text>
            </View>

            {item.status === 'error' && (
                <Pressable onPress={handleRetry} style={styles.retryBtn}>
                    <Text style={styles.retryText}>🔄 Bấm vào đây để thử lại</Text>
                </Pressable>
            )}
        </View>
    );

    const renderSuggestions = () => (
        <View style={styles.suggestBox}>
            <Text style={[styles.suggestTitle, { color: colors.textLight }]}>Gợi ý câu hỏi cho bạn:</Text>
            <View style={styles.chipRow}>
                {AI_SUGGESTIONS.map((s) => (
                    <Pressable
                        key={s}
                        style={[styles.chip, { borderColor: COLORS.primary, backgroundColor: isDark ? '#1F1F1F' : '#FFF0F6' }]}
                        onPress={() => handleSend(s)}
                        disabled={isTyping}
                    >
                        <Text style={styles.chipText}>{s}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );

    const canSend = inputText.trim().length > 0 && !isTyping;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: colors.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Trợ lý AI Gemini</Text>
                        <Text style={styles.headerSub}>{isTyping ? 'Đang soạn câu trả lời...' : 'Sẵn sàng tư vấn'}</Text>
                    </View>
                    {messages.length > 1 && (
                        <Pressable onPress={handleClearChat} style={styles.clearBtn}>
                            <Icon name="trash-can-outline" size={20} color={COLORS.textLight} />
                        </Pressable>
                    )}
                </View>

                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: SIZES.padding, flexGrow: 1 }}
                    onContentSizeChange={scrollToEnd}
                    keyboardShouldPersistTaps="handled"
                    ListFooterComponent={
                        <>
                            {messages.length <= 1 && renderSuggestions()}
                            {isTyping && (
                                <View style={[styles.bubble, styles.botBubble, styles.typingBubble, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]}>
                                    <ActivityIndicator size="small" color={COLORS.primary} />
                                    <Text style={[styles.typingText, { color: colors.textLight }]}>  Trợ lý đang suy nghĩ...</Text>
                                </View>
                            )}
                        </>
                    }
                />

                <View style={[styles.inputArea, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                                color: colors.text,
                            },
                        ]}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Hỏi về cấu hình, tư vấn chọn máy..."
                        placeholderTextColor={COLORS.textLight}
                        maxLength={500}
                        editable={!isTyping}
                        multiline
                        onSubmitEditing={() => handleSend()}
                    />
                    <ShopButton
                        title="Gửi"
                        onPress={() => handleSend()}
                        isLoading={isTyping}
                        disabled={!canSend}
                        style={{ width: 72, height: 40, opacity: canSend ? 1 : 0.5 }}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold' },
    headerSub: { fontSize: 12, color: '#777', marginTop: 2 },
    clearBtn: { padding: 6 },
    bubble: { padding: 14, borderRadius: 18, marginBottom: 10, maxWidth: '82%' },
    botBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    userBubble: { backgroundColor: COLORS.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    errorBubble: { backgroundColor: '#FFE0E0', borderWidth: 1, borderColor: COLORS.error },
    typingBubble: { flexDirection: 'row', alignItems: 'center' },
    typingText: { fontSize: 13 },
    retryBtn: { alignSelf: 'flex-start', marginBottom: 12, paddingHorizontal: 4 },
    retryText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13 },
    suggestBox: { marginTop: 8, marginBottom: 16 },
    suggestTitle: { fontSize: 13, marginBottom: 8, fontWeight: '600' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
    chipText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
    inputArea: { flexDirection: 'row', padding: 10, alignItems: 'flex-end', borderTopWidth: 1 },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 10,
        fontSize: 14,
    },
});