import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import {
    Mail,
    Phone,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Trash2,
    Search,
    MessageSquare,
    User
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface ContactItem {
    id: number;
    name: string;
    email: string;
    phone: string;
    preferred_flat_type?: string;
    visit_date?: string;
    message?: string;
    status: 'new' | 'contacted' | 'closed';
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ContactsIndexProps {
    contacts: {
        data: ContactItem[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
    stats: {
        total: number;
        new: number;
        contacted: number;
        closed: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tour Leads & Inquiries', href: '/admin/contacts' },
];

export default function ContactsIndex({ contacts, filters, stats }: ContactsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/contacts', {
            search,
            status,
        }, { preserveState: true });
    };

    const handleStatusChange = (contactId: number, newStatus: 'new' | 'contacted' | 'closed') => {
        router.patch(`/admin/contacts/${contactId}/status`, {
            status: newStatus,
        }, { preserveScroll: true });
    };

    const handleDelete = (contact: ContactItem) => {
        if (confirm(`Delete tour booking inquiry from ${contact.name}?`)) {
            router.delete(`/admin/contacts/${contact.id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Tour Leads & Website Inquiries • Skyline Heights" breadcrumbs={breadcrumbs}>
            {/* Quick Stat Pill Widgets */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
                <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-xs font-semibold uppercase text-slate-400">Total Leads</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                </div>
                <div className="rounded-md border border-rose-200 bg-rose-50/50 p-4 shadow-sm dark:border-rose-950 dark:bg-rose-950/20">
                    <div className="text-xs font-semibold uppercase text-rose-600 dark:text-rose-400">New / Uncontacted</div>
                    <div className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-300">{stats.new}</div>
                </div>
                <div className="rounded-md border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950 dark:bg-amber-950/20">
                    <div className="text-xs font-semibold uppercase text-amber-600 dark:text-amber-400">Contacted / Scheduled</div>
                    <div className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.contacted}</div>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950 dark:bg-emerald-950/20">
                    <div className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Closed / Completed</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.closed}</div>
                </div>
            </div>

            {/* Filter Card */}
            <AdminCard variant="default" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3 items-end">
                    <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Search Leads
                        </label>
                        <input
                            type="text"
                            placeholder="Name, Phone, Email, or Preferred Unit..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                            Filter by Status
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            >
                                <option value="all">All Inquiries</option>
                                <option value="new">New Inquiries</option>
                                <option value="contacted">Contacted</option>
                                <option value="closed">Closed</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </form>
            </AdminCard>

            {/* Leads Table Card */}
            <AdminCard
                title={
                    <div className="flex items-center gap-2">
                        <Mail size={18} className="text-rose-600" />
                        <span>Tour Bookings & Contact Inquiries ({contacts.total})</span>
                    </div>
                }
                variant="danger"
                noPadding
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                        <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                            <tr>
                                <th className="px-5 py-3.5">Prospective Tenant</th>
                                <th className="px-5 py-3.5">Unit Interest</th>
                                <th className="px-5 py-3.5">Preferred Visit Date</th>
                                <th className="px-5 py-3.5">Message Note</th>
                                <th className="px-5 py-3.5 text-center">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {contacts.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        No inquiries found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                contacts.data.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="px-5 py-3.5">
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {contact.name}
                                            </div>
                                            <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                                <Phone size={11} className="text-slate-400" />
                                                <span>{contact.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                <Mail size={11} />
                                                <span>{contact.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {contact.preferred_flat_type || 'General Inquiry'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {contact.visit_date ? (
                                                <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                                                    <Calendar size={13} className="text-slate-400" />
                                                    <span>{contact.visit_date}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Immediate / Flexible</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 max-w-xs">
                                            <p className="line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                {contact.message || 'No additional note provided.'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <select
                                                value={contact.status}
                                                onChange={(e) => handleStatusChange(contact.id, e.target.value as any)}
                                                className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-0 cursor-pointer focus:ring-1 focus:ring-blue-500 ${
                                                    contact.status === 'new'
                                                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                                        : contact.status === 'contacted'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                }`}
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button
                                                onClick={() => handleDelete(contact)}
                                                title="Delete Inquiry"
                                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {contacts.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                        <div className="text-xs text-slate-500">
                            Page {contacts.current_page} of {contacts.last_page} ({contacts.total} total leads)
                        </div>
                        <div className="flex items-center gap-1">
                            {contacts.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded px-2.5 py-1 text-xs transition-colors ${
                                        link.active
                                            ? 'bg-blue-600 font-bold text-white'
                                            : link.url
                                            ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                            : 'pointer-events-none text-slate-300 dark:text-slate-600'
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
