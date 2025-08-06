import { AdminLayout } from "@/layouts/AdminLayout";
import { Percent, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PromotionsPage() {
    return (
        <AdminLayout title="Promotions">
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center max-w-md">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                        <Percent className="h-12 w-12 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Promotions Management</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Create powerful promotional campaigns with our intelligent rules engine. 
                        Advanced promotion features including AI-powered suggestions and real-time analytics are coming soon.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button disabled className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Create Promotion</span>
                        </Button>
                        <Button variant="outline" disabled className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span>Rules Engine</span>
                        </Button>
                    </div>
                    <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700">
                            <strong>Coming Soon:</strong> Smart rule engine, A/B testing, 
                            automated campaigns, and comprehensive promotion analytics.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}