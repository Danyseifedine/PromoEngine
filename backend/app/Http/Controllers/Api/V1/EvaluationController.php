<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\PromotionRule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class EvaluationController extends Controller
{
    /**
     * Evaluate promotions for user's cart
     * POST /api/evaluate
     *
     * This method processes a user's shopping cart and applies promotion rules to calculate:
     * 1. Percentage discounts (reduces the price customer pays)
     * 2. Free units (gives additional products without reducing price)
     *
     * Each rule is evaluated ONCE per cart to prevent duplicates
     */
    public function evaluate(Request $request): JsonResponse
    {
        try {
            // Step 1: Get authenticated user from request token
            $user = $request->user();

            // Step 2: Load user's cart with all related data (cart items, products, categories, customer info)
            // Using 'with' for eager loading to prevent N+1 queries
            $cart = Cart::where('user_id', $user->id)
                ->with(['cartItems.product.category', 'user.customer'])
                ->first();

            // Step 3: Handle case where user has no cart or empty cart
            if (!$cart || $cart->cartItems->isEmpty()) {
                // Return empty response structure for empty cart
                return response()->json([
                    'applied' => [],           // No rules applied
                    'totalDiscount' => 0,      // No money discount
                    'originalTotal' => 0,      // No items in cart
                    'finalTotal' => 0,         // Nothing to pay
                    'freeItems' => []          // No free items
                ]);
            }

            // Step 4: Get customer information from user relationship
            $customer = $user->customer;
            $cartTotal = 0; // Initialize cart total accumulator

            // Step 5: Calculate original cart total by summing all line items
            foreach ($cart->cartItems as $cartItem) {
                // Calculate line total: quantity × unit price
                $lineTotal = $cartItem->quantity * $cartItem->product->unit_price;
                // Add to cart total
                $cartTotal += $lineTotal;
            }

            // Step 6: Log cart evaluation start for debugging
            Log::info('Cart Evaluation Started', [
                'user_id' => $user->id,                                    // Which user
                'cart_total' => $cartTotal,                               // Original cart value
                'item_count' => $cart->cartItems->count(),                // Number of different products
                'customer_loyalty_tier' => $customer->loyalty_tier ?? 'none' // Customer tier for tier-based rules
            ]);

            // Step 7: Get all active promotion rules from database
            // Rules are ordered by 'salience' (priority) - lower salience = higher priority
            $rules = PromotionRule::active()        // Only active rules
                ->currentlyValid()                   // Only rules within valid date range
                ->orderBy('salience', 'asc')        // Order by priority (1, 2, 3...)
                ->get();

            // Step 8: Initialize result tracking variables
            $appliedRules = [];      // Array to store successfully applied rules
            $totalDiscount = 0;      // Total money discount amount
            $freeItems = [];         // Array to store all free items
            $currentCartTotal = $cartTotal; // Running total after each discount

            // Step 9: Process each promotion rule ONCE for the entire cart
            // This prevents the same rule from being applied multiple times to different items
            foreach ($rules as $rule) {
                // Log which rule we're evaluating
                Log::info('Evaluating Rule', [
                    'rule_id' => $rule->id,
                    'rule_name' => $rule->name,
                    'stackable' => $rule->stackable  // Can this rule be combined with others?
                ]);

                // Evaluate this rule against the entire cart
                // Returns both discount amount and free items for this rule
                $ruleResult = $this->evaluateRuleForEntireCart($rule, $cart, $user, $currentCartTotal);

                // Step 10: Check if rule provided any benefits (discount or free items)
                if ($ruleResult['discount'] > 0 || !empty($ruleResult['freeItems'])) {
                    // Add this rule to applied rules list
                    $appliedRules[] = [
                        'ruleId' => $rule->id,                              // Rule identifier
                        'ruleName' => $rule->name,                          // Human-readable rule name
                        'discount' => round($ruleResult['discount'], 2),    // Money discount amount
                        'freeUnits' => $ruleResult['freeItems']            // Free items given
                    ];

                    // Apply discount to running cart total
                    $totalDiscount += $ruleResult['discount'];
                    $currentCartTotal -= $ruleResult['discount'];

                    // Add free items to master list
                    $freeItems = array_merge($freeItems, $ruleResult['freeItems']);

                    // Log successful rule application
                    Log::info('Rule Applied', [
                        'rule_id' => $rule->id,
                        'discount' => $ruleResult['discount'],
                        'free_items_count' => count($ruleResult['freeItems']),
                        'remaining_total' => $currentCartTotal
                    ]);

                    // Step 11: Check if rule is stackable
                    // If rule is not stackable, stop processing other rules
                    if (!$rule->stackable) {
                        Log::info('Non-stackable rule applied, stopping evaluation');
                        break; // Exit the foreach loop
                    }
                }
            }

            // Step 12: Ensure final total is never negative (can't pay negative money)
            $finalTotal = max(0, $currentCartTotal);

            // Step 13: Build response structure
            $response = [
                'applied' => $appliedRules,                          // List of applied rules with details
                'totalDiscount' => round($totalDiscount, 2),        // Total money saved
                'originalTotal' => round($cartTotal, 2),            // Original cart value
                'finalTotal' => round($finalTotal, 2),              // Amount customer pays
                'freeItems' => $this->consolidateFreeItems($freeItems) // Consolidated free items list
            ];

            // Step 14: Log completion for debugging
            Log::info('Cart Evaluation Completed', $response);

            // Step 15: Return JSON response
            return response()->json($response);

        } catch (\Exception $e) {
            // Handle any errors during evaluation
            Log::error('Cart Evaluation Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return error response
            return response()->json([
                'error' => 'Failed to evaluate cart promotions',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Evaluate a single promotion rule against the entire cart
     *
     * This method:
     * 1. Loops through each cart item
     * 2. Checks if the item matches the rule conditions
     * 3. Calculates benefits (discount + free items) for matching items
     * 4. Returns consolidated results for this rule
     *
     * @param PromotionRule $rule The promotion rule to evaluate
     * @param Cart $cart The user's shopping cart
     * @param $user The authenticated user
     * @param float $currentCartTotal Current cart value (after previous discounts)
     * @return array Contains 'discount' and 'freeItems' for this rule
     */
    private function evaluateRuleForEntireCart(PromotionRule $rule, Cart $cart, $user, float $currentCartTotal): array
    {
        // Get customer information for customer-based conditions
        $customer = $user->customer;

        // Initialize accumulators for this rule
        $totalRuleDiscount = 0;  // Total discount this rule provides
        $freeItems = [];         // Free items this rule provides

        // Check each cart item to see if the rule applies to it
        foreach ($cart->cartItems as $cartItem) {
            // Get product information
            $product = $cartItem->product;

            // Step 1: Build evaluation context with all data needed for condition checking
            $context = [
                'line' => [
                    'productId' => $product->id,           // Product identifier
                    'quantity' => $cartItem->quantity,     // How many customer is buying
                    'unitPrice' => $product->unit_price,   // Price per unit
                    'categoryId' => $product->category_id, // Product category
                ],
                'customer' => [
                    'email' => $user->email,                           // Customer email
                    'loyaltyTier' => $customer->loyalty_tier ?? 'none', // Customer loyalty level
                    'ordersCount' => $customer->orders_count ?? 0,     // How many orders customer has made
                    'city' => $customer->city ?? null,                 // Customer city
                    'businessType' => $customer->business_type ?? null, // Business customer type
                ]
            ];

            // Log which item we're checking
            Log::info('Evaluating Rule for Item', [
                'rule_id' => $rule->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $cartItem->quantity,
                'unit_price' => $product->unit_price
            ]);

            // Step 2: Check if this line item matches the rule conditions
            if ($this->evaluateConditions($rule->conditions, $context['line'], $context['customer'])) {
                // Conditions matched! Calculate benefits for this line item

                // Calculate original line total
                $lineTotal = $cartItem->quantity * $product->unit_price;

                // Calculate what benefits this rule gives for this line item
                $lineResult = $this->calculateBenefitsForLine($rule->actions, $context['line'], $lineTotal, $product);

                // Add line benefits to rule totals
                $totalRuleDiscount += $lineResult['discount'];
                $freeItems = array_merge($freeItems, $lineResult['freeItems']);

                // Log successful condition match
                Log::info('Rule Condition Matched', [
                    'rule_id' => $rule->id,
                    'product_id' => $product->id,
                    'line_discount' => $lineResult['discount'],
                    'free_items_count' => count($lineResult['freeItems'])
                ]);
            } else {
                // Conditions didn't match for this item
                Log::info('Rule Condition Not Matched', [
                    'rule_id' => $rule->id,
                    'product_id' => $product->id
                ]);
            }
        }

        // Return consolidated results for this rule
        return [
            'discount' => $totalRuleDiscount,  // Total money discount for this rule
            'freeItems' => $freeItems          // All free items for this rule
        ];
    }

    /**
     * Calculate benefits (discount + free items) for a specific line item
     *
     * This method processes the rule actions and determines:
     * - How much money discount to apply
     * - What free items to give
     *
     * @param array $actions Rule actions to apply
     * @param array $lineData Line item data (product, quantity, price)
     * @param float $lineTotal Original line total before any benefits
     * @param $product Product model for free item details
     * @return array Contains 'discount' and 'freeItems' for this line
     */
    private function calculateBenefitsForLine(array $actions, array $lineData, float $lineTotal, $product): array
    {
        // Initialize benefit accumulators for this line
        $lineDiscount = 0;  // Money discount for this line
        $freeItems = [];    // Free items for this line

        // Process each action in the rule
        foreach ($actions as $action) {
            // Extract action details
            $type = $action['type'] ?? '';   // Action type (applyPercent, applyFreeUnits)
            $value = $action['value'] ?? 0;  // Action value (percentage, quantity)

            // Process based on action type
            switch ($type) {
                case 'applyPercent':
                    // Apply percentage discount to reduce the price customer pays
                    $discount = ($lineTotal * $value) / 100;  // Calculate percentage of line total
                    $lineDiscount += $discount;               // Add to line discount total

                    // Log percentage discount application
                    Log::info('Applied Percentage Discount', [
                        'line_total' => $lineTotal,
                        'percentage' => $value,
                        'discount_amount' => $discount
                    ]);
                    break;

                case 'applyFreeUnits':
                    // Give free units (additional products without reducing price)
                    // FIXED: Use the actual value from rule, not limited by purchased quantity
                    $freeUnits = (int) $value;  // Convert to integer (free units should be whole numbers)

                    // Only give free units if value is positive
                    if ($freeUnits > 0) {
                        // Create free item entry
                        $freeItems[] = [
                            'productId' => $product->id,                           // Which product is free
                            'productName' => $product->name,                       // Product name for display
                            'freeQuantity' => $freeUnits,                         // How many free units
                            'unitPrice' => $product->unit_price,                  // Price per unit (for value calculation)
                            'totalValue' => $freeUnits * $product->unit_price,    // Total value of free items
                            'reason' => 'Free units promotion'                    // Why they're getting it free
                        ];
                    }

                    // Log free units application
                    Log::info('Applied Free Units', [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'free_units_requested' => $value,        // What rule asked for
                        'free_units_granted' => $freeUnits,      // What we're giving
                        'unit_price' => $product->unit_price,
                        'total_free_value' => $freeUnits * $product->unit_price
                    ]);
                    break;

                default:
                    // Unknown action type - log warning but don't fail
                    Log::warning('Unknown Action Type', [
                        'type' => $type,
                        'value' => $value
                    ]);
                    break;
            }
        }

        // Return benefits calculated for this line
        return [
            'discount' => $lineDiscount,  // Money discount for this line
            'freeItems' => $freeItems     // Free items for this line
        ];
    }

    /**
     * Consolidate free items by product to avoid duplicates
     *
     * If multiple rules give free items of the same product,
     * combine them into a single entry
     *
     * @param array $freeItems Array of free items from all rules
     * @return array Consolidated free items list
     */
    private function consolidateFreeItems(array $freeItems): array
    {
        $consolidated = [];  // Temporary associative array for consolidation

        // Process each free item
        foreach ($freeItems as $item) {
            $productId = $item['productId'];  // Use product ID as key

            // Check if we already have free items for this product
            if (isset($consolidated[$productId])) {
                // Add to existing free item entry
                $consolidated[$productId]['freeQuantity'] += $item['freeQuantity'];  // Add quantities
                $consolidated[$productId]['totalValue'] += $item['totalValue'];      // Add values
            } else {
                // Create new free item entry
                $consolidated[$productId] = $item;
            }
        }

        // Convert associative array back to indexed array for JSON response
        return array_values($consolidated);
    }

    /**
     * Evaluate rule conditions recursively
     *
     * Handles both simple conditions and complex AND/OR logic
     *
     * @param mixed $conditions Rule conditions to evaluate
     * @param array $lineData Current line item data
     * @param array $customerData Customer data
     * @return bool True if conditions match, false otherwise
     */
    private function evaluateConditions($conditions, array $lineData, array $customerData): bool
    {
        // Step 1: Check if conditions exist
        if (!$conditions) {
            return false;  // No conditions = no match
        }

        // Step 2: Check if this is a single condition or complex condition
        if (!isset($conditions['type'])) {
            // Single condition - evaluate directly
            return $this->evaluateSingleCondition($conditions, $lineData, $customerData);
        }

        // Step 3: Complex condition with AND/OR logic
        $type = strtoupper($conditions['type']);  // Convert to uppercase for comparison
        $rules = $conditions['rules'] ?? [];      // Get sub-rules

        // Log complex condition evaluation
        Log::info('Evaluating Complex Conditions', [
            'type' => $type,
            'rule_count' => count($rules)
        ]);

        // Step 4: Process based on condition type
        if ($type === 'AND') {
            // ALL sub-conditions must be true
            foreach ($rules as $rule) {
                // If any sub-condition fails, entire AND fails
                if (!$this->evaluateConditions($rule, $lineData, $customerData)) {
                    Log::info('AND condition failed');
                    return false;
                }
            }
            // All sub-conditions passed
            Log::info('All AND conditions passed');
            return true;

        } elseif ($type === 'OR') {
            // At least ONE sub-condition must be true
            foreach ($rules as $rule) {
                // If any sub-condition passes, entire OR passes
                if ($this->evaluateConditions($rule, $lineData, $customerData)) {
                    Log::info('OR condition passed');
                    return true;
                }
            }
            // No sub-conditions passed
            Log::info('No OR conditions passed');
            return false;
        }

        // Unknown condition type
        Log::warning('Unknown condition type', ['type' => $type]);
        return false;
    }

    /**
     * Evaluate a single condition against actual data
     *
     * @param array $condition Single condition with field, operator, value
     * @param array $lineData Line item data
     * @param array $customerData Customer data
     * @return bool True if condition matches, false otherwise
     */
    private function evaluateSingleCondition(array $condition, array $lineData, array $customerData): bool
    {
        // Extract condition components
        $field = $condition['field'] ?? '';           // What field to check
        $operator = $condition['operator'] ?? 'equals'; // How to compare
        $expectedValue = $condition['value'] ?? null;    // What value to expect

        // Get the actual value from the data
        $actualValue = $this->getFieldValue($field, $lineData, $customerData);

        // Compare actual vs expected using the operator
        $result = $this->compareValues($actualValue, $operator, $expectedValue);

        // Log detailed condition evaluation
        Log::info('Single Condition Evaluation', [
            'field' => $field,
            'operator' => $operator,
            'expected_value' => $expectedValue,
            'actual_value' => $actualValue,
            'result' => $result ? 'MATCH' : 'NO_MATCH'
        ]);

        return $result;
    }

    /**
     * Get field value from line or customer data
     *
     * Handles both dot notation (customer.loyaltyTier) and underscore notation (customer_tier)
     *
     * @param string $field Field name to retrieve
     * @param array $lineData Line item data
     * @param array $customerData Customer data
     * @return mixed The field value or null if not found
     */
    private function getFieldValue(string $field, array $lineData, array $customerData)
    {
        // Handle dot notation: line.productId, customer.loyaltyTier
        if (str_starts_with($field, 'line.')) {
            $lineField = substr($field, 5); // Remove 'line.' prefix
            return $lineData[$lineField] ?? null;
        }

        if (str_starts_with($field, 'customer.')) {
            $customerField = substr($field, 9); // Remove 'customer.' prefix
            return $customerData[$customerField] ?? null;
        }

        // Handle underscore notation from visual builder
        // Map frontend field names to backend data structure
        $fieldMapping = [
            // Customer fields
            'customer_tier' => $customerData['loyaltyTier'] ?? null,
            'customer_email' => $customerData['email'] ?? null,
            'customer_city' => $customerData['city'] ?? null,
            'customer_orders_count' => $customerData['ordersCount'] ?? null,
            'customer_business_type' => $customerData['businessType'] ?? null,

            // Line/Product fields
            'product_id' => $lineData['productId'] ?? null,
            'category_id' => $lineData['categoryId'] ?? null,
            'quantity' => $lineData['quantity'] ?? null,
            'unit_price' => $lineData['unitPrice'] ?? null,
        ];

        // Check if field exists in mapping
        if (isset($fieldMapping[$field])) {
            return $fieldMapping[$field];
        }

        // Field not found
        Log::warning('Unknown Field Requested', [
            'field' => $field,
            'available_line_fields' => array_keys($lineData),
            'available_customer_fields' => array_keys($customerData)
        ]);

        return null;
    }

    /**
     * Compare actual and expected values using the specified operator
     *
     * @param mixed $actual Actual value from data
     * @param string $operator Comparison operator
     * @param mixed $expected Expected value from rule
     * @return bool Comparison result
     */
    private function compareValues($actual, string $operator, $expected): bool
    {
        // Process based on operator type
        switch ($operator) {
            case 'equals':
                return $actual == $expected;  // Loose equality
            case 'notEquals':
                return $actual != $expected;  // Loose inequality
            case 'greaterThan':
                return $actual > $expected;   // Numeric comparison
            case 'greaterThanOrEqual':
                return $actual >= $expected;  // Numeric comparison
            case 'lessThan':
                return $actual < $expected;   // Numeric comparison
            case 'lessThanOrEqual':
                return $actual <= $expected;  // Numeric comparison
            case 'contains':
                // String contains check
                return is_string($actual) && str_contains($actual, $expected);
            case 'startsWith':
                // String starts with check
                return is_string($actual) && str_starts_with($actual, $expected);
            case 'endsWith':
                // String ends with check
                return is_string($actual) && str_ends_with($actual, $expected);
            case 'in':
                // Value in array check
                return is_array($expected) && in_array($actual, $expected);
            case 'notIn':
                // Value not in array check
                return is_array($expected) && !in_array($actual, $expected);
            default:
                // Unknown operator
                Log::warning('Unknown Comparison Operator', ['operator' => $operator]);
                return false;
        }
    }
}
