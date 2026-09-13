import AdminCard from '@/components/admin/admin-card';
import AdminSmallBox from '@/components/admin/admin-small-box';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Building2, CheckCircle2, Clock, Edit, Filter, PlusCircle, Search, Trash2, Wrench } from 'lucide-react';
import React, { useState } from 'react';

interface Flat {
    id: number;
    flat_number: string;
    floor: string;
}

interface Maintenance {
    id: number;
    flat_id: number;
    title: string;
    description: string | null;
    cost: string | number;
    reported_date: string;
    completed_date: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    flat: Flat;
}

interface Props {
    maintenances: {
        data: Maintenance[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        flat_id?: string;
    };
    stats: {
        total_count: number;
        total_cost: number;
        pending_count: number;
        in_progress_count: number;
        completed_count: number;
    };
    flats: Flat[];
}

export default function MaintenanceIndex({ maintenances, filters, stats, flats }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [flatId, setFlatId] = useState(filters.flat_id || 'all');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/maintenances',
            {
                search,
                status,
                flat_id: flatId,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (item: Maintenance) => {
        if (confirm(`Are you sure you want to delete maintenance record: "${item.title}"?`)) {
            router.delete(`/admin/maintenances/${item.id}`);
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Maintenance Tasks', href: '/admin/maintenances' },
    ];

    return (
        <AdminLayout title="Unit Maintenance & Repair Log" breadcrumbs={breadcrumbs}>
            <Head title="Unit Maintenance & Repairs - AdminLTE Management" />

            {/* Small Boxes Row */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminSmallBox variant="info" value={`৳ ${stats.total_cost.toLocaleString()}`} label="Total Repair Costs" icon={Wrench} />
                <AdminSmallBox variant="warning" value={stats.pending_count} label="Pending Issues" icon={Clock} />
                <AdminSmallBox variant="primary" value={stats.in_progress_count} label="In Progress Repairs" icon={AlertTriangle} />
                <AdminSmallBox variant="success" value={stats.completed_count} label="Completed Tasks" icon={CheckCircle2} />
            </div>

            {/* Main Card */}
            <AdminCard
                title="Maintenance Work Orders"
                icon={Wrench}
                headerAction={
                    <Link
                        href="/admin/maintenances/create"
                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                    >
                        <PlusCircle size={14} />
                        <span>Log Repair Ticket</span>
                    </Link>
                }
            >
                {/* Search and Filters */}
                <form onSubmit={handleFilter} className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <div className="relative sm:col-span-5">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, description or unit..."
                            className="w-full rounded-md border border-slate-300 bg-white py-2 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                        <Search className="absolute top-2.5 left-2.5 text-slate-400" size={15} />
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={flatId}
                            onChange={(e) => setFlatId(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                            <option value="all">All Flat Units</option>
                            {flats.map((f) => (
                                <option key={f.id} value={f.id}>
                                    Unit {f.flat_number} ({f.floor})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-1">
                        <button
                            type="submit"
                            className="flex h-full w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                            <Filter size={14} />
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Task Details</th>
                                <th className="px-4 py-3">Unit</th>
                                <th className="px-4 py-3">Dates</th>
                                <th className="px-4 py-3 text-right">Cost</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {maintenances.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        No maintenance work orders found matching the filter.
                                    </td>
                                </tr>
                            ) : (
                                maintenances.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                        <td className="px-4 py-3">
                                            <span className="block font-semibold text-slate-900 dark:text-white">{item.title}</span>
                                            {item.description && (
                                                <span className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{item.description}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                                <Building2 size={12} className="text-blue-500" />
                                                Unit {item.flat.flat_number}
                                            </span>
                                            <span className="mt-0.5 block text-[10px] text-slate-400">{item.flat.floor}</span>
                                        </td>
                                        <td className="px-4 py-3 text-[11px] whitespace-nowrap text-slate-500 dark:text-slate-400">
                                            <div>Reported: {item.reported_date}</div>
                                            {item.completed_date && (
                                                <div className="text-emerald-600 dark:text-emerald-400">Done: {item.completed_date}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                            ৳ {Number(item.cost).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                    item.status === 'completed'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                        : item.status === 'in_progress'
                                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                }`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {item.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="inline-flex items-center gap-1">
                                                <Link
                                                    href={`/admin/maintenances/${item.id}/edit`}
                                                    title="Edit / Update Status"
                                                    className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                                                >
                                                    <Edit size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    title="Delete Record"
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                                                >
                                                    <Trash2 size={14} />
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
                {maintenances.links && maintenances.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
                        <div>
                            Showing {maintenances.data.length} of {maintenances.total} records
                        </div>
                        <div className="flex items-center gap-1">
                            {maintenances.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded px-2.5 py-1 text-xs font-semibold ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : !link.url
                                              ? 'pointer-events-none text-slate-300'
                                              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
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
