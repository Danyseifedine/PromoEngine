import { useState, useEffect } from "react";
import { Edit, Trash2, User as UserIcon, Crown } from "lucide-react";
import { User } from "@/types/auth";
import { DataTable, Column, DataTableAction } from "@/components/ui/data-table";
import { UserEditModal } from "./EditModal";
import { useUserManagementStore } from "@/stores/UserManagementStore";
import { Button } from "@/components/ui/button";

// Create Badge component if it doesn't exist
export function Badge({
    children,
    variant = "default",
    className = ""
}: {
    children: React.ReactNode;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
}) {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    const variants = {
        default: "bg-purple-100 text-purple-800",
        secondary: "bg-gray-100 text-gray-800",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-gray-200 text-gray-700",
    };

    return (
        <span className={`${baseClasses} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}

export interface UsersDataTableProps {
    searchable?: boolean;
    className?: string;
}

export function UsersDataTable({
    searchable = true,
    className = ""
}: UsersDataTableProps) {
    const { users, isLoading, error, getUsers, updateUser, deleteUser } = useUserManagementStore();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch users on component mount and when debounced search query changes
    useEffect(() => {
        const fetchUsers = async () => {
            await getUsers(debouncedSearch);
        }
        fetchUsers();
    }, [getUsers, debouncedSearch]);

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleDeleteUser = async (user: User) => {
        if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
            try {
                await deleteUser(user.id.toString());
                // Refresh the users list with current search
                await getUsers(debouncedSearch);
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("Failed to delete user. Please try again.");
            }
        }
    };

    const handleUpdateUser = async (id: string, data: Partial<User>) => {
        try {
            await updateUser(id, data as User);
            // Refresh the users list with current search
            await getUsers(debouncedSearch);
        } catch (error) {
            console.error("Failed to update user:", error);
            throw error; // Re-throw to be handled by the modal
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Define table columns
    const columns: Column<User>[] = [
        {
            key: "id",
            header: "ID",
            width: "20",
            sortable: true,
        },
        {
            key: "name",
            header: "Name",
            sortable: true,
            render: (value, user) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
            ),
        },
        {
            key: "type",
            header: "Type",
            sortable: true,
            render: (value) => (
                <div className="flex items-center space-x-2">
                    {value === "admin" ? (
                        <>
                            <Crown className="h-4 w-4 text-yellow-500" />
                            <Badge variant="default">Admin</Badge>
                        </>
                    ) : (
                        <>
                            <UserIcon className="h-4 w-4 text-blue-500" />
                            <Badge variant="secondary">Customer</Badge>
                        </>
                    )}
                </div>
            ),
        },
        {
            key: "customer",
            header: "City",
            render: (value, user) => {
                if (user.type === "admin") {
                    return <span className="text-gray-400">N/A</span>;
                }
                return (
                    <span className="text-gray-900">
                        {user.customer?.city || "Not specified"}
                    </span>
                );
            },
        },
        {
            key: "customer",
            header: "Loyalty Tier",
            render: (value, user) => {
                if (user.type === "admin") {
                    return <span className="text-gray-400">N/A</span>;
                }
                const tier = user.customer?.loyalty_tier;
                const tierColors = {
                    bronze: "bg-orange-100 text-orange-800",
                    silver: "bg-gray-100 text-gray-800",
                    gold: "bg-yellow-100 text-yellow-800",
                    platinum: "bg-purple-100 text-purple-800",
                };
                return (
                    <Badge className={tierColors[tier as keyof typeof tierColors] || "bg-gray-100 text-gray-800"}>
                        {tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : "Bronze"}
                    </Badge>
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
    const actions: DataTableAction<User>[] = [
        {
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: handleEditUser,
            variant: "outline",
        },
        {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: handleDeleteUser,
            variant: "destructive",
            show: (user) => user.type !== "admin", // Don't allow deleting admin users
        },
    ];

    // Pagination configuration
    const pagination = users?.meta ? {
        currentPage: users.meta.current_page,
        totalPages: users.meta.last_page,
        itemsPerPage: users.meta.per_page,
        totalItems: users.meta.total,
        onPageChange: (page: number) => {
            // TODO: Implement pagination in your API service
            console.log("Navigate to page:", page);
        },
    } : undefined;

    // Show error state if there's an error
    if (error && !users) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 font-medium mb-2">Error Loading Users</div>
                <div className="text-red-500 text-sm mb-4">{error}</div>
                <Button
                    onClick={() => getUsers()}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    // Debug log (remove in production)
    if (users?.data) {
        console.log('Users loaded:', users.data.length, 'users');
    }

    return (
        <>
            <DataTable
                data={users?.data || []}
                columns={columns}
                actions={actions}
                pagination={pagination}
                loading={isLoading}
                searchable={searchable}
                onSearch={handleSearch}
                searchPlaceholder="Search users by name or email..."
                emptyMessage="No users found"
                className={className}
            />

            {/* Edit User Modal */}
            <UserEditModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSubmit={handleUpdateUser}
                isLoading={isLoading}
            />
        </>
    );
}