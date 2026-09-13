import AdminCard from '@/components/admin/admin-card';
import AdminSmallBox from '@/components/admin/admin-small-box';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, BarChart3, Building2, Coins, CreditCard, TrendingUp } from 'lucide-react';

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
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 text-white sm:flex-row sm:items-center">
                <div>
                    <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">Active Accounting Period</span>
                    <h2 className="mt-0.5 text-xl font-black">Performance Overview for {stats.current_month}</h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Comprehensive summary of rent collections, operating overheads, and net liquid cash flow.
                    </p>
                </div>

                <div className="text-left sm:text-right">
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Net Cash Flow ({stats.current_month})</span>
                    <span className={`text-2xl font-black ${stats.month_net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ৳ {stats.month_net.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Small Boxes Row */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* 1. Rent Collection Report */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-500/50 dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <CreditCard size={24} />
                        </div>
                        <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">Rent Collection Report</h3>
                        <p className="mb-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Filter rent collections by date range and payment method (Cash, Bank, bKash, Nagad). Export receipt ledgers for audits.
                        </p>
                    </div>

                    <Link
                        href="/admin/reports/collection"
                        className="inline-flex w-full items-center justify-between rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-emerald-600"
                    >
                        <span>Open Collection Report</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* 2. Outstanding Due List Report */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-500/50 dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">Tenant Due List Report</h3>
                        <p className="mb-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Detailed list of all unpaid and partially paid rent invoices. Track individual flat balances and overdue amounts.
                        </p>
                    </div>

                    <Link
                        href="/admin/reports/dues"
                        className="inline-flex w-full items-center justify-between rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:bg-amber-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-600"
                    >
                        <span>Open Due List Report</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* 3. Income vs Expense Statement */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500/50 dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">Income vs. Expense Statement</h3>
                        <p className="mb-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Operating statement comparing total rent revenue against building operational expenses, repairs, and net monthly cash
                            flow.
                        </p>
                    </div>

                    <Link
                        href="/admin/reports/income-expense"
                        className="inline-flex w-full items-center justify-between rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600"
                    >
                        <span>Open Operating Statement</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Lifetime Financial Position Banner */}
            <AdminCard title="Property Lifetime Financial Position" icon={Building2}>
                <div className="grid grid-cols-1 gap-6 py-2 text-center sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <span className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Cumulative Rent Collected
                        </span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">৳ {stats.total_income.toLocaleString()}</span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <span className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Cumulative Operating Expenses
                        </span>
                        <span className="text-2xl font-black text-rose-600 dark:text-rose-400">৳ {stats.total_expenses.toLocaleString()}</span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <span className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Cumulative Net Cash Retained
                        </span>
                        <span
                            className={`text-2xl font-black ${stats.total_net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}
                        >
                            ৳ {stats.total_net.toLocaleString()}
                        </span>
                    </div>
                </div>
            </AdminCard>
        </AdminLayout>
    );
}
