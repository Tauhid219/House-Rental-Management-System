import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { CreditCard, ExternalLink, PlusCircle, Printer } from 'lucide-react';
import React, { useState } from 'react';

interface PaymentItem {
    id: number;
    payment_no: string;
    invoice_id?: number;
    amount_paid: number | string;
    payment_method: 'cash' | 'bank' | 'bkash' | 'nagad' | 'other';
    transaction_id?: string;
    payment_date: string;
    notes?: string;
    invoice?: {
        id: number;
        invoice_no: string;
        billing_month: string;
        tenant?: {
            id: number;
            name: string;
            phone: string;
        };
    };
    lease?: {
        flat?: {
            id: number;
            flat_number: string;
            floor: string;
        };
    };
    received_by?: {
        name: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaymentsIndexProps {
    payments: {
        data: PaymentItem[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        payment_method?: string;
    };
    stats: {
        total_payments_count: number;
        total_collected: number;
        cash_collected: number;
        digital_collected: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payments History', href: '/admin/payments' },
];

export default function PaymentsIndex({ payments, filters, stats }: PaymentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [method, setMethod] = useState(filters.payment_method || 'all');

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/payments',
            {
                search,
                payment_method: method,
            },
            { preserveState: true },
        );
    };

    return (
        <AdminLayout title="Payment Collections & Receipts • Skyline Heights" breadcrumbs={breadcrumbs}>
            {/* Quick Stat Pill Widgets */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-xs font-semibold text-slate-400 uppercase">Total Collections</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">৳{stats.total_collected.toLocaleString()}</div>
                    <span className="text-[11px] text-slate-400">{stats.total_payments_count} receipts recorded</span>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
                    <div className="text-xs font-semibold text-emerald-600 uppercase dark:text-emerald-400">Digital / Bank Collections</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">৳{stats.digital_collected.toLocaleString()}</div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Bank Wire, bKash, Nagad</span>
                </div>
                <div className="rounded-md border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950 dark:bg-blue-950/20">
                    <div className="text-xs font-semibold text-blue-600 uppercase dark:text-blue-400">Cash Collections</div>
                    <div className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">৳{stats.cash_collected.toLocaleString()}</div>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400">Cashier Counter</span>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50/50 p-4 shadow-sm dark:border-indigo-950 dark:bg-indigo-950/20">
                    <div className="text-xs font-semibold text-indigo-600 uppercase dark:text-indigo-400">Digital Share</div>
                    <div className="mt-1 text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                        {stats.total_collected > 0 ? Math.round((stats.digital_collected / stats.total_collected) * 100) : 0}%
                    </div>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Digital adoption</span>
                </div>
            </div>

            {/* Filter Card */}
            <AdminCard variant="default" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                            Search Payment
                        </label>
                        <input
                            type="text"
                            placeholder="Payment No, Transaction ID, Tenant Name, or Flat..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                            Payment Method
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            >
                                <option value="all">All Methods</option>
                                <option value="cash">Cash</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </form>
            </AdminCard>

            {/* Payments Table Card */}
            <AdminCard
                title={
                    <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-blue-600" />
                        <span>Transaction & Payment Receipts ({payments.total})</span>
                    </div>
                }
                tools={
                    <Link
                        href="/admin/payments/create"
                        className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                        <PlusCircle size={14} />
                        <span>Record Payment Collection</span>
                    </Link>
                }
                variant="primary"
                noPadding
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                        <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/60">
                            <tr>
                                <th className="px-5 py-3.5">Payment No & Date</th>
                                <th className="px-5 py-3.5">Invoice Reference</th>
                                <th className="px-5 py-3.5">Tenant & Flat Unit</th>
                                <th className="px-5 py-3.5">Payment Method</th>
                                <th className="px-5 py-3.5">Trx ID / Ref</th>
                                <th className="px-5 py-3.5 text-right">Amount Collected</th>
                                <th className="px-5 py-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {payments.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-400">
                                        No payment records matching your search.
                                    </td>
                                </tr>
                            ) : (
                                payments.data.map((payment) => (
                                    <tr key={payment.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <span className="block font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {payment.payment_no}
                                            </span>
                                            <span className="text-[11px] text-slate-400">{payment.payment_date}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {payment.invoice ? (
                                                <Link
                                                    href={`/admin/invoices/${payment.invoice.id}`}
                                                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    <span>{payment.invoice.invoice_no}</span>
                                                    <ExternalLink size={11} />
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Manual / Advance</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                {payment.invoice?.tenant?.name || 'Resident'}
                                            </div>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                Flat {payment.lease?.flat?.flat_number} ({payment.lease?.flat?.floor})
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                    payment.payment_method === 'cash'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                        : payment.payment_method === 'bkash'
                                                          ? 'bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300'
                                                          : payment.payment_method === 'nagad'
                                                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
                                                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                }`}
                                            >
                                                {payment.payment_method}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                            {payment.transaction_id || '-'}
                                        </td>
                                        <td className="px-5 py-3.5 text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            ৳{Number(payment.amount_paid).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                            <Link
                                                href={`/admin/payments/${payment.id}/receipt`}
                                                title="Print Official Money Receipt"
                                                className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                                            >
                                                <Printer size={13} className="text-emerald-600 dark:text-emerald-400" />
                                                <span>Receipt</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {payments.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <div className="text-xs text-slate-500">
                            Page {payments.current_page} of {payments.last_page} ({payments.total} total payments)
                        </div>
                        <div className="flex items-center gap-1">
                            {payments.links.map((link, idx) => (
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
