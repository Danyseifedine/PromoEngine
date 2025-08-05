import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

/**
 * Interceptor for the request
 * @param config - The request config
 * @returns The request config
 * @description This interceptor is used to add the token to the request headers
 */
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
    }
)

/**
 * Interceptor for the response
 * @param response - The response
 * @returns The response
 * @description This interceptor is used to handle the response
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - clear token but don't redirect
            // Let the component handle the redirect
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

/**
 * API Client
 * @description This is the API client for the application
 */

export const api = {
    get: <T>(url: string) => apiClient.get<T>(url),
    post: <T>(url: string, data?: unknown) => apiClient.post<T>(url, data),
    put: <T>(url: string, data?: unknown) => apiClient.put<T>(url, data),
    delete: <T>(url: string) => apiClient.delete<T>(url),
};

// Utility functions for API calls
export const handleApiError = (error: AxiosError) => {
    if (error.response) {
        // Server responded with error status
        return error.response.data as { message: string };
    } else if (error.request) {
        // Request was made but no response received
        return { message: 'Network error - please check your connection' };
    } else {
        // Something else happened
        return { message: 'An unexpected error occurred' };
    }
};

/**
 * Builds a query string from an object
 * @param params - The parameters to build the query string from
 * @returns The query string
 * @description This function builds a query string from an object
 */
export const buildQueryString = (params: Record<string, string | number | boolean | null | undefined>): string => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
        }
    });
    return queryParams.toString();
};

/**
 * API Client
 * @description This is the API client for the application
 */
export default apiClient;