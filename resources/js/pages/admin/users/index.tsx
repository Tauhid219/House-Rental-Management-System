import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Filter, Search, Shield, ShieldCheck, UserCheck, Users, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface RoleOption {
    id: number;
    name: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    status: 'active' | 'inactive';
    created_at: string;
    roles: RoleOption[];
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: PaginatedUsers;
    roles: RoleOption[];
    filters: {
        search: string;
        role: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Access Control (RBAC)', href: '/admin/roles' },
    { title: 'System Users', href: '/admin/users' },
];

export default function UsersIndex({ users, roles, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/admin/users',
            { search, role: roleFilter },
            { preserveState: true, replace: true }
        );
    };

    const handleRoleChange = (user: UserItem, newRole: string) => {
        if (user.id === auth.user.id && newRole !== 'admin') {
            alert('Security Safeguard: You cannot remove the Administrator role from your own active account.');
            return;
        }

        if (confirm(`Change role of user '${user.name}' to '${newRole}'?`)) {
            router.patch(`/admin/users/${user.id}/role`, { role: newRole }, { preserveScroll: true });
        }
    };

    const handleStatusToggle = (user: UserItem) => {
        if (user.id === auth.user.id) {
            alert('Security Safeguard: You cannot deactivate your own account.');
            return;
        }

        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        if (confirm(`Set status of '${user.name}' to ${newStatus}?`)) {
            router.patch(`/admin/users/${user.id}/status`, { status: newStatus }, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="System Users & Role Assignment" breadcrumbs={breadcrumbs}>
            <Head title="System Users & RBAC - Skyline Heights Admin" />

            <div className="space-y-6">
                {/* Header & Quick Action */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">System Users Directory</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage user profiles, authenticate portal access, and designate functional RBAC roles.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/roles"
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <ShieldCheck size={14} className="text-blue-600" />
                            <span>Manage Role Permissions</span>
                        </Link>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <form onSubmit={handleFilter} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>

                            {/* Role Dropdown Filter */}
                            <div className="w-full sm:w-48">
                                <select
                                    value={roleFilter}
                                    onChange={(e) => {
                                        setRoleFilter(e.target.value);
                                        router.get(
                                            '/admin/users',
                                            { search, role: e.target.value },
                                            { preserveState: true, replace: true }
                                        );
                                    }}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                >
                                    <option value="all">All Roles</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.name}>
                                            Role: {r.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                            >
                                <Filter size={13} />
                                <span>Filter</span>
                            </button>

                            {(search || roleFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setRoleFilter('all');
                                        router.get('/admin/users', {}, { preserveState: true, replace: true });
                                    }}
                                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Users Table Card */}
                <AdminCard title={`Registered Portal Users (${users.total})`} icon={UserCheck}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">User Profile</th>
                                    <th className="px-4 py-3">Contact Details</th>
                                    <th className="px-4 py-3">Current Role</th>
                                    <th className="px-4 py-3">Assign RBAC Role</th>
                                    <th className="px-4 py-3">Account Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">
                                            No users found matching your filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => {
                                        const isCurrentUser = user.id === auth.user.id;
                                        const currentRoleName = user.roles[0]?.name || user.role || 'tenant';

                                        return (
                                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white shadow-sm">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                                                    {user.name}
                                                                </span>
                                                                {isCurrentUser && (
                                                                    <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                                                                        YOU
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400">ID: #{user.id}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <div className="space-y-0.5">
                                                        <div className="font-medium text-slate-800 dark:text-slate-200">{user.email}</div>
                                                        <div className="text-[11px] text-slate-400">{user.phone || 'No phone recorded'}</div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                                                            currentRoleName === 'admin'
                                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                                                                : currentRoleName === 'manager'
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        }`}
                                                    >
                                                        <Shield size={11} />
                                                        <span>{currentRoleName}</span>
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <select
                                                        value={currentRoleName}
                                                        disabled={isCurrentUser}
                                                        onChange={(e) => handleRoleChange(user, e.target.value)}
                                                        className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:disabled:bg-slate-900"
                                                    >
                                                        {roles.map((r) => (
                                                            <option key={r.id} value={r.name}>
                                                                Assign: {r.name.toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusToggle(user)}
                                                        disabled={isCurrentUser}
                                                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                                                            user.status === 'active'
                                                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
                                                        }`}
                                                    >
                                                        {user.status === 'active' ? (
                                                            <>
                                                                <CheckCircle2 size={12} />
                                                                <span>Active</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle size={12} />
                                                                <span>Inactive</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">
                                Page {users.current_page} of {users.last_page}
                            </span>

                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded px-2.5 py-1 text-xs font-semibold ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                                                : 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </AdminCard>
            </div>
        </AdminLayout>
    );
}
