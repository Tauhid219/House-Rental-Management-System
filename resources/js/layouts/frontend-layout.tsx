import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { 
    Building2, 
    Calendar, 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    Menu, 
    X, 
    ArrowRight, 
    CheckCircle2, 
    AlertCircle, 
    Send,
    UserCheck,
    ShieldCheck
} from 'lucide-react';
import TourBookingModal from '../components/tour-booking-modal';

interface Props {
    children: React.ReactNode;
}

export default function FrontendLayout({ children }: Props) {
    const { auth, flash } = usePage<any>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tourModalOpen, setTourModalOpen] = useState(false);

    // Newsletter subscription form
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
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
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
            {/* Global Flash Toast Notifications */}
            {flash?.success && (
                <div className="fixed top-20 right-5 z-50 max-w-md animate-fade-in">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 shadow-2xl backdrop-blur-md">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <p className="text-xs sm:text-sm font-medium">{flash.success}</p>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="fixed top-20 right-5 z-50 max-w-md animate-fade-in">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 shadow-2xl backdrop-blur-md">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <p className="text-xs sm:text-sm font-medium">{flash.error}</p>
                    </div>
                </div>
            )}

            {/* Top Info Strip */}
            <div className="bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400 py-2 px-4 sm:px-8 hidden md:block">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            Road 11, Block D, Banani, Dhaka
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            Visiting Hours: 9:00 AM – 7:30 PM (Daily)
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="tel:+8801711000001" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            +880 1711-000001
                        </a>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            24/7 Monitored Residency
                        </span>
                    </div>
                </div>
            </div>

            {/* Sticky Glassmorphism Header */}
            <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform duration-200">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors block leading-tight">
                                SKYLINE HEIGHTS
                            </span>
                            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                                Luxury Residential Living
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <Link href="/" className="hover:text-emerald-400 transition-colors">
                            Home
                        </Link>
                        <Link href="/flats" className="hover:text-emerald-400 transition-colors">
                            Available Flats
                        </Link>
                        <a href="/#amenities" className="hover:text-emerald-400 transition-colors">
                            Amenities
                        </a>
                        <a href="/#process" className="hover:text-emerald-400 transition-colors">
                            How It Works
                        </a>
                        <a href="/#contact" className="hover:text-emerald-400 transition-colors">
                            Contact Us
                        </a>
                    </nav>

                    {/* Right CTAs */}
                    <div className="hidden sm:flex items-center gap-3.5">
                        <button
                            type="button"
                            onClick={() => setTourModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all shadow-sm cursor-pointer"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Schedule Tour</span>
                        </button>

                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all shadow-sm"
                            >
                                <UserCheck className="w-4 h-4 text-emerald-400" />
                                <span>Portal Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 transition-all"
                            >
                                <span>Resident / Staff Login</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Drawer Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-5 py-6 space-y-4 animate-fade-in backdrop-blur-2xl">
                        <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-2 hover:text-emerald-400 transition-colors border-b border-slate-900"
                            >
                                Home
                            </Link>
                            <Link
                                href="/flats"
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-2 hover:text-emerald-400 transition-colors border-b border-slate-900"
                            >
                                Available Flats
                            </Link>
                            <a
                                href="/#amenities"
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-2 hover:text-emerald-400 transition-colors border-b border-slate-900"
                            >
                                Amenities
                            </a>
                            <a
                                href="/#process"
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-2 hover:text-emerald-400 transition-colors border-b border-slate-900"
                            >
                                How It Works
                            </a>
                            <a
                                href="/#contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-2 hover:text-emerald-400 transition-colors"
                            >
                                Contact Us
                            </a>
                        </nav>

                        <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setTourModalOpen(true);
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-emerald-500 text-white shadow-lg"
                            >
                                <Calendar className="w-4 h-4" />
                                Schedule a Tour
                            </button>

                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="w-full text-center py-3 rounded-xl text-xs font-semibold bg-slate-800 text-white border border-slate-700"
                                >
                                    Go to Portal Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full text-center py-3 rounded-xl text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-800"
                                >
                                    Resident / Staff Portal Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Body */}
            <main className="flex-1">
                {children}
            </main>

            {/* Global Tour Booking Modal */}
            <TourBookingModal
                isOpen={tourModalOpen}
                onClose={() => setTourModalOpen(false)}
            />

            {/* Rich Footer */}
            <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                        {/* Col 1: Brand info */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <span className="text-lg font-bold tracking-tight text-white">
                                    SKYLINE HEIGHTS
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                                Premium high-rise residential apartment complex offering modern architecture, dedicated parking, 24/7 standby generators, full-time security, and a peaceful community environment in Banani, Dhaka.
                            </p>
                            <div className="pt-2 text-xs text-slate-400 space-y-2">
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>House 42, Road 11, Block D, Banani, Dhaka-1213</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Hotline: +880 1711-000001 / +880 1711-000002</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>support@skylineheights.com</span>
                                </p>
                            </div>
                        </div>

                        {/* Col 2: Quick Links */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                                Property Exploration
                            </h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li>
                                    <Link href="/flats" className="hover:text-emerald-400 transition-colors">
                                        All Vacant Units
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/flats?bedrooms=2" className="hover:text-emerald-400 transition-colors">
                                        2 BHK Executive Units
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/flats?bedrooms=3" className="hover:text-emerald-400 transition-colors">
                                        3 BHK Family Flats
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/flats?bedrooms=4" className="hover:text-emerald-400 transition-colors">
                                        Penthouse & 4 BHK
                                    </Link>
                                </li>
                                <li>
                                    <a href="/#amenities" className="hover:text-emerald-400 transition-colors">
                                        Building Facilities
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Resident Portal & Management */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                                Management & Policies
                            </h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li>
                                    <Link href="/login" className="hover:text-emerald-400 transition-colors">
                                        Resident Bill Payment
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="hover:text-emerald-400 transition-colors">
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
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                                Stay Updated
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
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
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                                {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all disabled:opacity-60 cursor-pointer shadow-md"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{processing ? 'Subscribing...' : 'Subscribe to Alerts'}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>© {new Date().getFullYear()} Skyline Heights Residency. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <span>Privacy Policy</span>
                            <span>Rental Agreement Terms</span>
                            <Link href="/login" className="hover:text-emerald-400 transition-colors">
                                Staff Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
