import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import { Receipt, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface LeaseOption {
    id: number;
    agreed_monthly_rent: number | string;
    tenant?: {
        id: number;
        name: string;
        phone: string;
    };
    flat?: {
        id: number;
        flat_number: string;
        floor: string;
    };
}

interface CreateInvoiceProps {
    activeLeases: LeaseOption[];
    defaultBillingMonth: string;
    defaultDueDate: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Invoices', href: '/admin/invoices' },
    { title: 'Create Single Invoice', href: '/admin/invoices/create' },
];

export default function InvoiceCreate({ activeLeases, defaultBillingMonth, defaultDueDate }: CreateInvoiceProps) {
    const firstLease = activeLeases.length > 0 ? activeLeases[0] : null;

    const { data, setData, post, processing, errors } = useForm({
        lease_id: firstLease ? firstLease.id : '',
        billing_month: defaultBillingMonth,
        rent_amount: firstLease ? Number(firstLease.agreed_monthly_rent) : 0,
        utility_charges: 3000,
        other_charges: 0,
        discount: 0,
        due_date: defaultDueDate,
    });

    const handleLeaseChange = (leaseId: number) => {
        const selected = activeLeases.find((l) => l.id === leaseId);
        setData((prev) => ({
            ...prev,
            lease_id: leaseId,
            rent_amount: selected ? Number(selected.agreed_monthly_rent) : prev.rent_amount,
        }));
    };

    const calculatedTotal =
        Math.max(0, Number(data.rent_amount) + Number(data.utility_charges) + Number(data.other_charges) - Number(data.discount));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/invoices');
    };

    return (
        <AdminLayout title="Issue Single Rent Invoice • Skyline Heights" breadcrumbs={breadcrumbs}>
            <div className="max-w-3xl">
                {activeLeases.length === 0 ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                        <div className="flex items-center gap-2 font-bold text-sm">
                            <AlertCircle size={18} className="text-amber-600" />
                            <span>No Active Leases Available</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed">
                            Rent invoices can only be issued for active residential lease agreements. Please execute a lease agreement first before billing.
                        </p>
                        <div className="mt-4">
                            <Link
                                href="/admin/leases/create"
                                className="rounded bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
                            >
                                Create Lease Agreement
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <AdminCard
                            title={
                                <div className="flex items-center gap-2">
                                    <Receipt size={18} className="text-blue-600" />
                                    <span>Issue Individual Rent Invoice</span>
                                </div>
                            }
                            tools={
                                <Link
                                    href="/admin/invoices"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Back to Invoices</span>
                                </Link>
                            }
                            variant="primary"
                        >
                            <div className="space-y-5">
                                {/* Row 1: Lease Selection */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Select Active Resident & Unit *
                                    </label>
                                    <select
                                        value={data.lease_id}
                                        onChange={(e) => handleLeaseChange(Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    >
                                        {activeLeases.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                Flat {l.flat?.flat_number} ({l.flat?.floor}) - {l.tenant?.name} (Contract: ৳{Number(l.agreed_monthly_rent).toLocaleString()})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.lease_id && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.lease_id}</p>
                                    )}
                                </div>

                                {/* Row 2: Billing Month & Due Date */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Billing Month (YYYY-MM) *
                                        </label>
                                        <input
                                            type="month"
                                            value={data.billing_month}
                                            onChange={(e) => setData('billing_month', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                        {errors.billing_month && (
                                            <p className="mt-1 text-[11px] text-rose-600">{errors.billing_month}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Payment Due Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                        {errors.due_date && (
                                            <p className="mt-1 text-[11px] text-rose-600">{errors.due_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 3: Itemized Financial Breakdown */}
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Flat Rent (৳) *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.rent_amount}
                                            onChange={(e) => setData('rent_amount', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Utility Charges (৳)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.utility_charges}
                                            onChange={(e) => setData('utility_charges', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Other Charges (৳)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.other_charges}
                                            onChange={(e) => setData('other_charges', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Discount Waiver (৳)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.discount}
                                            onChange={(e) => setData('discount', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Total Calculation Banner */}
                                <div className="rounded-md border border-blue-200 bg-blue-50/70 p-4 text-xs dark:border-blue-900/60 dark:bg-blue-950/30">
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                            Total Calculated Payable Amount:
                                        </span>
                                        <span className="text-xl font-extrabold text-blue-700 dark:text-blue-300">
                                            ৳{calculatedTotal.toLocaleString()} BDT
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                                <Link
                                    href="/admin/invoices"
                                    className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    <Save size={15} />
                                    <span>{processing ? 'Issuing Invoice...' : 'Generate Invoice'}</span>
                                </button>
                            </div>
                        </AdminCard>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
