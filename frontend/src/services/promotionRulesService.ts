import { api } from '@/lib/api';
import { ENDPOINTS } from '@/config/api';

export interface PromotionRule {
    name: string;
    salience: number;
    stackable: boolean;
    active: boolean;
    valid_from: string | null;
    valid_until: string | null;
    conditions: Array<{
        type: string;
        operator: string;
        value: number;
        id: string;
    }>;
    actions: Array<{
        type: string;
        value: number;
        id: string;
    }>;
    logicalNodes: Array<{
        type: string;
        id: string;
    }>;
    connections: Array<{
        from: string;
        to: string;
        fromOutput: string;
        toInput: string;
    }>;
    createdAt: string;
}

export const promotionRulesService = {
    async createRule(rule: PromotionRule): Promise<{ success: boolean; message: string; data?: any }> {
        try {
            const response = await api.post(ENDPOINTS.ADMIN.PROMOTION_RULES.CREATE, rule);
            return response.data;
        } catch (error: any) {
            console.error('Error creating promotion rule:', error);
            throw new Error(error.response?.data?.message || 'Failed to create promotion rule');
        }
    },
};