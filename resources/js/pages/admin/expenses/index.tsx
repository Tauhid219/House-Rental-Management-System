import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import AdminSmallBox from '@/components/admin/admin-small-box';
import { 
    Coins, 
    PlusCircle, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    FileText, 
    Calendar,
    DollarSign,
    Zap,
    Users,
    Wrench,
    ExternalLink
} from 'lucide-react';

interface Expense {
    id: number;
    category: 'maintenance' | 'utility' | 'salary' | 'tax' | 'others';
    title: string;
    amount: string | number;
    expense_date: string;
    voucher_path: string | null;
    notes: string | null;
}

interface Props {
    expenses: {
        data: Expense[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        category?: string;
        month?: string;
    };
    stats: {
        total_expenses: number;
        salary_total: number;
        utility_total: number;
        maintenance_total: number;
        tax_other_total: number;
    };
}

export default function ExpenseIndex({ expenses, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [month, setMonth] = useState(filters.month || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/expenses', {
            search,
            category,
            month,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (item: Expense) => {
        if (confirm(`Are you sure you want to delete expense record: "${item.title}"?`)) {
            router.delete(`/admin/expenses/${item.id}`);
        }
    };

    const getCategoryBadge = (cat: string) => {
        switch (cat) {
            case 'salary':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
            case 'utility':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
            case 'maintenance':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
            case 'tax':
                return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Building Expenses', href: '/admin/expenses' },
    ];

    return (
        <AdminLayout title="Operational Expense Management" breadcrumbs={breadcrumbs}>
            <Head title="Building Expenses - AdminLTE Management" />

            {/* Small Boxes Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <AdminSmallBox
                    variant="danger"
                    value={`৳ ${stats.total_expenses.toLocaleString()}`}
                    label="Total Operational Outflow"
                    icon={Coins}
                />
                <AdminSmallBox
                    variant="info"
                    value={`৳ ${stats.salary_total.toLocaleString()}`}
                    label="Staff Salaries (Guards/Care)"
                    icon={Users}
                />
                <AdminSmallBox
                    variant="warning"
                    value={`৳ ${stats.utility_total.toLocaleString()}`}
                    label="Utilities (Power/Gen Fuel)"
                    icon={Zap}
                />
                <AdminSmallBox
                    variant="primary"
                    value={`৳ ${stats.maintenance_total.toLocaleString()}`}
                    label="Repairs & Lift Servicing"
                    icon={Wrench}
                />
            </div>

            {/* Main Card */}
            <AdminCard
                title="Building Overhead & Expense Ledger"
                icon={Coins}
                headerAction={
                    <Link
                        href="/admin/expenses/create"
                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
                    >
                        <PlusCircle size={14} />
                        <span>Record New Expense</span>
                    </Link>
                }
            >
                {/* Search and Filters */}
                <form onSubmit={handleFilter} className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-5 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by expense title or notes..."
                            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                        <Search className="absolute left-2.5 top-2.5 text-slate-400" size={15} />
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                            <option value="all">All Categories</option>
                            <option value="salary">Salaries</option>
                            <option value="utility">Utilities (Electric, Gas, Fuel)</option>
                            <option value="maintenance">Maintenance & Repairs</option>
                            <option value="tax">Taxes & Govt Fees</option>
                            <option value="others">Other Overhead</option>
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <button
                            type="submit"
                            className="w-full h-full flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                        >
                            <Filter size={14} />
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Expense Details</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-center">Receipt/Voucher</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {expenses.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        No expense transactions found.
                                    </td>
                                </tr>
                            ) : (
                                expenses.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                        <td className="px-4 py-3">
                                            <span className="font-semibold text-slate-900 dark:text-white block">
                                                {item.title}
                                            </span>
                                            {item.notes && (
                                                <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                                    {item.notes}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadge(item.category)}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs">
                                            {item.expense_date}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-rose-600 dark:text-rose-400">
                                            ৳ {Number(item.amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            {item.voucher_path ? (
                                                <a
                                                    href={item.voucher_path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-blue-600 hover:underline dark:bg-slate-800 dark:text-blue-400"
                                                >
                                                    <FileText size={12} />
                                                    <span>View</span>
                                                    <ExternalLink size={10} />
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-[11px]">None</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <Link
                                                    href={`/admin/expenses/${item.id}/edit`}
                                                    title="Edit Expense"
                                                    className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                                                >
                                                    <Edit size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    title="Delete Expense"
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
                {expenses.links && expenses.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800 mt-4 text-xs text-slate-500">
                        <div>
                            Showing {expenses.data.length} of {expenses.total} expense entries
                        </div>
                        <div className="flex items-center gap-1">
                            {expenses.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded px-2.5 py-1 text-xs font-semibold ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : !link.url
                                            ? 'text-slate-300 pointer-events-none'
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
