<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends Controller
{
    /**
     * Get paginated products with optional search
     */
    public function getProducts(Request $request): JsonResponse
    {
        try {
            $query = Product::with('category');

            // Apply search if provided
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhereHas('category', function ($categoryQuery) use ($searchTerm) {
                          $categoryQuery->where('name', 'like', "%{$searchTerm}%");
                      });
                });
            }

            // Get paginated results
            $products = $query->orderBy('created_at', 'desc')
                            ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $products->items(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch products: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new product
     */
    public function createProduct(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'unit_price' => 'required|numeric|min:0',
                'quantity' => 'required|integer|min:0'
            ]);

            $product = Product::create($validatedData);
            $product->load('category');

            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'Product created successfully'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to create product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single product by ID
     */
    public function getProduct(string $id): JsonResponse
    {
        try {
            $product = Product::with('category')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing product
     */
    public function updateProduct(Request $request, string $id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'unit_price' => 'required|numeric|min:0',
                'quantity' => 'required|integer|min:0'
            ]);

            $product->update($validatedData);
            $product->load('category');

            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'Product updated successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Product not found'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a product
     */
    public function deleteProduct(string $id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);
            $productName = $product->name;

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => "Product '{$productName}' deleted successfully"
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete product: ' . $e->getMessage()
            ], 500);
        }
    }
}
