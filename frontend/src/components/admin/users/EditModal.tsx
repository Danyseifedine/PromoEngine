import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@/types/auth";
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

const userEditSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    type: z.enum(["admin", "customer"], {
        required_error: "Please select a user type",
    }),
    city: z.string().optional(),
});

type UserEditFormValues = z.infer<typeof userEditSchema>;

export interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSubmit: (id: string, data: Partial<User>) => Promise<void>;
    isLoading?: boolean;
}

export function UserEditModal({
    isOpen,
    onClose,
    user,
    onSubmit,
    isLoading = false,
}: UserEditModalProps) {
    const [submitLoading, setSubmitLoading] = useState(false);

    const form = useForm<UserEditFormValues>({
        resolver: zodResolver(userEditSchema),
        defaultValues: {
            name: "",
            email: "",
            type: "customer",
            city: "",
        },
    });

    // Reset form when user changes
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
                type: user.type || "customer",
                city: user.customer?.city || "",
            });
        }
    }, [user, form]);

    const handleSubmit = async (data: UserEditFormValues) => {
        if (!user) return;

        setSubmitLoading(true);
        try {
            const updateData: Partial<User> = {
                name: data.name,
                email: data.email,
                type: data.type,
            };

            // If user is customer and city is provided, include it
            if (data.type === "customer" && data.city) {
                updateData.customer = {
                    ...user.customer,
                    city: data.city,
                };
            }

            await onSubmit(user.id.toString(), updateData);
            onClose();
        } catch (error) {
            console.error("Failed to update user:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {user ? `Edit User: ${user.name}` : "Edit User"}
                    </DialogTitle>
                    <DialogDescription>
                        Update the user information below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                    {/* Name Field */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter full name"
                                        {...field}
                                        disabled={submitLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter email address"
                                        {...field}
                                        disabled={submitLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* User Type Field */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={submitLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* City Field - Only show for customers */}
                    {form.watch("type") === "customer" && (
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter city"
                                            {...field}
                                            disabled={submitLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                        {/* User Info Display */}
                        {user && (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <h4 className="font-medium text-gray-900">User Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">User ID:</span>
                                        <span className="ml-2 font-medium">{user.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Created:</span>
                                        <span className="ml-2 font-medium">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Last Updated:</span>
                                        <span className="ml-2 font-medium">
                                            {new Date(user.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {user.customer && (
                                        <div>
                                            <span className="text-gray-500">Loyalty Tier:</span>
                                            <span className="ml-2 font-medium capitalize">
                                                {user.customer.loyalty_tier}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={submitLoading}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitLoading}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {submitLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}