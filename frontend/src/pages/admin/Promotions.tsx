import { AdminLayout } from "@/layouts/AdminLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromotionRuleCard } from "@/components/admin/promotion-rules/PromotionRuleCard";
import { usePromotionRulesStore } from "@/stores/promotionRulesStore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PromotionsPage() {
    const { promotionRules, isLoading, error, getPromotionRules, deletePromotionRule } = usePromotionRulesStore();
    const [deletingRuleId, setDeletingRuleId] = useState<number | null>(null);

    const handleDeleteRule = async (ruleId: number) => {
        setDeletingRuleId(ruleId);
        try {
            await deletePromotionRule(ruleId.toString());
        } catch (error) {
            console.error('Error deleting rule:', error);
        } finally {
            setDeletingRuleId(null);
        }
    };

    // Fetch promotion rules on component mount
    useEffect(() => {
        getPromotionRules();
    }, [getPromotionRules]);

    return (
        <AdminLayout title="Promotions">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Promotion Rules Management
                            </h1>
                            <p className="text-gray-600">
                                Manage your promotion rules. Create new rules using the visual rule engine.
                            </p>
                        </div>
                        <Link to="/admin/engine">
                            <Button className="flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Create New Rule</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Promotion Rules Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Active Promotion Rules
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                All your created promotion rules with their current status
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {promotionRules?.data?.length || 0} rules total
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-500">Loading promotion rules...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-8">
                            <div className="text-red-600 mb-2">⚠️ Error loading rules</div>
                            <p className="text-gray-500">{error}</p>
                            <button 
                                onClick={() => getPromotionRules()}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Rules Grid */}
                    {!isLoading && !error && promotionRules?.data && (
                        <>
                            {promotionRules.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            📝
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No promotion rules yet
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Get started by creating your first promotion rule
                                    </p>
                                    <Link to="/admin/engine">
                                        <Button className="flex items-center space-x-2">
                                            <Plus className="h-4 w-4" />
                                            <span>Create Your First Rule</span>
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {promotionRules.data.map((rule) => (
                                        <PromotionRuleCard
                                            key={rule.id}
                                            rule={rule}
                                            onDelete={handleDeleteRule}
                                            isDeleting={deletingRuleId === rule.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}