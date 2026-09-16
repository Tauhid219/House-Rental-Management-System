import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckSquare, Plus, Save, Shield, Square } from 'lucide-react';
import React from 'react';

interface PermissionItem {
    id: number;
    name: string;
}

interface Props {
    groupedPermissions: Record<string, PermissionItem[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Access Control (RBAC)', href: '/admin/roles' },
    { title: 'Roles', href: '/admin/roles' },
    { title: 'Create Role', href: '/admin/roles/create' },
];

export default function RoleCreate({ groupedPermissions }: Props) {
    const allPermissionNames = Object.values(groupedPermissions)
        .flat()
        .map((p) => p.name);

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: '',
        permissions: [],
    });

    const togglePermission = (permName: string) => {
        if (data.permissions.includes(permName)) {
            setData('permissions', data.permissions.filter((p) => p !== permName));
        } else {
            setData('permissions', [...data.permissions, permName]);
        }
    };

    const toggleGroup = (groupPerms: PermissionItem[]) => {
        const groupNames = groupPerms.map((p) => p.name);
        const allSelected = groupNames.every((name) => data.permissions.includes(name));

        if (allSelected) {
            setData('permissions', data.permissions.filter((p) => !groupNames.includes(p)));
        } else {
            const combined = Array.from(new Set([...data.permissions, ...groupNames]));
            setData('permissions', combined);
        }
    };

    const toggleAll = () => {
        if (data.permissions.length === allPermissionNames.length) {
            setData('permissions', []);
        } else {
            setData('permissions', [...allPermissionNames]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/roles');
    };

    return (
        <AdminLayout title="Create Custom Role" breadcrumbs={breadcrumbs}>
            <Head title="Create New Role - Skyline Heights Admin" />

            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/roles"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Roles Directory</span>
                    </Link>

                    <button
                        type="button"
                        onClick={toggleAll}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        {data.permissions.length === allPermissionNames.length ? (
                            <>
                                <Square size={14} className="text-slate-500" />
                                <span>Deselect All Permissions</span>
                            </>
                        ) : (
                            <>
                                <CheckSquare size={14} className="text-blue-600 dark:text-blue-400" />
                                <span>Grant All System Permissions</span>
                            </>
                        )}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Details Card */}
                    <AdminCard title="Role Identification" icon={Shield}>
                        <div className="max-w-md space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Role Name / Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Accountant, Caretaker, Supervisor"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Use a clear descriptive identifier. It will be stored in lower-case format.
                                </p>
                            </div>
                        </div>
                    </AdminCard>

                    {/* Permissions Allocation Matrix */}
                    <AdminCard
                        title={`Select Permissions (${data.permissions.length} of ${allPermissionNames.length} selected)`}
                        icon={CheckSquare}
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {Object.entries(groupedPermissions).map(([category, perms]) => {
                                const groupNames = perms.map((p) => p.name);
                                const isGroupAllSelected = groupNames.every((n) => data.permissions.includes(n));
                                const hasSomeSelected = groupNames.some((n) => data.permissions.includes(n));

                                return (
                                    <div
                                        key={category}
                                        className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700"
                                    >
                                        <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                                            <h4 className="text-xs font-bold text-slate-900 uppercase dark:text-slate-100">{category}</h4>
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup(perms)}
                                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {isGroupAllSelected ? 'Deselect Category' : 'Select All'}
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {perms.map((perm) => {
                                                const isChecked = data.permissions.includes(perm.name);
                                                return (
                                                    <label
                                                        key={perm.id}
                                                        className="flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 text-xs text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800/60"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => togglePermission(perm.name)}
                                                            className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                                                        />
                                                        <span className="select-none font-medium capitalize">{perm.name}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AdminCard>

                    {/* Form Submit Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                        <Link
                            href="/admin/roles"
                            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save size={14} />
                            <span>{processing ? 'Saving Role...' : 'Save Role'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
