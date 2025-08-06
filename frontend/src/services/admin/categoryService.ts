import { api } from "@/lib/api";
import { ENDPOINTS } from "@/config/api";
import { ApiResponse } from "@/types/auth";
import { CategoriesManagement, Category, CategoryFormData } from "@/types/admin";

export const getCategories = async (search?: string): Promise<ApiResponse<CategoriesManagement>> => {
    let url = ENDPOINTS.ADMIN.CATEGORIES.GET;
    if (search && search.trim()) {
        url += `?search=${encodeURIComponent(search.trim())}`;
    }
    const response = await api.get<ApiResponse<CategoriesManagement>>(url);
    return response.data;
};

export const createCategory = async (data: CategoryFormData): Promise<ApiResponse<Category>> => {
    const response = await api.post<ApiResponse<Category>>(ENDPOINTS.ADMIN.CATEGORIES.CREATE, data);
    return response.data;
};

export const getCategory = async (id: string): Promise<ApiResponse<Category>> => {
    const response = await api.get<ApiResponse<Category>>(
        ENDPOINTS.ADMIN.CATEGORIES.GET_ONE.replace('{id}', id)
    );
    return response.data;
};

export const updateCategory = async (id: string, data: CategoryFormData): Promise<ApiResponse<Category>> => {
    const response = await api.put<ApiResponse<Category>>(
        ENDPOINTS.ADMIN.CATEGORIES.UPDATE.replace('{id}', id), 
        data
    );
    return response.data;
};

export const deleteCategory = async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete<ApiResponse<any>>(
        ENDPOINTS.ADMIN.CATEGORIES.DELETE.replace('{id}', id)
    );
    return response.data;
};