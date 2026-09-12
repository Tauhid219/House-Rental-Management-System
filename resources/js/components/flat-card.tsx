import React from 'react';
import { Link } from '@inertiajs/react';
import { Bed, Bath, Layers, Maximize2, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

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
    const defaultImage =
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const mainImage = flat.images && flat.images.length > 0 ? flat.images[0] : defaultImage;

    const isVacant = flat.status === 'vacant';

    return (
        <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-950/30 flex flex-col overflow-hidden">
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                    src={mainImage}
                    alt={`Flat ${flat.flat_number}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-md ${
                            isVacant
                                ? 'bg-emerald-500/90 text-white backdrop-blur-md'
                                : flat.status === 'occupied'
                                ? 'bg-amber-500/90 text-white backdrop-blur-md'
                                : 'bg-slate-700/90 text-slate-200 backdrop-blur-md'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isVacant ? 'bg-emerald-200 animate-pulse' : 'bg-white'}`} />
                        {flat.status}
                    </span>

                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 text-slate-200 border border-slate-700/50 backdrop-blur-md shadow-sm">
                        {flat.floor}
                    </span>
                </div>

                {/* Rent Price on bottom edge of image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
                    <div>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">Monthly Rent</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white drop-shadow">
                                ৳ {Number(flat.rent_cost).toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-300 font-medium">/ month</span>
                        </div>
                    </div>

                    <Link
                        href={`/flats/${flat.id}`}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-500 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 shadow hover:scale-110"
                        title="View Full Specifications"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <Link href={`/flats/${flat.id}`} className="hover:text-emerald-400 transition-colors">
                            <h3 className="text-lg font-bold text-white tracking-tight">
                                Unit {flat.flat_number}
                            </h3>
                        </Link>
                        <span className="text-xs text-slate-400 font-medium">
                            {flat.bedrooms} Bedroom Residence
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {flat.description || 'Premium rental unit built with top-grade ventilation, natural lighting, and modern sanitary fittings.'}
                    </p>

                    {/* Key Specifications Grid */}
                    <div className="grid grid-cols-4 gap-2 py-3 px-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
                                <Bed className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-semibold text-white">{flat.bedrooms}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Beds</span>
                        </div>

                        <div className="flex flex-col items-center border-l border-slate-800">
                            <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
                                <Bath className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-semibold text-white">{flat.bathrooms}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Baths</span>
                        </div>

                        <div className="flex flex-col items-center border-l border-slate-800">
                            <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
                                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-semibold text-white">{flat.balconies}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Balcony</span>
                        </div>

                        <div className="flex flex-col items-center border-l border-slate-800">
                            <div className="flex items-center gap-1 text-slate-400 text-xs mb-0.5">
                                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-semibold text-white">{flat.size_sqft}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Sq Ft</span>
                        </div>
                    </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center gap-2">
                    <Link
                        href={`/flats/${flat.id}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-semibold text-center border border-slate-700/60 transition-colors"
                    >
                        View Details
                    </Link>

                    {isVacant ? (
                        <button
                            type="button"
                            onClick={() => onBookTour && onBookTour(flat)}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule Tour</span>
                        </button>
                    ) : (
                        <span className="py-2.5 px-3 rounded-xl bg-slate-800/40 text-slate-500 text-xs font-medium border border-slate-800 text-center">
                            Unavailable
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
