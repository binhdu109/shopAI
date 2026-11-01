import axiosClient from '@api/axiosClient';
import type { CartItem } from '@store/useCartStore';
import type { OrderRecord } from '../types/order';

type ApiOrder = {
    id: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    status: 'PENDING' | 'PAID';
    createdAt: string;
    items: {
        id: string;
        productId: string;
        productName: string;
        image: string;
        category: string;
        quantity: number;
        price: number;
    }[];
};

type Coordinates = { latitude: number; longitude: number } | null;

const toOrderRecord = (order: ApiOrder): OrderRecord => ({
    id: order.id,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
        id: item.productId,
        name: item.productName,
        image: item.image,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
    })),
});

export async function createOrder(
    items: CartItem[],
    total: number,
    coordinates: Coordinates,
): Promise<OrderRecord> {
    const response = await axiosClient.post<ApiOrder>('/api/orders', {
        items: items.map(({ id, quantity }) => ({ productId: id, quantity })),
        total,
        ...(coordinates ?? {}),
    });
    return toOrderRecord(response.data);
}

export async function getOrders(): Promise<OrderRecord[]> {
    const response = await axiosClient.get<ApiOrder[]>('/api/orders');
    return response.data.map(toOrderRecord);
}

export async function getOrder(orderId: string): Promise<OrderRecord> {
    const response = await axiosClient.get<ApiOrder>(`/api/orders/${encodeURIComponent(orderId)}`);
    return toOrderRecord(response.data);
}

export async function payOrder(orderId: string): Promise<OrderRecord> {
    const response = await axiosClient.post<ApiOrder>(
        `/api/orders/${encodeURIComponent(orderId)}/pay`,
    );
    return toOrderRecord(response.data);
}
