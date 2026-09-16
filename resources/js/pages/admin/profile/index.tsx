import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, KeyRound, Lock, Save, Shield, ShieldCheck, User } from 'lucide-react';
import React from 'react';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    status: string;
    created_at: string;
    roles: string[];
    permissions: string[];
}

interface Props {
    user: UserProfile;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Account Settings', href: '/admin/profile' },
    { title: 'Profile Settings', href: '/admin/profile' },
];

export default function AdminProfile({ user }: Props) {
    // Profile information form
    const profileForm = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch('/admin/profile', {
            preserveScroll: true,
        });
    };

    // Password update form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/admin/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AdminLayout title="Account & Profile Settings" breadcrumbs={breadcrumbs}>
            <Head title="Profile Settings - Skyline Heights Admin" />

            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header Title */}
                <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Personal Account Profile</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage your authenticated administrator profile, security credentials, and view active role permissions.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column: Account & RBAC Overview Card */}
                    <div className="space-y-6 lg:col-span-1">
                        <AdminCard title="Account Profile" icon={User}>
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-3">
                                    <div className="flex size-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-black text-white shadow-md">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="absolute bottom-0 right-1 size-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                                </div>

                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 uppercase dark:bg-purple-950/60 dark:text-purple-300">
                                        <Shield size={12} />
                                        <span>{user.role}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        <CheckCircle2 size={11} />
                                        <span>Active</span>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">User ID</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">#{user.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Member Since</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{user.created_at}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Active Permissions</span>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">{user.permissions.length} Granted</span>
                                </div>
                            </div>
                        </AdminCard>

                        {/* Role Permissions Preview */}
                        <AdminCard title={`Role Permissions (${user.permissions.length})`} icon={ShieldCheck}>
                            <div className="max-h-60 overflow-y-auto pr-1">
                                <div className="flex flex-wrap gap-1.5">
                                    {user.permissions.map((perm, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            {perm}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </AdminCard>
                    </div>

                    {/* Right Column: Update Forms */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* 1. General Profile Info Card */}
                        <AdminCard title="Personal Information" icon={User}>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Full Name <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                        />
                                        {profileForm.errors.name && (
                                            <p className="mt-1 text-xs text-rose-500">{profileForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Email Address <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                        />
                                        {profileForm.errors.email && (
                                            <p className="mt-1 text-xs text-rose-500">{profileForm.errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Phone Number / Mobile
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+88017XXXXXXXX"
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                    />
                                    {profileForm.errors.phone && (
                                        <p className="mt-1 text-xs text-rose-500">{profileForm.errors.phone}</p>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <Save size={14} />
                                        <span>{profileForm.processing ? 'Saving Changes...' : 'Save Profile Details'}</span>
                                    </button>
                                </div>
                            </form>
                        </AdminCard>

                        {/* 2. Change Password Card */}
                        <AdminCard title="Update Password & Security" icon={KeyRound}>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                        Current Password <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                    />
                                    {passwordForm.errors.current_password && (
                                        <p className="mt-1 text-xs text-rose-500">{passwordForm.errors.current_password}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            New Password <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Minimum 8 characters"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                        />
                                        {passwordForm.errors.password && (
                                            <p className="mt-1 text-xs text-rose-500">{passwordForm.errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Confirm New Password <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Repeat new password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                        />
                                        {passwordForm.errors.password_confirmation && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {passwordForm.errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-900 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
                                    >
                                        <Lock size={14} />
                                        <span>{passwordForm.processing ? 'Updating Password...' : 'Change Password'}</span>
                                    </button>
                                </div>
                            </form>
                        </AdminCard>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
