import { api } from "@/lib/api";
import { ENDPOINTS } from "@/config/api";
import { ApiResponse } from "@/types/auth";
import { ProductsManagement, Product, ProductFormData } from "@/types/admin";

export const getProducts = async (search?: string): Promise<ApiResponse<ProductsManagement>> => {
    let url = ENDPOINTS.ADMIN.PRODUCTS.GET;
    if (search && search.trim()) {
        url += `?search=${encodeURIComponent(search.trim())}`;
    }
    const response = await api.get(url);
    
    // Transform the API response to match the expected ProductsManagement structure
    const transformedData: ProductsManagement = {
        data: response.data.data || [],
        meta: response.data.meta || {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
        }
    };
    
    return {
        success: response.data.success,
        data: transformedData
    };
};

export const createProduct = async (data: ProductFormData): Promise<ApiResponse<Product>> => {
    const response = await api.post<ApiResponse<Product>>(ENDPOINTS.ADMIN.PRODUCTS.CREATE, data);
    return response.data;
};

export const getProduct = async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(
        ENDPOINTS.ADMIN.PRODUCTS.GET_ONE.replace('{id}', id)
    );
    return response.data;
};

export const updateProduct = async (id: string, data: ProductFormData): Promise<ApiResponse<Product>> => {
    const response = await api.put<ApiResponse<Product>>(
        ENDPOINTS.ADMIN.PRODUCTS.UPDATE.replace('{id}', id), 
        data
    );
    return response.data;
};

export const deleteProduct = async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete<ApiResponse<any>>(
        ENDPOINTS.ADMIN.PRODUCTS.DELETE.replace('{id}', id)
    );
    return response.data;
};