import { api } from "@/lib/api";
import { CartResponse } from '../types/admin';

export const getCart = async (): Promise<CartResponse> => {
    const response = await api.get('/cart');
    return response.data;
};

export const addToCart = async (productId: number, quantity: number = 1): Promise<void> => {
    await api.post('/cart/add', {
        product_id: productId,
        quantity
    });
};

export const updateCartItem = async (cartItemId: number, quantity: number): Promise<void> => {
    await api.put(`/cart/items/${cartItemId}`, {
        quantity
    });
};

export const removeFromCart = async (cartItemId: number): Promise<void> => {
    await api.delete(`/cart/items/${cartItemId}`);
};

export const clearCart = async (): Promise<void> => {
    await api.delete('/cart/clear');
};