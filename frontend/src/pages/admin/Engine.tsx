import { AdminLayout } from "@/layouts/AdminLayout";
import { SimpleRuleEditor } from "@/components/rule-engine/SimpleRuleEditor";
import { useState } from "react";

export default function EnginePage() {
    const [currentRule, setCurrentRule] = useState<unknown>(null);

    const handleRuleChange = (rule: unknown) => {
        setCurrentRule(rule);
        console.log('Rule updated:', rule);
    };

    return (
        <AdminLayout title="Promotion Rule Engine">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Visual Rule Builder
                    </h1>
                    <p className="text-gray-600">
                        Create promotion rules by connecting condition and action nodes.
                        Start simple: check for a product ID and apply a percentage discount.
                    </p>
                </div>

                {/* Rule Editor Section */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Rule Canvas
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Drag nodes, connect them, and set values to create your promotion rule
                        </p>
                    </div>

                    <div className="h-96">
                        <SimpleRuleEditor onRuleChange={handleRuleChange} />
                    </div>
                </div>

                {/* Rule Preview Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Rule Preview
                    </h2>

                    {/* Generated Rule JSON */}
                    {currentRule && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium text-gray-700 mb-2">Generated Rule JSON:</h3>
                            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-48">
                                {JSON.stringify(currentRule, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}