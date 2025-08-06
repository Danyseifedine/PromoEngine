import { useState, useEffect } from "react";
import { Edit, Trash2, Tag } from "lucide-react";
import { Category } from "@/types/admin";
import { DataTable, Column, DataTableAction } from "@/components/ui/data-table";
import { CategoryEditModal } from "./EditModal";
import { useCategoryManagementStore } from "@/stores/categoryManagementStore";
import { Button } from "@/components/ui/button";

export interface CategoriesDataTableProps {
    searchable?: boolean;
    className?: string;
}

export function CategoriesDataTable({
    searchable = true,
    className = ""
}: CategoriesDataTableProps) {
    const { categories, isLoading, error, getCategories, updateCategory, deleteCategory } = useCategoryManagementStore();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch categories on component mount and when debounced search query changes
    useEffect(() => {
        const fetchCategories = async () => {
            await getCategories(debouncedSearch);
        }
        fetchCategories();
    }, [getCategories, debouncedSearch]);

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setEditModalOpen(true);
    };

    const handleDeleteCategory = async (category: Category) => {
        if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
            try {
                await deleteCategory(category.id.toString());
                // Refresh the categories list with current search
                await getCategories(debouncedSearch);
            } catch (error) {
                console.error("Failed to delete category:", error);
                alert("Failed to delete category. Please try again.");
            }
        }
    };

    const handleUpdateCategory = async (id: string, data: { name: string }) => {
        try {
            await updateCategory(id, data);
            // Refresh the categories list with current search
            await getCategories(debouncedSearch);
        } catch (error) {
            console.error("Failed to update category:", error);
            throw error; // Re-throw to be handled by the modal
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Define table columns
    const columns: Column<Category>[] = [
        {
            key: "id",
            header: "ID",
            width: "20",
            sortable: true,
        },
        {
            key: "name",
            header: "Category Name",
            sortable: true,
            render: (value) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Tag className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                    </div>
                </div>
            ),
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
    const actions: DataTableAction<Category>[] = [
        {
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: handleEditCategory,
            variant: "outline",
        },
        {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: handleDeleteCategory,
            variant: "destructive",
        },
    ];

    // Pagination configuration
    const pagination = categories?.meta ? {
        currentPage: categories.meta.current_page,
        totalPages: categories.meta.last_page,
        itemsPerPage: categories.meta.per_page,
        totalItems: categories.meta.total,
        onPageChange: (page: number) => {
            // TODO: Implement pagination in your API service
            console.log("Navigate to page:", page);
        },
    } : undefined;

    // Show error state if there's an error
    if (error && !categories) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 font-medium mb-2">Error Loading Categories</div>
                <div className="text-red-500 text-sm mb-4">{error}</div>
                <Button
                    onClick={() => getCategories()}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    // Debug log (remove in production)
    if (categories?.data) {
        console.log('Categories loaded:', categories.data.length, 'categories');
    }

    return (
        <>
            <DataTable
                data={categories?.data || []}
                columns={columns}
                actions={actions}
                pagination={pagination}
                loading={isLoading}
                searchable={searchable}
                onSearch={handleSearch}
                searchPlaceholder="Search categories by name..."
                emptyMessage="No categories found"
                className={className}
            />

            {/* Edit Category Modal */}
            <CategoryEditModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedCategory(null);
                }}
                category={selectedCategory}
                onSubmit={handleUpdateCategory}
                isLoading={isLoading}
            />
        </>
    );
}