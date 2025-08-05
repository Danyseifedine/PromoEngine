import { api } from '../lib/api';
import { ENDPOINTS } from '../config/api';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, User } from '../types/auth';

export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
        return response.data;
    },

    /**
     * Register new user
     */
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    /**
     * Get current user
     */
    async me(): Promise<ApiResponse<{ user: User }>> {
        const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
        return response.data;
    },

    /**
     * Logout current user
     */
    async logout(): Promise<ApiResponse> {
        const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.LOGOUT, {});
        return response.data;
    },

    /**
     * Logout from all devices
     */
    async logoutAll(): Promise<ApiResponse> {
        const response = await api.post<ApiResponse>('/auth/logout-all', {});
        return response.data;
    },
};
