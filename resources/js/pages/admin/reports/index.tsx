import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import AdminSmallBox from '@/components/admin/admin-small-box';
import { 
    BarChart3, 
    CreditCard, 
    AlertCircle, 
    Coins, 
    TrendingUp, 
    ArrowRight, 
    Calendar, 
    FileText, 
    PieChart,
    Building2,
    Clock
} from 'lucide-react';

interface Props {
    stats: {
        month_income: number;
        total_income: number;
        total_due: number;
        month_expenses: number;
        total_expenses: number;
        month_net: number;
        total_net: number;
        current_month: string;
    };
}

export default function ReportIndex({ stats }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Financial Reports', href: '/admin/reports' },
    ];

    return (
        <AdminLayout title="Financial Reports & Performance Analytics" breadcrumbs={breadcrumbs}>
            <Head title="Financial Reports - AdminLTE Management" />

            {/* Current Month Highlights Banner */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-slate-900 border border-slate-800 p-5 text-white">
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        Active Accounting Period
                    </span>
                    <h2 className="text-xl font-black mt-0.5">
                        Performance Overview for {stats.current_month}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Comprehensive summary of rent collections, operating overheads, and net liquid cash flow.
                    </p>
                </div>

                <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Net Cash Flow ({stats.current_month})</span>
                    <span className={`text-2xl font-black ${stats.month_net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ৳ {stats.month_net.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Small Boxes Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <AdminSmallBox
                    variant="success"
                    value={`৳ ${stats.month_income.toLocaleString()}`}
                    label={`Rent Inflows (${stats.current_month})`}
                    icon={CreditCard}
                    link="/admin/reports/collection"
                    linkText="View Collection Ledger"
                />
                <AdminSmallBox
                    variant="danger"
                    value={`৳ ${stats.month_expenses.toLocaleString()}`}
                    label={`Operating Outflows (${stats.current_month})`}
                    icon={Coins}
                    link="/admin/expenses"
                    linkText="View Expense Ledger"
                />
                <AdminSmallBox
                    variant="warning"
                    value={`৳ ${stats.total_due.toLocaleString()}`}
                    label="Outstanding Tenant Dues"
                    icon={AlertCircle}
                    link="/admin/reports/dues"
                    linkText="View Due List Statement"
                />
                <AdminSmallBox
                    variant="info"
                    value={`৳ ${stats.total_income.toLocaleString()}`}
                    label="All-Time Rent Revenue"
                    icon={TrendingUp}
                    link="/admin/reports/income-expense"
                    linkText="View P&L Statement"
                />
            </div>

            {/* Report Navigation Modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 1. Rent Collection Report */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center mb-4">
                            <CreditCard size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                            Rent Collection Report
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                            Filter rent collections by date range and payment method (Cash, Bank, bKash, Nagad). Export receipt ledgers for audits.
                        </p>
                    </div>

                    <Link
                        href="/admin/reports/collection"
                        className="inline-flex items-center justify-between w-full rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-emerald-600 transition-colors"
                    >
                        <span>Open Collection Report</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* 2. Outstanding Due List Report */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-all">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center mb-4">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                            Tenant Due List Report
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                            Detailed list of all unpaid and partially paid rent invoices. Track individual flat balances and overdue amounts.
                        </p>
                    </div>

                    <Link
                        href="/admin/reports/dues"
                        className="inline-flex items-center justify-between w-full rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-amber-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-600 transition-colors"
                    >
                        <span>Open Due List Report</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* 3. Income vs Expense Statement */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center mb-4">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                            Income vs. Expense Statement
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                            Operating statement comparing total rent revenue against building operational expenses, repairs, and net monthly cash flow.
                        </p>
                    </div>

                    <Link
                        href="/admin/reports/income-expense"
                        className="inline-flex items-center justify-between w-full rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 transition-colors"
                    >
                        <span>Open Operating Statement</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Lifetime Financial Position Banner */}
            <AdminCard title="Property Lifetime Financial Position" icon={Building2}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center py-2">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Cumulative Rent Collected
                        </span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            ৳ {stats.total_income.toLocaleString()}
                        </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Cumulative Operating Expenses
                        </span>
                        <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                            ৳ {stats.total_expenses.toLocaleString()}
                        </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Cumulative Net Cash Retained
                        </span>
                        <span className={`text-2xl font-black ${stats.total_net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            ৳ {stats.total_net.toLocaleString()}
                        </span>
                    </div>
                </div>
            </AdminCard>
        </AdminLayout>
    );
}
