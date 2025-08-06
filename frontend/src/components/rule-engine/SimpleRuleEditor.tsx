// Import the React 18/19 polyfill FIRST - this is critical!
import './reactdom-polyfill';

// Simple Rete.js Rule Editor
import { useRef, useEffect, useState } from 'react';
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets as ReactPresets, ReactArea2D } from 'rete-react-plugin';
import { Button } from '@/components/ui/button';
import { ConditionOperator } from './types';
import { promotionRulesService, type PromotionRule } from '@/services/promotionRulesService';
import { useCategoryManagementStore } from '@/stores/categoryManagementStore';

// Socket types
class ConditionSocket extends ClassicPreset.Socket {
    constructor() {
        super("condition");
    }
}

// Category Interface
interface Category {
    id: number;
    name: string;
}

// Customer Tiers
enum CustomerTier {
    BRONZE = 'bronze',
    SILVER = 'silver', 
    GOLD = 'gold'
}

// Simple Product ID Node
class ProductIdNode extends ClassicPreset.Node {
    productId: number = 1;
    operator: ConditionOperator = ConditionOperator.EQUALS;

    constructor(id: string) {
        super("Product ID");
        this.id = id;

        // Add operator dropdown control
        const operatorControl = new ClassicPreset.InputControl("operator", {
            initial: this.operator,
            change: (value) => { this.operator = value as ConditionOperator; }
        });
        (operatorControl as any).parent = this;
        (operatorControl as any).key = 'operator';
        this.addControl("operator", operatorControl);

        const productIdControl = new ClassicPreset.InputControl("number", {
            initial: this.productId,
            change: (value) => { this.productId = value; }
        });
        (productIdControl as any).parent = this;
        (productIdControl as any).key = 'productId';
        this.addControl("productId", productIdControl);

        this.addOutput("condition", new ClassicPreset.Output(new ConditionSocket(), "Condition"));
    }
}

// Category Condition Node
class CategoryNode extends ClassicPreset.Node {
    categoryId: number = 1;
    operator: ConditionOperator = ConditionOperator.EQUALS;
    categories: Category[] = [];

    constructor(id: string, categories: Category[] = []) {
        super("Category ID");
        this.id = id;
        this.categories = categories;

        // Add operator dropdown control
        const operatorControl = new ClassicPreset.InputControl("operator", {
            initial: this.operator,
            change: (value) => { this.operator = value as ConditionOperator; }
        });
        (operatorControl as any).parent = this;
        (operatorControl as any).key = 'operator';
        this.addControl("operator", operatorControl);

        // Add category selector control
        const categoryControl = new ClassicPreset.InputControl("category", {
            initial: this.categoryId,
            change: (value) => { this.categoryId = value; }
        });
        (categoryControl as any).parent = this;
        (categoryControl as any).key = 'categoryId';
        (categoryControl as any).categories = categories;
        this.addControl("categoryId", categoryControl);

        this.addOutput("condition", new ClassicPreset.Output(new ConditionSocket(), "Condition"));
    }
}

// Email Condition Node
class EmailNode extends ClassicPreset.Node {
    email: string = '';
    operator: ConditionOperator = ConditionOperator.EQUALS;

    constructor(id: string) {
        super("Email");
        this.id = id;

        // Add operator dropdown control
        const operatorControl = new ClassicPreset.InputControl("operator", {
            initial: this.operator,
            change: (value) => { this.operator = value as ConditionOperator; }
        });
        (operatorControl as any).parent = this;
        (operatorControl as any).key = 'operator';
        this.addControl("operator", operatorControl);

        // Add email input control
        const emailControl = new ClassicPreset.InputControl("text", {
            initial: this.email,
            change: (value) => { this.email = value; }
        });
        (emailControl as any).parent = this;
        (emailControl as any).key = 'email';
        this.addControl("email", emailControl);

        this.addOutput("condition", new ClassicPreset.Output(new ConditionSocket(), "Condition"));
    }
}

// Quantity Condition Node
class QuantityNode extends ClassicPreset.Node {
    quantity: number = 1;
    operator: ConditionOperator = ConditionOperator.EQUALS;

    constructor(id: string) {
        super("Quantity");
        this.id = id;

        // Add operator dropdown control
        const operatorControl = new ClassicPreset.InputControl("operator", {
            initial: this.operator,
            change: (value) => { this.operator = value as ConditionOperator; }
        });
        (operatorControl as any).parent = this;
        (operatorControl as any).key = 'operator';
        this.addControl("operator", operatorControl);

        // Add quantity input control
        const quantityControl = new ClassicPreset.InputControl("number", {
            initial: this.quantity,
            change: (value) => { this.quantity = value; }
        });
        (quantityControl as any).parent = this;
        (quantityControl as any).key = 'quantity';
        this.addControl("quantity", quantityControl);

        this.addOutput("condition", new ClassicPreset.Output(new ConditionSocket(), "Condition"));
    }
}

// Customer Tier Node
class CustomerTierNode extends ClassicPreset.Node {
    tier: CustomerTier = CustomerTier.BRONZE;
    operator: ConditionOperator = ConditionOperator.EQUALS;

    constructor(id: string) {
        super("Customer Tier");
        this.id = id;

        // Add operator dropdown control
        const operatorControl = new ClassicPreset.InputControl("operator", {
            initial: this.operator,
            change: (value) => { this.operator = value as ConditionOperator; }
        });
        (operatorControl as any).parent = this;
        (operatorControl as any).key = 'operator';
        this.addControl("operator", operatorControl);

        // Add tier selector control
        const tierControl = new ClassicPreset.InputControl("tier", {
            initial: this.tier,
            change: (value) => { this.tier = value as CustomerTier; }
        });
        (tierControl as any).parent = this;
        (tierControl as any).key = 'tier';
        this.addControl("tier", tierControl);

        this.addOutput("condition", new ClassicPreset.Output(new ConditionSocket(), "Condition"));
    }
}

// Simple Discount Node
class DiscountNode extends ClassicPreset.Node {
    percentage: number = 10;

    constructor(id: string) {
        super("Discount");
        this.id = id;

        this.addInput("condition", new ClassicPreset.Input(new ConditionSocket(), "Condition"));

        const percentageControl = new ClassicPreset.InputControl("number", {
            initial: this.percentage,
            change: (value) => { this.percentage = value; }
        });
        (percentageControl as any).parent = this;
        (percentageControl as any).key = 'percentage';
        this.addControl("percentage", percentageControl);
    }
}

// Free Units Action Node
class FreeUnitsNode extends ClassicPreset.Node {
    quantity: number = 1;

    constructor(id: string) {
        super("Free Units");
        this.id = id;

        this.addInput("condition", new ClassicPreset.Input(new ConditionSocket(), "Condition"));

        const quantityControl = new ClassicPreset.InputControl("number", {
            initial: this.quantity,
            change: (value) => { this.quantity = value; }
        });
        (quantityControl as any).parent = this;
        (quantityControl as any).key = 'quantity';
        this.addControl("quantity", quantityControl);
    }
}

// Simple OR Node
class OrNode extends ClassicPreset.Node {
    constructor(id: string) {
        super("OR Logic");
        this.id = id;
        this.addInput("a", new ClassicPreset.Input(new ConditionSocket(), "A"));
        this.addInput("b", new ClassicPreset.Input(new ConditionSocket(), "B"));
        this.addOutput("result", new ClassicPreset.Output(new ConditionSocket(), "Result"));
    }
}

// Simple AND Node
class AndNode extends ClassicPreset.Node {
    constructor(id: string) {
        super("AND Logic");
        this.id = id;
        this.addInput("a", new ClassicPreset.Input(new ConditionSocket(), "A"));
        this.addInput("b", new ClassicPreset.Input(new ConditionSocket(), "B"));
        this.addOutput("result", new ClassicPreset.Output(new ConditionSocket(), "Result"));
    }
}

type Schemes = GetSchemes<
    ProductIdNode | CategoryNode | EmailNode | CustomerTierNode | DiscountNode | FreeUnitsNode | OrNode | AndNode,
    ClassicPreset.Connection<ProductIdNode | CategoryNode | EmailNode | CustomerTierNode | DiscountNode | FreeUnitsNode | OrNode | AndNode, ProductIdNode | CategoryNode | EmailNode | CustomerTierNode | DiscountNode | FreeUnitsNode | OrNode | AndNode>
>;

export interface SimpleRuleEditorProps {
    onRuleChange?: (rule: unknown) => void;
}

export function SimpleRuleEditor({ onRuleChange }: SimpleRuleEditorProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<NodeEditor<Schemes> | null>(null);
    const [area, setArea] = useState<AreaPlugin<Schemes, ReactArea2D<Schemes>> | null>(null);
    
    // Rule metadata state
    const [ruleName, setRuleName] = useState('My Rule');
    const [salience, setSalience] = useState(10);
    const [stackable, setStackable] = useState(true);
    const [validFrom, setValidFrom] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { categories: categoriesData, getCategories } = useCategoryManagementStore();
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (!categoriesData?.categories || categoriesData.categories.length === 0) {
                    await getCategories();
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        
        fetchCategories();
    }, []); // Empty dependency array to run only once

    // Update local categories state when store data changes
    useEffect(() => {
        console.log('Categories data from store:', categoriesData);
        
        // Try different possible data structures
        let categoryList = null;
        if (categoriesData?.categories) {
            categoryList = categoriesData.categories;
        } else if (categoriesData?.data) {
            categoryList = categoriesData.data;
        } else if (Array.isArray(categoriesData)) {
            categoryList = categoriesData;
        }
        
        if (categoryList && Array.isArray(categoryList)) {
            console.log('Setting categories:', categoryList);
            setCategories(categoryList.map((cat: any) => ({
                id: cat.id,
                name: cat.name
            })));
        } else {
            console.log('No valid category list found');
        }
    }, [categoriesData]);

    useEffect(() => {
        if (!ref.current) return;

        const initializeEditor = async () => {
            const editor = new NodeEditor<Schemes>();
            const area = new AreaPlugin<Schemes, ReactArea2D<Schemes>>(ref.current!);
            const connection = new ConnectionPlugin<Schemes, ReactArea2D<Schemes>>();
            const reactPlugin = new ReactPlugin<Schemes, ReactArea2D<Schemes>>();

            editor.use(area);
            area.use(connection);
            area.use(reactPlugin);

            connection.addPreset(ConnectionPresets.classic.setup());

            // Custom rendering with working inputs
            reactPlugin.addPreset(ReactPresets.classic.setup({
                customize: {
                    control(context) {
                        // Handle category selector (dropdown)
                        if (context.payload.type === "category") {
                            return () => {
                                const [value, setValue] = useState(context.payload.value || context.payload.initial || 1);
                                const availableCategories = (context.payload as any).categories || categories;
                                console.log('Available categories in dropdown:', availableCategories);
                                
                                const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newValue = Number(e.target.value);
                                    setValue(newValue);
                                    context.payload.value = newValue;
                                    if (context.payload.change) {
                                        context.payload.change(newValue);
                                    }
                                    const node = context.payload.parent as any;
                                    const controlKey = context.payload.key;
                                    if (node && controlKey) {
                                        node[controlKey] = newValue;
                                    }
                                };

                                return (
                                    <div
                                        style={{
                                            pointerEvents: 'auto',
                                            position: 'relative',
                                            zIndex: 9999,
                                            margin: '2px 0'
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onPointerUp={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onMouseUp={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <select
                                            value={value}
                                            onChange={handleChange}
                                            style={{
                                                background: 'white',
                                                color: 'black',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                width: '140px',
                                                pointerEvents: 'auto',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {availableCategories.map((cat: Category) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            };
                        }
                        
                        // Handle tier selector (dropdown)
                        if (context.payload.type === "tier") {
                            return () => {
                                const [value, setValue] = useState(context.payload.value || context.payload.initial || CustomerTier.BRONZE);
                                
                                const tiers = [
                                    { value: CustomerTier.BRONZE, label: "Bronze" },
                                    { value: CustomerTier.SILVER, label: "Silver" },
                                    { value: CustomerTier.GOLD, label: "Gold" }
                                ];

                                const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newValue = e.target.value as CustomerTier;
                                    setValue(newValue);
                                    context.payload.value = newValue;
                                    if (context.payload.change) {
                                        context.payload.change(newValue);
                                    }
                                    const node = context.payload.parent as any;
                                    const controlKey = context.payload.key;
                                    if (node && controlKey) {
                                        node[controlKey] = newValue;
                                    }
                                };

                                return (
                                    <div
                                        style={{
                                            pointerEvents: 'auto',
                                            position: 'relative',
                                            zIndex: 9999,
                                            margin: '2px 0'
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onPointerUp={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onMouseUp={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <select
                                            value={value}
                                            onChange={handleChange}
                                            style={{
                                                background: 'white',
                                                color: 'black',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                width: '100px',
                                                pointerEvents: 'auto',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {tiers.map(tier => (
                                                <option key={tier.value} value={tier.value}>
                                                    {tier.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            };
                        }

                        // Handle operator selector (dropdown)
                        if (context.payload.type === "operator") {
                            return () => {
                                const [value, setValue] = useState(context.payload.value || context.payload.initial || ConditionOperator.EQUALS);

                                // Get available operators based on control context
                                const getOperatorsForControl = () => {
                                    const node = context.payload.parent;
                                    
                                    // Email node gets text-specific operators
                                    if (node instanceof EmailNode) {
                                        return [
                                            { value: ConditionOperator.EQUALS, label: "Equals (=)" },
                                            { value: 'not_equals', label: "Not Equals (≠)" },
                                            { value: 'ends_with', label: "Ends With" },
                                        ];
                                    }
                                    
                                    // Category and Tier nodes get equals/not equals only
                                    if (node instanceof CategoryNode || node instanceof CustomerTierNode) {
                                        return [
                                            { value: ConditionOperator.EQUALS, label: "Equals (=)" },
                                            { value: 'not_equals', label: "Not Equals (≠)" },
                                        ];
                                    }
                                    
                                    // Default numeric operators for ProductId and other nodes
                                    return [
                                        { value: ConditionOperator.EQUALS, label: "Equals (=)" },
                                        { value: ConditionOperator.GREATER_THAN, label: "Greater than (>)" },
                                        { value: ConditionOperator.LESS_THAN, label: "Less than (<)" },
                                        { value: ConditionOperator.GREATER_THAN_OR_EQUAL, label: "Greater or equal (>=)" },
                                        { value: ConditionOperator.LESS_THAN_OR_EQUAL, label: "Less or equal (<=)" }
                                    ];
                                };
                                
                                const operators = getOperatorsForControl();

                                const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newValue = e.target.value as ConditionOperator;
                                    setValue(newValue);
                                    context.payload.value = newValue;
                                    if (context.payload.change) {
                                        context.payload.change(newValue);
                                    }
                                    // Update the node's operator property directly
                                    const node = context.payload.parent as any;
                                    if (node && 'operator' in node) {
                                        node.operator = newValue;
                                    }
                                };

                                return (
                                    <div
                                        style={{
                                            pointerEvents: 'auto',
                                            position: 'relative',
                                            zIndex: 9999,
                                            margin: '2px 0'
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onPointerUp={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onMouseUp={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <select
                                            value={value}
                                            onChange={handleChange}
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onPointerUp={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onMouseUp={(e) => e.stopPropagation()}
                                            onClick={(e) => e.stopPropagation()}
                                            onFocus={(e) => e.stopPropagation()}
                                            style={{
                                                background: 'white',
                                                color: 'black',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                width: '140px',
                                                pointerEvents: 'auto',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {operators.map(op => (
                                                <option key={op.value} value={op.value}>
                                                    {op.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            };
                        }

                        // Handle text and number inputs
                        if (context.payload.type === "text" || context.payload.type === "number") {
                            return () => {
                                const [value, setValue] = useState(context.payload.value || context.payload.initial || "");

                                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newValue = context.payload.type === "number" ? Number(e.target.value) : e.target.value;
                                    setValue(e.target.value);
                                    context.payload.value = newValue;
                                    if (context.payload.change) {
                                        context.payload.change(newValue);
                                    }
                                    // Update the node's property directly based on control key
                                    const node = context.payload.parent as any;
                                    const controlKey = context.payload.key;
                                    if (node && controlKey) {
                                        node[controlKey] = newValue;
                                    }
                                };

                                return (
                                    <div
                                        style={{
                                            pointerEvents: 'auto',
                                            position: 'relative',
                                            zIndex: 9999,
                                            margin: '2px 0'
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onPointerUp={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onMouseUp={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type={context.payload.type}
                                            value={value}
                                            onChange={handleChange}
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onPointerUp={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onMouseUp={(e) => e.stopPropagation()}
                                            onClick={(e) => e.stopPropagation()}
                                            onFocus={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => e.stopPropagation()}
                                            onKeyUp={(e) => e.stopPropagation()}
                                            style={{
                                                background: 'white',
                                                color: 'black',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                width: context.payload.type === "number" ? '80px' : '100px',
                                                pointerEvents: 'auto',
                                                outline: 'none',
                                                cursor: 'text'
                                            }}
                                            placeholder={context.payload.type === "text" ? "equals" : "1"}
                                            min={context.payload.type === "number" ? "0" : undefined}
                                            step={context.payload.type === "number" ? "1" : undefined}
                                        />
                                    </div>
                                );
                            };
                        }
                        return ReactPresets.classic.Control;
                    },
                    node(context) {
                        const Node = ReactPresets.classic.Node;

                        return (props: any) => {
                            let style = {};
                            let title = "";

                            if (context.payload instanceof ProductIdNode) {
                                style = {
                                    background: '#3B82F6',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minWidth: '220px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                };
                                title = "🛍️ Product Condition";
                            } else if (context.payload instanceof CategoryNode) {
                                style = {
                                    background: '#6366F1',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minWidth: '220px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                };
                                title = "📂 Category Condition";
                            } else if (context.payload instanceof EmailNode) {
                                style = {
                                    background: '#0891B2',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minWidth: '220px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                };
                                title = "📧 Email Condition";
                            } else if (context.payload instanceof CustomerTierNode) {
                                style = {
                                    background: '#DC2626',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minWidth: '200px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                };
                                title = "👑 Customer Tier";
                            } else if (context.payload instanceof DiscountNode) {
                                style = {
                                    background: '#10B981',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minWidth: '180px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                };
                                title = "💰 Discount Action";
                            } else if (context.payload instanceof FreeUnitsNode) {
                                style = {
                                    background: '#059669',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minWidth: '180px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                };
                                title = "🎁 Free Units Action";
                            } else if (context.payload instanceof OrNode) {
                                style = {
                                    background: '#8B5CF6',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minWidth: '120px',
                                    textAlign: 'center' as const,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                };
                                title = "OR Logic";
                            } else if (context.payload instanceof AndNode) {
                                style = {
                                    background: '#F59E0B',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minWidth: '120px',
                                    textAlign: 'center' as const,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                };
                                title = "AND Logic";
                            }

                            return (
                                <div style={style}>
                                    {title && (
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            textAlign: 'center' as const
                                        }}>
                                            {title}
                                        </div>
                                    )}
                                    <Node {...props} />
                                </div>
                            );
                        };
                    }
                }
            }));

            AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
                accumulating: AreaExtensions.accumulateOnCtrl()
            });
            AreaExtensions.simpleNodesOrder(area);

            setEditor(editor);
            setArea(area);
        };

        initializeEditor();

        return () => {
            if (area) area.destroy();
        };
    }, []);

    const addProductIdNode = async () => {
        if (!editor || !area) return;
        const node = new ProductIdNode('product-id-' + Date.now());
        await editor.addNode(node);
        await area.translate(node.id, { x: 100, y: 100 });
    };

    const addCategoryNode = async () => {
        if (!editor || !area) return;
        const node = new CategoryNode('category-' + Date.now(), categories);
        await editor.addNode(node);
        await area.translate(node.id, { x: 100, y: 200 });
    };

    const addEmailNode = async () => {
        if (!editor || !area) return;
        const node = new EmailNode('email-' + Date.now());
        await editor.addNode(node);
        await area.translate(node.id, { x: 100, y: 300 });
    };

    const addQuantityNode = async () => {
        if (!editor || !area) return;
        const node = new QuantityNode('quantity-' + Date.now());
        await editor.addNode(node);
        await area.translate(node.id, { x: 100, y: 400 });
    };

    const addCustomerTierNode = async () => {
        if (!editor || !area) return;
        const node = new CustomerTierNode('tier-' + Date.now());
        await editor.addNode(node);
        await area.translate(node.id, { x: 100, y: 500 });
    };

    const addDiscountNode = async () => {
        if (!editor || !area) return;
        const node = new DiscountNode('discount-' + Date.now());
        await editor.addNode(node);
        await area.translate(node.id, { x: 400, y: 100 });
    };

    const addFreeUnitsNode = async () => {
        if (!editor || !area) return;
        const node = new FreeUnitsNode('free-units-' + Date.now());
        await editor.addNode(node);
        await area.translate(node.id, { x: 400, y: 200 });
    };

    const addOrNode = async () => {
        if (!editor || !area) return;
        const node = new OrNode('or-' + Date.now());
        await editor.addNode(node);
        await area.translate(node.id, { x: 250, y: 200 });
    };

    const addAndNode = async () => {
        if (!editor || !area) return;
        const node = new AndNode('and-' + Date.now());
        await editor.addNode(node);
        await area.translate(node.id, { x: 250, y: 300 });
    };

    const generateRule = () => {
        if (!editor) return null;

        const nodes = editor.getNodes();
        const connections = editor.getConnections();

        const conditions: Array<{ type: string; operator: string; value: any; id: string }> = [];
        const actions: Array<{ type: string; value: any; id: string }> = [];
        const logicalNodes: Array<{ type: string; id: string }> = [];

        nodes.forEach(node => {
            if (node instanceof ProductIdNode) {
                conditions.push({
                    type: 'product_id',
                    operator: node.operator,
                    value: node.productId,
                    id: node.id
                });
            } else if (node instanceof CategoryNode) {
                conditions.push({
                    type: 'category_id',
                    operator: node.operator,
                    value: node.categoryId,
                    id: node.id
                });
            } else if (node instanceof EmailNode) {
                conditions.push({
                    type: 'customer_email',
                    operator: node.operator,
                    value: node.email,
                    id: node.id
                });
            } else if (node instanceof QuantityNode) {
                conditions.push({
                    type: 'quantity',
                    operator: node.operator,
                    value: node.quantity,
                    id: node.id
                });
            } else if (node instanceof CustomerTierNode) {
                conditions.push({
                    type: 'customer_tier',
                    operator: node.operator,
                    value: node.tier,
                    id: node.id
                });
            } else if (node instanceof DiscountNode) {
                actions.push({
                    type: 'percentage_discount',
                    value: node.percentage,
                    id: node.id
                });
            } else if (node instanceof FreeUnitsNode) {
                actions.push({
                    type: 'free_units',
                    value: node.quantity,
                    id: node.id
                });
            } else if (node instanceof OrNode) {
                logicalNodes.push({
                    type: 'or',
                    id: node.id
                });
            } else if (node instanceof AndNode) {
                logicalNodes.push({
                    type: 'and',
                    id: node.id
                });
            }
        });

        const rule = {
            name: ruleName || `Rule_${Date.now()}`,
            salience: salience,
            stackable: stackable,
            active: true,
            valid_from: validFrom || null,
            valid_until: validUntil || null,
            conditions,
            actions,
            logicalNodes,
            connections: connections.map(conn => ({
                from: conn.source,
                to: conn.target,
                fromOutput: conn.sourceOutput,
                toInput: conn.targetInput
            })),
            createdAt: new Date().toISOString()
        };

        console.log('Generated Rule:', JSON.stringify(rule, null, 2));

        // Show JSON in alert or could be passed to parent component

        if (onRuleChange) {
            onRuleChange(rule);
        }

        return rule;
    };

    const submitRule = async () => {
        if (!editor) {
            alert('No editor available');
            return;
        }

        setIsSubmitting(true);
        try {
            const rule = generateRule();
            if (!rule) {
                alert('Failed to generate rule');
                return;
            }

            // Validate that we have at least one condition and one action
            if (rule.conditions.length === 0) {
                alert('Please add at least one condition node (Product ID, Category, Email, Quantity, or Customer Tier)');
                return;
            }
            
            if (rule.actions.length === 0) {
                alert('Please add at least one action node (Discount % or Free Units)');
                return;
            }

            const response = await promotionRulesService.createRule(rule as PromotionRule);
            
            if (response.success) {
                alert(`Rule "${rule.name}" submitted successfully!\n\nRule has been sent to the backend.`);
            } else {
                alert('Failed to submit rule: ' + response.message);
            }
        } catch (error: any) {
            console.error('Error submitting rule:', error);
            alert('Failed to submit rule: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Rule Metadata Form */}
            <div className="p-4 bg-white border-b">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                        <input
                            type="text"
                            value={ruleName}
                            onChange={(e) => setRuleName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter rule name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salience</label>
                        <input
                            type="number"
                            value={salience}
                            onChange={(e) => setSalience(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            max="100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                        <input
                            type="date"
                            value={validFrom}
                            onChange={(e) => setValidFrom(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                        <input
                            type="date"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stackable</label>
                        <div className="flex items-center h-9">
                            <input
                                type="checkbox"
                                checked={stackable}
                                onChange={(e) => setStackable(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-gray-700">Allow stacking</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Toolbar */}
            <div className="p-4 bg-gray-50 border-b">
                <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Conditions:</span>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={addProductIdNode} className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                            + Product ID
                        </Button>
                        <Button onClick={addCategoryNode} className="bg-indigo-500 hover:bg-indigo-600 text-white" size="sm">
                            + Category
                        </Button>
                        <Button onClick={addEmailNode} className="bg-cyan-500 hover:bg-cyan-600 text-white" size="sm">
                            + Email
                        </Button>
                        <Button onClick={addQuantityNode} className="bg-violet-500 hover:bg-violet-600 text-white" size="sm">
                            + Quantity
                        </Button>
                        <Button onClick={addCustomerTierNode} className="bg-red-500 hover:bg-red-600 text-white" size="sm">
                            + Customer Tier
                        </Button>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Actions:</span>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={addDiscountNode} className="bg-green-500 hover:bg-green-600 text-white" size="sm">
                            + Discount %
                        </Button>
                        <Button onClick={addFreeUnitsNode} className="bg-emerald-500 hover:bg-emerald-600 text-white" size="sm">
                            + Free Units
                        </Button>
                    </div>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Logic:</span>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={addOrNode} className="bg-purple-500 hover:bg-purple-600 text-white" size="sm">
                            + OR
                        </Button>
                        <Button onClick={addAndNode} className="bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                            + AND
                        </Button>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={ref}
                className="flex-1 bg-gray-100 relative overflow-hidden"
                style={{
                    minHeight: '300px',
                    maxHeight: 'calc(100vh - 320px)',
                    // Ensure input elements work properly
                    '--pointer-events': 'auto'
                }}
            />

            
            {/* Bottom Actions Bar */}
            <div className="p-4 bg-white mt-20 border-t">
                <div className="flex justify-center gap-4">
                    {/* <Button onClick={generateRule} variant="outline" className="px-6">
                        Generate & Preview JSON
                    </Button> */}
                    <Button 
                        onClick={submitRule} 
                        className="bg-green-600 hover:bg-green-700 text-white px-6"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Rule'}
                    </Button>
                </div>
            </div>

            {/* CSS to fix input interaction issues */}
            <style>{`
        .rete-control input, .rete-control select {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 1000 !important;
          cursor: text !important;
        }
        
        .rete-control select {
          cursor: pointer !important;
        }
        
        .rete-control {
          pointer-events: auto !important;
          z-index: 100 !important;
          margin: 4px 0 !important;
        }
        
        .rete-node {
          pointer-events: auto !important;
        }
        
        /* Ensure inputs and selects are always interactive */
        input[type="text"], input[type="number"], select {
          pointer-events: auto !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
          font-family: inherit !important;
        }

        /* Fix dragging interference */
        .rete-node .rete-control input:focus,
        .rete-node .rete-control select:focus {
          outline: 2px solid #3B82F6 !important;
          outline-offset: 1px !important;
        }
        
        /* Style socket connections */
        .rete-socket {
          cursor: crosshair !important;
        }
      `}</style>
        </div>
    );
}