<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    /**
     * Get user's cart with items
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $cart = Cart::with(['cartItems.product.category'])
                ->where('user_id', $user->id)
                ->first();

            if (!$cart) {
                $cart = Cart::create(['user_id' => $user->id]);
            }

            return response()->json([
                'success' => true,
                'data' => $cart,
                'total_amount' => $cart->cartItems->sum(function ($item) {
                    return $item->quantity * $item->unit_price;
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching cart: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cart'
            ], 500);
        }
    }

    /**
     * Add item to cart
     */
    public function addItem(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1'
            ]);

            $user = $request->user();
            $product = Product::findOrFail($request->product_id);

            // Check if product has enough stock
            if ($product->quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough stock available'
                ], 400);
            }

            // Get or create cart
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            // Check if item already exists in cart
            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $request->product_id)
                ->first();

            if ($cartItem) {
                $newQuantity = $cartItem->quantity + $request->quantity;

                // Check total quantity against stock
                if ($product->quantity < $newQuantity) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Not enough stock available'
                    ], 400);
                }

                $cartItem->update(['quantity' => $newQuantity]);
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity,
                    'unit_price' => $product->unit_price
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Item added to cart successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error adding item to cart: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to cart'
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(Request $request, $cartItemId): JsonResponse
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1'
            ]);

            $user = $request->user();
            $cartItem = CartItem::with(['cart', 'product'])
                ->where('id', $cartItemId)
                ->whereHas('cart', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found'
                ], 404);
            }

            // Check stock availability
            if ($cartItem->product->quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough stock available'
                ], 400);
            }

            $cartItem->update(['quantity' => $request->quantity]);

            return response()->json([
                'success' => true,
                'message' => 'Cart item updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating cart item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart item'
            ], 500);
        }
    }

    /**
     * Remove item from cart
     */
    public function removeItem(Request $request, $cartItemId): JsonResponse
    {
        try {
            $user = $request->user();
            $cartItem = CartItem::whereHas('cart', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->find($cartItemId);

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found'
                ], 404);
            }

            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error removing cart item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove cart item'
            ], 500);
        }
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $cart = Cart::where('user_id', $user->id)->first();

            if ($cart) {
                $cart->cartItems()->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error clearing cart: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart'
            ], 500);
        }
    }
}
