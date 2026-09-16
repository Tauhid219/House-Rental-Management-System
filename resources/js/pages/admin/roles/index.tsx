import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Lock, Plus, Shield, ShieldAlert, ShieldCheck, Trash2, Users } from 'lucide-react';
import React from 'react';

interface PermissionItem {
    id: number;
    name: string;
}

interface RoleItem {
    id: number;
    name: string;
    guard_name: string;
    users_count: number;
    permissions: PermissionItem[];
}

interface Props {
    roles: RoleItem[];
    protectedRoles: string[];
    totalPermissions: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Access Control (RBAC)', href: '/admin/roles' },
    { title: 'Roles & Permissions', href: '/admin/roles' },
];

export default function RolesIndex({ roles, protectedRoles, totalPermissions }: Props) {
    const handleDeleteRole = (role: RoleItem) => {
        if (protectedRoles.includes(role.name)) {
            alert(`Role '${role.name}' is a system default role and cannot be deleted.`);
            return;
        }

        if (role.users_count > 0) {
            alert(`Cannot delete '${role.name}' because ${role.users_count} user(s) are currently assigned to it.`);
            return;
        }

        if (confirm(`Are you sure you want to permanently delete custom role '${role.name}'?`)) {
            router.delete(`/admin/roles/${role.id}`);
        }
    };

    return (
        <AdminLayout title="Role-Based Access Control (RBAC)" breadcrumbs={breadcrumbs}>
            <Head title="Roles & Permissions - Skyline Heights Admin" />

            <div className="space-y-6">
                {/* Header Summary & Actions */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">User Roles & Access Permissions</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure functional permission sets and role boundaries for administrators, property managers, and staff members.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <Users size={14} className="text-slate-500" />
                            <span>Assign User Roles</span>
                        </Link>

                        <Link
                            href="/admin/roles/create"
                            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                            <Plus size={14} />
                            <span>Create New Role</span>
                        </Link>
                    </div>
                </div>

                {/* Info Alert Box */}
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
                    <Shield className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                        <span className="font-bold">Security Boundary Notice:</span> System roles (<code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900/60">admin</code>, <code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900/60">manager</code>, <code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900/60">tenant</code>) are vital system anchors. You can modify permission allocations for any role, while core admin safeguards guarantee you never lock out administrative capabilities.
                    </div>
                </div>

                {/* Roles Table Card */}
                <AdminCard title={`Configured System Roles (${roles.length})`} icon={ShieldCheck}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Role Identifier</th>
                                    <th className="px-4 py-3">Assigned Users</th>
                                    <th className="px-4 py-3">Granted Permissions</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {roles.map((role) => {
                                    const isProtected = protectedRoles.includes(role.name);
                                    const hasAllPerms = role.permissions.length >= totalPermissions && totalPermissions > 0;

                                    return (
                                        <tr key={role.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-7 items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                                        <Shield size={15} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-bold text-slate-900 capitalize dark:text-slate-100">
                                                                {role.name}
                                                            </span>
                                                            {isProtected && (
                                                                <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                                                    <Lock size={10} /> System Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-mono">guard: {role.guard_name}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <Link
                                                    href={`/admin/users?role=${role.name}`}
                                                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                                                >
                                                    <Users size={12} />
                                                    <span>{role.users_count} Users</span>
                                                </Link>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                {hasAllPerms ? (
                                                    <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 size={15} />
                                                        <span>Full System Access ({role.permissions.length} / {totalPermissions} permissions)</span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                                            {role.permissions.length} of {totalPermissions} permissions granted
                                                        </div>
                                                        <div className="flex max-w-xl flex-wrap gap-1">
                                                            {role.permissions.slice(0, 6).map((p) => (
                                                                <span
                                                                    key={p.id}
                                                                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                                >
                                                                    {p.name}
                                                                </span>
                                                            ))}
                                                            {role.permissions.length > 6 && (
                                                                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                                                    +{role.permissions.length - 6} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/admin/roles/${role.id}/edit`}
                                                        className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-600 shadow-sm hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-blue-950/40"
                                                    >
                                                        Configure
                                                    </Link>

                                                    {!isProtected && (
                                                        <button
                                                            onClick={() => handleDeleteRole(role)}
                                                            disabled={role.users_count > 0}
                                                            title={role.users_count > 0 ? "Cannot delete role assigned to users" : "Delete role"}
                                                            className="rounded border border-slate-200 bg-white p-1 text-slate-400 shadow-sm hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-rose-900 dark:hover:text-rose-400"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </AdminCard>
            </div>
        </AdminLayout>
    );
}
