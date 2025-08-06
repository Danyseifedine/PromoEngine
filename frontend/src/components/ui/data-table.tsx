import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit,
    Trash2,
    Search,
    Filter,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (value: any, row: T, index: number) => React.ReactNode;
    sortable?: boolean;
    searchable?: boolean;
    width?: string;
}

export interface DataTableAction<T> {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T, index: number) => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
    show?: (row: T) => boolean;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: DataTableAction<T>[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        onItemsPerPageChange?: (itemsPerPage: number) => void;
    };
    loading?: boolean;
    searchable?: boolean;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
}

export function DataTable<T>({
    data,
    columns,
    actions = [],
    pagination,
    loading = false,
    searchable = false,
    onSearch,
    searchPlaceholder = "Search...",
    emptyMessage = "No data available",
    className = "",
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortDirection("asc");
        }
    };

    const getCellValue = (row: T, column: Column<T>, index: number) => {
        if (column.render) {
            return column.render(
                typeof column.key === "string" ? (row as any)[column.key] : row,
                row,
                index
            );
        }
        return typeof column.key === "string" ? (row as any)[column.key] : "";
    };

    const renderPagination = () => {
        if (!pagination) return null;

        const { currentPage, totalPages, onPageChange, totalItems, itemsPerPage } = pagination;
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                    Showing {startItem} to {endItem} of {totalItems} results
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
            {/* Header with Search */}
            {searchable && (
                <div className="p-6 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width ? `w-${column.width}` : ""
                                        } ${column.sortable ? "cursor-pointer hover:bg-gray-100" : ""}`}
                                    onClick={() => column.sortable && handleSort(column.key as string)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.header}</span>
                                        {column.sortable && sortColumn === column.key && (
                                            <span className="text-gray-400">
                                                {sortDirection === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                                        <span>Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getCellValue(row, column, rowIndex)}
                                        </td>
                                    ))}
                                    {actions.length > 0 && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                {actions.map((action, actionIndex) => {
                                                    if (action.show && !action.show(row)) return null;
                                                    return (
                                                        <Button
                                                            key={actionIndex}
                                                            variant={action.variant || "ghost"}
                                                            size="sm"
                                                            onClick={() => action.onClick(row, rowIndex)}
                                                        >
                                                            {action.icon}
                                                            <span className="ml-1">{action.label}</span>
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {renderPagination()}
        </div>
    );
}