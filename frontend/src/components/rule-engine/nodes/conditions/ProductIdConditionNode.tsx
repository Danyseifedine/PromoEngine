import { ClassicPreset } from 'rete';
import { useState } from 'react';

export class ProductIdConditionNode extends ClassicPreset.Node {
    productId: number = 1;

    constructor(id: string) {
        super('Product ID Condition');
        this.id = id;
    }

    static Component = ({ data }: { data: ProductIdConditionNode }) => {
        const [productId, setProductId] = useState(data.productId);

        const handleChange = (value: number) => {
            setProductId(value);
            data.productId = value;
        };

        return (
            <div className="bg-blue-500 text-white rounded-lg shadow-lg min-w-48">
                {/* Header */}
                <div className="px-4 py-2 bg-blue-600 rounded-t-lg">
                    <h3 className="font-semibold text-sm">Product ID Check</h3>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="mb-3">
                        <label className="block text-xs font-medium mb-1">Product ID:</label>
                        <input
                            type="number"
                            value={productId}
                            onChange={(e) => handleChange(Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm text-black rounded border"
                            placeholder="Enter product ID"
                            min="1"
                        />
                    </div>
                    <div className="text-xs opacity-90">
                        Checks if product {productId} is in cart
                    </div>
                </div>

                {/* Output socket area */}
                <div className="px-4 pb-3">
                    <div className="flex justify-end">
                        <div
                            className="w-4 h-4 bg-white rounded-full border-2 border-blue-300 cursor-pointer hover:bg-blue-100"
                            data-testid="output-socket"
                        ></div>
                    </div>
                </div>
            </div>
        );
    };
}