import type { CartItem } from '@store/useCartStore';

export type PaymentStatus = 'PENDING' | 'PAID';

export interface OrderRecord {
    id: string;
    items: CartItem[];
    subtotal?: number;
    shippingFee?: number;
    total: number;
    status: PaymentStatus;
    createdAt: string;
}
