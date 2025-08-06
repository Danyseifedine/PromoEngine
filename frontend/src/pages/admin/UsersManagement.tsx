import { AdminLayout } from "@/layouts/AdminLayout";
import { UsersDataTable } from "@/components/admin/users/DataTable";

export default function UsersPage() {
    return (
        <AdminLayout title="Users">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">Manage and monitor all users in the system</p>
                    </div>
                </div>
                <UsersDataTable />
            </div>
        </AdminLayout>
    );
}