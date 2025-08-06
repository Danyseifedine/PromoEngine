import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsDataTable } from "@/components/admin/products/DataTable";
import { ProductAddModal } from "@/components/admin/products/AddModal";
import { useProductManagementStore } from "@/stores/productManagementStore";

export default function ProductsPage() {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const { createProduct, isLoading } = useProductManagementStore();

    const handleCreateProduct = async (data: { name: string; category_id: number; unit_price: number }) => {
        try {
            await createProduct(data);
            setAddModalOpen(false);
        } catch (error) {
            console.error("Failed to create product:", error);
        }
    };

    return (
        <AdminLayout title="Products">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">Manage your product catalog</p>
                    </div>
                    <Button 
                        onClick={() => setAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
                
                <ProductsDataTable />

                <ProductAddModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onSubmit={handleCreateProduct}
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
}