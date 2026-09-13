import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Car,
    CheckCircle2,
    Clock,
    Flame,
    Home as HomeIcon,
    MapPin,
    Phone,
    Search,
    Send,
    Shield,
    Sparkles,
    Star,
    Trees,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import FlatCard, { FlatType } from '../../components/flat-card';
import TourBookingModal from '../../components/tour-booking-modal';
import FrontendLayout from '../../layouts/frontend-layout';

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

    const filteredFlats = activeTab === 'all' ? flats : flats.filter((f) => f.bedrooms === activeTab);

    return (
        <FrontendLayout>
            <Head title="Luxury Residential Apartments & Flats in Banani, Dhaka" />

            {/* HERO SECTION */}
            <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-slate-950 pt-8 pb-16">
                {/* Background image with high quality lighting and dark gradient overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80"
                        alt="Luxury High-Rise Residence"
                        className="animate-pulse-slow h-full w-full scale-105 object-cover object-center opacity-25"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                    <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center sm:px-8">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-emerald-400 shadow-xl backdrop-blur-md">
                        <Sparkles className="animate-spin-slow h-3.5 w-3.5 text-emerald-400" />
                        <span>Now Leasing · {stats.vacant_flats} Premium Units Available Immediately</span>
                    </div>

                    {/* Headline */}
                    <h1 className="mx-auto mb-6 max-w-4xl text-4xl leading-[1.15] font-black tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
                        Experience{' '}
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                            Refined Living
                        </span>{' '}
                        in Banani's Heart.
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed font-normal text-slate-300 sm:text-lg">
                        Elegantly planned 2, 3 & 4-bedroom flats built with expansive balconies, modern kitchens, 24/7 backup power, dedicated
                        parking, and full-service resident management.
                    </p>

                    {/* INSTANT SEARCH / FILTER BAR */}
                    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/95 p-4 text-left shadow-2xl backdrop-blur-2xl sm:p-5">
                        <form onSubmit={handleHeroSearch} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-400">Bedrooms Layout</label>
                                <select
                                    value={filterBedrooms}
                                    onChange={(e) => setFilterBedrooms(e.target.value)}
                                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-3 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
                                >
                                    <option value="">Any Bedrooms</option>
                                    <option value="2">2 Bedrooms (BHK)</option>
                                    <option value="3">3 Bedrooms (BHK)</option>
                                    <option value="4">4 Bedrooms / Penthouse</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-400">Floor Elevation</label>
                                <select
                                    value={filterFloor}
                                    onChange={(e) => setFilterFloor(e.target.value)}
                                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-3 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
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
                                <label className="mb-1.5 block text-xs font-medium text-slate-400">Monthly Budget</label>
                                <select
                                    value={filterBudget}
                                    onChange={(e) => setFilterBudget(e.target.value)}
                                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-3 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
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
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/60 transition-all hover:from-emerald-500 hover:to-teal-500"
                                >
                                    <Search className="h-4 w-4" />
                                    <span>Find Vacant Flats</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Quick highlights under search */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 sm:gap-10">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            No Hidden Broker Fees
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Same-Day Tour Booking
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Transparent Digital Lease
                        </span>
                    </div>
                </div>
            </section>

            {/* METRICS & KEY STATS STRIP */}
            <section className="border-y border-slate-800/80 bg-slate-900 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <div className="mb-1 text-3xl font-black text-white sm:text-4xl">{stats.total_flats}</div>
                            <div className="text-xs font-medium tracking-wider text-slate-400 uppercase">Total Built Units</div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <div className="mb-1 text-3xl font-black text-emerald-400 sm:text-4xl">{stats.vacant_flats}</div>
                            <div className="text-xs font-medium tracking-wider text-slate-400 uppercase">Ready to Move Vacant Flats</div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <div className="mb-1 text-3xl font-black text-white sm:text-4xl">100%</div>
                            <div className="text-xs font-medium tracking-wider text-slate-400 uppercase">Generator Power Backup</div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <div className="mb-1 text-3xl font-black text-white sm:text-4xl">24/7</div>
                            <div className="text-xs font-medium tracking-wider text-slate-400 uppercase">On-Site Caretaker & CCTV</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AVAILABLE FLATS SHOWCASE SECTION */}
            <section className="bg-slate-950 py-20" id="flats">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <span className="mb-3 inline-block rounded-full border border-emerald-800/60 bg-emerald-950/80 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                                Available Inventory
                            </span>
                            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Featured Vacant Flats</h2>
                            <p className="mt-2 max-w-xl text-sm text-slate-400">
                                Handpicked units available for immediate lease. Every unit is inspected, sanitised, and ready for moving in.
                            </p>
                        </div>

                        {/* Category filter tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-1.5">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                    activeTab === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                All Vacant ({flats.length})
                            </button>
                            <button
                                onClick={() => setActiveTab(2)}
                                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                    activeTab === 2 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                2 BHK
                            </button>
                            <button
                                onClick={() => setActiveTab(3)}
                                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                    activeTab === 3 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                3 BHK
                            </button>
                            <button
                                onClick={() => setActiveTab(4)}
                                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                    activeTab === 4 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                4 BHK / Penthouse
                            </button>
                        </div>
                    </div>

                    {/* Flats Grid */}
                    {filteredFlats.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredFlats.map((flat) => (
                                <FlatCard key={flat.id} flat={flat} onBookTour={handleOpenBooking} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 py-16 text-center">
                            <HomeIcon className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                            <h4 className="mb-1 text-lg font-bold text-white">No Flats Matching Filter</h4>
                            <p className="mb-6 text-xs text-slate-400">We currently don't have vacant units in this specific bedroom category.</p>
                            <button
                                onClick={() => setActiveTab('all')}
                                className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700"
                            >
                                View All Available Units
                            </button>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link
                            href="/flats"
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-3.5 text-xs font-semibold text-emerald-400 shadow-md transition-all hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-300"
                        >
                            <span>Explore Full Catalog With Custom Price & Floor Filters</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* BUILDING AMENITIES SECTION */}
            <section className="border-t border-slate-800/80 bg-slate-900/80 py-20" id="amenities">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <span className="mb-3 inline-block rounded-full border border-emerald-800/60 bg-emerald-950/80 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                            Building Features
                        </span>
                        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Designed for Uncompromised Comfort</h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-400">
                            Every aspect of Skyline Heights has been planned with architectural excellence, security, and effortless family
                            convenience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-7 transition-all hover:border-emerald-500/50">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">24/7 Security & CCTV</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Complete perimeter and hallway monitoring with 32 IP cameras and trained security guards stationed round the clock.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-7 transition-all hover:border-emerald-500/50">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">Heavy-Duty Standby Generator</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Seamless 5-second automatic power changeover ensuring fans, lights, and refrigerator never lose power during grid
                                outages.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-7 transition-all hover:border-emerald-500/50">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                                <Car className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">Dedicated Covered Parking</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Wide vehicular access ramps, designated marked spots for each flat, and safe visitor bays on the ground floor.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-7 transition-all hover:border-emerald-500/50">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                                <Trees className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">Rooftop Sky Garden</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Lush landscaped garden with evening walking track, pergolas, and breathtaking 360-degree views of Banani skyline.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-7 transition-all hover:border-emerald-500/50">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                                <Flame className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">Fire Safety & Hydrant System</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Integrated smoke detectors, fire hose reels on every floor landing, emergency escape stairs, and multi-stage water
                                filtration.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-7 transition-all hover:border-emerald-500/50">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-base font-bold text-white">Full-Time Maintenance Staff</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Dedicated electrician, plumber, and caretaker available right inside the building to solve maintenance queries
                                instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISUAL MOSAIC GALLERY */}
            <section className="bg-slate-950 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <span className="mb-3 inline-block rounded-full border border-emerald-800/60 bg-emerald-950/80 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                            Visual Preview
                        </span>
                        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">A Glimpse into Quality Interiors</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                                alt="Master Bedroom"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-4">
                                <div>
                                    <span className="block text-xs font-bold text-white">Master Suites</span>
                                    <span className="text-[11px] text-slate-400">Attached Balconies & Built-in Closets</span>
                                </div>
                            </div>
                        </div>

                        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
                                alt="Living Lounge"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-4">
                                <div>
                                    <span className="block text-xs font-bold text-white">Living & Dining</span>
                                    <span className="text-[11px] text-slate-400">Sunlit Open Plan Concepts</span>
                                </div>
                            </div>
                        </div>

                        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80"
                                alt="Gourmet Kitchen"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-4">
                                <div>
                                    <span className="block text-xs font-bold text-white">Modern Kitchens</span>
                                    <span className="text-[11px] text-slate-400">Granite Counters & Ventilation</span>
                                </div>
                            </div>
                        </div>

                        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
                                alt="Penthouse Terrace"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-4">
                                <div>
                                    <span className="block text-xs font-bold text-white">Penthouse Terraces</span>
                                    <span className="text-[11px] text-slate-400">Exclusive 5th Floor Overlook</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4-STEP HOW IT WORKS */}
            <section className="border-y border-slate-800/80 bg-slate-900 py-20" id="process">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <span className="mb-3 inline-block rounded-full border border-emerald-800/60 bg-emerald-950/80 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                            Simple Leasing Steps
                        </span>
                        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">How to Rent Your New Home</h2>
                    </div>

                    <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                            <span className="absolute top-4 right-4 text-4xl font-black text-emerald-500/20">01</span>
                            <h3 className="mb-2 text-base font-bold text-white">Browse & Select</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Review our available flats catalog, check floor plans, sqft measurements, and exact rental costs.
                            </p>
                        </div>

                        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                            <span className="absolute top-4 right-4 text-4xl font-black text-emerald-500/20">02</span>
                            <h3 className="mb-2 text-base font-bold text-white">Schedule Private Tour</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Book an inspection visit online. Our manager walks you through the unit and building facilities.
                            </p>
                        </div>

                        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                            <span className="absolute top-4 right-4 text-4xl font-black text-emerald-500/20">03</span>
                            <h3 className="mb-2 text-base font-bold text-white">Sign Digital Lease</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Complete simple NID verification, sign clear tenancy terms, and deposit your advance securely.
                            </p>
                        </div>

                        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                            <span className="absolute top-4 right-4 text-4xl font-black text-emerald-500/20">04</span>
                            <h3 className="mb-2 text-base font-bold text-white">Move In Effortlessly</h3>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Receive your keys, access portal credentials for automated rent receipts, and start living comfortably.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RESIDENT TESTIMONIALS */}
            <section className="bg-slate-950 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <span className="mb-3 inline-block rounded-full border border-emerald-800/60 bg-emerald-950/80 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                            Resident Experience
                        </span>
                        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Loved by Our Families</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-7">
                            <div>
                                <div className="mb-4 flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-300 italic">
                                    "Living at Skyline Heights has been wonderful. The standby generator operates reliably during summer load
                                    sheddings, and the elevator never has downtime."
                                </p>
                            </div>
                            <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/30 text-xs font-bold text-emerald-400">
                                    TA
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Tanvir Ahmed</h4>
                                    <span className="text-[11px] text-slate-400">Software Architect · Resident Unit 201-A</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-7">
                            <div>
                                <div className="mb-4 flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-300 italic">
                                    "The security team is polite and alert. Having an on-site caretaker who handles plumbing and minor fixes in
                                    minutes makes all the difference for busy professionals."
                                </p>
                            </div>
                            <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/30 text-xs font-bold text-emerald-400">
                                    NJ
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Dr. Nusrat Jahan</h4>
                                    <span className="text-[11px] text-slate-400">Physician · Resident Unit 301-A</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-7">
                            <div>
                                <div className="mb-4 flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-300 italic">
                                    "The digital monthly rent receipt system and transparent utility billing give absolute peace of mind. Very well
                                    managed building."
                                </p>
                            </div>
                            <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/30 text-xs font-bold text-emerald-400">
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
            <section className="border-t border-slate-800/80 bg-slate-900/60 py-20" id="contact">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        {/* Info Column */}
                        <div className="space-y-6 lg:col-span-5">
                            <span className="inline-block rounded-full border border-emerald-800/60 bg-emerald-950/80 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                                Book an In-Person Visit
                            </span>
                            <h2 className="text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl">
                                Come View Your Future Apartment Today.
                            </h2>
                            <p className="text-sm leading-relaxed text-slate-400">
                                Our property managers are ready to welcome you, answer floor plan queries, and show you vacant flats and parking bays
                                in person.
                            </p>

                            <div className="space-y-4 pt-4 text-xs text-slate-300">
                                <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                                    <div>
                                        <strong className="mb-0.5 block text-sm text-white">Skyline Heights Residency</strong>
                                        House 42, Road 11, Block D, Banani, Dhaka-1213
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                                    <div>
                                        <strong className="mb-0.5 block text-sm text-white">Visiting Schedule</strong>
                                        Saturday – Thursday: 9:00 AM – 7:30 PM
                                        <br />
                                        Friday: 2:30 PM – 7:30 PM
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                                    <div>
                                        <strong className="mb-0.5 block text-sm text-white">Direct Management Helpline</strong>
                                        +880 1711-000001 / +880 1711-000002
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Form Column */}
                        <div className="lg:col-span-7">
                            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl sm:p-10">
                                <h3 className="mb-2 text-xl font-bold text-white">Send Visit Request or Inquiry</h3>
                                <p className="mb-6 text-xs text-slate-400">
                                    Fill out the quick form below and we will get back to you with confirmed visit slots.
                                </p>

                                {wasSuccessful ? (
                                    <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-6 text-center">
                                        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                                        <h4 className="text-lg font-bold text-white">Visit Request Received!</h4>
                                        <p className="mx-auto max-w-sm text-xs text-emerald-200">
                                            Thank you! Our property manager will call you within 24 hours to confirm your scheduled visit.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContactSubmit} className="space-y-4">
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-slate-300">
                                                Your Full Name <span className="text-rose-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. Asif Chowdhury"
                                                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                            />
                                            {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                                    Phone Number <span className="text-rose-400">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+88017XXXXXXXX"
                                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                />
                                                {errors.phone && <p className="mt-1 text-xs text-rose-400">{errors.phone}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                                    Email Address <span className="text-rose-400">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="name@example.com"
                                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                />
                                                {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-slate-300">Interested Flat Type</label>
                                                <select
                                                    value={data.preferred_flat_type}
                                                    onChange={(e) => setData('preferred_flat_type', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                >
                                                    <option value="2 Bedroom">2 Bedroom (BHK)</option>
                                                    <option value="3 Bedroom">3 Bedroom (BHK)</option>
                                                    <option value="4 Bedroom">4 Bedroom Unit</option>
                                                    <option value="Penthouse">Penthouse 5th Floor</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-slate-300">Preferred Visit Date</label>
                                                <input
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={data.visit_date}
                                                    onChange={(e) => setData('visit_date', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-slate-300">
                                                Inquiry Details / Message (Optional)
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                placeholder="Specify moving timeline, parking spot needs, or any specific flat requirements..."
                                                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60"
                                        >
                                            <Send className="h-4 w-4" />
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
            <TourBookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} flat={selectedFlat} />
        </FrontendLayout>
    );
}
