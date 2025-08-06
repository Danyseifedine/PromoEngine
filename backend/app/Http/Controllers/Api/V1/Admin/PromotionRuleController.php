<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromotionRule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PromotionRuleController extends Controller
{
    /**
     * Store a newly created promotion rule in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Promotion Rule Creation Request', [
                'payload' => $request->all(),
            ]);

            // Validate the request
            $validator = $this->validateRequest($request);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Transform the visual builder format to database format
            $transformedData = $this->transformVisualRuleToDatabase($request->all());

            // Create the promotion rule
            $promotionRule = PromotionRule::create([
                'name' => $request->input('name'),
                'salience' => $request->input('salience', 10),
                'stackable' => $request->input('stackable', true),
                'active' => $request->input('active', true),
                'valid_from' => $request->input('valid_from') ?
                    \Carbon\Carbon::parse($request->input('valid_from')) : null,
                'valid_until' => $request->input('valid_until') ?
                    \Carbon\Carbon::parse($request->input('valid_until')) : null,
                'conditions' => $transformedData['conditions'],
                'actions' => $transformedData['actions'],
                // Store original visual data for editing
                'visual_data' => json_encode([
                    'conditions' => $request->input('conditions', []),
                    'actions' => $request->input('actions', []),
                    'logicalNodes' => $request->input('logicalNodes', []),
                    'connections' => $request->input('connections', [])
                ])
            ]);

            DB::commit();

            Log::info('Promotion Rule Created Successfully', [
                'rule_id' => $promotionRule->id,
                'rule_name' => $promotionRule->name
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Promotion rule created successfully',
                'data' => [
                    'id' => $promotionRule->id,
                    'name' => $promotionRule->name,
                    'salience' => $promotionRule->salience,
                    'stackable' => $promotionRule->stackable,
                    'active' => $promotionRule->active,
                    'valid_from' => $promotionRule->valid_from,
                    'valid_until' => $promotionRule->valid_until,
                    'conditions' => $promotionRule->conditions,
                    'actions' => $promotionRule->actions,
                    'created_at' => $promotionRule->created_at,
                    'updated_at' => $promotionRule->updated_at
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Error creating promotion rule', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create promotion rule',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Validate the incoming request
     */
    private function validateRequest(Request $request)
    {
        return Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'salience' => 'sometimes|integer|min:1|max:100',
            'stackable' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'conditions' => 'required|array|min:1',
            'conditions.*.type' => 'required|string',
            'conditions.*.operator' => 'required|string',
            'conditions.*.value' => 'required',
            'conditions.*.id' => 'required|string',
            'actions' => 'required|array|min:1',
            'actions.*.type' => 'required|string',
            'actions.*.value' => 'required',
            'actions.*.id' => 'required|string',
            'logicalNodes' => 'sometimes|array',
            'connections' => 'sometimes|array'
        ]);
    }

    /**
     * Transform visual rule builder format to database format
     */
    private function transformVisualRuleToDatabase(array $requestData): array
    {
        $conditions = $requestData['conditions'] ?? [];
        $actions = $requestData['actions'] ?? [];
        $logicalNodes = $requestData['logicalNodes'] ?? [];
        $connections = $requestData['connections'] ?? [];

        // Transform conditions based on logical connections
        $transformedConditions = $this->buildConditionsFromConnections(
            $conditions,
            $logicalNodes,
            $connections
        );

        // Transform actions
        $transformedActions = $this->transformActions($actions);

        return [
            'conditions' => $transformedConditions,
            'actions' => $transformedActions
        ];
    }

    /**
     * Build conditions structure from visual connections
     */
    private function buildConditionsFromConnections(array $conditions, array $logicalNodes, array $connections): array
    {
        // If no logical nodes, assume simple conditions
        if (empty($logicalNodes)) {
            if (count($conditions) === 1) {
                return $this->transformSingleCondition($conditions[0]);
            } else {
                // Multiple conditions without logical nodes - assume AND
                return [
                    'type' => 'AND',
                    'rules' => array_map([$this, 'transformSingleCondition'], $conditions)
                ];
            }
        }

        // Build from connections - find the root logical node
        $rootLogicalNode = $this->findRootLogicalNode($logicalNodes, $connections);

        if (!$rootLogicalNode) {
            // Fallback to simple AND logic
            return [
                'type' => 'AND',
                'rules' => array_map([$this, 'transformSingleCondition'], $conditions)
            ];
        }

        return $this->buildConditionTree($rootLogicalNode, $conditions, $logicalNodes, $connections);
    }

    /**
     * Transform a single condition from visual format to database format
     */
    private function transformSingleCondition(array $condition): array
    {
        // Map visual condition types to database field names
        $fieldMapping = [
            'product_id' => 'line.productId',
            'category_id' => 'line.categoryId',
            'quantity' => 'line.quantity',
            'unit_price' => 'line.unitPrice',
            'customer_type' => 'customer.businessType',
            'customer_city' => 'customer.city',
            'loyalty_tier' => 'customer.loyaltyTier',
            'orders_count' => 'customer.ordersCount'
        ];

        return [
            'field' => $fieldMapping[$condition['type']] ?? $condition['type'],
            'operator' => $this->mapOperator($condition['operator']),
            'value' => $condition['value']
        ];
    }

    /**
     * Map visual operators to database operators
     */
    private function mapOperator(string $operator): string
    {
        $operatorMapping = [
            'equals' => 'equals',
            'not_equals' => 'notEquals',
            'greater_than' => 'greaterThan',
            'greater_than_equal' => 'greaterThanOrEqual',
            'less_than' => 'lessThan',
            'less_than_equal' => 'lessThanOrEqual',
            'contains' => 'contains',
            'starts_with' => 'startsWith',
            'ends_with' => 'endsWith',
            'in' => 'in',
            'not_in' => 'notIn'
        ];

        return $operatorMapping[$operator] ?? $operator;
    }

    /**
     * Find the root logical node (the one that connects to actions)
     */
    private function findRootLogicalNode(array $logicalNodes, array $connections): ?array
    {
        foreach ($logicalNodes as $node) {
            // Check if this node connects to any action
            foreach ($connections as $connection) {
                if ($connection['from'] === $node['id']) {
                    return $node;
                }
            }
        }

        return $logicalNodes[0] ?? null;
    }

    /**
     * Recursively build condition tree from connections
     */
    private function buildConditionTree(array $logicalNode, array $conditions, array $logicalNodes, array $connections): array
    {
        $nodeId = $logicalNode['id'];
        $nodeType = strtoupper($logicalNode['type']); // 'and' -> 'AND'

        $rules = [];

        // Find all connections that feed into this logical node
        foreach ($connections as $connection) {
            if ($connection['to'] === $nodeId) {
                $fromId = $connection['from'];

                // Check if 'from' is a condition
                $condition = collect($conditions)->firstWhere('id', $fromId);
                if ($condition) {
                    $rules[] = $this->transformSingleCondition($condition);
                    continue;
                }

                // Check if 'from' is another logical node
                $childLogicalNode = collect($logicalNodes)->firstWhere('id', $fromId);
                if ($childLogicalNode) {
                    $rules[] = $this->buildConditionTree($childLogicalNode, $conditions, $logicalNodes, $connections);
                    continue;
                }
            }
        }

        return [
            'type' => $nodeType,
            'rules' => $rules
        ];
    }

    /**
     * Transform actions from visual format to database format
     */
    private function transformActions(array $actions): array
    {
        $transformedActions = [];

        foreach ($actions as $action) {
            $transformedAction = [
                'type' => $this->mapActionType($action['type']),
                'value' => $action['value']
            ];

            // Add additional properties based on action type
            if (isset($action['productId'])) {
                $transformedAction['productId'] = $action['productId'];
            }
            if (isset($action['quantity'])) {
                $transformedAction['quantity'] = $action['quantity'];
            }

            $transformedActions[] = $transformedAction;
        }

        return $transformedActions;
    }

    /**
     * Map visual action types to database action types
     */
    private function mapActionType(string $actionType): string
    {
        $actionMapping = [
            'percentage_discount' => 'applyPercent',
            'fixed_discount' => 'applyFixedAmount',
            'free_units' => 'applyFreeUnits',
            'free_shipping' => 'freeShipping',
            'add_gift' => 'addGift'
        ];

        return $actionMapping[$actionType] ?? $actionType;
    }
}
