import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product.schema';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    totalQuantity: () => number;
    totalPrice: () => number;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                set((state) => {
                    const existing = state.items.find((item) => item.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                            ),
                        };
                    }
                    return { items: [...state.items, { ...product, quantity: 1 }] };
                });
            },
            removeItem: (productId) => {
                set((state) => ({ items: state.items.filter((item) => item.id !== productId) }));
            },
            totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'shopai-cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ items: state.items }) as CartState,
        }
    )
);