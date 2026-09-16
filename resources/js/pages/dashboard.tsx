import AdminCard from '@/components/admin/admin-card';
import AdminSmallBox from '@/components/admin/admin-small-box';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Building2, Clock, ExternalLink, Key, Layers, Mail, PlusCircle, Users } from 'lucide-react';

interface LeaseItem {
    id: number;
    tenant?: {
        name: string;
        phone: string;
    };
    flat?: {
        flat_number: string;
        floor: string;
    };
    start_date: string;
    agreed_monthly_rent: number | string;
    status: 'active' | 'closed';
}

interface ContactItem {
    id: number;
    name: string;
    email: string;
    phone: string;
    preferred_flat_type?: string;
    visit_date?: string;
    status: 'new' | 'contacted' | 'closed';
    created_at: string;
}

interface FloorStat {
    floor: string;
    total: number;
    vacant_count: number;
}

interface DashboardProps {
    stats: {
        total_flats: number;
        vacant_flats: number;
        occupied_flats: number;
        maintenance_flats: number;
        active_tenants: number;
        active_leases: number;
        monthly_rent_expected: number;
        pending_invoices_count: number;
        pending_invoices_sum: number;
        paid_invoices_sum: number;
        new_contacts_count: number;
        occupancy_rate: number;
    };
    recentLeases: LeaseItem[];
    recentContacts: ContactItem[];
    flatsByFloor: FloorStat[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats, recentLeases, recentContacts, flatsByFloor }: DashboardProps) {
    return (
        <AdminLayout title="Skyline Heights • Property Dashboard" breadcrumbs={breadcrumbs}>
            {/* Small Boxes Metric Row (AdminLTE 3 iconic small-box) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminSmallBox
                    title="Total Units (Flats)"
                    value={stats.total_flats}
                    icon={Building2}
                    variant="info"
                    href="/admin/flats"
                    linkText={`View all (${stats.vacant_flats} vacant)`}
                />
                <AdminSmallBox
                    title="Occupied Units"
                    value={`${stats.occupied_flats} (${stats.occupancy_rate}%)`}
                    icon={Key}
                    variant="success"
                    href="/admin/leases"
                    linkText="View active leases"
                />
                <AdminSmallBox
                    title="Active Tenants"
                    value={stats.active_tenants}
                    icon={Users}
                    variant="warning"
                    href="/admin/tenants"
                    linkText="Manage tenants"
                />
                <AdminSmallBox
                    title="New Tour Leads"
                    value={stats.new_contacts_count}
                    icon={Mail}
                    variant="danger"
                    href="/admin/contacts"
                    linkText="Review inquiries"
                />
            </div>

            {/* Quick Action Shortcuts Bar */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                <Link
                    href="/admin/flats/create"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 text-center"
                >
                    <PlusCircle size={15} className="shrink-0" />
                    <span>Add Flat Unit</span>
                </Link>
                <Link
                    href="/admin/tenants/create"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 text-center"
                >
                    <Users size={15} className="shrink-0" />
                    <span>Register Tenant</span>
                </Link>
                <Link
                    href="/admin/leases/create"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 text-center"
                >
                    <Key size={15} className="shrink-0" />
                    <span>Create Lease</span>
                </Link>
                <a
                    href="/flats"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 text-center"
                >
                    <ExternalLink size={15} className="shrink-0" />
                    <span>Public Site</span>
                </a>
            </div>

            {/* Main Operational Tables Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left 2 Cols: Recent Leases & Floor-wise Units */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Recent Leases Table Card */}
                    <AdminCard
                        title={
                            <div className="flex items-center gap-2">
                                <Key size={18} className="text-blue-600" />
                                <span>Recent Lease Agreements</span>
                            </div>
                        }
                        tools={
                            <Link href="/admin/leases" className="text-xs font-semibold text-blue-600 hover:underline">
                                View All &rarr;
                            </Link>
                        }
                        variant="primary"
                        noPadding
                    >
                        {/* Mobile Card View (md:hidden) */}
                        <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
                            {recentLeases.length === 0 ? (
                                <div className="p-5 text-center text-xs text-slate-400">
                                    No lease agreements registered yet.
                                </div>
                            ) : (
                                recentLeases.map((lease) => (
                                    <div key={lease.id} className="p-4 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    Flat {lease.flat?.flat_number || 'N/A'}
                                                </span>
                                                <span className="ml-2 text-[11px] text-slate-400">{lease.flat?.floor}</span>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                    lease.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                }`}
                                            >
                                                {lease.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <div>
                                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lease.tenant?.name || 'Unassigned'}
                                                </span>
                                                <span className="block text-[11px] text-slate-400">{lease.tenant?.phone}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                                    ৳{Number(lease.agreed_monthly_rent).toLocaleString()}
                                                </span>
                                                <span className="block text-[10px] text-slate-400">{lease.start_date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop Table View (hidden md:block) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/60">
                                    <tr>
                                        <th className="px-5 py-3">Flat Unit</th>
                                        <th className="px-5 py-3">Resident / Tenant</th>
                                        <th className="px-5 py-3">Monthly Rent</th>
                                        <th className="px-5 py-3">Start Date</th>
                                        <th className="px-5 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentLeases.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-slate-400">
                                                No lease agreements registered yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentLeases.map((lease) => (
                                            <tr key={lease.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                                                    Flat {lease.flat?.flat_number || 'N/A'}
                                                    <span className="block text-[11px] font-normal text-slate-400">{lease.flat?.floor}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                                        {lease.tenant?.name || 'Unassigned'}
                                                    </span>
                                                    <span className="block text-[11px] text-slate-400">{lease.tenant?.phone}</span>
                                                </td>
                                                <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                                                    ৳{Number(lease.agreed_monthly_rent).toLocaleString()}
                                                </td>
                                                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{lease.start_date}</td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <span
                                                        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                            lease.status === 'active'
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {lease.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </AdminCard>

                    {/* Floor-wise Distribution Card */}
                    <AdminCard
                        title={
                            <div className="flex items-center gap-2">
                                <Layers size={18} className="text-cyan-600" />
                                <span>Building Floor Distribution</span>
                            </div>
                        }
                        variant="info"
                    >
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {flatsByFloor.map((floorItem, idx) => (
                                <div
                                    key={idx}
                                    className="rounded border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                                >
                                    <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{floorItem.floor}</div>
                                    <div className="mt-1 flex items-baseline justify-between">
                                        <span className="text-xl font-bold text-slate-900 dark:text-white">{floorItem.total} Units</span>
                                        <span
                                            className={`text-[11px] font-semibold ${
                                                Number(floorItem.vacant_count) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                                            }`}
                                        >
                                            {floorItem.vacant_count} vacant
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AdminCard>
                </div>

                {/* Right 1 Col: Latest Website Inquiries / Leads */}
                <div className="space-y-6">
                    <AdminCard
                        title={
                            <div className="flex items-center gap-2">
                                <Mail size={18} className="text-rose-600" />
                                <span>Prospective Tenant Leads</span>
                            </div>
                        }
                        tools={
                            <Link href="/admin/contacts" className="text-xs font-semibold text-rose-600 hover:underline">
                                All Inquiries &rarr;
                            </Link>
                        }
                        variant="danger"
                        noPadding
                    >
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentContacts.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-400">No website tour inquiries submitted yet.</div>
                            ) : (
                                recentContacts.map((contact) => (
                                    <div key={contact.id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{contact.name}</div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400">{contact.phone}</div>
                                            </div>
                                            <span
                                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                                                    contact.status === 'new'
                                                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                                        : contact.status === 'contacted'
                                                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                }`}
                                            >
                                                {contact.status}
                                            </span>
                                        </div>

                                        {contact.preferred_flat_type && (
                                            <div className="mt-2 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                                                Interested in: {contact.preferred_flat_type}
                                            </div>
                                        )}

                                        {contact.visit_date && (
                                            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                                <Clock size={11} />
                                                <span>Visit Requested: {contact.visit_date}</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </AdminCard>

                    {/* Operational Rent Summary Box */}
                    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Monthly Rent Commitment</h4>
                        <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">৳{stats.monthly_rent_expected.toLocaleString()}</div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Based on {stats.active_leases} active lease agreements.</p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold dark:border-slate-800">
                            <span className="text-slate-500">Collected Payments:</span>
                            <span className="text-emerald-600 dark:text-emerald-400">৳{stats.paid_invoices_sum.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
