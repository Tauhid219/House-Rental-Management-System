import { type SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    Menu,
    Phone,
    Send,
    ShieldCheck,
    UserCheck,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import TourBookingModal from '../components/tour-booking-modal';

interface Props {
    children: React.ReactNode;
}

export default function FrontendLayout({ children }: Props) {
    const { auth, flash } = usePage<SharedData & { flash?: { success?: string; error?: string } }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tourModalOpen, setTourModalOpen] = useState(false);

    // Newsletter subscription form
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        post('/subscribe', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-white">
            {/* Global Flash Toast Notifications */}
            {flash?.success && (
                <div className="animate-fade-in fixed top-20 right-5 z-50 max-w-md">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-500/50 bg-emerald-950/90 p-4 text-emerald-200 shadow-2xl backdrop-blur-md">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                        <p className="text-xs font-medium sm:text-sm">{flash.success}</p>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="animate-fade-in fixed top-20 right-5 z-50 max-w-md">
                    <div className="flex items-center gap-3 rounded-xl border border-rose-500/50 bg-rose-950/90 p-4 text-rose-200 shadow-2xl backdrop-blur-md">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                        <p className="text-xs font-medium sm:text-sm">{flash.error}</p>
                    </div>
                </div>
            )}

            {/* Top Info Strip */}
            <div className="hidden border-b border-slate-800/80 bg-slate-900/90 px-4 py-2 text-xs text-slate-400 sm:px-8 md:block">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                            Road 11, Block D, Banani, Dhaka
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-emerald-400" />
                            Visiting Hours: 9:00 AM – 7:30 PM (Daily)
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="tel:+8801711000001" className="flex items-center gap-1.5 transition-colors hover:text-emerald-400">
                            <Phone className="h-3.5 w-3.5 text-emerald-400" />
                            +880 1711-000001
                        </a>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center gap-1 font-medium text-emerald-400">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            24/7 Monitored Residency
                        </span>
                    </div>
                </div>
            </div>

            {/* Sticky Glassmorphism Header */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
                    {/* Brand Logo */}
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-950/50 transition-transform duration-200 group-hover:scale-105">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="block text-lg leading-tight font-extrabold tracking-tight text-white transition-colors group-hover:text-emerald-400">
                                SKYLINE HEIGHTS
                            </span>
                            <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Luxury Residential Living</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
                        <Link href="/" className="transition-colors hover:text-emerald-400">
                            Home
                        </Link>
                        <Link href="/flats" className="transition-colors hover:text-emerald-400">
                            Available Flats
                        </Link>
                        <a href="/#amenities" className="transition-colors hover:text-emerald-400">
                            Amenities
                        </a>
                        <a href="/#process" className="transition-colors hover:text-emerald-400">
                            How It Works
                        </a>
                        <a href="/#contact" className="transition-colors hover:text-emerald-400">
                            Contact Us
                        </a>
                    </nav>

                    {/* Right CTAs */}
                    <div className="hidden items-center gap-3.5 sm:flex">
                        <button
                            type="button"
                            onClick={() => setTourModalOpen(true)}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400 shadow-sm transition-all hover:bg-emerald-500 hover:text-white"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Schedule Tour</span>
                        </button>

                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-700"
                            >
                                <UserCheck className="h-4 w-4 text-emerald-400" />
                                <span>Portal Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-950/40 transition-all hover:from-emerald-500 hover:to-teal-500"
                            >
                                <span>Resident / Staff Login</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition-colors hover:text-white lg:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Drawer Menu */}
                {mobileMenuOpen && (
                    <div className="animate-fade-in space-y-4 border-b border-slate-800 bg-slate-950/95 px-5 py-6 backdrop-blur-2xl lg:hidden">
                        <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="border-b border-slate-900 py-2 transition-colors hover:text-emerald-400"
                            >
                                Home
                            </Link>
                            <Link
                                href="/flats"
                                onClick={() => setMobileMenuOpen(false)}
                                className="border-b border-slate-900 py-2 transition-colors hover:text-emerald-400"
                            >
                                Available Flats
                            </Link>
                            <a
                                href="/#amenities"
                                onClick={() => setMobileMenuOpen(false)}
                                className="border-b border-slate-900 py-2 transition-colors hover:text-emerald-400"
                            >
                                Amenities
                            </a>
                            <a
                                href="/#process"
                                onClick={() => setMobileMenuOpen(false)}
                                className="border-b border-slate-900 py-2 transition-colors hover:text-emerald-400"
                            >
                                How It Works
                            </a>
                            <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 transition-colors hover:text-emerald-400">
                                Contact Us
                            </a>
                        </nav>

                        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setTourModalOpen(true);
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-semibold text-white shadow-lg"
                            >
                                <Calendar className="h-4 w-4" />
                                Schedule a Tour
                            </button>

                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 text-center text-xs font-semibold text-white"
                                >
                                    Go to Portal Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 text-center text-xs font-semibold text-slate-200"
                                >
                                    Resident / Staff Portal Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Body */}
            <main className="flex-1">{children}</main>

            {/* Global Tour Booking Modal */}
            <TourBookingModal isOpen={tourModalOpen} onClose={() => setTourModalOpen(false)} />

            {/* Rich Footer */}
            <footer className="border-t border-slate-800/80 bg-slate-950 pt-16 pb-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
                        {/* Col 1: Brand info */}
                        <div className="space-y-4 lg:col-span-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <span className="text-lg font-bold tracking-tight text-white">SKYLINE HEIGHTS</span>
                            </div>
                            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
                                Premium high-rise residential apartment complex offering modern architecture, dedicated parking, 24/7 standby
                                generators, full-time security, and a peaceful community environment in Banani, Dhaka.
                            </p>
                            <div className="space-y-2 pt-2 text-xs text-slate-400">
                                <p className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-emerald-400" />
                                    <span>House 42, Road 11, Block D, Banani, Dhaka-1213</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                                    <span>Hotline: +880 1711-000001 / +880 1711-000002</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                                    <span>support@skylineheights.com</span>
                                </p>
                            </div>
                        </div>

                        {/* Col 2: Quick Links */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">Property Exploration</h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li>
                                    <Link href="/flats" className="transition-colors hover:text-emerald-400">
                                        All Vacant Units
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/flats?bedrooms=2" className="transition-colors hover:text-emerald-400">
                                        2 BHK Executive Units
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/flats?bedrooms=3" className="transition-colors hover:text-emerald-400">
                                        3 BHK Family Flats
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/flats?bedrooms=4" className="transition-colors hover:text-emerald-400">
                                        Penthouse & 4 BHK
                                    </Link>
                                </li>
                                <li>
                                    <a href="/#amenities" className="transition-colors hover:text-emerald-400">
                                        Building Facilities
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Resident Portal & Management */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">Management & Policies</h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li>
                                    <Link href="/login" className="transition-colors hover:text-emerald-400">
                                        Resident Bill Payment
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="transition-colors hover:text-emerald-400">
                                        Property Staff Portal
                                    </Link>
                                </li>
                                <li>
                                    <span className="text-slate-500">Security Deposit Terms</span>
                                </li>
                                <li>
                                    <span className="text-slate-500">Maintenance Guidelines</span>
                                </li>
                                <li>
                                    <span className="text-slate-500">Visitor Parking Rules</span>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Newsletter Subscription */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">Stay Updated</h4>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Subscribe to receive instant alerts whenever a flat becomes vacant or new rental opportunities open.
                            </p>

                            <form onSubmit={handleSubscribe} className="space-y-2">
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                                {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-emerald-500 disabled:opacity-60"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>{processing ? 'Subscribing...' : 'Subscribe to Alerts'}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 text-xs text-slate-500 sm:flex-row">
                        <p>© {new Date().getFullYear()} Skyline Heights Residency. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <span>Privacy Policy</span>
                            <span>Rental Agreement Terms</span>
                            <Link href="/login" className="transition-colors hover:text-emerald-400">
                                Staff Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
