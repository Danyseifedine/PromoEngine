import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductsManagement, Product, ProductFormData } from '../types/admin';
import { 
    getProducts as fetchProducts, 
    createProduct as apiCreateProduct,
    updateProduct as apiUpdateProduct,
    deleteProduct as apiDeleteProduct 
} from '../services/admin/productService';

// Define the store state type
interface ProductManagementStoreState {
    products: ProductsManagement | null;
    isLoading: boolean;
    error: string | null;
    getProducts: (search?: string) => Promise<ProductsManagement>;
    createProduct: (data: ProductFormData) => Promise<void>;
    updateProduct: (id: string, data: ProductFormData) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useProductManagementStore = create<ProductManagementStoreState>()(
    persist(
        (set, get) => ({
            // Initial State
            products: null,
            isLoading: false,
            error: null,

            // Actions
            getProducts: async (search?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetchProducts(search);
                    console.log('Products API Response:', response);
                    set({ products: response.data, isLoading: false, error: null });
                    return response.data;
                } catch (error: any) {
                    console.error('Error fetching products:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to fetch products',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            createProduct: async (data: ProductFormData) => {
                set({ isLoading: true, error: null });
                try {
                    await apiCreateProduct(data);
                    set({ isLoading: false, error: null });
                    // Refresh products list
                    await get().getProducts();
                } catch (error: any) {
                    console.error('Error creating product:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to create product',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            updateProduct: async (id: string, data: ProductFormData) => {
                set({ isLoading: true, error: null });
                try {
                    await apiUpdateProduct(id, data);
                    set({ isLoading: false, error: null });
                    // Refresh products list
                    await get().getProducts();
                } catch (error: any) {
                    console.error('Error updating product:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to update product',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            deleteProduct: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    await apiDeleteProduct(id);
                    set({ isLoading: false, error: null });
                    // Refresh products list
                    await get().getProducts();
                } catch (error: any) {
                    console.error('Error deleting product:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to delete product',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'product-management-store',
            partialize: (state) => ({
                products: state.products,
            }),
        }
    )
);