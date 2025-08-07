<?php

use App\Http\Controllers\Api\V1\EvaluationController;
use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\PromotionRuleController;
use App\Http\Controllers\Api\V1\CartController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);

        // Users routes
        Route::get('/users', [UserController::class, 'getUsers']);
        Route::delete('/users/{id}', [UserController::class, 'deleteUser']);
        Route::put('/users/{id}', [UserController::class, 'updateUser']);

        // Categories routes
        Route::get('/categories', [CategoryController::class, 'getCategories']);
        Route::post('/categories', [CategoryController::class, 'createCategory']);
        Route::get('/categories/{id}', [CategoryController::class, 'getCategory']);
        Route::put('/categories/{id}', [CategoryController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [CategoryController::class, 'deleteCategory']);

        // Products routes
        Route::get('/products', [ProductController::class, 'getProducts']);
        Route::post('/products', [ProductController::class, 'createProduct']);
        Route::get('/products/{id}', [ProductController::class, 'getProduct']);
        Route::put('/products/{id}', [ProductController::class, 'updateProduct']);
        Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);

        // Promotion Rules routes
        Route::get('/promotion-rules', [PromotionRuleController::class, 'index']);
        Route::post('/promotion-rules', [PromotionRuleController::class, 'store']);
        Route::delete('/promotion-rules/{id}', [PromotionRuleController::class, 'destroy']);
    });

    // Cart routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'addItem']);
        Route::put('/items/{cartItemId}', [CartController::class, 'updateItem']);
        Route::delete('/items/{cartItemId}', [CartController::class, 'removeItem']);
        Route::delete('/clear', [CartController::class, 'clear']);
    });

    // Evaluation routes
    Route::post('/evaluate', [EvaluationController::class, 'evaluate']);
});

// Test route to verify API is working
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working!',
        'timestamp' => now(),
    ]);
});
