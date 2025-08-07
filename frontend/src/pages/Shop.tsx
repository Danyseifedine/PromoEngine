
import { useProductManagementStore } from "@/stores/productManagementStore";
import { useCategoryManagementStore } from "@/stores/categoryManagementStore";
import { useCartStore } from "@/stores/cartStore";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/admin";
import { ShoppingCart, Filter, Search } from "lucide-react";
import { GuestLayout } from "@/layouts/GuestLayout";

export default function ShopPage() {
    const { products, isLoading: productsLoading, error: productsError, getProducts } = useProductManagementStore();
    const { categories: categoriesData, getCategories } = useCategoryManagementStore();
    const { addToCart, isLoading: cartLoading, openCart } = useCartStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());

    // Fetch products and categories on component mount
    useEffect(() => {
        getProducts();
        getCategories();
    }, [getProducts, getCategories]);

    const handleAddToCart = async (product: Product) => {
        if (product.quantity === 0) return;
        
        setAddingToCart(prev => new Set(prev).add(product.id));
        try {
            await addToCart(product.id, 1);
            // Optionally show a toast notification or open cart
            // openCart(); // Uncomment to auto-open cart after adding
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Handle error (could show a toast notification)
        } finally {
            setAddingToCart(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };

    const filteredProducts = products?.data?.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category_id.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    }) || [];

    const categories = categoriesData?.data || [];

    return (
        <GuestLayout>
            <div className="bg-gray-50 min-h-screen">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">
                                Welcome to Our Store
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Discover amazing products with our smart promotion engine. 
                                Great deals and personalized offers await!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            
                            {/* Category Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-600" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Results Count */}
                            <div className="text-sm text-gray-600">
                                {filteredProducts.length} products found
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="mb-8">
                        {productsLoading ? (
                            /* Loading State */
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <p className="mt-4 text-gray-600">Loading amazing products...</p>
                            </div>
                        ) : productsError ? (
                            /* Error State */
                            <div className="text-center py-12">
                                <div className="text-red-600 mb-4">⚠️ Oops! Something went wrong</div>
                                <p className="text-gray-600 mb-4">{productsError}</p>
                                <Button onClick={() => getProducts()}>
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            /* Empty State */
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        🛍️
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm || selectedCategory !== 'all' 
                                        ? 'Try adjusting your search or filter criteria' 
                                        : 'Check back later for new arrivals!'}
                                </p>
                            </div>
                        ) : (
                            /* Products Grid */
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <div 
                                        key={product.id} 
                                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                    >
                                        {/* Product Image Placeholder */}
                                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <div className="text-4xl text-gray-400">📦</div>
                                        </div>
                                        
                                        {/* Product Info */}
                                        <div className="p-4">
                                            <div className="mb-2">
                                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                {product.category && (
                                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {product.category.name}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Price & Stock */}
                                            <div className="mb-4">
                                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                                    ${Number(product.unit_price).toFixed(2)}
                                                </div>
                                                <div className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.quantity > 0 
                                                        ? `${product.quantity} in stock` 
                                                        : 'Out of stock'}
                                                </div>
                                            </div>
                                            
                                            {/* Add to Cart Button */}
                                            <Button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.quantity === 0 || addingToCart.has(product.id)}
                                                className={`w-full flex items-center justify-center gap-2 ${
                                                    product.quantity > 0 
                                                        ? 'bg-purple-600 hover:bg-purple-700' 
                                                        : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {addingToCart.has(product.id) ? (
                                                    <>
                                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="h-4 w-4" />
                                                        {product.quantity > 0 ? 'Add to Cart' : 'Sold Out'}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}