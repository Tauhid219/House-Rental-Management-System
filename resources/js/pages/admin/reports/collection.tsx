import AdminCard from '@/components/admin/admin-card';
import AdminSmallBox from '@/components/admin/admin-small-box';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Building2, Coins, CreditCard, DollarSign, Download, Printer } from 'lucide-react';
import React, { useState } from 'react';

interface PaymentItem {
    id: number;
    payment_no: string;
    payment_date: string;
    amount_paid: string | number;
    payment_method: string;
    transaction_id: string | null;
    invoice: {
        invoice_no: string;
        billing_month: string;
        tenant: {
            name: string;
            phone: string;
        } | null;
    } | null;
    lease: {
        flat: {
            flat_number: string;
            floor: string;
        } | null;
    } | null;
}

interface Props {
    payments: PaymentItem[];
    filters: {
        start_date: string;
        end_date: string;
        payment_method: string;
    };
    summary: {
        total_collected: number;
        cash_total: number;
        bank_total: number;
        digital_total: number;
        count: number;
    };
}

export default function ReportCollection({ payments, filters, summary }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [method, setMethod] = useState(filters.payment_method);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/reports/collection',
            {
                start_date: startDate,
                end_date: endDate,
                payment_method: method,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleQuickPreset = (type: 'this_month' | 'last_month' | 'this_year') => {
        const now = new Date();
        let start = '';
        let end = '';

        if (type === 'this_month') {
            start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            end = now.toISOString().split('T')[0];
        } else if (type === 'last_month') {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
            end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        } else if (type === 'this_year') {
            start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
            end = now.toISOString().split('T')[0];
        }

        setStartDate(start);
        setEndDate(end);

        router.get('/admin/reports/collection', {
            start_date: start,
            end_date: end,
            payment_method: method,
        });
    };

    const handleExportCSV = () => {
        if (payments.length === 0) return;

        const headers = ['Receipt No', 'Date', 'Tenant', 'Flat', 'Invoice Ref', 'Method', 'Trx ID', 'Amount (BDT)'];
        const rows = payments.map((p) => [
            p.payment_no,
            p.payment_date,
            `"${p.invoice?.tenant?.name || 'Resident'}"`,
            `"${p.lease?.flat?.flat_number || 'N/A'}"`,
            p.invoice?.invoice_no || 'N/A',
            p.payment_method.toUpperCase(),
            p.transaction_id || 'Cash',
            Number(p.amount_paid).toFixed(2),
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `rent_collection_${startDate}_to_${endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reports', href: '/admin/reports' },
        { title: 'Rent Collection Report', href: '/admin/reports/collection' },
    ];

    return (
        <AdminLayout title="Rent Collection Statement" breadcrumbs={breadcrumbs}>
            <Head title="Rent Collection Report - Skyline Heights" />

            {/* Top Toolbar (Hidden on print) */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center print:hidden">
                <Link
                    href="/admin/reports"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Reports Hub</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                        <Download size={13} />
                        <span>Export CSV</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                    >
                        <Printer size={13} />
                        <span>Print Report</span>
                    </button>
                </div>
            </div>

            {/* Printable Report Header */}
            <div className="mb-6 hidden border-b border-slate-300 pb-4 text-center print:block">
                <h2 className="text-xl font-black text-slate-900">SKYLINE HEIGHTS RESIDENCY</h2>
                <p className="text-xs text-slate-600">House 42, Road 11, Block D, Banani, Dhaka-1213 · Property Accounts Office</p>
                <h3 className="mt-2 text-sm font-bold tracking-wide text-emerald-800 uppercase">
                    Rent Collection Statement ({startDate} to {endDate})
                </h3>
            </div>

            {/* Metrics Row */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminSmallBox
                    variant="success"
                    value={`৳ ${summary.total_collected.toLocaleString()}`}
                    label={`Total Collected (${summary.count} Txns)`}
                    icon={CreditCard}
                />
                <AdminSmallBox variant="info" value={`৳ ${summary.cash_total.toLocaleString()}`} label="Cash Collections" icon={Coins} />
                <AdminSmallBox variant="primary" value={`৳ ${summary.bank_total.toLocaleString()}`} label="Bank Wire Transfers" icon={Building2} />
                <AdminSmallBox variant="warning" value={`৳ ${summary.digital_total.toLocaleString()}`} label="bKash & Nagad" icon={DollarSign} />
            </div>

            {/* Filters Bar (Hidden on print) */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
                <form onSubmit={handleFilter} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-3">
                        <label className="mb-1 block text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label className="mb-1 block text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label className="mb-1 block text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        >
                            <option value="all">All Methods</option>
                            <option value="cash">Cash Only</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-3">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                            Filter Date Range
                        </button>
                    </div>
                </form>

                {/* Quick Presets */}
                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                    <span>Quick Range:</span>
                    <button
                        type="button"
                        onClick={() => handleQuickPreset('this_month')}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        This Month
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickPreset('last_month')}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        Last Month
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickPreset('this_year')}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        Year to Date
                    </button>
                </div>
            </div>

            {/* Collection Ledger Table */}
            <AdminCard title={`Collection Records (${startDate} to ${endDate})`} icon={CreditCard}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Receipt No</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Resident</th>
                                <th className="px-4 py-3">Flat</th>
                                <th className="px-4 py-3">Invoice Ref</th>
                                <th className="px-4 py-3">Method</th>
                                <th className="px-4 py-3">Txn ID</th>
                                <th className="px-4 py-3 text-right">Amount (BDT)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-slate-400">
                                        No rent collections recorded within this date range.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                        <td className="px-4 py-3 font-mono font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                            {p.payment_no}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">{p.payment_date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="block font-semibold text-slate-900 dark:text-white">
                                                {p.invoice?.tenant?.name || 'Resident'}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{p.invoice?.tenant?.phone}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">Unit {p.lease?.flat?.flat_number || 'N/A'}</td>
                                        <td className="px-4 py-3 font-mono whitespace-nowrap text-blue-600 dark:text-blue-400">
                                            {p.invoice?.invoice_no || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap uppercase">{p.payment_method}</td>
                                        <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap text-slate-500">
                                            {p.transaction_id || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                                            ৳ {Number(p.amount_paid).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot className="border-t-2 border-slate-300 bg-slate-50/75 font-bold dark:border-slate-700 dark:bg-slate-900/60">
                            <tr>
                                <td colSpan={7} className="px-4 py-3 text-right text-xs tracking-wider uppercase">
                                    Grand Total Collected:
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-emerald-600 dark:text-emerald-400">
                                    ৳ {summary.total_collected.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </AdminCard>
        </AdminLayout>
    );
}
