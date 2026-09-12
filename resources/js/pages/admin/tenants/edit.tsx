import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import { Users, ArrowLeft, Save } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface TenantData {
    id: number;
    name: string;
    nid_passport: string;
    phone: string;
    email?: string;
    emergency_contact?: string;
    occupation?: string;
    family_members: number;
    permanent_address?: string;
    status: 'active' | 'past';
}

interface EditTenantProps {
    tenant: TenantData;
}

export default function TenantEdit({ tenant }: EditTenantProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tenants', href: '/admin/tenants' },
        { title: `Edit ${tenant.name}`, href: `/admin/tenants/${tenant.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name || '',
        nid_passport: tenant.nid_passport || '',
        phone: tenant.phone || '',
        email: tenant.email || '',
        emergency_contact: tenant.emergency_contact || '',
        occupation: tenant.occupation || '',
        family_members: tenant.family_members || 1,
        permanent_address: tenant.permanent_address || '',
        status: tenant.status || 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/tenants/${tenant.id}`);
    };

    return (
        <AdminLayout title={`Edit Tenant ${tenant.name} • Skyline Heights`} breadcrumbs={breadcrumbs}>
            <div className="max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <AdminCard
                        title={
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-blue-600" />
                                <span>Edit Profile for {tenant.name}</span>
                            </div>
                        }
                        tools={
                            <Link
                                href="/admin/tenants"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            >
                                <ArrowLeft size={14} />
                                <span>Back to Tenants</span>
                            </Link>
                        }
                        variant="primary"
                    >
                        <div className="space-y-5">
                            {/* Row 1: Full Name & NID */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        National ID (NID) / Passport *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nid_passport}
                                        onChange={(e) => setData('nid_passport', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {errors.nid_passport && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.nid_passport}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Phone & Email */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Primary Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Emergency Contact & Occupation & Family Members */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Emergency Contact Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact}
                                        onChange={(e) => setData('emergency_contact', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Occupation / Organization
                                    </label>
                                    <input
                                        type="text"
                                        value={data.occupation}
                                        onChange={(e) => setData('occupation', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Family Members Count *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={data.family_members}
                                        onChange={(e) => setData('family_members', Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Permanent Address */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Permanent Home Address
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.permanent_address}
                                    onChange={(e) => setData('permanent_address', e.target.value)}
                                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Resident Status *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as any)}
                                    className="w-full sm:w-1/2 rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="active">Active Resident</option>
                                    <option value="past">Past / Archived Resident</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href="/admin/tenants"
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
                                <span>{processing ? 'Saving Changes...' : 'Update Profile'}</span>
                            </button>
                        </div>
                    </AdminCard>
                </form>
            </div>
        </AdminLayout>
    );
}
