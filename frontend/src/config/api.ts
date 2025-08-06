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
    },
    
    ADMIN: {
        STATS: '/admin/stats',

        USERS: {
            GET: '/admin/users',
            DELETE: '/admin/users/{id}',
            UPDATE: '/admin/users/{id}',
        },

        CATEGORIES: {
            GET: '/admin/categories',
            CREATE: '/admin/categories',
            GET_ONE: '/admin/categories/{id}',
            UPDATE: '/admin/categories/{id}',
            DELETE: '/admin/categories/{id}',
        },

        PRODUCTS: {
            GET: '/admin/products',
            CREATE: '/admin/products',
            GET_ONE: '/admin/products/{id}',
            UPDATE: '/admin/products/{id}',
            DELETE: '/admin/products/{id}',
        },

        PROMOTION_RULES: {
            GET: '/admin/promotion-rules',
            CREATE: '/admin/promotion-rules',
            DELETE: '/admin/promotion-rules/{id}',
        },

    }
}

