import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontendLayout from '../../../layouts/frontend-layout';
import FlatCard, { FlatType } from '../../../components/flat-card';
import TourBookingModal from '../../../components/tour-booking-modal';
import { 
    Search, 
    SlidersHorizontal, 
    RotateCcw, 
    Home as HomeIcon, 
    Check, 
    ArrowUpDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

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
        router.get('/flats', {
            search,
            bedrooms,
            floor,
            min_rent: minRent,
            max_rent: maxRent,
            sort,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
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
            <div className="bg-slate-900 border-b border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                                <Link href="/" className="hover:underline text-slate-400">Home</Link>
                                <span className="text-slate-600">/</span>
                                <span>Flats Catalog</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                Available Rental Flats & Penthouses
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Showing verified vacant units ready for leasing in Banani, Dhaka.
                            </p>
                        </div>

                        <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                            <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Available Now</span>
                                <strong className="text-emerald-400 font-bold text-sm">{flats.total} Units</strong>
                            </div>
                            <div className="w-px h-8 bg-slate-800" />
                            <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Rent Range</span>
                                <strong className="text-white font-semibold text-xs">
                                    ৳{Number(stats.min_rent).toLocaleString()} – ৳{Number(stats.max_rent).toLocaleString()}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Filters + Listing Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 sticky top-28 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 text-sm font-bold text-white">
                                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                                    <span>Filter Properties</span>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Reset all filters"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Reset</span>
                                </button>
                            </div>

                            <form onSubmit={handleApplyFilters} className="space-y-5">
                                {/* Keyword search */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Search by Keyword
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Unit no, floor, features..."
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                    </div>
                                </div>

                                {/* Bedrooms */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Bedrooms
                                    </label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {['', '2', '3', '4'].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setBedrooms(val)}
                                                className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                                    bedrooms === val
                                                        ? 'bg-emerald-600 border-emerald-500 text-white'
                                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {val === '' ? 'All' : `${val} BHK`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Floor */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Floor
                                    </label>
                                    <select
                                        value={floor}
                                        onChange={(e) => setFloor(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
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
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Monthly Budget (BDT)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            step="1000"
                                            value={minRent}
                                            onChange={(e) => setMinRent(e.target.value)}
                                            placeholder="Min ৳"
                                            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                        <input
                                            type="number"
                                            step="1000"
                                            value={maxRent}
                                            onChange={(e) => setMaxRent(e.target.value)}
                                            placeholder="Max ৳"
                                            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* Sorting */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Sort By
                                    </label>
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="latest">Latest Added</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="size_desc">Largest Size (Sq Ft)</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                                >
                                    Apply Filter Criteria
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Listing Column */}
                    <div className="lg:col-span-9 space-y-8">
                        {flats.data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {flats.data.map((flat) => (
                                    <FlatCard
                                        key={flat.id}
                                        flat={flat}
                                        onBookTour={handleOpenBooking}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
                                <HomeIcon className="w-14 h-14 text-slate-600 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-white mb-2">No Matching Flats Found</h3>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                                    Try loosening your search filters or budget range to see more available apartments in the building.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {flats.links && flats.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-slate-800">
                                {flats.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-3.5 py-2 rounded-xl text-xs text-slate-600 border border-slate-800/60 pointer-events-none"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                                link.active
                                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TourBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                flat={selectedFlat}
            />
        </FrontendLayout>
    );
}
