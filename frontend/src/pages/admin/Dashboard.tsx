import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
    Users,
    Tag,
    Package,
    Gift,
    Menu,
    X,
    LogOut,
    User,
    Settings,
    BarChart3,
    Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStatsStore } from "@/stores/statsStore";

// Placeholder components for menu items
const UsersPage = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Users Management</h2>
            <p className="text-gray-500">Coming Soon</p>
        </div>
    </div>
);

const CategoriesPage = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Categories Management</h2>
            <p className="text-gray-500">Coming Soon</p>
        </div>
    </div>
);

const ProductsPage = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Products Management</h2>
            <p className="text-gray-500">Coming Soon</p>
        </div>
    </div>
);

const PromotionPage = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Promotion Management</h2>
            <p className="text-gray-500">Coming Soon</p>
        </div>
    </div>
);

export default function AdminDashboard() {
    const { user, logout } = useAuthStore();
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { stats, isLoading, error, getStats } = useStatsStore();

    useEffect(() => {
        const fetchStats = async () => {
            await getStats();
        }
        fetchStats();
    }, [getStats]);

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "users", label: "Users", icon: Users },
        { id: "categories", label: "Categories", icon: Tag },
        { id: "products", label: "Products", icon: Package },
        { id: "promotion", label: "Promotion", icon: Gift },
    ];

    const renderPage = () => {
        switch (activePage) {
            case "users":
                return <UsersPage />;
            case "categories":
                return <CategoriesPage />;
            case "products":
                return <ProductsPage />;
            case "promotion":
                return <PromotionPage />;
            default:
                return <DashboardHome />;
        }
    };

    const DashboardHome = () => (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-purple-100">Here's what's happening with your PromoEngine today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? (
                                    <span className="inline-block w-5 h-5 align-middle">
                                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    </span>
                                ) : stats?.total_customers}
                            </p>
                        </div>
                        <Users className="h-8 w-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Categories</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? (
                                    <span className="inline-block w-5 h-5 align-middle">
                                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    </span>
                                ) : stats?.total_categories}
                            </p>
                        </div>
                        <Tag className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Products</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? (
                                    <span className="inline-block w-5 h-5 align-middle">
                                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    </span>
                                ) : stats?.total_products}
                            </p>
                        </div>
                        <Package className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? (
                                    <span className="inline-block w-5 h-5 align-middle">
                                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    </span>
                                ) : stats?.total_promotions}
                            </p>
                        </div>
                        <Gift className="h-8 w-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        onClick={() => setActivePage("users")}
                        className="flex items-center space-x-2 h-12"
                    >
                        <Users className="h-4 w-4" />
                        <span>Manage Users</span>
                    </Button>
                    <Button
                        onClick={() => setActivePage("products")}
                        variant="outline"
                        className="flex items-center space-x-2 h-12"
                    >
                        <Package className="h-4 w-4" />
                        <span>Add Product</span>
                    </Button>
                    <Button
                        onClick={() => setActivePage("promotion")}
                        variant="outline"
                        className="flex items-center space-x-2 h-12"
                    >
                        <Gift className="h-4 w-4" />
                        <span>Create Promotion</span>
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Gift className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">PromoEngine</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActivePage(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activePage === item.id
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <Button
                            onClick={logout}
                            variant="outline"
                            className="w-full flex items-center space-x-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {menuItems.find(item => item.id === activePage)?.label}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="p-2 rounded-md text-gray-400 hover:text-gray-600">
                                <Settings className="h-5 w-5" />
                            </button>
                            <button className="p-2 rounded-md text-gray-400 hover:text-gray-600">
                                <BarChart3 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-6 overflow-auto">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
} 