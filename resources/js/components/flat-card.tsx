import { Link } from '@inertiajs/react';
import { ArrowUpRight, Bath, Bed, Calendar, Layers, Maximize2 } from 'lucide-react';

export interface FlatType {
    id: number;
    flat_number: string;
    floor: string;
    size_sqft: number;
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    rent_cost: number | string;
    status: 'vacant' | 'occupied' | 'maintenance';
    description?: string;
    amenities?: string[];
    images?: string[];
}

interface Props {
    flat: FlatType;
    onBookTour?: (flat: FlatType) => void;
}

export default function FlatCard({ flat, onBookTour }: Props) {
    const defaultImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const mainImage = flat.images && flat.images.length > 0 ? flat.images[0] : defaultImage;

    const isVacant = flat.status === 'vacant';

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-lg transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/30">
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                    src={mainImage}
                    alt={`Flat ${flat.flat_number}`}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Top Badges */}
                <div className="pointer-events-none absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase shadow-md ${
                            isVacant
                                ? 'bg-emerald-500/90 text-white backdrop-blur-md'
                                : flat.status === 'occupied'
                                  ? 'bg-amber-500/90 text-white backdrop-blur-md'
                                  : 'bg-slate-700/90 text-slate-200 backdrop-blur-md'
                        }`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${isVacant ? 'animate-pulse bg-emerald-200' : 'bg-white'}`} />
                        {flat.status}
                    </span>

                    <span className="rounded-lg border border-slate-700/50 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-200 shadow-sm backdrop-blur-md">
                        {flat.floor}
                    </span>
                </div>

                {/* Rent Price on bottom edge of image */}
                <div className="absolute right-3.5 bottom-3.5 left-3.5 flex items-end justify-between">
                    <div>
                        <span className="block text-[11px] font-medium tracking-wider text-slate-400 uppercase">Monthly Rent</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white drop-shadow">৳ {Number(flat.rent_cost).toLocaleString()}</span>
                            <span className="text-xs font-medium text-slate-300">/ month</span>
                        </div>
                    </div>

                    <Link
                        href={`/flats/${flat.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-emerald-500"
                        title="View Full Specifications"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <Link href={`/flats/${flat.id}`} className="transition-colors hover:text-emerald-400">
                            <h3 className="text-lg font-bold tracking-tight text-white">Unit {flat.flat_number}</h3>
                        </Link>
                        <span className="text-xs font-medium text-slate-400">{flat.bedrooms} Bedroom Residence</span>
                    </div>

                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-400">
                        {flat.description || 'Premium rental unit built with top-grade ventilation, natural lighting, and modern sanitary fittings.'}
                    </p>

                    {/* Key Specifications Grid */}
                    <div className="grid grid-cols-4 gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 px-2.5 py-3 text-center">
                        <div className="flex flex-col items-center">
                            <div className="mb-0.5 flex items-center gap-1 text-xs text-slate-400">
                                <Bed className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="font-semibold text-white">{flat.bedrooms}</span>
                            </div>
                            <span className="text-[10px] tracking-wider text-slate-500 uppercase">Beds</span>
                        </div>

                        <div className="flex flex-col items-center border-l border-slate-800">
                            <div className="mb-0.5 flex items-center gap-1 text-xs text-slate-400">
                                <Bath className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="font-semibold text-white">{flat.bathrooms}</span>
                            </div>
                            <span className="text-[10px] tracking-wider text-slate-500 uppercase">Baths</span>
                        </div>

                        <div className="flex flex-col items-center border-l border-slate-800">
                            <div className="mb-0.5 flex items-center gap-1 text-xs text-slate-400">
                                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="font-semibold text-white">{flat.balconies}</span>
                            </div>
                            <span className="text-[10px] tracking-wider text-slate-500 uppercase">Balcony</span>
                        </div>

                        <div className="flex flex-col items-center border-l border-slate-800">
                            <div className="mb-0.5 flex items-center gap-1 text-xs text-slate-400">
                                <Maximize2 className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="font-semibold text-white">{flat.size_sqft}</span>
                            </div>
                            <span className="text-[10px] tracking-wider text-slate-500 uppercase">Sq Ft</span>
                        </div>
                    </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2">
                    <Link
                        href={`/flats/${flat.id}`}
                        className="flex-1 rounded-xl border border-slate-700/60 bg-slate-800 px-3 py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-slate-700/80"
                    >
                        View Details
                    </Link>

                    {isVacant ? (
                        <button
                            type="button"
                            onClick={() => onBookTour && onBookTour(flat)}
                            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-950/40 transition-all hover:bg-emerald-500"
                        >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Schedule Tour</span>
                        </button>
                    ) : (
                        <span className="rounded-xl border border-slate-800 bg-slate-800/40 px-3 py-2.5 text-center text-xs font-medium text-slate-500">
                            Unavailable
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
