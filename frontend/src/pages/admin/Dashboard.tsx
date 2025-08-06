import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { AdminLayout } from "@/layouts/AdminLayout";
import {
    Users,
    Tag,
    Package,
    Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStatsStore } from "@/stores/statsStore";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const { stats, isLoading, getStats } = useStatsStore();

    useEffect(() => {
        const fetchStats = async () => {
            await getStats();
        }
        fetchStats();
    }, [getStats]);

    return (
        <AdminLayout title="Dashboard">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button asChild variant="outline" className="flex items-center space-x-2 h-12">
                            <Link to="/admin/users">
                                <Users className="h-4 w-4" />
                                <span>Manage Users</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex items-center space-x-2 h-12">
                            <Link to="/admin/categories">
                                <Tag className="h-4 w-4" />
                                <span>Manage Categories</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex items-center space-x-2 h-12">
                            <Link to="/admin/products">
                                <Package className="h-4 w-4" />
                                <span>Manage Products</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex items-center space-x-2 h-12">
                            <Link to="/admin/promotions">
                                <Gift className="h-4 w-4" />
                                <span>Manage Promotions</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 