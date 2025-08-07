import { api } from "@/lib/api";
import { EvaluationResponse } from '../types/admin';

export const evaluateCart = async (): Promise<EvaluationResponse> => {
    const response = await api.post('/evaluate');
    return response.data;
};