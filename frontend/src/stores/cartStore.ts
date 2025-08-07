import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartResponse } from '../types/admin';
import { 
    getCart as fetchCart,
    addToCart as apiAddToCart,
    updateCartItem as apiUpdateCartItem,
    removeFromCart as apiRemoveFromCart,
    clearCart as apiClearCart
} from '../services/cartService';

interface CartStoreState {
    cart: Cart | null;
    totalAmount: number;
    isLoading: boolean;
    error: string | null;
    isCartOpen: boolean;
    
    // Actions
    getCart: () => Promise<void>;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    clearError: () => void;
}

export const useCartStore = create<CartStoreState>()(
    persist(
        (set, get) => ({
            // Initial State
            cart: null,
            totalAmount: 0,
            isLoading: false,
            error: null,
            isCartOpen: false,

            // Actions
            getCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response: CartResponse = await fetchCart();
                    set({ 
                        cart: response.data, 
                        totalAmount: response.total_amount,
                        isLoading: false, 
                        error: null 
                    });
                } catch (error: any) {
                    console.error('Error fetching cart:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to fetch cart',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            addToCart: async (productId: number, quantity: number = 1) => {
                set({ isLoading: true, error: null });
                try {
                    await apiAddToCart(productId, quantity);
                    set({ isLoading: false, error: null });
                    // Refresh cart after adding
                    await get().getCart();
                } catch (error: any) {
                    console.error('Error adding to cart:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to add item to cart',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            updateCartItem: async (cartItemId: number, quantity: number) => {
                set({ isLoading: true, error: null });
                try {
                    await apiUpdateCartItem(cartItemId, quantity);
                    set({ isLoading: false, error: null });
                    // Refresh cart after updating
                    await get().getCart();
                } catch (error: any) {
                    console.error('Error updating cart item:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to update cart item',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            removeFromCart: async (cartItemId: number) => {
                set({ isLoading: true, error: null });
                try {
                    await apiRemoveFromCart(cartItemId);
                    set({ isLoading: false, error: null });
                    // Refresh cart after removing
                    await get().getCart();
                } catch (error: any) {
                    console.error('Error removing from cart:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to remove item from cart',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            clearCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    await apiClearCart();
                    set({ 
                        cart: { ...get().cart!, cart_items: [] }, 
                        totalAmount: 0,
                        isLoading: false, 
                        error: null 
                    });
                } catch (error: any) {
                    console.error('Error clearing cart:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to clear cart',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            openCart: () => {
                set({ isCartOpen: true });
            },

            closeCart: () => {
                set({ isCartOpen: false });
            },

            toggleCart: () => {
                set((state) => ({ isCartOpen: !state.isCartOpen }));
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'cart-store',
            partialize: (state) => ({
                cart: state.cart,
                totalAmount: state.totalAmount,
            }),
        }
    )
);