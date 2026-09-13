import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Wrench } from 'lucide-react';
import React from 'react';

interface Flat {
    id: number;
    flat_number: string;
    floor: string;
    status: string;
}

interface Props {
    flats: Flat[];
    today: string;
}

export default function MaintenanceCreate({ flats, today }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        flat_id: flats.length > 0 ? flats[0].id : '',
        title: '',
        description: '',
        cost: '0',
        reported_date: today,
        completed_date: '',
        status: 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/maintenances');
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Maintenance Tasks', href: '/admin/maintenances' },
        { title: 'Log Repair Ticket', href: '/admin/maintenances/create' },
    ];

    return (
        <AdminLayout title="Log New Maintenance / Repair" breadcrumbs={breadcrumbs}>
            <Head title="Log Repair Ticket - AdminLTE Management" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-4">
                    <Link
                        href="/admin/maintenances"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Maintenance Work Orders</span>
                    </Link>
                </div>

                <AdminCard title="Maintenance Work Order Details" icon={Wrench}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Affected Unit / Flat <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.flat_id}
                                    onChange={(e) => setData('flat_id', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                >
                                    {flats.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            Unit {f.flat_number} ({f.floor}) - Currently {f.status}
                                        </option>
                                    ))}
                                </select>
                                {errors.flat_id && <p className="mt-1 text-xs text-rose-500">{errors.flat_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Initial Status <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {errors.status && <p className="mt-1 text-xs text-rose-500">{errors.status}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                Issue Title / Task Summary <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Master bathroom faucet leakage repair"
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            />
                            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                Detailed Work Description
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Provide specific plumbing, electrical, or carpentry notes and materials replaced..."
                                className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            />
                            {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Repair Cost (BDT) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={data.cost}
                                    onChange={(e) => setData('cost', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                                {errors.cost && <p className="mt-1 text-xs text-rose-500">{errors.cost}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Reported Date <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={data.reported_date}
                                    onChange={(e) => setData('reported_date', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                                {errors.reported_date && <p className="mt-1 text-xs text-rose-500">{errors.reported_date}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                    Completed Date
                                </label>
                                <input
                                    type="date"
                                    value={data.completed_date}
                                    onChange={(e) => setData('completed_date', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />
                                {errors.completed_date && <p className="mt-1 text-xs text-rose-500">{errors.completed_date}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                            <Link
                                href="/admin/maintenances"
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
                                <span>{processing ? 'Logging Ticket...' : 'Save Work Order'}</span>
                            </button>
                        </div>
                    </form>
                </AdminCard>
            </div>
        </AdminLayout>
    );
}
