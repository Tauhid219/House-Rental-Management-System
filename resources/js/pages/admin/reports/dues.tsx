import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import AdminSmallBox from '@/components/admin/admin-small-box';
import { 
    AlertCircle, 
    ArrowLeft, 
    Printer, 
    Download, 
    Search, 
    CreditCard, 
    ExternalLink,
    Building2,
    Calendar,
    Coins
} from 'lucide-react';

interface DueInvoice {
    id: number;
    invoice_no: string;
    billing_month: string;
    rent_amount: string | number;
    utility_charges: string | number;
    other_charges: string | number;
    discount: string | number;
    total_payable: string | number;
    paid_amount: string | number;
    due_date: string | null;
    status: 'unpaid' | 'partially_paid';
    tenant: {
        id: number;
        name: string;
        phone: string;
    };
    lease: {
        flat: {
            id: number;
            flat_number: string;
            floor: string;
        };
    };
}

interface Props {
    invoices: DueInvoice[];
    filters: {
        month?: string;
        search?: string;
    };
    summary: {
        total_invoices: number;
        total_payable: number;
        total_paid: number;
        total_due: number;
    };
}

export default function ReportDues({ invoices, filters, summary }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [month, setMonth] = useState(filters.month || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/reports/dues', {
            search,
            month,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExportCSV = () => {
        if (invoices.length === 0) return;

        const headers = ['Invoice No', 'Billing Month', 'Resident', 'Phone', 'Flat', 'Due Date', 'Total Payable', 'Paid', 'Outstanding Due (BDT)'];
        const rows = invoices.map((inv) => {
            const due = Number(inv.total_payable) - Number(inv.paid_amount);
            return [
                inv.invoice_no,
                inv.billing_month,
                `"${inv.tenant?.name || 'Resident'}"`,
                inv.tenant?.phone || '',
                `"${inv.lease?.flat?.flat_number || 'N/A'}"`,
                inv.due_date || 'N/A',
                Number(inv.total_payable).toFixed(2),
                Number(inv.paid_amount).toFixed(2),
                due.toFixed(2),
            ];
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `outstanding_tenant_dues_${month || 'all'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reports', href: '/admin/reports' },
        { title: 'Outstanding Dues List', href: '/admin/reports/dues' },
    ];

    return (
        <AdminLayout title="Tenant Outstanding Dues & Arrears" breadcrumbs={breadcrumbs}>
            <Head title="Outstanding Due List Report - Skyline Heights" />

            {/* Top Toolbar (Hidden on print) */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
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
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                        <Download size={13} />
                        <span>Export CSV</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm"
                    >
                        <Printer size={13} />
                        <span>Print Due List</span>
                    </button>
                </div>
            </div>

            {/* Printable Report Header */}
            <div className="hidden print:block mb-6 border-b border-slate-300 pb-4 text-center">
                <h2 className="text-xl font-black text-slate-900">SKYLINE HEIGHTS RESIDENCY</h2>
                <p className="text-xs text-slate-600">House 42, Road 11, Block D, Banani, Dhaka-1213 · Property Accounts Office</p>
                <h3 className="text-sm font-bold text-amber-800 mt-2 uppercase tracking-wide">
                    Outstanding Rent Dues & Arrears Statement
                </h3>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <AdminSmallBox
                    variant="danger"
                    value={`৳ ${summary.total_due.toLocaleString()}`}
                    label="Total Outstanding Balance"
                    icon={AlertCircle}
                />
                <AdminSmallBox
                    variant="warning"
                    value={summary.total_invoices}
                    label="Unsettled Invoices"
                    icon={Calendar}
                />
                <AdminSmallBox
                    variant="info"
                    value={`৳ ${summary.total_payable.toLocaleString()}`}
                    label="Total Billed on Dues"
                    icon={Coins}
                />
                <AdminSmallBox
                    variant="success"
                    value={`৳ ${summary.total_paid.toLocaleString()}`}
                    label="Partial Payments Received"
                    icon={CreditCard}
                />
            </div>

            {/* Filters Bar (Hidden on print) */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm print:hidden">
                <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-6 relative">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                            Search Resident or Flat
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Type tenant name, phone, or unit..."
                            className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        />
                        <Search className="absolute left-2.5 top-7 text-slate-400" size={14} />
                    </div>

                    <div className="sm:col-span-4">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                            Specific Billing Month
                        </label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                        >
                            Filter Dues
                        </button>
                    </div>
                </form>
            </div>

            {/* Dues Table Card */}
            <AdminCard title={`Outstanding Invoices Ledger (${invoices.length} Unsettled)`} icon={AlertCircle}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Invoice & Month</th>
                                <th className="px-4 py-3">Resident Details</th>
                                <th className="px-4 py-3">Flat Unit</th>
                                <th className="px-4 py-3">Due Date</th>
                                <th className="px-4 py-3 text-right">Total Billed</th>
                                <th className="px-4 py-3 text-right">Paid</th>
                                <th className="px-4 py-3 text-right">Net Due</th>
                                <th className="px-4 py-3 text-right print:hidden">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-slate-400">
                                        No outstanding rent dues found! All accounts are fully settled.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => {
                                    const due = Number(inv.total_payable) - Number(inv.paid_amount);
                                    return (
                                        <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Link
                                                    href={`/admin/invoices/${inv.id}`}
                                                    className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline block"
                                                >
                                                    {inv.invoice_no}
                                                </Link>
                                                <span className="text-[10px] text-slate-400">
                                                    Month: {inv.billing_month}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="font-semibold text-slate-900 dark:text-white block">
                                                    {inv.tenant?.name || 'Resident'}
                                                </span>
                                                <span className="text-[10px] text-slate-400">{inv.tenant?.phone}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                Unit {inv.lease?.flat?.flat_number || 'N/A'}
                                                <span className="block text-[10px] text-slate-400">
                                                    {inv.lease?.flat?.floor}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                                                {inv.due_date || 'Immediate'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right font-medium">
                                                ৳ {Number(inv.total_payable).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right text-slate-500">
                                                ৳ {Number(inv.paid_amount).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-rose-600 dark:text-rose-400">
                                                ৳ {due.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right print:hidden">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <Link
                                                        href={`/admin/payments/create?invoice_id=${inv.id}`}
                                                        className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-sm"
                                                    >
                                                        Collect
                                                    </Link>
                                                    <Link
                                                        href={`/admin/invoices/${inv.id}`}
                                                        title="View Invoice"
                                                        className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                    >
                                                        <ExternalLink size={13} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        <tfoot className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50/75 dark:bg-slate-900/60 font-bold">
                            <tr>
                                <td colSpan={6} className="px-4 py-3 text-right uppercase tracking-wider text-xs">
                                    Total Outstanding Arrears:
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-rose-600 dark:text-rose-400">
                                    ৳ {summary.total_due.toLocaleString()}
                                </td>
                                <td className="print:hidden" />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </AdminCard>
        </AdminLayout>
    );
}
