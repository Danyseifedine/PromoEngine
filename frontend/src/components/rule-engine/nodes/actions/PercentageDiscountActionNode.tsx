import { ClassicPreset } from 'rete';
import { useState } from 'react';

export class PercentageDiscountActionNode extends ClassicPreset.Node {
    percentage: number = 10;

    constructor(id: string) {
        super('Percentage Discount');
        this.id = id;
    }

    static Component = ({ data }: { data: PercentageDiscountActionNode }) => {
        const [percentage, setPercentage] = useState(data.percentage);

        const handleChange = (value: number) => {
            setPercentage(value);
            data.percentage = value;
        };

        return (
            <div className="bg-green-500 text-white rounded-lg shadow-lg min-w-48">
                {/* Input socket area */}
                <div className="px-4 pt-3">
                    <div className="flex justify-start">
                        <div
                            className="w-4 h-4 bg-white rounded-full border-2 border-green-300 cursor-pointer hover:bg-green-100"
                            data-testid="input-socket"
                        ></div>
                    </div>
                </div>

                {/* Header */}
                <div className="px-4 py-2 bg-green-600 rounded-none">
                    <h3 className="font-semibold text-sm">Percentage Discount</h3>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="mb-3">
                        <label className="block text-xs font-medium mb-1">Discount %:</label>
                        <input
                            type="number"
                            value={percentage}
                            onChange={(e) => handleChange(Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm text-black rounded border"
                            placeholder="Enter percentage"
                            min="1"
                            max="100"
                        />
                    </div>
                    <div className="text-xs opacity-90">
                        Apply {percentage}% discount to cart
                    </div>
                </div>
            </div>
        );
    };
}