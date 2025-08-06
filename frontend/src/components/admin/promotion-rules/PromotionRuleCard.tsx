import React from 'react';
import { Button } from '@/components/ui/button';
import { PromotionRule } from '@/stores/promotionRulesStore';

interface PromotionRuleCardProps {
    rule: PromotionRule;
    onDelete: (id: number) => void;
    isDeleting?: boolean;
}

export const PromotionRuleCard: React.FC<PromotionRuleCardProps> = ({ 
    rule, 
    onDelete, 
    isDeleting = false 
}) => {
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
            onDelete(rule.id);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {rule.name}
                    </h3>
                    <div className="flex items-center gap-3">
                        {/* Active Status */}
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${rule.active ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`text-sm font-medium ${rule.active ? 'text-green-700' : 'text-red-700'}`}>
                                {rule.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        
                        {/* Stackable Status */}
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-500">Stackable:</span>
                            <span className={`text-sm font-medium ${rule.stackable ? 'text-blue-700' : 'text-gray-700'}`}>
                                {rule.stackable ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Delete Button */}
                <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    variant="destructive"
                    size="sm"
                    className="hover:bg-red-600"
                >
                    {isDeleting ? 'Deleting...' : '🗑️ Delete'}
                </Button>
            </div>

            {/* Details */}
            <div className="space-y-3">
                {/* Salience */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Priority:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {rule.salience}
                    </span>
                </div>

                {/* Validity Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <span className="text-sm text-gray-500">Valid From:</span>
                        <div className="text-sm font-medium text-gray-900">
                            {formatDate(rule.valid_from)}
                        </div>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Valid Until:</span>
                        <div className="text-sm font-medium text-gray-900">
                            {formatDate(rule.valid_until)}
                        </div>
                    </div>
                </div>

                {/* Rule Stats */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{rule.conditions.length}</span> condition(s)
                    </div>
                    <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{rule.actions.length}</span> action(s)
                    </div>
                    <div className="text-sm text-gray-500">
                        Created: <span className="font-medium text-gray-700">{formatDate(rule.created_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};