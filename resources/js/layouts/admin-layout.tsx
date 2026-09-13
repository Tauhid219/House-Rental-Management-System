import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Coins,
    CreditCard,
    FileText,
    Globe,
    Home as HomeIcon,
    LayoutGrid,
    LogOut,
    LucideIcon,
    Mail,
    Menu,
    Receipt,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface AdminNavItem {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive: boolean;
    isExternal?: boolean;
}

interface AdminNavSection {
    category: string;
    items: AdminNavItem[];
}

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ children, title, breadcrumbs = [] }: AdminLayoutProps) {
    const page = usePage<SharedData & { flash?: { success?: string; error?: string } }>();
    const { auth, flash } = page.props;
    const currentUrl = page.url;

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    const navItems: AdminNavSection[] = [
        {
            category: 'MAIN',
            items: [
                {
                    title: 'Dashboard',
                    url: '/dashboard',
                    icon: LayoutGrid,
                    isActive: currentUrl === '/dashboard',
                },
            ],
        },
        {
            category: 'PROPERTY MANAGEMENT',
            items: [
                {
                    title: 'Flats & Units',
                    url: '/admin/flats',
                    icon: Building2,
                    isActive: currentUrl.startsWith('/admin/flats'),
                },
                {
                    title: 'Tenants',
                    url: '/admin/tenants',
                    icon: Users,
                    isActive: currentUrl.startsWith('/admin/tenants'),
                },
                {
                    title: 'Lease Agreements',
                    url: '/admin/leases',
                    icon: FileText,
                    isActive: currentUrl.startsWith('/admin/leases'),
                },
                {
                    title: 'Maintenance',
                    url: '/admin/maintenances',
                    icon: Wrench,
                    isActive: currentUrl.startsWith('/admin/maintenances'),
                },
            ],
        },
        {
            category: 'FINANCIAL BILLING',
            items: [
                {
                    title: 'Rent Invoices',
                    url: '/admin/invoices',
                    icon: Receipt,
                    isActive: currentUrl.startsWith('/admin/invoices'),
                },
                {
                    title: 'Payments & Receipts',
                    url: '/admin/payments',
                    icon: CreditCard,
                    isActive: currentUrl.startsWith('/admin/payments'),
                },
                {
                    title: 'Building Expenses',
                    url: '/admin/expenses',
                    icon: Coins,
                    isActive: currentUrl.startsWith('/admin/expenses'),
                },
            ],
        },
        {
            category: 'REPORTS & ANALYTICS',
            items: [
                {
                    title: 'Financial Reports',
                    url: '/admin/reports',
                    icon: BarChart3,
                    isActive: currentUrl.startsWith('/admin/reports'),
                },
            ],
        },
        {
            category: 'COMMUNICATION',
            items: [
                {
                    title: 'Tour Inquiries / Leads',
                    url: '/admin/contacts',
                    icon: Mail,
                    isActive: currentUrl.startsWith('/admin/contacts'),
                },
            ],
        },
        {
            category: 'SHORTCUTS',
            items: [
                {
                    title: 'Public Showcase Site',
                    url: '/',
                    icon: Globe,
                    isActive: false,
                    isExternal: true,
                },
            ],
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#f4f6f9] font-sans text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-100">
            {title && <Head title={title} />}

            {/* Top Navbar */}
            <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {/* Left controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (window.innerWidth < 1024) {
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                            } else {
                                setIsSidebarOpen(!isSidebarOpen);
                            }
                        }}
                        className="rounded p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        title="Toggle Navigation"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="hidden items-center gap-3 text-xs font-medium text-slate-500 sm:flex dark:text-slate-400">
                        <Link href="/dashboard" className="transition-colors hover:text-blue-600">
                            Dashboard
                        </Link>
                        <span>•</span>
                        <Link href="/admin/flats" className="transition-colors hover:text-blue-600">
                            Flats
                        </Link>
                        <span>•</span>
                        <Link href="/admin/contacts" className="transition-colors hover:text-blue-600">
                            Inquiries
                        </Link>
                    </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        target="_blank"
                        className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 md:inline-flex dark:bg-slate-800 dark:text-slate-300"
                    >
                        <Globe size={13} className="text-blue-600" />
                        <span>Live Website</span>
                    </Link>

                    {/* User profile dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            className="flex items-center gap-2 rounded-full p-1 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            <div className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                                {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <span className="hidden max-w-[120px] truncate text-xs font-semibold sm:inline-block">{auth?.user?.name || 'Admin'}</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>

                        {isUserDropdownOpen && (
                            <div
                                className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                                onMouseLeave={() => setIsUserDropdownOpen(false)}
                            >
                                <div className="border-b border-slate-100 px-4 py-2 dark:border-slate-800">
                                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{auth?.user?.name}</p>
                                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{auth?.user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                >
                                    <LogOut size={14} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Layout Wrapper: Sidebar + Content Wrapper */}
            <div className="relative flex flex-1 overflow-hidden">
                {/* AdminLTE 3 Dark Charcoal Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#343a40] text-[#c2c7d0] transition-all duration-300 ease-in-out lg:static lg:z-auto ${
                        isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden lg:w-16'
                    } ${isMobileMenuOpen ? '!w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                >
                    {/* Brand Link */}
                    <div className="flex h-14 items-center justify-between border-b border-[#4b545c] bg-[#343a40] px-4">
                        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded bg-blue-600 font-black text-white shadow">S</div>
                            <div className={`leading-none transition-opacity duration-200 ${!isSidebarOpen && 'lg:hidden'}`}>
                                <span className="block text-sm font-bold tracking-wide text-white">SKYLINE</span>
                                <span className="block text-[10px] font-light text-slate-400">AdminLTE 3 Portal</span>
                            </div>
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
                            <X size={18} />
                        </button>
                    </div>

                    {/* User Panel */}
                    <div className={`flex items-center gap-3 border-b border-[#4b545c] p-4 transition-opacity ${!isSidebarOpen && 'lg:hidden'}`}>
                        <div className="relative">
                            <div className="flex size-9 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white ring-1 ring-slate-500">
                                {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-[#343a40]"></span>
                        </div>
                        <div className="overflow-hidden leading-tight">
                            <span className="block truncate text-xs font-semibold text-white">{auth?.user?.name || 'Administrator'}</span>
                            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-400"></span> Online
                            </span>
                        </div>
                    </div>

                    {/* Sidebar Nav items */}
                    <div className="flex-1 space-y-4 overflow-y-auto px-2 py-3 text-xs font-medium">
                        {navItems.map((section, idx) => (
                            <div key={idx} className="space-y-1">
                                <div
                                    className={`px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase ${!isSidebarOpen && 'lg:hidden'}`}
                                >
                                    {section.category}
                                </div>
                                {section.items.map((item, itemIdx) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={itemIdx}
                                            href={item.url}
                                            target={item.isExternal ? '_blank' : undefined}
                                            className={`group flex items-center gap-3 rounded-md px-3 py-2 transition-all ${
                                                item.isActive
                                                    ? 'bg-[#007bff] font-semibold text-white shadow-sm'
                                                    : 'text-[#c2c7d0] hover:bg-[#4f5962] hover:text-white'
                                            }`}
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            <span className={`truncate ${!isSidebarOpen && 'lg:hidden'}`}>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Sidebar Footer */}
                    <div className={`border-t border-[#4b545c] p-3 text-center text-[10px] text-slate-400 ${!isSidebarOpen && 'lg:hidden'}`}>
                        <span>Skyline Heights v3.1</span>
                    </div>
                </aside>

                {/* Mobile Backdrop */}
                {isMobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

                {/* Content Wrapper (AdminLTE .content-wrapper) */}
                <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                    {/* Content Header */}
                    <div className="border-b border-slate-200/80 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title || 'Dashboard'}</h1>

                            {/* Breadcrumbs */}
                            {breadcrumbs.length > 0 && (
                                <nav className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                                    <Link href="/dashboard" className="flex items-center transition-colors hover:text-blue-600">
                                        <HomeIcon size={13} className="mr-1" />
                                        Home
                                    </Link>
                                    {breadcrumbs.map((crumb, idx) => (
                                        <React.Fragment key={idx}>
                                            <ChevronRight size={12} className="text-slate-400" />
                                            {crumb.href ? (
                                                <Link href={crumb.href} className="transition-colors hover:text-blue-600">
                                                    {crumb.title}
                                                </Link>
                                            ) : (
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{crumb.title}</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </nav>
                            )}
                        </div>
                    </div>

                    {/* Flash Toast Alerts */}
                    {flash?.success && (
                        <div className="mx-6 mt-4 flex items-center gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mx-6 mt-4 flex items-center gap-2.5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                            <AlertCircle size={16} className="shrink-0 text-rose-600 dark:text-rose-400" />
                            <span>{flash.error}</span>
                        </div>
                    )}

                    {/* Main Page Body */}
                    <main className="flex-1 p-6">{children}</main>

                    {/* AdminLTE Footer */}
                    <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-500 sm:flex-row dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        <div>
                            <strong>
                                Copyright &copy; 2026{' '}
                                <Link href="/" className="text-blue-600 hover:underline">
                                    Skyline Heights Residency
                                </Link>
                                .
                            </strong>{' '}
                            All rights reserved.
                        </div>
                        <div className="text-[11px] text-slate-400">
                            <b>AdminLTE Theme</b> 3.1.0 • Laravel 12 & Inertia React
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
