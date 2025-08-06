import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, Category } from "@/types/admin";
import { useCategoryManagementStore } from "@/stores/categoryManagementStore";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Product name is too long"),
  category_id: z.coerce.number({
    required_error: "Please select a category",
    invalid_type_error: "Please select a category",
  }).positive("Please select a valid category"),
  unit_price: z.coerce.number({
    required_error: "Unit price is required",
    invalid_type_error: "Unit price must be a number",
  }).min(0.01, "Unit price must be greater than 0").max(999999.99, "Unit price is too high"),
  quantity: z.coerce.number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity must be a number",
  }).min(0, "Quantity cannot be negative").max(999999, "Quantity is too high"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (id: string, data: ProductFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ProductEditModal({
  isOpen,
  onClose,
  product,
  onSubmit,
  isLoading
}: ProductEditModalProps) {
  const { categories, getCategories } = useCategoryManagementStore();
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: 0,
      unit_price: 0,
      quantity: 0,
    },
  });

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          await getCategories();
          setCategoriesLoaded(true);
          console.log('EditModal - categories loaded:', categories);
        } catch (error) {
          console.error("Failed to load categories:", error);
        }
      };
      loadCategories();
    }
  }, [isOpen, getCategories, categories]);

  // Reset form when product changes or modal opens
  useEffect(() => {
    if (isOpen && product) {
      console.log('EditModal - product data:', product);
      console.log('EditModal - product.unit_price:', product.unit_price, typeof product.unit_price);
      console.log('EditModal - product.category_id:', product.category_id, typeof product.category_id);

      // Delay form reset to ensure categories are loaded first
      setTimeout(() => {
        const formData = {
          name: product.name,
          category_id: product.category_id,
          unit_price: typeof product.unit_price === 'string' ? parseFloat(product.unit_price) : product.unit_price,
          quantity: product.quantity,
        };
        console.log('EditModal - setting form data:', formData);
        form.reset(formData);
      }, 100);
    } else if (!isOpen) {
      form.reset({
        name: "",
        category_id: 0,
        unit_price: 0,
        quantity: 0,
      });
    }
  }, [product, form, isOpen]);

  const handleSubmit = async (data: ProductFormValues) => {
    if (!product) return;

    try {
      await onSubmit(product.id.toString(), data);
      onClose();
    } catch (error) {
      // Error is handled by the parent component
      console.error("Failed to update product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => {
                console.log('Category field - field.value:', field.value);
                console.log('Category field - categories?.data:', categories?.data);
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        console.log('Category selected:', value);
                        field.onChange(parseInt(value));
                      }}
                      value={field.value ? field.value.toString() : ""}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category">
                            {field.value ?
                              categories?.data?.find(cat => cat.id === field.value)?.name || "Select a category"
                              : "Select a category"
                            }
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.data?.map((category: Category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Unit Price Field */}
            <FormField
              control={form.control}
              name="unit_price"
              render={({ field }) => {
                console.log('Unit price field - field.value:', field.value, typeof field.value);
                return (
                  <FormItem>
                    <FormLabel>Unit Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="999999.99"
                        placeholder="0.00"
                        value={field.value ? field.value.toString() : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('Unit price changed to:', value);
                          field.onChange(value ? parseFloat(value) : 0);
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Quantity Field */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="999999"
                        placeholder="0"
                        value={field.value ? field.value.toString() : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value) : 0);
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Product Info Display */}
            {product && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-gray-900">Product Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Product ID:</span>
                    <span className="ml-2 font-medium">{product.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 font-medium">
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="ml-2 font-medium">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  {product.category && (
                    <div>
                      <span className="text-gray-500">Current Category:</span>
                      <span className="ml-2 font-medium">
                        {product.category.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}