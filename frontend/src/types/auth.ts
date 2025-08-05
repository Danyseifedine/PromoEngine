/**
 * User
 * @description User interface
 */
export interface User {
    id: number;
    name: string;
    email: string;
    type: 'admin' | 'customer';
    created_at: string;
    updated_at: string;
    customer?: Customer;
}

/**
 * Customer
 * @description Customer interface
 */
export interface Customer {
    id: number;
    user_id: number;
    loyalty_tier: string;
    orders_count: number;
    city: string;
    created_at: string;
    user?: User;
}

/**
 * Register Request
 * @description Register request interface
 */
export interface RegisterRequest {
    name: string;
    email: string;
    city: string;
    password: string;
}

/**
 * Login Request
 * @description Login request interface
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Auth Response
 * @description Auth response interface
 */
export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}
/**
 * Auth Error
 * @description Auth error interface
 */
export interface AuthError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

/**
 * Api Response
 * @description Api response interface
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

/**
 * Api Error
 * @description Api error interface
 */
export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    error?: string;
}

/**
 * Auth State
 * @description Auth state interface
 */
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    register: (user: RegisterRequest) => Promise<AuthResponse>;
    login: (user: LoginRequest) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    logoutAll: () => Promise<void>;
    me: () => Promise<void>;
    clearError: () => void;

    // Extra Data
    isAdmin: () => boolean;
    isCustomer: () => boolean;
}
