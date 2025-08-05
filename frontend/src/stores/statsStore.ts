import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stats } from '../types/admin';
import { getStats as fetchStats } from '../services/admin/statsService';

// Define the store state type
interface StatsStoreState {
    stats: Stats | null;
    isLoading: boolean;
    error: string | null;
    getStats: () => Promise<void>;
}

export const useStatsStore = create<StatsStoreState>()(
    persist(
        (set) => ({
            // Initial State
            stats: null,
            isLoading: false,
            error: null,

            // Actions
            getStats: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetchStats();
                    set({ stats: response.data, isLoading: false, error: null });
                } catch (error: any) {
                    set({
                        error: error?.message || 'Failed to fetch stats',
                        isLoading: false,
                    });
                }
            },
        }),
        {
            name: 'stats-store',
            partialize: (state) => ({
                stats: state.stats,
                isLoading: state.isLoading,
                error: state.error,
            }),
        }
    )
);