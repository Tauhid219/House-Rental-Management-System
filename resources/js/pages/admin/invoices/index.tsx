import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import {
    Receipt,
    PlusCircle,
    Search,
    Calendar,
    DollarSign,
    ExternalLink,
    CreditCard,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Zap,
    X
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface InvoiceItem {
    id: number;
    invoice_no: string;
    billing_month: string;
    rent_amount: number | string;
    utility_charges: number | string;
    other_charges: number | string;
    discount: number | string;
    total_payable: number | string;
    paid_amount: number | string;
    due_amount: number;
    due_date?: string;
    status: 'unpaid' | 'partially_paid' | 'paid';
    tenant?: {
        id: number;
        name: string;
        phone: string;
    };
    lease?: {
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

interface InvoicesIndexProps {
    invoices: {
        data: InvoiceItem[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
        billing_month?: string;
    };
    stats: {
        total_invoices: number;
        unpaid_count: number;
        partially_paid_count: number;
        paid_count: number;
        total_payable: number;
        total_paid: number;
        total_due: number;
    };
    billingMonths: string[];
    currentMonth: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rent Invoices', href: '/admin/invoices' },
];

export default function InvoicesIndex({
    invoices,
    filters,
    stats,
    billingMonths,
    currentMonth,
}: InvoicesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [billingMonth, setBillingMonth] = useState(filters.billing_month || 'all');
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    // Batch generator form state
    const { data: batchData, setData: setBatchData, post: postBatch, processing: batchProcessing, errors: batchErrors, reset: resetBatch } = useForm({
        billing_month: currentMonth,
        due_date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
        utility_charges: 3000,
        other_charges: 0,
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/invoices', {
            search,
            status,
            billing_month: billingMonth,
        }, { preserveState: true });
    };

    const handleBatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postBatch('/admin/invoices/batch', {
            onSuccess: () => {
                setIsBatchModalOpen(false);
                resetBatch();
            },
        });
    };

    const handleDelete = (invoice: InvoiceItem) => {
        if (confirm(`Are you sure you want to delete Invoice ${invoice.invoice_no}? This cannot be undone.`)) {
            router.delete(`/admin/invoices/${invoice.id}`);
        }
    };

    return (
        <AdminLayout title="Rent Invoices & Billing • Skyline Heights" breadcrumbs={breadcrumbs}>
            {/* Quick Stat Pill Widgets */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
                <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-xs font-semibold uppercase text-slate-400">Total Invoiced</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        ৳{stats.total_payable.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-400">{stats.total_invoices} invoices total</span>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
                    <div className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Collected Payments</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        ৳{stats.total_paid.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">{stats.paid_count} fully paid</span>
                </div>
                <div className="rounded-md border border-rose-200 bg-rose-50/50 p-4 shadow-sm dark:border-rose-950 dark:bg-rose-950/20">
                    <div className="text-xs font-semibold uppercase text-rose-600 dark:text-rose-400">Outstanding Due</div>
                    <div className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-300">
                        ৳{stats.total_due.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400">
                        {stats.unpaid_count + stats.partially_paid_count} pending invoices
                    </span>
                </div>
                <div className="rounded-md border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950 dark:bg-blue-950/20">
                    <div className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Collection Rate</div>
                    <div className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {stats.total_payable > 0
                            ? Math.round((stats.total_paid / stats.total_payable) * 100)
                            : 0}%
                    </div>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400">
                        {stats.partially_paid_count} partial collections
                    </span>
                </div>
            </div>

            {/* Action & Filter Bar */}
            <AdminCard variant="default" className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            onClick={() => setIsBatchModalOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            <Zap size={14} />
                            <span>Batch Generate Monthly Invoices</span>
                        </button>
                        <Link
                            href="/admin/invoices/create"
                            className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircle size={14} />
                            <span>Create Single Invoice</span>
                        </Link>
                        <Link
                            href="/admin/payments/create"
                            className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <CreditCard size={14} />
                            <span>Record Payment Collection</span>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-end mt-4">
                    <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Search Invoice
                        </label>
                        <input
                            type="text"
                            placeholder="Invoice #, Tenant Name, Phone, or Flat..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Payment Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        >
                            <option value="all">All Statuses</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partially_paid">Partially Paid</option>
                            <option value="paid">Fully Paid</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Billing Month
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={billingMonth}
                                onChange={(e) => setBillingMonth(e.target.value)}
                                className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            >
                                <option value="all">All Months</option>
                                {billingMonths.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
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

            {/* Invoices Table Card */}
            <AdminCard
                title={
                    <div className="flex items-center gap-2">
                        <Receipt size={18} className="text-blue-600" />
                        <span>Invoices Directory ({invoices.total})</span>
                    </div>
                }
                variant="primary"
                noPadding
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                        <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                            <tr>
                                <th className="px-5 py-3.5">Invoice # & Month</th>
                                <th className="px-5 py-3.5">Resident & Flat</th>
                                <th className="px-5 py-3.5">Total Invoiced</th>
                                <th className="px-5 py-3.5">Paid Amount</th>
                                <th className="px-5 py-3.5">Balance Due</th>
                                <th className="px-5 py-3.5 text-center">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {invoices.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-400">
                                        No invoices matching the selected criteria.
                                    </td>
                                </tr>
                            ) : (
                                invoices.data.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/admin/invoices/${inv.id}`}
                                                className="font-mono text-xs font-bold text-blue-600 hover:underline block"
                                            >
                                                {inv.invoice_no}
                                            </Link>
                                            <span className="text-[11px] text-slate-400">
                                                Month: {inv.billing_month}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                {inv.tenant?.name || 'Unassigned'}
                                            </div>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                Flat {inv.lease?.flat?.flat_number} ({inv.lease?.flat?.floor})
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                                            ৳{Number(inv.total_payable).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3.5 font-medium text-emerald-600 dark:text-emerald-400">
                                            ৳{Number(inv.paid_amount).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-rose-600 dark:text-rose-400">
                                            ৳{Number(inv.due_amount).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                                    inv.status === 'paid'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : inv.status === 'partially_paid'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                                }`}
                                            >
                                                {inv.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/invoices/${inv.id}`}
                                                    title="View Printable Invoice"
                                                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                                                >
                                                    <ExternalLink size={13} />
                                                    <span>View</span>
                                                </Link>
                                                {inv.status !== 'paid' && (
                                                    <Link
                                                        href={`/admin/payments/create?invoice_id=${inv.id}`}
                                                        title="Collect Payment"
                                                        className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
                                                    >
                                                        <CreditCard size={13} />
                                                        <span>Collect</span>
                                                    </Link>
                                                )}
                                                {Number(inv.paid_amount) === 0 && (
                                                    <button
                                                        onClick={() => handleDelete(inv)}
                                                        title="Delete Invoice"
                                                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {invoices.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <div className="text-xs text-slate-500">
                            Page {invoices.current_page} of {invoices.last_page} ({invoices.total} total invoices)
                        </div>
                        <div className="flex items-center gap-1">
                            {invoices.links.map((link, idx) => (
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

            {/* Batch Invoicing Modal */}
            {isBatchModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Zap size={18} className="text-indigo-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Batch Generate Monthly Invoices
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsBatchModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleBatchSubmit} className="mt-4 space-y-4">
                            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                                Automatically creates monthly rent invoices for <strong>all currently active leases</strong>. Active units that already have an invoice generated for the selected month will be safely skipped.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Billing Month (YYYY-MM) *
                                    </label>
                                    <input
                                        type="month"
                                        value={batchData.billing_month}
                                        onChange={(e) => setBatchData('billing_month', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {batchErrors.billing_month && (
                                        <p className="mt-1 text-[11px] text-rose-600">{batchErrors.billing_month}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Payment Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={batchData.due_date}
                                        onChange={(e) => setBatchData('due_date', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {batchErrors.due_date && (
                                        <p className="mt-1 text-[11px] text-rose-600">{batchErrors.due_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Default Utility Charges (৳)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={batchData.utility_charges}
                                        onChange={(e) => setBatchData('utility_charges', Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Other Service Charges (৳)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={batchData.other_charges}
                                        onChange={(e) => setBatchData('other_charges', Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsBatchModalOpen(false)}
                                    className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={batchProcessing}
                                    className="inline-flex items-center gap-1.5 rounded bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <Zap size={14} />
                                    <span>{batchProcessing ? 'Generating Invoices...' : 'Generate Invoices'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
