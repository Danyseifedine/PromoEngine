import { ClassicPreset } from 'rete';

export class AndLogicalNode extends ClassicPreset.Node {
    constructor(id: string) {
        super('AND Logic');
        this.id = id;
    }

    static Component = ({ data }: { data: AndLogicalNode }) => {
        return (
            <div className="bg-orange-500 text-white rounded-lg shadow-lg min-w-48">
                {/* Input sockets area */}
                <div className="px-4 pt-3">
                    <div className="flex flex-col gap-2">
                        <div
                            className="w-4 h-4 bg-white rounded-full border-2 border-orange-300 cursor-pointer hover:bg-orange-100"
                            data-testid="input-socket-1"
                        ></div>
                        <div
                            className="w-4 h-4 bg-white rounded-full border-2 border-orange-300 cursor-pointer hover:bg-orange-100"
                            data-testid="input-socket-2"
                        ></div>
                    </div>
                </div>

                {/* Header */}
                <div className="px-4 py-2 bg-orange-600 rounded-none">
                    <h3 className="font-semibold text-sm text-center">AND</h3>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="text-xs opacity-90 text-center">
                        True if ALL conditions are met
                    </div>
                    <div className="text-xs opacity-75 text-center mt-1">
                        Condition 1 AND Condition 2
                    </div>
                </div>

                {/* Output socket area */}
                <div className="px-4 pb-3">
                    <div className="flex justify-end">
                        <div
                            className="w-4 h-4 bg-white rounded-full border-2 border-orange-300 cursor-pointer hover:bg-orange-100"
                            data-testid="output-socket"
                        ></div>
                    </div>
                </div>
            </div>
        );
    };
}