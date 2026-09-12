import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import { FileText, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface VacantFlat {
    id: number;
    flat_number: string;
    floor: string;
    bedrooms: number;
    rent_cost: number;
}

interface TenantOption {
    id: number;
    name: string;
    phone: string;
    nid_passport: string;
}

interface CreateLeaseProps {
    vacantFlats: VacantFlat[];
    tenants: TenantOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leases', href: '/admin/leases' },
    { title: 'Create Lease Agreement', href: '/admin/leases/create' },
];

export default function LeaseCreate({ vacantFlats, tenants }: CreateLeaseProps) {
    const { data, setData, post, processing, errors } = useForm({
        tenant_id: tenants.length > 0 ? tenants[0].id : '',
        flat_id: vacantFlats.length > 0 ? vacantFlats[0].id : '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        agreed_monthly_rent: vacantFlats.length > 0 ? vacantFlats[0].rent_cost : 30000,
        security_deposit: vacantFlats.length > 0 ? Number(vacantFlats[0].rent_cost) * 2 : 60000,
        advance_paid: 0,
        status: 'active',
    });

    const handleFlatChange = (flatId: number) => {
        setData((prev) => {
            const selected = vacantFlats.find((f) => f.id === flatId);
            const rent = selected ? Number(selected.rent_cost) : prev.agreed_monthly_rent;
            return {
                ...prev,
                flat_id: flatId,
                agreed_monthly_rent: rent,
                security_deposit: rent * 2,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/leases');
    };

    return (
        <AdminLayout title="New Lease Agreement • Skyline Heights" breadcrumbs={breadcrumbs}>
            <div className="max-w-3xl">
                {vacantFlats.length === 0 ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                        <div className="flex items-center gap-2 font-bold text-sm">
                            <AlertCircle size={18} className="text-amber-600" />
                            <span>No Vacant Flats Available</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed">
                            All units in Skyline Heights are currently occupied or under maintenance. To create a new lease agreement, either add a new flat unit or terminate an existing active lease.
                        </p>
                        <div className="mt-4 flex gap-3">
                            <Link
                                href="/admin/flats/create"
                                className="rounded bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
                            >
                                Register New Flat
                            </Link>
                            <Link
                                href="/admin/leases"
                                className="rounded border border-amber-300 bg-white px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-50"
                            >
                                Back to Leases
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <AdminCard
                            title={
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-blue-600" />
                                    <span>Execute New Residential Lease Contract</span>
                                </div>
                            }
                            tools={
                                <Link
                                    href="/admin/leases"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Back to Leases</span>
                                </Link>
                            }
                            variant="primary"
                        >
                            <div className="space-y-5">
                                {/* Row 1: Assign Flat & Tenant */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Select Available Vacant Flat *
                                        </label>
                                        <select
                                            value={data.flat_id}
                                            onChange={(e) => handleFlatChange(Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        >
                                            {vacantFlats.map((flat) => (
                                                <option key={flat.id} value={flat.id}>
                                                    Flat {flat.flat_number} ({flat.floor}, {flat.bedrooms} BHK - ৳{Number(flat.rent_cost).toLocaleString()})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.flat_id && (
                                            <p className="mt-1 text-[11px] text-rose-600">{errors.flat_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Select Tenant / Resident *
                                        </label>
                                        <select
                                            value={data.tenant_id}
                                            onChange={(e) => setData('tenant_id', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        >
                                            {tenants.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name} ({t.phone} • NID: {t.nid_passport})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.tenant_id && (
                                            <p className="mt-1 text-[11px] text-rose-600">{errors.tenant_id}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Contract Dates */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Lease Agreement Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="mt-1 text-[11px] text-rose-600">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Contract End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                        {errors.end_date && (
                                            <p className="mt-1 text-[11px] text-rose-600">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 3: Financial Agreements */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Agreed Monthly Rent (৳ BDT) *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="500"
                                            value={data.agreed_monthly_rent}
                                            onChange={(e) => setData('agreed_monthly_rent', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                        {errors.agreed_monthly_rent && (
                                            <p className="mt-1 text-[11px] text-rose-600">{errors.agreed_monthly_rent}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Security Deposit (৳ BDT) *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="500"
                                            value={data.security_deposit}
                                            onChange={(e) => setData('security_deposit', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                        {errors.security_deposit && (
                                            <p className="mt-1 text-[11px] text-rose-600">{errors.security_deposit}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Advance Rent Paid (৳ BDT)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="500"
                                            value={data.advance_paid}
                                            onChange={(e) => setData('advance_paid', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="rounded border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
                                    <strong>Automation Notice:</strong> Executing this lease contract will automatically change the flat's status from <span className="font-semibold text-emerald-700 dark:text-emerald-400">vacant</span> to <span className="font-semibold text-blue-700 dark:text-blue-400">occupied</span> and assign the tenant as the registered occupant.
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                                <Link
                                    href="/admin/leases"
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
                                    <span>{processing ? 'Creating Lease...' : 'Execute Agreement'}</span>
                                </button>
                            </div>
                        </AdminCard>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
