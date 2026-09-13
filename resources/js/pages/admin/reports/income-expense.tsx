import AdminCard from '@/components/admin/admin-card';
import AdminSmallBox from '@/components/admin/admin-small-box';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BarChart3, Calendar, Coins, Download, Printer, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

interface MonthlyTrendItem {
    month: string;
    income: number;
    expense: number;
    net: number;
}

interface Props {
    filters: {
        start_date: string;
        end_date: string;
    };
    summary: {
        total_income: number;
        total_expenses: number;
        net_income: number;
        salary: number;
        utility: number;
        maintenance: number;
        tax: number;
        others: number;
    };
    monthlyTrend: MonthlyTrendItem[];
}

export default function ReportIncomeExpense({ filters, summary, monthlyTrend }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/reports/income-expense',
            {
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleQuickPreset = (type: 'this_year' | 'this_month' | 'last_month') => {
        const now = new Date();
        let start = '';
        let end = '';

        if (type === 'this_year') {
            start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
            end = now.toISOString().split('T')[0];
        } else if (type === 'this_month') {
            start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            end = now.toISOString().split('T')[0];
        } else if (type === 'last_month') {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
            end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        }

        setStartDate(start);
        setEndDate(end);

        router.get('/admin/reports/income-expense', {
            start_date: start,
            end_date: end,
        });
    };

    const handleExportCSV = () => {
        const headers = ['Financial Metric / Category', 'Amount (BDT)', 'Share of Revenue (%)'];
        const totalInc = summary.total_income > 0 ? summary.total_income : 1;

        const rows = [
            ['Total Rent Revenue (Gross Inflow)', summary.total_income.toFixed(2), '100.0%'],
            ['Staff Salaries', summary.salary.toFixed(2), ((summary.salary / totalInc) * 100).toFixed(1) + '%'],
            ['Utilities & Generator Fuel', summary.utility.toFixed(2), ((summary.utility / totalInc) * 100).toFixed(1) + '%'],
            ['Repairs & Unit Maintenance', summary.maintenance.toFixed(2), ((summary.maintenance / totalInc) * 100).toFixed(1) + '%'],
            ['Taxes & Regulatory Fees', summary.tax.toFixed(2), ((summary.tax / totalInc) * 100).toFixed(1) + '%'],
            ['Other Operational Overheads', summary.others.toFixed(2), ((summary.others / totalInc) * 100).toFixed(1) + '%'],
            ['Total Operating Expenses', summary.total_expenses.toFixed(2), ((summary.total_expenses / totalInc) * 100).toFixed(1) + '%'],
            ['Net Operating Cash Flow (Profit/Loss)', summary.net_income.toFixed(2), ((summary.net_income / totalInc) * 100).toFixed(1) + '%'],
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `income_vs_expense_statement_${startDate}_to_${endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const expenseRatio = summary.total_income > 0 ? ((summary.total_expenses / summary.total_income) * 100).toFixed(1) : '0.0';

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reports', href: '/admin/reports' },
        { title: 'Income vs. Expense Statement', href: '/admin/reports/income-expense' },
    ];

    return (
        <AdminLayout title="Operating Financial Statement (Income vs. Expense)" breadcrumbs={breadcrumbs}>
            <Head title="Income vs. Expense Statement - Skyline Heights" />

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
                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                        <Printer size={13} />
                        <span>Print Statement</span>
                    </button>
                </div>
            </div>

            {/* Printable Statement Header */}
            <div className="mb-6 hidden border-b border-slate-300 pb-4 text-center print:block">
                <h2 className="text-xl font-black text-slate-900">SKYLINE HEIGHTS RESIDENCY</h2>
                <p className="text-xs text-slate-600">House 42, Road 11, Block D, Banani, Dhaka-1213 · Property Accounts Office</p>
                <h3 className="mt-2 text-sm font-bold tracking-wide text-blue-800 uppercase">
                    Income vs. Operating Expenses Statement ({startDate} to {endDate})
                </h3>
            </div>

            {/* Metrics Row */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminSmallBox variant="success" value={`৳ ${summary.total_income.toLocaleString()}`} label="Gross Rent Inflows" icon={TrendingUp} />
                <AdminSmallBox
                    variant="danger"
                    value={`৳ ${summary.total_expenses.toLocaleString()}`}
                    label="Total Operational Outflows"
                    icon={TrendingDown}
                />
                <AdminSmallBox
                    variant={summary.net_income >= 0 ? 'info' : 'danger'}
                    value={`৳ ${summary.net_income.toLocaleString()}`}
                    label="Net Operating Cash Flow"
                    icon={Coins}
                />
                <AdminSmallBox variant="primary" value={`${expenseRatio}%`} label="Expense-to-Income Ratio" icon={BarChart3} />
            </div>

            {/* Filters Bar (Hidden on print) */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
                <form onSubmit={handleFilter} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-5">
                        <label className="mb-1 block text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                            Accounting Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        />
                    </div>

                    <div className="sm:col-span-5">
                        <label className="mb-1 block text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                            Accounting End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                            Filter Statement
                        </button>
                    </div>
                </form>

                {/* Quick Presets */}
                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                    <span>Quick Range:</span>
                    <button
                        type="button"
                        onClick={() => handleQuickPreset('this_year')}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        Current Fiscal Year
                    </button>
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
                </div>
            </div>

            {/* Income & Expense Breakdown Table */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <AdminCard title={`Categorized Financial Statement (${startDate} to ${endDate})`} icon={BarChart3}>
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-600 uppercase dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Account Particulars</th>
                                    <th className="px-4 py-3 text-right">Amount (BDT)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {/* Income Header */}
                                <tr className="bg-emerald-50/50 font-bold dark:bg-emerald-950/20">
                                    <td className="px-4 py-2.5 text-emerald-800 dark:text-emerald-300">A. OPERATING REVENUE (INCOME)</td>
                                    <td className="px-4 py-2.5 text-right text-emerald-700 dark:text-emerald-400">
                                        ৳ {summary.total_income.toLocaleString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-2 text-slate-600 dark:text-slate-300">Residential Apartment Rents Collected</td>
                                    <td className="px-4 py-2 text-right font-medium">৳ {summary.total_income.toLocaleString()}</td>
                                </tr>

                                {/* Expense Header */}
                                <tr className="bg-rose-50/50 font-bold dark:bg-rose-950/20">
                                    <td className="px-4 py-2.5 text-rose-800 dark:text-rose-300">B. OPERATIONAL EXPENDITURES (OVERHEADS)</td>
                                    <td className="px-4 py-2.5 text-right text-rose-700 dark:text-rose-400">
                                        ৳ {summary.total_expenses.toLocaleString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-2 text-slate-600 dark:text-slate-300">Staff Salaries (Guards, Cleaners, Caretaker)</td>
                                    <td className="px-4 py-2 text-right font-medium">৳ {summary.salary.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-2 text-slate-600 dark:text-slate-300">
                                        Common Utilities (Electricity & Generator Diesel)
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium">৳ {summary.utility.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-2 text-slate-600 dark:text-slate-300">Building Repairs & Unit Maintenance</td>
                                    <td className="px-4 py-2 text-right font-medium">৳ {summary.maintenance.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-2 text-slate-600 dark:text-slate-300">Taxes, Municipal Fees & Levies</td>
                                    <td className="px-4 py-2 text-right font-medium">৳ {summary.tax.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="px-8 py-2 text-slate-600 dark:text-slate-300">Other Building Expenses (Pest Control, Hardware)</td>
                                    <td className="px-4 py-2 text-right font-medium">৳ {summary.others.toLocaleString()}</td>
                                </tr>
                            </tbody>
                            <tfoot className="border-t-2 border-slate-300 bg-slate-100 text-sm font-bold dark:border-slate-700 dark:bg-slate-900">
                                <tr>
                                    <td className="px-4 py-3 tracking-wider text-slate-900 uppercase dark:text-white">
                                        NET OPERATING CASH FLOW (A - B):
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-right font-black ${summary.net_income >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}
                                    >
                                        ৳ {summary.net_income.toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </AdminCard>
                </div>

                {/* 6 Months Trend Visualization */}
                <div className="lg:col-span-5">
                    <AdminCard title="Monthly Performance History (Last 6 Months)" icon={Calendar}>
                        <div className="space-y-4">
                            {monthlyTrend.map((m, idx) => {
                                const maxVal = Math.max(m.income, m.expense, 1);
                                const incWidth = Math.min(100, Math.round((m.income / maxVal) * 100));
                                const expWidth = Math.min(100, Math.round((m.expense / maxVal) * 100));

                                return (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950/40"
                                    >
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-white">{m.month}</span>
                                            <span
                                                className={`font-mono font-bold ${m.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                                            >
                                                Net: ৳{m.net.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            {/* Income bar */}
                                            <div className="flex items-center gap-2">
                                                <span className="w-12 text-[10px] text-slate-400">In:</span>
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${incWidth}%` }} />
                                                </div>
                                                <span className="w-16 text-right font-mono text-[10px] text-slate-700 dark:text-slate-300">
                                                    ৳{m.income > 0 ? (m.income / 1000).toFixed(0) + 'k' : '0'}
                                                </span>
                                            </div>

                                            {/* Expense bar */}
                                            <div className="flex items-center gap-2">
                                                <span className="w-12 text-[10px] text-slate-400">Out:</span>
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${expWidth}%` }} />
                                                </div>
                                                <span className="w-16 text-right font-mono text-[10px] text-slate-700 dark:text-slate-300">
                                                    ৳{m.expense > 0 ? (m.expense / 1000).toFixed(0) + 'k' : '0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminLayout>
    );
}
