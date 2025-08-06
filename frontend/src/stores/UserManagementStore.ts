
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UsersManagement } from '../types/admin';
import { deleteUser, getUsers as fetchUsers, updateUser } from '../services/admin/userService';
import { User } from '@/types/auth';

// Define the store state type
interface UserManagementStoreState {
    users: UsersManagement | null;
    isLoading: boolean;
    error: string | null;
    getUsers: (search?: string) => Promise<UsersManagement>;
    updateUser: (id: string, data: User) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export const useUserManagementStore = create<UserManagementStoreState>()(
    persist(
        (set) => ({
            // Initial State
            users: null,
            isLoading: false,
            error: null,

            // Actions
            getUsers: async (search?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetchUsers(search);
                    console.log('Users API Response:', response);
                    set({ users: response.data, isLoading: false, error: null });
                    return response.data;
                } catch (error: any) {
                    console.error('Error fetching users:', error);
                    set({
                        error: error?.message || 'Failed to fetch users',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // Update User
            updateUser: async (id: string, data: User): Promise<void> => {
                set({ isLoading: true, error: null });
                try {
                    const response = await updateUser(id, data);
                    set({ users: response.data, isLoading: false, error: null });
                } catch (error: any) {
                    set({
                        error: error?.message || 'Failed to update user',
                        isLoading: false,
                    });
                }
            },

            deleteUser: async (id: string): Promise<void> => {

                set({ isLoading: true, error: null });
                try {
                    const response = await deleteUser(id);
                    set({ users: response.data, isLoading: false, error: null });
                } catch (error: any) {
                    set({
                        error: error?.message || 'Failed to delete user',
                        isLoading: false,
                    });
                }
            },

        }),
        {
            name: 'user-management-store',
            partialize: (state) => ({
                users: state.users,
                isLoading: state.isLoading,
                error: state.error,
            }),
        }
    )
);