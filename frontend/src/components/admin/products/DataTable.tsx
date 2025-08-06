import { useState, useEffect } from "react";
import { Edit, Trash2, Package } from "lucide-react";
import { Product } from "@/types/admin";
import { DataTable, Column, DataTableAction } from "@/components/ui/data-table";
import { ProductEditModal } from "./EditModal";
import { useProductManagementStore } from "@/stores/productManagementStore";
import { Button } from "@/components/ui/button";

export interface ProductsDataTableProps {
    searchable?: boolean;
    className?: string;
}

export function ProductsDataTable({
    searchable = true,
    className = ""
}: ProductsDataTableProps) {
    const { products, isLoading, error, getProducts, updateProduct, deleteProduct } = useProductManagementStore();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch products on component mount and when debounced search query changes
    useEffect(() => {
        const fetchProducts = async () => {
            await getProducts(debouncedSearch);
        }
        fetchProducts();
    }, [getProducts, debouncedSearch]);

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    const handleDeleteProduct = async (product: Product) => {
        if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
            try {
                await deleteProduct(product.id.toString());
                // Refresh the products list with current search
                await getProducts(debouncedSearch);
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    const handleUpdateProduct = async (id: string, data: { name: string; category_id: number; unit_price: number }) => {
        try {
            await updateProduct(id, data);
            // Refresh the products list with current search
            await getProducts(debouncedSearch);
        } catch (error) {
            console.error("Failed to update product:", error);
            throw error; // Re-throw to be handled by the modal
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Define table columns
    const columns: Column<Product>[] = [
        {
            key: "id",
            header: "ID",
            width: "20",
            sortable: true,
        },
        {
            key: "name",
            header: "Product Name",
            sortable: true,
            render: (value, product) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                        {product.category && (
                            <div className="text-sm text-gray-500">
                                Category: {product.category.name}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "unit_price",
            header: "Unit Price",
            sortable: true,
            render: (value) => {
                // Handle both string and number values from API
                const price = typeof value === 'string' ? parseFloat(value) : value;
                const formattedPrice = isNaN(price) ? '0.00' : price.toFixed(2);
                return (
                    <div className="font-medium text-green-600">
                        ${formattedPrice}
                    </div>
                );
            },
        },
        {
            key: "created_at",
            header: "Created",
            sortable: true,
            render: (value) => (
                <div className="text-sm text-gray-900">
                    {new Date(value).toLocaleDateString()}
                </div>
            ),
        },
    ];

    // Define table actions
    const actions: DataTableAction<Product>[] = [
        {
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: handleEditProduct,
            variant: "outline",
        },
        {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: handleDeleteProduct,
            variant: "destructive",
        },
    ];

    // Pagination configuration
    const pagination = products?.meta ? {
        currentPage: products.meta.current_page,
        totalPages: products.meta.last_page,
        itemsPerPage: products.meta.per_page,
        totalItems: products.meta.total,
        onPageChange: (page: number) => {
            // TODO: Implement pagination in your API service
            console.log("Navigate to page:", page);
        },
    } : undefined;

    // Show error state if there's an error
    if (error && !products) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 font-medium mb-2">Error Loading Products</div>
                <div className="text-red-500 text-sm mb-4">{error}</div>
                <Button
                    onClick={() => getProducts()}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    // Debug log (remove in production)
    if (products?.data) {
        console.log('Products loaded:', products.data.length, 'products');
    }

    return (
        <>
            <DataTable
                data={products?.data || []}
                columns={columns}
                actions={actions}
                pagination={pagination}
                loading={isLoading}
                searchable={searchable}
                onSearch={handleSearch}
                searchPlaceholder="Search products by name or category..."
                emptyMessage="No products found"
                className={className}
            />

            {/* Edit Product Modal */}
            <ProductEditModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedProduct(null);
                }}
                product={selectedProduct}
                onSubmit={handleUpdateProduct}
                isLoading={isLoading}
            />
        </>
    );
}