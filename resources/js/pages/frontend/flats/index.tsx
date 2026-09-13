import { Head, Link, router } from '@inertiajs/react';
import { Home as HomeIcon, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import FlatCard, { FlatType } from '../../../components/flat-card';
import TourBookingModal from '../../../components/tour-booking-modal';
import FrontendLayout from '../../../layouts/frontend-layout';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    flats: {
        data: FlatType[];
        current_page: number;
        last_page: number;
        total: number;
        links: PaginationLink[];
    };
    filters: {
        search?: string;
        bedrooms?: string;
        floor?: string;
        min_rent?: string;
        max_rent?: string;
        sort?: string;
        status?: string;
    };
    stats: {
        total_vacant: number;
        min_rent: number;
        max_rent: number;
    };
}

export default function FlatsIndex({ flats, filters, stats }: Props) {
    const [selectedFlat, setSelectedFlat] = useState<FlatType | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const [search, setSearch] = useState(typeof filters?.search === 'string' ? filters.search : '');
    const [bedrooms, setBedrooms] = useState(typeof filters?.bedrooms === 'string' ? filters.bedrooms : '');
    const [floor, setFloor] = useState(typeof filters?.floor === 'string' ? filters.floor : '');
    const [minRent, setMinRent] = useState(typeof filters?.min_rent === 'string' ? filters.min_rent : '');
    const [maxRent, setMaxRent] = useState(typeof filters?.max_rent === 'string' ? filters.max_rent : '');
    const [sort, setSort] = useState(typeof filters?.sort === 'string' ? filters.sort : 'latest');

    const handleApplyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/flats',
            {
                search,
                bedrooms,
                floor,
                min_rent: minRent,
                max_rent: maxRent,
                sort,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReset = () => {
        setSearch('');
        setBedrooms('');
        setFloor('');
        setMinRent('');
        setMaxRent('');
        setSort('latest');
        router.get('/flats');
    };

    const handleOpenBooking = (flat: FlatType) => {
        setSelectedFlat(flat);
        setIsBookingModalOpen(true);
    };

    return (
        <FrontendLayout>
            <Head title="Available Rental Flats & Apartments - Skyline Heights" />

            {/* Header Banner */}
            <div className="border-b border-slate-800 bg-slate-900 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                                <Link href="/" className="text-slate-400 hover:underline">
                                    Home
                                </Link>
                                <span className="text-slate-600">/</span>
                                <span>Flats Catalog</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Available Rental Flats & Penthouses</h1>
                            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                                Showing verified vacant units ready for leasing in Banani, Dhaka.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs text-slate-300">
                            <div>
                                <span className="block text-[10px] text-slate-500 uppercase">Available Now</span>
                                <strong className="text-sm font-bold text-emerald-400">{flats.total} Units</strong>
                            </div>
                            <div className="h-8 w-px bg-slate-800" />
                            <div>
                                <span className="block text-[10px] text-slate-500 uppercase">Rent Range</span>
                                <strong className="text-xs font-semibold text-white">
                                    ৳{Number(stats.min_rent).toLocaleString()} – ৳{Number(stats.max_rent).toLocaleString()}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Filters + Listing Grid */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-28 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-white">
                                    <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
                                    <span>Filter Properties</span>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="flex cursor-pointer items-center gap-1 text-xs text-slate-400 transition-colors hover:text-white"
                                    title="Reset all filters"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    <span>Reset</span>
                                </button>
                            </div>

                            <form onSubmit={handleApplyFilters} className="space-y-5">
                                {/* Keyword search */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Search by Keyword</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Unit no, floor, features..."
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-3 pl-9 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                        />
                                        <Search className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
                                    </div>
                                </div>

                                {/* Bedrooms */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Bedrooms</label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {['', '2', '3', '4'].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setBedrooms(val)}
                                                className={`cursor-pointer rounded-lg border py-2 text-xs font-semibold transition-all ${
                                                    bedrooms === val
                                                        ? 'border-emerald-500 bg-emerald-600 text-white'
                                                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {val === '' ? 'All' : `${val} BHK`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Floor */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Floor</label>
                                    <select
                                        value={floor}
                                        onChange={(e) => setFloor(e.target.value)}
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                                    >
                                        <option value="">Any Floor Level</option>
                                        <option value="1st">1st Floor</option>
                                        <option value="2nd">2nd Floor</option>
                                        <option value="3rd">3rd Floor</option>
                                        <option value="4th">4th Floor</option>
                                        <option value="5th">5th Floor (Penthouse)</option>
                                    </select>
                                </div>

                                {/* Budget Range */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Monthly Budget (BDT)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            step="1000"
                                            value={minRent}
                                            onChange={(e) => setMinRent(e.target.value)}
                                            placeholder="Min ৳"
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                        />
                                        <input
                                            type="number"
                                            step="1000"
                                            value={maxRent}
                                            onChange={(e) => setMaxRent(e.target.value)}
                                            placeholder="Max ৳"
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Sorting */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Sort By</label>
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                                    >
                                        <option value="latest">Latest Added</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="size_desc">Largest Size (Sq Ft)</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full cursor-pointer rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-500"
                                >
                                    Apply Filter Criteria
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Listing Column */}
                    <div className="space-y-8 lg:col-span-9">
                        {flats.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {flats.data.map((flat) => (
                                    <FlatCard key={flat.id} flat={flat} onBookTour={handleOpenBooking} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 py-20 text-center">
                                <HomeIcon className="mx-auto mb-3 h-14 w-14 text-slate-600" />
                                <h3 className="mb-2 text-xl font-bold text-white">No Matching Flats Found</h3>
                                <p className="mx-auto mb-6 max-w-sm text-xs text-slate-400">
                                    Try loosening your search filters or budget range to see more available apartments in the building.
                                </p>
                                <button onClick={handleReset} className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white">
                                    Reset All Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {flats.links && flats.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1.5 border-t border-slate-800 pt-6">
                                {flats.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="pointer-events-none rounded-xl border border-slate-800/60 px-3.5 py-2 text-xs text-slate-600"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                                                link.active
                                                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                                                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TourBookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} flat={selectedFlat} />
        </FrontendLayout>
    );
}
