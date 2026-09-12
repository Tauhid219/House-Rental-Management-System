import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import {
    Users,
    PlusCircle,
    Search,
    Edit3,
    Trash2,
    Phone,
    Mail,
    Home as HomeIcon,
    Shield,
    FileText
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface TenantItem {
    id: number;
    name: string;
    nid_passport: string;
    phone: string;
    email?: string;
    emergency_contact?: string;
    occupation?: string;
    family_members: number;
    permanent_address?: string;
    status: 'active' | 'past';
    active_lease?: {
        flat?: {
            id: number;
            flat_number: string;
            floor: string;
        };
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface TenantsIndexProps {
    tenants: {
        data: TenantItem[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    stats: {
        total: number;
        active: number;
        past: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tenants Management', href: '/admin/tenants' },
];

export default function TenantsIndex({ tenants, filters, stats }: TenantsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/tenants', {
            search,
            status,
        }, { preserveState: true });
    };

    const handleDelete = (tenant: TenantItem) => {
        if (confirm(`Are you sure you want to remove tenant profile for ${tenant.name}?`)) {
            router.delete(`/admin/tenants/${tenant.id}`);
        }
    };

    return (
        <AdminLayout title="Tenants & Residents Directory • Skyline Heights" breadcrumbs={breadcrumbs}>
            {/* Quick Stat Pill Widgets */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-xs font-semibold uppercase text-slate-400">Total Registered Tenants</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
                    <div className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Active Residents</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.active}</div>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Past Residents</div>
                    <div className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-300">{stats.past}</div>
                </div>
            </div>

            {/* Filter Card */}
            <AdminCard variant="default" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3 items-end">
                    <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Search Tenant
                        </label>
                        <input
                            type="text"
                            placeholder="Name, Phone, NID or Occupation..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Resident Status
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Residents</option>
                                <option value="past">Past Residents</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </form>
            </AdminCard>

            {/* Tenants Table Card */}
            <AdminCard
                title={
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-blue-600" />
                        <span>Tenants Directory ({tenants.total})</span>
                    </div>
                }
                tools={
                    <Link
                        href="/admin/tenants/create"
                        className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        <PlusCircle size={14} />
                        <span>Register New Tenant</span>
                    </Link>
                }
                variant="primary"
                noPadding
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                        <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                            <tr>
                                <th className="px-5 py-3.5">Tenant Name & Details</th>
                                <th className="px-5 py-3.5">Contact Info</th>
                                <th className="px-5 py-3.5">NID / Passport</th>
                                <th className="px-5 py-3.5">Assigned Flat</th>
                                <th className="px-5 py-3.5 text-center">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tenants.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        No tenants registered matching your search.
                                    </td>
                                </tr>
                            ) : (
                                tenants.data.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="px-5 py-3.5">
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {tenant.name}
                                            </div>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {tenant.occupation || 'Resident'} • {tenant.family_members} Members
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                                                <Phone size={12} className="text-slate-400" />
                                                <span>{tenant.phone}</span>
                                            </div>
                                            {tenant.email && (
                                                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                                    <Mail size={12} />
                                                    <span>{tenant.email}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {tenant.nid_passport}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {tenant.active_lease?.flat ? (
                                                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                                    <HomeIcon size={12} />
                                                    Flat {tenant.active_lease.flat.flat_number} ({tenant.active_lease.flat.floor})
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic text-[11px]">No active lease</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                                    tenant.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                }`}
                                            >
                                                {tenant.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/tenants/${tenant.id}/edit`}
                                                    title="Edit Tenant"
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800"
                                                >
                                                    <Edit3 size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(tenant)}
                                                    title="Remove Tenant"
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {tenants.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <div className="text-xs text-slate-500">
                            Page {tenants.current_page} of {tenants.last_page} ({tenants.total} total tenants)
                        </div>
                        <div className="flex items-center gap-1">
                            {tenants.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded px-2.5 py-1 text-xs transition-colors ${
                                        link.active
                                            ? 'bg-blue-600 font-bold text-white'
                                            : link.url
                                            ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                            : 'pointer-events-none text-slate-300 dark:text-slate-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </AdminCard>
        </AdminLayout>
    );
}
