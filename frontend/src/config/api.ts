/** 
 * API Configuration
 * 
 * @description This file contains the configuration for the API.
*/
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',

    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
}

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        // REFRESH: '/auth/refresh',
        // FORGOT_PASSWORD: '/auth/forgot-password', // Not implemented (NOT NEEDED FOR NOW)
    },
    ADMIN: {
        STATS: '/admin/stats',
    }
}

