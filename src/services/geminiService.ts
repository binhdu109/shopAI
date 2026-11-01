import axios from 'axios';
import axiosClient from '@api/axiosClient';

export type ChatTurn = {
    role: 'user' | 'model';
    parts?: { text: string }[];
    text?: string;
};

export const askShopAI = async (question: string, history: ChatTurn[] = []): Promise<string> => {
    const response = await axiosClient.post<{ reply: string }>('/api/ai/chat', {
        message: question,
        history: history.slice(-20).map((turn) => ({
            role: turn.role,
            text: turn.parts?.[0]?.text ?? turn.text ?? '',
        })),
    });
    const text = response.data.reply;
    if (typeof text !== 'string' || !text.trim()) {
        throw new Error('AI không trả lời được câu này (có thể đã bị bộ lọc an toàn chặn).');
    }
    return text.trim();
};

export const toFriendlyError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        if (Array.isArray(serverMessage)) return serverMessage.join(', ');
        if (typeof serverMessage === 'string') return serverMessage;
        if (!error.response) return 'Không kết nối được máy chủ ShopAI. Hãy kiểm tra Server và thử lại nhé.';
    }
    const msg = error instanceof Error ? error.message : String(error);

    if (msg.includes('bộ lọc an toàn')) return msg;

    return 'Trợ lý gặp sự cố tạm thời. Bạn thử lại giúp mình nhé.';
};