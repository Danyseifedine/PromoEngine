import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoriesDataTable } from "@/components/admin/categories/DataTable";
import { CategoryAddModal } from "@/components/admin/categories/AddModal";
import { useCategoryManagementStore } from "@/stores/categoryManagementStore";

export default function CategoriesPage() {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const { createCategory, isLoading } = useCategoryManagementStore();

    const handleCreateCategory = async (data: { name: string }) => {
        try {
            await createCategory(data);
            setAddModalOpen(false);
        } catch (error) {
            console.error("Failed to create category:", error);
        }
    };

    return (
        <AdminLayout title="Categories">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">Organize your products with categories</p>
                    </div>
                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </div>

                <CategoriesDataTable />

                <CategoryAddModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onSubmit={handleCreateCategory}
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
}