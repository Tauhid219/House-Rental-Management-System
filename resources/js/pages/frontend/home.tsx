import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import FrontendLayout from '../../layouts/frontend-layout';
import FlatCard, { FlatType } from '../../components/flat-card';
import TourBookingModal from '../../components/tour-booking-modal';
import { 
    Search, 
    Sparkles, 
    Shield, 
    Zap, 
    Car, 
    Trees, 
    Flame, 
    SlidersHorizontal, 
    ArrowRight, 
    Calendar, 
    CheckCircle2, 
    Star, 
    Phone, 
    Mail, 
    MapPin, 
    Send,
    Award,
    Clock,
    Home as HomeIcon
} from 'lucide-react';

interface Props {
    flats: FlatType[];
    stats: {
        total_flats: number;
        vacant_flats: number;
        occupied_flats: number;
        active_residents: number;
    };
}

export default function Home({ flats, stats }: Props) {
    const [selectedFlat, setSelectedFlat] = useState<FlatType | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<number | 'all'>('all');

    // Hero instant search state
    const [filterBedrooms, setFilterBedrooms] = useState('');
    const [filterFloor, setFilterFloor] = useState('');
    const [filterBudget, setFilterBudget] = useState('');

    const handleHeroSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (filterBedrooms) params.bedrooms = filterBedrooms;
        if (filterFloor) params.floor = filterFloor;
        if (filterBudget) {
            if (filterBudget === 'under_25') {
                params.max_rent = '25000';
            } else if (filterBudget === '25_35') {
                params.min_rent = '25000';
                params.max_rent = '35000';
            } else if (filterBudget === 'above_35') {
                params.min_rent = '35000';
            }
        }
        router.get('/flats', params);
    };

    // On-page contact form
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        preferred_flat_type: '2 Bedroom',
        visit_date: '',
        message: '',
    });

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleOpenBooking = (flat: FlatType) => {
        setSelectedFlat(flat);
        setIsBookingModalOpen(true);
    };

    const filteredFlats = activeTab === 'all' 
        ? flats 
        : flats.filter((f) => f.bedrooms === activeTab);

    return (
        <FrontendLayout>
            <Head title="Luxury Residential Apartments & Flats in Banani, Dhaka" />

            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-8 pb-16">
                {/* Background image with high quality lighting and dark gradient overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80"
                        alt="Luxury High-Rise Residence"
                        className="w-full h-full object-cover object-center opacity-25 scale-105 animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-6 shadow-xl backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                        <span>Now Leasing · {stats.vacant_flats} Premium Units Available Immediately</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6 drop-shadow-sm">
                        Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Refined Living</span> in Banani's Heart.
                    </h1>

                    <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
                        Elegantly planned 2, 3 & 4-bedroom flats built with expansive balconies, modern kitchens, 24/7 backup power, dedicated parking, and full-service resident management.
                    </p>

                    {/* INSTANT SEARCH / FILTER BAR */}
                    <div className="max-w-4xl mx-auto bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl text-left">
                        <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    Bedrooms Layout
                                </label>
                                <select
                                    value={filterBedrooms}
                                    onChange={(e) => setFilterBedrooms(e.target.value)}
                                    className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">Any Bedrooms</option>
                                    <option value="2">2 Bedrooms (BHK)</option>
                                    <option value="3">3 Bedrooms (BHK)</option>
                                    <option value="4">4 Bedrooms / Penthouse</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    Floor Elevation
                                </label>
                                <select
                                    value={filterFloor}
                                    onChange={(e) => setFilterFloor(e.target.value)}
                                    className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">Any Floor</option>
                                    <option value="1st">1st Floor</option>
                                    <option value="2nd">2nd Floor</option>
                                    <option value="3rd">3rd Floor</option>
                                    <option value="4th">4th Floor</option>
                                    <option value="5th">5th Floor (Penthouse)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    Monthly Budget
                                </label>
                                <select
                                    value={filterBudget}
                                    onChange={(e) => setFilterBudget(e.target.value)}
                                    className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="">Any Budget</option>
                                    <option value="under_25">Under ৳ 25,000</option>
                                    <option value="25_35">৳ 25,000 – ৳ 35,000</option>
                                    <option value="above_35">Above ৳ 35,000</option>
                                </select>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Find Vacant Flats</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Quick highlights under search */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            No Hidden Broker Fees
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Same-Day Tour Booking
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Transparent Digital Lease
                        </span>
                    </div>
                </div>
            </section>

            {/* METRICS & KEY STATS STRIP */}
            <section className="py-8 bg-slate-900 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                            <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                                {stats.total_flats}
                            </div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                Total Built Units
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">
                                {stats.vacant_flats}
                            </div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                Ready to Move Vacant Flats
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                            <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                                100%
                            </div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                Generator Power Backup
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                            <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                                24/7
                            </div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                On-Site Caretaker & CCTV
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AVAILABLE FLATS SHOWCASE SECTION */}
            <section className="py-20 bg-slate-950" id="flats">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full mb-3">
                                Available Inventory
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                Featured Vacant Flats
                            </h2>
                            <p className="text-sm text-slate-400 mt-2 max-w-xl">
                                Handpicked units available for immediate lease. Every unit is inspected, sanitised, and ready for moving in.
                            </p>
                        </div>

                        {/* Category filter tabs */}
                        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === 'all'
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                All Vacant ({flats.length})
                            </button>
                            <button
                                onClick={() => setActiveTab(2)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === 2
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                2 BHK
                            </button>
                            <button
                                onClick={() => setActiveTab(3)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === 3
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                3 BHK
                            </button>
                            <button
                                onClick={() => setActiveTab(4)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    activeTab === 4
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                4 BHK / Penthouse
                            </button>
                        </div>
                    </div>

                    {/* Flats Grid */}
                    {filteredFlats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredFlats.map((flat) => (
                                <FlatCard
                                    key={flat.id}
                                    flat={flat}
                                    onBookTour={handleOpenBooking}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
                            <HomeIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <h4 className="text-lg font-bold text-white mb-1">No Flats Matching Filter</h4>
                            <p className="text-xs text-slate-400 mb-6">
                                We currently don't have vacant units in this specific bedroom category.
                            </p>
                            <button
                                onClick={() => setActiveTab('all')}
                                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                            >
                                View All Available Units
                            </button>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link
                            href="/flats"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-semibold text-xs border border-slate-800 hover:border-emerald-500/40 transition-all shadow-md"
                        >
                            <span>Explore Full Catalog With Custom Price & Floor Filters</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* BUILDING AMENITIES SECTION */}
            <section className="py-20 bg-slate-900/80 border-t border-slate-800/80" id="amenities">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full mb-3">
                            Building Features
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Designed for Uncompromised Comfort
                        </h2>
                        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                            Every aspect of Skyline Heights has been planned with architectural excellence, security, and effortless family convenience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-7 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">24/7 Security & CCTV</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Complete perimeter and hallway monitoring with 32 IP cameras and trained security guards stationed round the clock.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">Heavy-Duty Standby Generator</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Seamless 5-second automatic power changeover ensuring fans, lights, and refrigerator never lose power during grid outages.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Car className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">Dedicated Covered Parking</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Wide vehicular access ramps, designated marked spots for each flat, and safe visitor bays on the ground floor.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Trees className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">Rooftop Sky Garden</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Lush landscaped garden with evening walking track, pergolas, and breathtaking 360-degree views of Banani skyline.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Flame className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">Fire Safety & Hydrant System</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Integrated smoke detectors, fire hose reels on every floor landing, emergency escape stairs, and multi-stage water filtration.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">Full-Time Maintenance Staff</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Dedicated electrician, plumber, and caretaker available right inside the building to solve maintenance queries instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISUAL MOSAIC GALLERY */}
            <section className="py-20 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full mb-3">
                            Visual Preview
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            A Glimpse into Quality Interiors
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                                alt="Master Bedroom"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-4">
                                <div>
                                    <span className="text-xs font-bold text-white block">Master Suites</span>
                                    <span className="text-[11px] text-slate-400">Attached Balconies & Built-in Closets</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                            <img
                                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
                                alt="Living Lounge"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-4">
                                <div>
                                    <span className="text-xs font-bold text-white block">Living & Dining</span>
                                    <span className="text-[11px] text-slate-400">Sunlit Open Plan Concepts</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                            <img
                                src="https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80"
                                alt="Gourmet Kitchen"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-4">
                                <div>
                                    <span className="text-xs font-bold text-white block">Modern Kitchens</span>
                                    <span className="text-[11px] text-slate-400">Granite Counters & Ventilation</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                            <img
                                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
                                alt="Penthouse Terrace"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-4">
                                <div>
                                    <span className="text-xs font-bold text-white block">Penthouse Terraces</span>
                                    <span className="text-[11px] text-slate-400">Exclusive 5th Floor Overlook</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4-STEP HOW IT WORKS */}
            <section className="py-20 bg-slate-900 border-y border-slate-800/80" id="process">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full mb-3">
                            Simple Leasing Steps
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            How to Rent Your New Home
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
                            <span className="text-4xl font-black text-emerald-500/20 absolute top-4 right-4">01</span>
                            <h3 className="text-base font-bold text-white mb-2">Browse & Select</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Review our available flats catalog, check floor plans, sqft measurements, and exact rental costs.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
                            <span className="text-4xl font-black text-emerald-500/20 absolute top-4 right-4">02</span>
                            <h3 className="text-base font-bold text-white mb-2">Schedule Private Tour</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Book an inspection visit online. Our manager walks you through the unit and building facilities.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
                            <span className="text-4xl font-black text-emerald-500/20 absolute top-4 right-4">03</span>
                            <h3 className="text-base font-bold text-white mb-2">Sign Digital Lease</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Complete simple NID verification, sign clear tenancy terms, and deposit your advance securely.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
                            <span className="text-4xl font-black text-emerald-500/20 absolute top-4 right-4">04</span>
                            <h3 className="text-base font-bold text-white mb-2">Move In Effortlessly</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Receive your keys, access portal credentials for automated rent receipts, and start living comfortably.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RESIDENT TESTIMONIALS */}
            <section className="py-20 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full mb-3">
                            Resident Experience
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Loved by Our Families
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-1 text-amber-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                                    "Living at Skyline Heights has been wonderful. The standby generator operates reliably during summer load sheddings, and the elevator never has downtime."
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                                <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    TA
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Tanvir Ahmed</h4>
                                    <span className="text-[11px] text-slate-400">Software Architect · Resident Unit 201-A</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-1 text-amber-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                                    "The security team is polite and alert. Having an on-site caretaker who handles plumbing and minor fixes in minutes makes all the difference for busy professionals."
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                                <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    NJ
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Dr. Nusrat Jahan</h4>
                                    <span className="text-[11px] text-slate-400">Physician · Resident Unit 301-A</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-1 text-amber-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                                    "The digital monthly rent receipt system and transparent utility billing give absolute peace of mind. Very well managed building."
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                                <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    MH
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Mahmudul Hasan</h4>
                                    <span className="text-[11px] text-slate-400">Bank Manager · Resident Unit 401-A</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SCHEDULE VISIT & CONTACT FORM SECTION */}
            <section className="py-20 bg-slate-900/60 border-t border-slate-800/80" id="contact">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Info Column */}
                        <div className="lg:col-span-5 space-y-6">
                            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full">
                                Book an In-Person Visit
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                                Come View Your Future Apartment Today.
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Our property managers are ready to welcome you, answer floor plan queries, and show you vacant flats and parking bays in person.
                            </p>

                            <div className="space-y-4 pt-4 text-xs text-slate-300">
                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white block text-sm mb-0.5">Skyline Heights Residency</strong>
                                        House 42, Road 11, Block D, Banani, Dhaka-1213
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                    <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white block text-sm mb-0.5">Visiting Schedule</strong>
                                        Saturday – Thursday: 9:00 AM – 7:30 PM<br />
                                        Friday: 2:30 PM – 7:30 PM
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                    <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-white block text-sm mb-0.5">Direct Management Helpline</strong>
                                        +880 1711-000001 / +880 1711-000002
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Form Column */}
                        <div className="lg:col-span-7">
                            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Send Visit Request or Inquiry
                                </h3>
                                <p className="text-xs text-slate-400 mb-6">
                                    Fill out the quick form below and we will get back to you with confirmed visit slots.
                                </p>

                                {wasSuccessful ? (
                                    <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                                        <h4 className="text-lg font-bold text-white">Visit Request Received!</h4>
                                        <p className="text-xs text-emerald-200 max-w-sm mx-auto">
                                            Thank you! Our property manager will call you within 24 hours to confirm your scheduled visit.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContactSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                                Your Full Name <span className="text-rose-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. Asif Chowdhury"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                            />
                                            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                                    Phone Number <span className="text-rose-400">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+88017XXXXXXXX"
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                                />
                                                {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                                    Email Address <span className="text-rose-400">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="name@example.com"
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                                />
                                                {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                                    Interested Flat Type
                                                </label>
                                                <select
                                                    value={data.preferred_flat_type}
                                                    onChange={(e) => setData('preferred_flat_type', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                                >
                                                    <option value="2 Bedroom">2 Bedroom (BHK)</option>
                                                    <option value="3 Bedroom">3 Bedroom (BHK)</option>
                                                    <option value="4 Bedroom">4 Bedroom Unit</option>
                                                    <option value="Penthouse">Penthouse 5th Floor</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                                    Preferred Visit Date
                                                </label>
                                                <input
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={data.visit_date}
                                                    onChange={(e) => setData('visit_date', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                                Inquiry Details / Message (Optional)
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                placeholder="Specify moving timeline, parking spot needs, or any specific flat requirements..."
                                                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-60 cursor-pointer"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>{processing ? 'Submitting Request...' : 'Schedule Viewing Appointment'}</span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <TourBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                flat={selectedFlat}
            />
        </FrontendLayout>
    );
}
