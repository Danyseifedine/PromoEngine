import { api } from "@/lib/api";
import { ENDPOINTS } from "@/config/api";
import { ApiResponse, User } from "@/types/auth";
import { UsersManagement } from "@/types/admin";


export const getUsers = async (search?: string): Promise<ApiResponse<UsersManagement>> => {
    let url = ENDPOINTS.ADMIN.USERS.GET;
    if (search && search.trim()) {
        url += `?search=${encodeURIComponent(search.trim())}`;
    }
    const response = await api.get<ApiResponse<UsersManagement>>(url);
    return response.data;
}

export const deleteUser = async (id: string): Promise<ApiResponse<UsersManagement>> => {
    const response = await api.delete<ApiResponse<UsersManagement>>(ENDPOINTS.ADMIN.USERS.DELETE.replace('{id}', id));
    return response.data;
}

export const updateUser = async (id: string, data: User): Promise<ApiResponse<UsersManagement>> => {
    const response = await api.put<ApiResponse<UsersManagement>>(ENDPOINTS.ADMIN.USERS.UPDATE.replace('{id}', id), data);
    return response.data;
}