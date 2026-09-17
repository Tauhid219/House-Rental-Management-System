import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Receipt, Save } from 'lucide-react';
import React from 'react';

interface LeaseOption {
    id: number;
    agreed_monthly_rent: number | string;
    default_water_bill?: number | string;
    default_service_charge?: number | string;
    default_gas_type?: string;
    default_electricity_type?: string;
    start_date?: string;
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
        water_bill: firstLease?.default_water_bill !== undefined ? Number(firstLease.default_water_bill) : 1000,
        service_charge: firstLease?.default_service_charge !== undefined ? Number(firstLease.default_service_charge) : 3500,
        gas_bill: 0,
        gas_type: firstLease?.default_gas_type || 'prepaid',
        electricity_bill: 0,
        electricity_type: firstLease?.default_electricity_type || 'prepaid',
        other_charges: 0,
        other_charges_description: '',
        advance_adjustment: 0,
        discount: 0,
        due_date: defaultDueDate,
    });

    const handleLeaseChange = (leaseId: number) => {
        const selected = activeLeases.find((l) => l.id === leaseId);
        if (selected) {
            setData((prev) => ({
                ...prev,
                lease_id: leaseId,
                rent_amount: Number(selected.agreed_monthly_rent),
                water_bill: selected.default_water_bill !== undefined ? Number(selected.default_water_bill) : prev.water_bill,
                service_charge: selected.default_service_charge !== undefined ? Number(selected.default_service_charge) : 3500,
                gas_type: selected.default_gas_type || prev.gas_type,
                electricity_type: selected.default_electricity_type || prev.electricity_type,
            }));
        }
    };

    const totalUtility =
        Number(data.water_bill || 0) + Number(data.service_charge || 0) + Number(data.gas_bill || 0) + Number(data.electricity_bill || 0);
    const calculatedTotal = Math.max(
        0,
        Number(data.rent_amount || 0) +
            totalUtility +
            Number(data.other_charges || 0) -
            Number(data.advance_adjustment || 0) -
            Number(data.discount || 0),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/invoices');
    };

    const selectedLease = activeLeases.find((l) => l.id === Number(data.lease_id));

    return (
        <AdminLayout title="Issue Single Rent Invoice • Skyline Heights" breadcrumbs={breadcrumbs}>
            <div className="max-w-4xl">
                {activeLeases.length === 0 ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <AlertCircle size={18} className="text-amber-600" />
                            <span>No Active Leases Available</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed">
                            Rent invoices can only be issued for active residential lease agreements. Please execute a lease agreement first before
                            billing.
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AdminCard
                            title={
                                <div className="flex items-center gap-2">
                                    <Receipt size={18} className="text-blue-600" />
                                    <span>Issue Individual Rent Invoice (Client Billing Breakdown)</span>
                                </div>
                            }
                            tools={
                                <Link
                                    href="/admin/invoices"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Cancel</span>
                                </Link>
                            }
                        >
                            {/* Target Unit & Tenant Selection */}
                            <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:grid-cols-2 dark:border-slate-700/60 dark:bg-slate-800/30">
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Select Flat Unit & Tenant <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.lease_id}
                                        onChange={(e) => handleLeaseChange(Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        {activeLeases.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                Flat {l.flat?.flat_number} ({l.flat?.floor}) — {l.tenant?.name} [Agreed Rent: ৳
                                                {Number(l.agreed_monthly_rent).toLocaleString()}]
                                            </option>
                                        ))}
                                    </select>
                                    {errors.lease_id && <p className="mt-1 text-xs text-rose-500">{errors.lease_id}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                            Billing Month <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="month"
                                            value={data.billing_month}
                                            onChange={(e) => setData('billing_month', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                            required
                                        />
                                        {errors.billing_month && <p className="mt-1 text-xs text-rose-500">{errors.billing_month}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                            Payment Due Date <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                            required
                                        />
                                        <span className="text-[10px] text-slate-400">Client standard: 7th of month</span>
                                    </div>
                                </div>

                                {selectedLease?.start_date && (
                                    <div className="col-span-full text-xs text-slate-500 dark:text-slate-400">
                                        <strong>Date of Occupation:</strong> {selectedLease.start_date}
                                    </div>
                                )}
                            </div>

                            {/* Line-Item Breakdown (Matching Client Excel) */}
                            <div className="mt-6 space-y-4">
                                <h4 className="border-b border-slate-200 pb-2 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-700 dark:text-slate-400">
                                    Financial Line Items (House Rent Bill Breakdown)
                                </h4>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* 1. Monthly Rent */}
                                    <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                            1. Monthly Apartment Rent (মাসিক ভাড়া) <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">৳</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.rent_amount}
                                                onChange={(e) => setData('rent_amount', Number(e.target.value))}
                                                className="w-full rounded border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                                required
                                            />
                                        </div>
                                        {errors.rent_amount && <p className="mt-1 text-xs text-rose-500">{errors.rent_amount}</p>}
                                    </div>

                                    {/* 2. Service Charge */}
                                    <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                            2. Service Charge (সার্ভিস চার্জ)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">৳</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.service_charge}
                                                onChange={(e) => setData('service_charge', Number(e.target.value))}
                                                className="w-full rounded border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-400">Standard residential: ৳3,500</span>
                                    </div>

                                    {/* 3. Water Bill */}
                                    <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                            3. Water Bill (পানি বিল)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">৳</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.water_bill}
                                                onChange={(e) => setData('water_bill', Number(e.target.value))}
                                                className="w-full rounded border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-400">Individual unit water usage (৳1,000 - ৳1,600)</span>
                                    </div>

                                    {/* 4. GAS Bill & Type */}
                                    <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                        <div className="mb-1 flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">4. GAS Bill (গ্যাস বিল)</label>
                                            <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                                                <input
                                                    type="checkbox"
                                                    checked={data.gas_type === 'prepaid'}
                                                    onChange={(e) => setData('gas_type', e.target.checked ? 'prepaid' : 'billed')}
                                                    className="size-3.5 rounded text-blue-600"
                                                />
                                                <span>Prepaid Card</span>
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">৳</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                disabled={data.gas_type === 'prepaid'}
                                                value={data.gas_bill}
                                                onChange={(e) => setData('gas_bill', Number(e.target.value))}
                                                placeholder={data.gas_type === 'prepaid' ? 'Prepaid (0.00)' : 'Amount'}
                                                className="w-full rounded border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:disabled:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    {/* 5. Electric Bill & Type */}
                                    <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                        <div className="mb-1 flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                                5. Electric Bill (বিদ্যুৎ বিল)
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                                                <input
                                                    type="checkbox"
                                                    checked={data.electricity_type === 'prepaid'}
                                                    onChange={(e) => setData('electricity_type', e.target.checked ? 'prepaid' : 'billed')}
                                                    className="size-3.5 rounded text-blue-600"
                                                />
                                                <span>Prepaid Meter</span>
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">৳</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                disabled={data.electricity_type === 'prepaid'}
                                                value={data.electricity_bill}
                                                onChange={(e) => setData('electricity_bill', Number(e.target.value))}
                                                placeholder={data.electricity_type === 'prepaid' ? 'Prepaid (0.00)' : 'Amount'}
                                                className="w-full rounded border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:disabled:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    {/* 6. Others / Shop rent / Adjustments */}
                                    <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                            6. Others / Commercial Rent (অন্যান্য / বকেয়া / দোকান ভাড়া)
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">৳</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.other_charges}
                                                    onChange={(e) => setData('other_charges', Number(e.target.value))}
                                                    placeholder="0.00"
                                                    className="w-full rounded border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.other_charges_description}
                                                onChange={(e) => setData('other_charges_description', e.target.value)}
                                                placeholder="e.g. Shop rent JULY 26"
                                                className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>

                                    {/* 7. Advance Adjustment */}
                                    <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                            7. Advance Adjustment (এডভান্স কর্তন / ছাড়)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">৳</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.advance_adjustment}
                                                onChange={(e) => setData('advance_adjustment', Number(e.target.value))}
                                                placeholder="0.00"
                                                className="w-full rounded border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-rose-600 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-rose-400"
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-400">Deducted directly from total bill</span>
                                    </div>

                                    {/* 8. Discount Waiver */}
                                    <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-200">
                                            8. Special Waiver / Discount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">৳</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.discount}
                                                onChange={(e) => setData('discount', Number(e.target.value))}
                                                placeholder="0.00"
                                                className="w-full rounded border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs font-semibold text-emerald-600 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Total Taka Live Calculation Card */}
                            <div className="mt-6 flex flex-col justify-between rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/60 p-5 sm:flex-row sm:items-center dark:border-blue-900/50 dark:bg-blue-950/30">
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-300">
                                        Total Payable Amount (মোট টাকা)
                                    </div>
                                    <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                                        Rent (৳{Number(data.rent_amount).toLocaleString()}) + Utilities & Services (৳{totalUtility.toLocaleString()})
                                        {Number(data.other_charges) > 0 && ` + Others (৳${Number(data.other_charges).toLocaleString()})`}
                                        {Number(data.advance_adjustment) > 0 && ` - Advance (৳${Number(data.advance_adjustment).toLocaleString()})`}
                                        {Number(data.discount) > 0 && ` - Discount (৳${Number(data.discount).toLocaleString()})`}
                                    </div>
                                </div>

                                <div className="mt-3 text-left sm:mt-0 sm:text-right">
                                    <div className="text-2xl font-black text-blue-700 dark:text-blue-300">
                                        ৳{calculatedTotal.toLocaleString()} BDT
                                    </div>
                                    <div className="text-[11px] font-medium text-slate-500">Requested to pay bill by 7th of each month</div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 flex items-center justify-end gap-3">
                                <Link
                                    href="/admin/invoices"
                                    className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                                >
                                    <Save size={14} />
                                    <span>{processing ? 'Generating Bill...' : 'Create & Issue Bill'}</span>
                                </button>
                            </div>
                        </AdminCard>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
