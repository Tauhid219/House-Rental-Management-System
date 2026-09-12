import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import {
    FileText,
    PlusCircle,
    Search,
    Home as HomeIcon,
    Users,
    Calendar,
    DollarSign,
    CheckCircle2,
    XCircle,
    AlertOctagon
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface LeaseItem {
    id: number;
    start_date: string;
    end_date?: string;
    agreed_monthly_rent: number | string;
    security_deposit: number | string;
    advance_paid: number | string;
    status: 'active' | 'closed';
    tenant?: {
        id: number;
        name: string;
        phone: string;
    };
    flat?: {
        id: number;
        flat_number: string;
        floor: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface LeasesIndexProps {
    leases: {
        data: LeaseItem[];
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
        closed: number;
        monthly_committed: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leases Management', href: '/admin/leases' },
];

export default function LeasesIndex({ leases, filters, stats }: LeasesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/leases', {
            search,
            status,
        }, { preserveState: true });
    };

    const handleTerminate = (lease: LeaseItem) => {
        if (
            confirm(
                `Terminate Lease #${lease.id} for Flat ${lease.flat?.flat_number}? This will automatically change the flat status back to 'vacant'.`
            )
        ) {
            router.post(`/admin/leases/${lease.id}/terminate`);
        }
    };

    return (
        <AdminLayout title="Lease Agreements Directory • Skyline Heights" breadcrumbs={breadcrumbs}>
            {/* Quick Stat Pill Widgets */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
                <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-xs font-semibold uppercase text-slate-400">Total Leases</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
                    <div className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Active Contracts</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.active}</div>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Closed Leases</div>
                    <div className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-300">{stats.closed}</div>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50/50 p-4 shadow-sm dark:border-indigo-950 dark:bg-indigo-950/20">
                    <div className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">Monthly Committed</div>
                    <div className="mt-1 text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                        ৳{Number(stats.monthly_committed).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Filter Card */}
            <AdminCard variant="default" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3 items-end">
                    <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Search Leases
                        </label>
                        <input
                            type="text"
                            placeholder="Tenant name, phone, or flat number (e.g. 101-A)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Lease Status
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Leases</option>
                                <option value="closed">Closed Leases</option>
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

            {/* Leases Table Card */}
            <AdminCard
                title={
                    <div className="flex items-center gap-2">
                        <FileText size={18} className="text-blue-600" />
                        <span>Lease Agreements Registry ({leases.total})</span>
                    </div>
                }
                tools={
                    <Link
                        href="/admin/leases/create"
                        className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        <PlusCircle size={14} />
                        <span>Create Lease Agreement</span>
                    </Link>
                }
                variant="primary"
                noPadding
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                        <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                            <tr>
                                <th className="px-5 py-3.5">Agreement # & Flat</th>
                                <th className="px-5 py-3.5">Assigned Tenant</th>
                                <th className="px-5 py-3.5">Duration Term</th>
                                <th className="px-5 py-3.5">Financial Terms</th>
                                <th className="px-5 py-3.5 text-center">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {leases.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        No lease contracts matching your search.
                                    </td>
                                </tr>
                            ) : (
                                leases.data.map((lease) => (
                                    <tr key={lease.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="px-5 py-3.5">
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                Lease #{lease.id}
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                                                <HomeIcon size={12} />
                                                Flat {lease.flat?.flat_number || 'N/A'} ({lease.flat?.floor})
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                {lease.tenant?.name || 'Unassigned'}
                                            </div>
                                            <span className="text-[11px] text-slate-400">
                                                {lease.tenant?.phone}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="text-slate-800 dark:text-slate-200 font-medium">
                                                Start: {lease.start_date}
                                            </div>
                                            <span className="text-[11px] text-slate-400">
                                                End: {lease.end_date || 'Open-ended (No expiry)'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-bold text-slate-900 dark:text-white text-xs">
                                                ৳{Number(lease.agreed_monthly_rent).toLocaleString()} / month
                                            </div>
                                            <span className="text-[11px] text-slate-400">
                                                Deposit: ৳{Number(lease.security_deposit).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                                    lease.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                }`}
                                            >
                                                {lease.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            {lease.status === 'active' ? (
                                                <button
                                                    onClick={() => handleTerminate(lease)}
                                                    className="inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
                                                    title="Terminate agreement and vacate flat"
                                                >
                                                    <XCircle size={13} />
                                                    <span>Terminate</span>
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 italic text-[11px]">Archived</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {leases.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <div className="text-xs text-slate-500">
                            Page {leases.current_page} of {leases.last_page} ({leases.total} total leases)
                        </div>
                        <div className="flex items-center gap-1">
                            {leases.links.map((link, idx) => (
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
