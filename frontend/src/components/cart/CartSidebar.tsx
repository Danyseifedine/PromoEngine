import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { useState } from "react";

export function CartSidebar() {
    const { 
        cart, 
        totalAmount, 
        isCartOpen, 
        closeCart, 
        updateCartItem, 
        removeFromCart, 
        clearCart, 
        isLoading,
        error 
    } = useCartStore();

    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());

    const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        setLoadingItems(prev => new Set(prev).add(cartItemId));
        try {
            await updateCartItem(cartItemId, newQuantity);
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartItemId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        setLoadingItems(prev => new Set(prev).add(cartItemId));
        try {
            await removeFromCart(cartItemId);
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartItemId);
                return newSet;
            });
        }
    };

    const cartItems = cart?.cart_items || [];
    const isEmpty = cartItems.length === 0;

    return (
        <Sheet open={isCartOpen} onOpenChange={closeCart}>
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Shopping Cart ({cartItems.length})
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full mt-6">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto">
                        {isEmpty ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Your cart is empty
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Add some products to get started!
                                </p>
                                <Button
                                    onClick={closeCart}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                        {/* Product Image Placeholder */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <div className="text-2xl text-gray-400">📦</div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {item.product?.name || 'Product'}
                                            </h4>
                                            {item.product?.category && (
                                                <p className="text-sm text-gray-600">
                                                    {item.product.category.name}
                                                </p>
                                            )}
                                            <p className="text-sm font-medium text-purple-600 mt-1">
                                                ${Number(item.unit_price).toFixed(2)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || loadingItems.has(item.id)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={loadingItems.has(item.id)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="flex flex-col items-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={loadingItems.has(item.id)}
                                            >
                                                {loadingItems.has(item.id) ? (
                                                    <div className="h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-3 w-3" />
                                                )}
                                            </Button>
                                            <p className="text-sm font-semibold text-gray-900 mt-2">
                                                ${(item.quantity * Number(item.unit_price)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Footer */}
                    {!isEmpty && (
                        <div className="border-t pt-4 mt-4 space-y-4">
                            {/* Total */}
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total:</span>
                                <span className="text-purple-600">
                                    ${totalAmount.toFixed(2)}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <Button 
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Processing...
                                        </div>
                                    ) : (
                                        "Proceed to Checkout"
                                    )}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={clearCart}
                                    disabled={isLoading}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}