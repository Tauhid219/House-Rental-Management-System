import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Coins, ExternalLink, FileText, Save } from 'lucide-react';
import React from 'react';

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
    expense: Expense;
}

export default function ExpenseEdit({ expense }: Props) {
    const { data, setData, processing, errors } = useForm({
        _method: 'PUT',
        category: expense.category,
        title: expense.title,
        amount: String(expense.amount),
        expense_date: expense.expense_date,
        voucher_file: null as File | null,
        notes: expense.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/expenses/${expense.id}`, data, {
            forceFormData: true,
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Building Expenses', href: '/admin/expenses' },
        { title: `Edit: ${expense.title}`, href: `/admin/expenses/${expense.id}/edit` },
    ];

    return (
        <AdminLayout title="Edit Operational Expense" breadcrumbs={breadcrumbs}>
            <Head title={`Edit Expense: ${expense.title} - AdminLTE Management`} />

            <div className="mx-auto max-w-3xl">
                <div className="mb-4">
                    <Link
                        href="/admin/expenses"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Expense Ledger</span>
                    </Link>
                </div>

                <AdminCard title={`Edit Expense #${expense.id} - ${expense.title}`} icon={Coins}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Expense Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value as 'utility' | 'salary' | 'maintenance' | 'tax' | 'others')}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                >
                                    <option value="utility">Utility (Electricity, Gas, Fuel)</option>
                                    <option value="salary">Salary (Security, Caretaker)</option>
                                    <option value="maintenance">Maintenance & Repairs</option>
                                    <option value="tax">Tax & Government Fees</option>
                                    <option value="others">Other Miscellaneous</option>
                                </select>
                                {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Expense Date <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={data.expense_date}
                                    onChange={(e) => setData('expense_date', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                                {errors.expense_date && <p className="mt-1 text-xs text-rose-500">{errors.expense_date}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Expense Title / Particulars <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                                {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Amount (BDT) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    required
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                                {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                Replace Receipt / Voucher Document
                            </label>
                            {expense.voucher_path && (
                                <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                    <span>Current file:</span>
                                    <a
                                        href={expense.voucher_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                                    >
                                        <FileText size={12} />
                                        <span>View Voucher</span>
                                        <ExternalLink size={10} />
                                    </a>
                                </div>
                            )}
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => setData('voucher_file', e.target.files ? e.target.files[0] : null)}
                                className="w-full text-xs text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-300"
                            />
                            {errors.voucher_file && <p className="mt-1 text-xs text-rose-500">{errors.voucher_file}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                Notes / Vendor Details
                            </label>
                            <textarea
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            />
                            {errors.notes && <p className="mt-1 text-xs text-rose-500">{errors.notes}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                            <Link
                                href="/admin/expenses"
                                className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save size={14} />
                                <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </AdminCard>
            </div>
        </AdminLayout>
    );
}
