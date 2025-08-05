<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Category;
use App\Models\PromotionRule;
use Illuminate\Http\Response;

class AdminController extends Controller
{
    public function getStats(Request $request)
    {
        try {
            // Check if user is admin
            if ($request->user()->type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], Response::HTTP_FORBIDDEN);
            }

            $stats = [
                'total_customers' => Customer::count(),
                'total_promotions' => PromotionRule::count(),
                'total_products' => Product::count(),
                'total_categories' => Category::count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch stats',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
