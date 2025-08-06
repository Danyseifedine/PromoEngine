import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define promotion rule types
export interface PromotionRule {
    id: number;
    name: string;
    salience: number;
    stackable: boolean;
    active: boolean;
    valid_from: string | null;
    valid_until: string | null;
    conditions: any[];
    actions: any[];
    visual_data?: string;
    created_at: string;
    updated_at: string;
}

export interface PromotionRulesResponse {
    data: PromotionRule[];
    total: number;
}

// Define the store state type
interface PromotionRulesStoreState {
    promotionRules: PromotionRulesResponse | null;
    isLoading: boolean;
    error: string | null;
    getPromotionRules: (search?: string) => Promise<PromotionRulesResponse>;
    deletePromotionRule: (id: string) => Promise<void>;
    clearError: () => void;
}

export const usePromotionRulesStore = create<PromotionRulesStoreState>()(
    persist(
        (set, get) => ({
            // Initial State
            promotionRules: null,
            isLoading: false,
            error: null,

            // Actions
            getPromotionRules: async (search?: string) => {
                set({ isLoading: true, error: null });
                try {
                    // Import service functions dynamically to avoid circular imports
                    const { getPromotionRules: fetchPromotionRules } = await import('../services/promotionRulesService');
                    const response = await fetchPromotionRules(search);
                    console.log('Promotion Rules API Response:', response);
                    set({ promotionRules: response, isLoading: false, error: null });
                    return response;
                } catch (error: any) {
                    console.error('Error fetching promotion rules:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to fetch promotion rules',
                        isLoading: false,
                    });
                    throw error;
                }
            },


            deletePromotionRule: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const { deletePromotionRule: apiDeletePromotionRule } = await import('../services/promotionRulesService');
                    await apiDeletePromotionRule(id);
                    set({ isLoading: false, error: null });
                    // Refresh promotion rules list
                    await get().getPromotionRules();
                } catch (error: any) {
                    console.error('Error deleting promotion rule:', error);
                    set({
                        error: error?.response?.data?.message || error?.message || 'Failed to delete promotion rule',
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
            name: 'promotion-rules-store',
            partialize: (state) => ({
                promotionRules: state.promotionRules,
            }),
        }
    )
);