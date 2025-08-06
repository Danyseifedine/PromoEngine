// Rule engine type definitions
export interface PromotionRule {
  id?: number;
  name: string;
  salience: number;
  stackable: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  active: boolean;
  valid_from?: string;
  valid_until?: string;
}

// Base condition interface
export interface RuleCondition {
  type: ConditionType;
  field: string;
  operator: ConditionOperator;
  value: any;
  id: string;
}

// Base action interface
export interface RuleAction {
  type: ActionType;
  field?: string;
  value: any;
  id: string;
}

// Condition types for promotion rules
export enum ConditionType {
  // by Product ID
  PRODUCT_ID = 'product_id',
}

// Action types for promotion rules
export enum ActionType {
  PERCENTAGE_DISCOUNT = 'percentage_discount',
}

// Condition operators
export enum ConditionOperator {
  EQUALS = 'equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  CONTAINS = 'contains',
  IN = 'in',
  NOT_IN = 'not_in',
}

// Rete node data interfaces
export interface ConditionNodeData {
  condition: RuleCondition;
}

export interface ActionNodeData {
  action: RuleAction;
}

// Socket types for Rete connections
export interface RuleSocket {
  key: string;
  name: string;
}