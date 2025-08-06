import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoriesManagement, CategoryFormData } from '../types/admin';
import { 
    getCategories as fetchCategories, 
    createCategory as apiCreateCategory,
    updateCategory as apiUpdateCategory,
    deleteCategory as apiDeleteCategory 
} from '../services/admin/categoryService';

// Define the store state type
interface CategoryManagementStoreState {
    categories: CategoriesManagement | null;
    isLoading: boolean;
    error: string | null;
    getCategories: (search?: string) => Promise<CategoriesManagement>;
    createCategory: (data: CategoryFormData) => Promise<void>;
    updateCategory: (id: string, data: CategoryFormData) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useCategoryManagementStore = create<CategoryManagementStoreState>()(
    persist(
        (set, get) => ({
            // Initial State
            categories: null,
            isLoading: false,
            error: null,

            // Actions
            getCategories: async (search?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetchCategories(search);
                    console.log('Categories API Response:', response);
                    set({ categories: response.data, isLoading: false, error: null });
                    return response.data;
                } catch (error: any) {
                    console.error('Error fetching categories:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to fetch categories',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            createCategory: async (data: CategoryFormData) => {
                set({ isLoading: true, error: null });
                try {
                    await apiCreateCategory(data);
                    set({ isLoading: false, error: null });
                    // Refresh categories list
                    await get().getCategories();
                } catch (error: any) {
                    console.error('Error creating category:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to create category',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            updateCategory: async (id: string, data: CategoryFormData) => {
                set({ isLoading: true, error: null });
                try {
                    await apiUpdateCategory(id, data);
                    set({ isLoading: false, error: null });
                    // Refresh categories list
                    await get().getCategories();
                } catch (error: any) {
                    console.error('Error updating category:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to update category',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            deleteCategory: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    await apiDeleteCategory(id);
                    set({ isLoading: false, error: null });
                    // Refresh categories list
                    await get().getCategories();
                } catch (error: any) {
                    console.error('Error deleting category:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to delete category',
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
            name: 'category-management-store',
            partialize: (state) => ({
                categories: state.categories,
            }),
        }
    )
);