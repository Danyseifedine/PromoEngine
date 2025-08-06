import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps {
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    value?: string;
    disabled?: boolean;
    children: React.ReactNode;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export interface SelectContentProps {
    children: React.ReactNode;
}

export interface SelectItemProps {
    value: string;
    children: React.ReactNode;
}

export interface SelectValueProps {
    placeholder?: string;
    children?: React.ReactNode;
}

const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
} | null>(null);

export function Select({ onValueChange, defaultValue, value: controlledValue, disabled, children }: SelectProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);

    // Use controlled value if provided, otherwise use internal state
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
        setIsOpen(false);
    };

    return (
        <SelectContext.Provider
            value={{
                value,
                onValueChange: handleValueChange,
                disabled,
                isOpen,
                setIsOpen,
            }}
        >
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    );
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ children, className, ...props }, ref) => {
        const context = React.useContext(SelectContext);
        if (!context) throw new Error("SelectTrigger must be used within a Select");

        const { disabled, isOpen, setIsOpen } = context;

        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        );
    }
);
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({ placeholder, children }: SelectValueProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectValue must be used within a Select");

    const { value } = context;

    // If children are provided, use them, otherwise use the value or placeholder
    return <span>{children || value || placeholder}</span>;
}

export function SelectContent({ children }: SelectContentProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectContent must be used within a Select");

    const { isOpen, setIsOpen } = context;

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('[data-select-content]')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
        <div
            data-select-content
            className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
            {children}
        </div>
    );
}

export function SelectItem({ value, children }: SelectItemProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectItem must be used within a Select");

    const { onValueChange, value: selectedValue } = context;
    const isSelected = selectedValue === value;

    return (
        <button
            type="button"
            className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                isSelected && "bg-purple-50 text-purple-700"
            )}
            onClick={() => onValueChange?.(value)}
        >
            {children}
        </button>
    );
}