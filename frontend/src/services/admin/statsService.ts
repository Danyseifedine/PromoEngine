import { api } from "@/lib/api";
import { ENDPOINTS } from "@/config/api";
import { ApiResponse } from "@/types/auth";
import { Stats } from "@/types/admin";


const getStats = async (): Promise<ApiResponse<Stats>> => {
    const response = await api.get<ApiResponse<Stats>>(ENDPOINTS.ADMIN.STATS);
    return response.data;
}

export { getStats };