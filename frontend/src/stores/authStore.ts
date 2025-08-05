// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginRequest, RegisterRequest, AuthState } from '../types/auth';
import { authService } from '../services/authService';


export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            login: async (credentials: LoginRequest) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(credentials);

                    // Store token in localStorage
                    localStorage.setItem('token', response.data.token);

                    set({
                        user: response.data.user,
                        token: response.data.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });

                    return response;
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error && 'response' in error
                        ? (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (error as Error).message || 'Login failed'
                        : 'Login failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false
                    });
                    throw error;
                }
            },

            register: async (userData: RegisterRequest) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register(userData);

                    // Store token in localStorage
                    localStorage.setItem('token', response.data.token);

                    set({
                        user: response.data.user,
                        token: response.data.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });

                    return response;
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error && 'response' in error
                        ? (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (error as Error).message || 'Registration failed'
                        : 'Registration failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false
                    });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    // Call API to logout (revoke token)
                    if (get().token) {
                        await authService.logout();
                    }
                } catch (error) {
                    // Even if API call fails, clear local state
                    console.error('Logout API call failed:', error);
                } finally {
                    // Always clear local state
                    localStorage.removeItem('token');

                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
                }
            },

            me: async (): Promise<void> => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.me();

                    set({
                        user: response.data?.user,
                        isLoading: false,
                        error: null
                    });
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error && 'response' in error
                        ? (error as { response?: { data?: { message?: string }; status?: number } }).response?.data?.message || 'Failed to get user data'
                        : 'Failed to get user data';
                    set({
                        error: errorMessage,
                        isLoading: false
                    });

                    // If unauthorized, clear auth state
                    if (error instanceof Error && 'response' in error && (error as { response?: { status?: number } }).response?.status === 401) {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false
                        });
                    }

                    throw error;
                }
            },

            logoutAll: async () => {
                set({ isLoading: true });
                try {
                    // Call API to logout from all devices
                    if (get().token) {
                        await authService.logoutAll();
                    }
                } catch (error) {
                    // Even if API call fails, clear local state
                    console.error('Logout all API call failed:', error);
                } finally {
                    // Always clear local state
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
                }
            },

            clearError: () => {
                set({ error: null });
            },

            // Computed values
            isAdmin: () => {
                const { user } = get();
                return user?.type === 'admin';
            },

            isCustomer: () => {
                const { user } = get();
                return user?.type === 'customer';
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);