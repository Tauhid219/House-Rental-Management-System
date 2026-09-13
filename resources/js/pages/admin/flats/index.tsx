import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Building2, Edit3, ExternalLink, PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface FlatItem {
    id: number;
    flat_number: string;
    floor: string;
    size_sqft: number;
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    rent_cost: number | string;
    status: 'vacant' | 'occupied' | 'maintenance';
    active_lease?: {
        tenant?: {
            name: string;
            phone: string;
        };
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface FlatsIndexProps {
    flats: {
        data: FlatItem[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
        bedrooms?: string;
        floor?: string;
        sort?: string;
    };
    stats: {
        total: number;
        vacant: number;
        occupied: number;
        maintenance: number;
    };
    floors: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Flats Management', href: '/admin/flats' },
];

export default function FlatsIndex({ flats, filters, stats, floors }: FlatsIndexProps) {
    const [search, setSearch] = useState(typeof filters?.search === 'string' ? filters.search : '');
    const [status, setStatus] = useState(typeof filters?.status === 'string' ? filters.status : 'all');
    const [floor, setFloor] = useState(typeof filters?.floor === 'string' ? filters.floor : 'all');
    const [sort, setSort] = useState(typeof filters?.sort === 'string' ? filters.sort : 'flat_number_asc');

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/flats',
            {
                search,
                status,
                floor,
                sort,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (flat: FlatItem) => {
        if (confirm(`Are you sure you want to delete Flat ${flat.flat_number}? This cannot be undone.`)) {
            router.delete(`/admin/flats/${flat.id}`);
        }
    };

    return (
        <AdminLayout title="Flats & Units Management • Skyline Heights" breadcrumbs={breadcrumbs}>
            {/* Quick Stat Pill Widgets */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-xs font-semibold text-slate-400 uppercase">Total Units</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
                    <div className="text-xs font-semibold text-emerald-600 uppercase dark:text-emerald-400">Vacant Units</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.vacant}</div>
                </div>
                <div className="rounded-md border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950 dark:bg-blue-950/20">
                    <div className="text-xs font-semibold text-blue-600 uppercase dark:text-blue-400">Occupied Units</div>
                    <div className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.occupied}</div>
                </div>
                <div className="rounded-md border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
                    <div className="text-xs font-semibold text-amber-600 uppercase dark:text-amber-400">Maintenance</div>
                    <div className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.maintenance}</div>
                </div>
            </div>

            {/* Filter Card */}
            <AdminCard variant="default" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 md:grid-cols-5">
                    <div>
                        <label className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                            Search Unit
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Flat # (e.g. 101-A)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        >
                            <option value="all">All Statuses</option>
                            <option value="vacant">Vacant</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                            Floor
                        </label>
                        <select
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        >
                            <option value="all">All Floors</option>
                            {floors.map((fl, i) => (
                                <option key={i} value={fl}>
                                    {fl}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                            Sort Order
                        </label>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        >
                            <option value="flat_number_asc">Flat Number (Asc)</option>
                            <option value="rent_asc">Rent: Low to High</option>
                            <option value="rent_desc">Rent: High to Low</option>
                            <option value="size_desc">Size: Largest First</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            Apply Filter
                        </button>
                        <Link
                            href="/admin/flats"
                            className="rounded border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            Reset
                        </Link>
                    </div>
                </form>
            </AdminCard>

            {/* Flats Table Card */}
            <AdminCard
                title={
                    <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-blue-600" />
                        <span>Registered Flats Directory ({flats.total})</span>
                    </div>
                }
                tools={
                    <Link
                        href="/admin/flats/create"
                        className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                        <PlusCircle size={14} />
                        <span>Add New Flat</span>
                    </Link>
                }
                variant="primary"
                noPadding
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                        <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/60">
                            <tr>
                                <th className="px-5 py-3.5">Unit No & Floor</th>
                                <th className="px-5 py-3.5">Specifications</th>
                                <th className="px-5 py-3.5">Rent / Month</th>
                                <th className="px-5 py-3.5">Current Tenant</th>
                                <th className="px-5 py-3.5 text-center">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {flats.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        No flats matching the selected criteria.
                                    </td>
                                </tr>
                            ) : (
                                flats.data.map((flat) => (
                                    <tr key={flat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                                            Flat {flat.flat_number}
                                            <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400">{flat.floor}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {flat.bedrooms} BHK • {flat.bathrooms} Baths
                                            </span>
                                            <span className="block text-[11px] text-slate-400">
                                                {flat.size_sqft} sqft • {flat.balconies} Balcony
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white">
                                            ৳{Number(flat.rent_cost).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {flat.active_lease?.tenant ? (
                                                <div>
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {flat.active_lease.tenant.name}
                                                    </span>
                                                    <span className="block text-[11px] text-slate-400">{flat.active_lease.tenant.phone}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">No Active Tenant</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                                                    flat.status === 'vacant'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : flat.status === 'occupied'
                                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                }`}
                                            >
                                                {flat.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/flats/${flat.id}`}
                                                    target="_blank"
                                                    title="View on public site"
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                                                >
                                                    <ExternalLink size={15} />
                                                </Link>
                                                <Link
                                                    href={`/admin/flats/${flat.id}/edit`}
                                                    title="Edit flat details"
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-slate-800"
                                                >
                                                    <Edit3 size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(flat)}
                                                    title="Delete flat"
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
                {flats.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <div className="text-xs text-slate-500">
                            Page {flats.current_page} of {flats.last_page} ({flats.total} total units)
                        </div>
                        <div className="flex items-center gap-1">
                            {flats.links.map((link, idx) => (
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
