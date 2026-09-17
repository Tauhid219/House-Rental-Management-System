import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckSquare, Lock, Save, Shield, Square } from 'lucide-react';
import React from 'react';

interface PermissionItem {
    id: number;
    name: string;
}

interface RoleItem {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    role: RoleItem;
    rolePermissions: string[];
    groupedPermissions: Record<string, PermissionItem[]>;
    isProtected: boolean;
}

export default function RoleEdit({ role, rolePermissions, groupedPermissions, isProtected }: Props) {
    const allPermissionNames = Object.values(groupedPermissions)
        .flat()
        .map((p) => p.name);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Access Control (RBAC)', href: '/admin/roles' },
        { title: 'Roles', href: '/admin/roles' },
        { title: `Configure: ${role.name}`, href: `/admin/roles/${role.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: role.name,
        permissions: rolePermissions,
    });

    const togglePermission = (permName: string) => {
        // If admin role and critical permission, do not allow unchecking
        if (role.name === 'admin' && ['view roles', 'manage roles', 'manage users'].includes(permName)) {
            return;
        }

        if (data.permissions.includes(permName)) {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permName),
            );
        } else {
            setData('permissions', [...data.permissions, permName]);
        }
    };

    const toggleGroup = (groupPerms: PermissionItem[]) => {
        const groupNames = groupPerms.map((p) => p.name);
        const allSelected = groupNames.every((name) => data.permissions.includes(name));

        if (allSelected) {
            let filtered = data.permissions.filter((p) => !groupNames.includes(p));
            // Keep mandatory admin perms
            if (role.name === 'admin') {
                filtered = Array.from(new Set([...filtered, 'view roles', 'manage roles', 'manage users']));
            }
            setData('permissions', filtered);
        } else {
            const combined = Array.from(new Set([...data.permissions, ...groupNames]));
            setData('permissions', combined);
        }
    };

    const toggleAll = () => {
        if (data.permissions.length === allPermissionNames.length) {
            if (role.name === 'admin') {
                setData('permissions', ['view roles', 'manage roles', 'manage users']);
            } else {
                setData('permissions', []);
            }
        } else {
            setData('permissions', [...allPermissionNames]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/roles/${role.id}`);
    };

    return (
        <AdminLayout title={`Configure Role: ${role.name.toUpperCase()}`} breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role: ${role.name} - Skyline Heights Admin`} />

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
                                <span>Deselect All</span>
                            </>
                        ) : (
                            <>
                                <CheckSquare size={14} className="text-blue-600 dark:text-blue-400" />
                                <span>Grant All Permissions</span>
                            </>
                        )}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Details Card */}
                    <AdminCard title="Role Information" icon={Shield}>
                        <div className="max-w-md space-y-4">
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Role Name / Title <span className="text-rose-500">*</span>
                                    </label>
                                    {isProtected && (
                                        <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                            <Lock size={11} /> System Default Identifier Protected
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    required
                                    disabled={isProtected}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                                <p className="mt-1 text-[11px] text-slate-400">
                                    {isProtected
                                        ? 'System default role names cannot be renamed to preserve core application bindings.'
                                        : 'Custom role name.'}
                                </p>
                            </div>
                        </div>
                    </AdminCard>

                    {/* Permissions Allocation Matrix */}
                    <AdminCard
                        title={`Granted Functional Permissions (${data.permissions.length} of ${allPermissionNames.length} selected)`}
                        icon={CheckSquare}
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {Object.entries(groupedPermissions).map(([category, perms]) => {
                                const groupNames = perms.map((p) => p.name);
                                const isGroupAllSelected = groupNames.every((n) => data.permissions.includes(n));

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
                                                const isMandatoryAdmin =
                                                    role.name === 'admin' && ['view roles', 'manage roles', 'manage users'].includes(perm.name);

                                                return (
                                                    <label
                                                        key={perm.id}
                                                        className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800/60"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                disabled={isMandatoryAdmin}
                                                                onChange={() => togglePermission(perm.name)}
                                                                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900"
                                                            />
                                                            <span className="font-medium capitalize select-none">{perm.name}</span>
                                                        </div>

                                                        {isMandatoryAdmin && (
                                                            <span className="font-mono text-[10px] text-slate-400 italic">(Admin Required)</span>
                                                        )}
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
                            <span>{processing ? 'Saving Changes...' : 'Save Permissions'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
