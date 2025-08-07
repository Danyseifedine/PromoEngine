import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, CreditCard, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { GuestLayout } from "@/layouts/GuestLayout";

export default function CheckoutPage() {
    const { cart, totalAmount, getCart, isLoading } = useCartStore();
    const { user } = useAuthStore();

    useEffect(() => {
        getCart();
    }, [getCart]);

    const cartItems = cart?.cart_items || [];
    const isEmpty = cartItems.length === 0;

    if (isEmpty) {
        return (
            <GuestLayout>
                <div className="max-w-2xl mx-auto p-6">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="h-12 w-12 text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                        <p className="text-gray-600 mb-6">Add some products to proceed with checkout</p>
                        <Button asChild className="bg-purple-600 hover:bg-purple-700">
                            <Link to="/shop">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Review your order before completing your purchase</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Order Summary ({cartItems.length} items)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                        {/* Product Image Placeholder */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <div className="text-2xl text-gray-400">📦</div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                                            {item.product?.category && (
                                                <p className="text-sm text-gray-600">{item.product.category.name}</p>
                                            )}
                                            <p className="text-sm text-purple-600 font-medium">
                                                ${Number(item.unit_price).toFixed(2)} each
                                            </p>
                                        </div>

                                        {/* Quantity and Total */}
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="font-semibold text-gray-900">
                                                ${(item.quantity * Number(item.unit_price)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Total & Checkout */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Customer Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="font-medium">{user?.name}</p>
                                    <p className="text-sm text-gray-600">{user?.email}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Total */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Total</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span className="text-purple-600">${totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Checkout Button */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Payment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button 
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-sm py-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Complete Purchase
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-gray-500 text-center">
                                    By completing your purchase you agree to our terms and conditions
                                </p>
                            </CardContent>
                        </Card>

                        {/* Continue Shopping */}
                        <Button variant="outline" asChild className="w-full">
                            <Link to="/shop">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}