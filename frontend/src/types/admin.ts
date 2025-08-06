import { User } from "./auth";

export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface CategoryFormData {
    name: string;
}

export interface CategoriesManagement {
    data: Category[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface Stats {
    total_customers: number;
    total_promotions: number;
    total_products: number;
    total_categories: number;
}

export interface UsersManagement {
    data: User[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface Product {
    id: number;
    name: string;
    category_id: number;
    unit_price: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    category?: Category;
}

export interface ProductFormData {
    name: string;
    category_id: number;
    unit_price: number;
    quantity: number;
}

export interface ProductsManagement {
    data: Product[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
