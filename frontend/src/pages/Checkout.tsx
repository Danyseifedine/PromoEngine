import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, CreditCard, User, Sparkles, Gift, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GuestLayout } from "@/layouts/GuestLayout";
import { evaluateCart } from "@/services/evaluationService";
import { EvaluationResponse } from "@/types/admin";

export default function CheckoutPage() {
    const { cart, totalAmount, getCart, isLoading } = useCartStore();
    const { user } = useAuthStore();
    const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationError, setEvaluationError] = useState<string | null>(null);

    useEffect(() => {
        getCart();
    }, [getCart]);

    const handleApplyPromotions = async () => {
        setIsEvaluating(true);
        setEvaluationError(null);
        try {
            const result = await evaluateCart();
            setEvaluation(result);
        } catch (error: any) {
            console.error('Error evaluating cart:', error);
            setEvaluationError(error?.response?.data?.message || 'Failed to apply promotions');
        } finally {
            setIsEvaluating(false);
        }
    };

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
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Review your order before completing your purchase</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-3">
                        <Card className="h-fit">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <ShoppingCart className="h-5 w-5 text-purple-600" />
                                    </div>
                                    Order Summary ({cartItems.length} items)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
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
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Info */}
                        <Card className="border-2 border-gray-100">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    Customer Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-semibold text-gray-900">{user?.name}</p>
                                        <p className="text-sm text-gray-600">{user?.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Apply Promotions */}
                        <Card className="border-2 border-purple-100">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                                        <Sparkles className="h-5 w-5 text-purple-600" />
                                    </div>
                                    Promotions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {evaluationError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-800 text-sm">{evaluationError}</p>
                                    </div>
                                )}
                                
                                <Button 
                                    onClick={handleApplyPromotions}
                                    disabled={isEvaluating}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                >
                                    {isEvaluating ? (
                                        <div className="flex items-center">
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Applying Promotions...
                                        </div>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Apply Promotions
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Promotion Results */}
                        {evaluation && (
                            <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-bl-full opacity-10"></div>
                                <CardHeader className="pb-4 relative">
                                    <CardTitle className="flex items-center gap-3 text-green-800">
                                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                                            <Gift className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-bold">Promotions Applied!</span>
                                            <div className="text-sm font-normal text-green-600">
                                                You're saving ${evaluation.totalDiscount.toFixed(2)}
                                            </div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-0 relative">
                                    {/* Applied Rules */}
                                    {evaluation.applied.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-green-800 text-sm uppercase tracking-wide">Applied Promotions</h4>
                                            <div className="space-y-2">
                                                {evaluation.applied.map((rule) => (
                                                    <div key={rule.ruleId} className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-green-200">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <span className="text-green-800 font-medium text-sm">{rule.ruleName}</span>
                                                        </div>
                                                        <span className="text-green-700 font-bold text-sm">
                                                            {rule.discount > 0 && `-$${rule.discount.toFixed(2)}`}
                                                            {rule.freeUnits.length > 0 && (
                                                                <span className="text-green-600">🎁 Free Items</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Free Items */}
                                    {evaluation.freeItems.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-green-800 text-sm uppercase tracking-wide">Free Items</h4>
                                            <div className="space-y-2">
                                                {evaluation.freeItems.map((freeItem, index) => (
                                                    <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-300">
                                                        <div className="flex items-center gap-2">
                                                            <Gift className="h-4 w-4 text-green-600" />
                                                            <span className="text-green-800 font-medium text-sm">
                                                                {freeItem.productName} x{freeItem.freeQuantity}
                                                            </span>
                                                        </div>
                                                        <span className="text-green-700 font-bold text-sm">
                                                            +${Number(freeItem.totalValue).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Order Total */}
                        <Card className="border-2 border-gray-200 bg-gray-50/50">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-900 text-lg">
                                            ${evaluation ? evaluation.originalTotal.toFixed(2) : totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    {evaluation && evaluation.totalDiscount > 0 && (
                                        <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-green-800 font-medium">Promotions Saved</span>
                                            </div>
                                            <span className="text-green-700 font-bold text-lg">
                                                -${evaluation.totalDiscount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t-2 border-dashed border-gray-200 pt-4">
                                    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-purple-600">
                                                ${evaluation ? evaluation.finalTotal.toFixed(2) : totalAmount.toFixed(2)}
                                            </span>
                                            {evaluation && evaluation.totalDiscount > 0 && (
                                                <div className="text-xs text-green-600 font-medium">
                                                    You saved ${evaluation.totalDiscount.toFixed(2)}!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {evaluation && evaluation.freeItems.length > 0 && (
                                    <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                        <div className="flex items-center justify-center gap-2">
                                            <Gift className="h-4 w-4 text-green-600" />
                                            <span className="text-green-800 font-semibold text-sm">
                                                Plus ${evaluation.freeItems.reduce((sum, item) => sum + Number(item.totalValue), 0).toFixed(2)} in FREE items!
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Checkout Button */}
                        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
                                        <CreditCard className="h-5 w-5 text-purple-600" />
                                    </div>
                                    Complete Your Order
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <Button 
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                            <span className="text-base">Processing Your Order...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3">
                                            <CreditCard className="h-5 w-5" />
                                            <span className="text-base">Complete Purchase</span>
                                            <div className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                                                ${evaluation ? evaluation.finalTotal.toFixed(2) : totalAmount.toFixed(2)}
                                            </div>
                                        </div>
                                    )}
                                </Button>
                                
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="px-3 text-xs text-gray-500 font-medium">SECURE CHECKOUT</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                
                                <p className="text-xs text-gray-500 text-center leading-relaxed">
                                    🔒 Your payment information is encrypted and secure<br/>
                                    By completing your purchase you agree to our terms and conditions
                                </p>
                            </CardContent>
                        </Card>

                        {/* Continue Shopping */}
                        <Button 
                            variant="outline" 
                            asChild 
                            className="w-full border-2 border-gray-300 hover:border-purple-300 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-semibold py-4 rounded-xl transition-all duration-300"
                        >
                            <Link to="/shop" className="flex items-center justify-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}