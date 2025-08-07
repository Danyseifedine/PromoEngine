<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\PromotionRule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EvaluationController extends Controller
{
    /**
     * Evaluate promotions for user's cart
     * POST /api/evaluate
     */
    public function evaluate(Request $request): JsonResponse
    {
        try {
            // Get cart from authenticated user
            $user = $request->user();
            $cart = Cart::where('user_id', $user->id)->with(['cartItems.product.category', 'user.customer'])->first();

            if (!$cart || $cart->cartItems->isEmpty()) {
                return response()->json([
                    'applied' => [],
                    'totalDiscount' => 0,
                    'finalTotal' => 0
                ]);
            }

            $customer = $user->customer;
            $cartTotal = 0;

            // Calculate original cart total
            foreach ($cart->cartItems as $cartItem) {
                $lineTotal = $cartItem->quantity * $cartItem->product->unit_price;
                $cartTotal += $lineTotal;
            }

            // Get all active rules ordered by salience (priority)
            $rules = PromotionRule::active()
                ->currentlyValid()
                ->orderBy('salience', 'asc')
                ->get();

            $appliedRules = [];
            $totalDiscount = 0;
            $currentCartTotal = $cartTotal;

            // Evaluate each rule ONCE for the entire cart
            foreach ($rules as $rule) {
                $ruleDiscount = $this->evaluateRuleForEntireCart($rule, $cart, $user, $currentCartTotal);

                if ($ruleDiscount > 0) {
                    $appliedRules[] = [
                        'ruleId' => $rule->id,
                        'ruleName' => $rule->name,
                        'discount' => round($ruleDiscount, 2)
                    ];

                    $totalDiscount += $ruleDiscount;
                    $currentCartTotal -= $ruleDiscount;

                    // Stop if rule is not stackable
                    if (!$rule->stackable) {
                        break;
                    }
                }
            }

            $finalTotal = max(0, $currentCartTotal);

            return response()->json([
                'applied' => $appliedRules,
                'totalDiscount' => round($totalDiscount, 2),
                'originalTotal' => round($cartTotal, 2),
                'finalTotal' => round($finalTotal, 2)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to evaluate cart promotions',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Evaluate a single rule for the entire cart
     */
    private function evaluateRuleForEntireCart(PromotionRule $rule, Cart $cart, $user, float $currentCartTotal): float
    {
        $customer = $user->customer;
        $totalRuleDiscount = 0;

        // Check each cart item to see if rule applies
        foreach ($cart->cartItems as $cartItem) {
            $product = $cartItem->product;

            // Create evaluation context for this line
            $context = [
                'line' => [
                    'productId' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'unitPrice' => $product->unit_price,
                    'categoryId' => $product->category_id,
                ],
                'customer' => [
                    'email' => $user->email,
                    'loyaltyTier' => $customer->loyalty_tier ?? 'none',
                    'ordersCount' => $customer->orders_count ?? 0,
                    'city' => $customer->city,
                    'businessType' => $customer->business_type,
                ]
            ];

            // Check if this line item matches the rule conditions
            if ($this->evaluateConditions($rule->conditions, $context['line'], $context['customer'])) {

                // Calculate discount for this specific line item
                $lineTotal = $cartItem->quantity * $product->unit_price;
                $lineDiscount = $this->calculateDiscountForLine($rule->actions, $context['line'], $lineTotal);

                $totalRuleDiscount += $lineDiscount;
            }
        }

        return $totalRuleDiscount;
    }

    /**
     * Calculate discount for a specific line item
     */
    private function calculateDiscountForLine(array $actions, array $lineData, float $lineTotal): float
    {
        $lineDiscount = 0;

        foreach ($actions as $action) {
            $type = $action['type'] ?? '';
            $value = $action['value'] ?? 0;

            switch ($type) {
                case 'applyPercent':
                    $discount = ($lineTotal * $value) / 100;
                    $lineDiscount += $discount;
                    break;

                case 'applyFreeUnits':
                    $freeUnits = min($value, $lineData['quantity']);
                    $discount = $freeUnits * $lineData['unitPrice'];
                    $lineDiscount += $discount;
                    break;
            }
        }

        return $lineDiscount;
    }

    /**
     * Evaluate rule conditions
     */
    private function evaluateConditions($conditions, array $lineData, array $customerData): bool
    {
        if (!$conditions) return false;

        if (!isset($conditions['type'])) {
            return $this->evaluateSingleCondition($conditions, $lineData, $customerData);
        }

        $type = strtoupper($conditions['type']);
        $rules = $conditions['rules'] ?? [];

        if ($type === 'AND') {
            foreach ($rules as $rule) {
                if (!$this->evaluateConditions($rule, $lineData, $customerData)) {
                    return false;
                }
            }
            return true;
        } elseif ($type === 'OR') {
            foreach ($rules as $rule) {
                if ($this->evaluateConditions($rule, $lineData, $customerData)) {
                    return true;
                }
            }
            return false;
        }

        return false;
    }

    private function evaluateSingleCondition(array $condition, array $lineData, array $customerData): bool
    {
        $field = $condition['field'] ?? '';
        $operator = $condition['operator'] ?? 'equals';
        $expectedValue = $condition['value'] ?? null;

        $actualValue = $this->getFieldValue($field, $lineData, $customerData);
        return $this->compareValues($actualValue, $operator, $expectedValue);
    }

    private function getFieldValue(string $field, array $lineData, array $customerData)
    {
        if (str_starts_with($field, 'line.')) {
            $lineField = substr($field, 5);
            return $lineData[$lineField] ?? null;
        }

        if (str_starts_with($field, 'customer.')) {
            $customerField = substr($field, 9);
            return $customerData[$customerField] ?? null;
        }

        return null;
    }

    private function compareValues($actual, string $operator, $expected): bool
    {
        switch ($operator) {
            case 'equals':
                return $actual == $expected;
            case 'notEquals':
                return $actual != $expected;
            case 'greaterThan':
                return $actual > $expected;
            case 'greaterThanOrEqual':
                return $actual >= $expected;
            case 'lessThan':
                return $actual < $expected;
            case 'lessThanOrEqual':
                return $actual <= $expected;
            case 'contains':
                return is_string($actual) && str_contains($actual, $expected);
            case 'startsWith':
                return is_string($actual) && str_starts_with($actual, $expected);
            case 'endsWith':
                return is_string($actual) && str_ends_with($actual, $expected);
            case 'in':
                return is_array($expected) && in_array($actual, $expected);
            case 'notIn':
                return is_array($expected) && !in_array($actual, $expected);
            default:
                return false;
        }
    }
}
