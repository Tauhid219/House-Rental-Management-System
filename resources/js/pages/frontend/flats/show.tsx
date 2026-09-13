import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Bath, Bed, CheckCircle2, Clock, Info, Layers, MapPin, Maximize2, Phone, Send, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import FlatCard, { FlatType } from '../../../components/flat-card';
import TourBookingModal from '../../../components/tour-booking-modal';
import FrontendLayout from '../../../layouts/frontend-layout';

interface Props {
    flat: FlatType;
    relatedFlats: FlatType[];
}

export default function FlatShow({ flat, relatedFlats }: Props) {
    const images =
        flat.images && flat.images.length > 0
            ? flat.images
            : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'];

    const [activeImage, setActiveImage] = useState(images[0]);
    const [isTourModalOpen, setIsTourModalOpen] = useState(false);

    // Direct booking form inside sidebar
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        preferred_flat_type: `Flat ${flat.flat_number} (${flat.bedrooms} BHK, ${flat.floor})`,
        visit_date: '',
        message: '',
    });

    const handleSidebarBooking = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const isVacant = flat.status === 'vacant';
    const securityDeposit = Number(flat.rent_cost) * 2;

    const defaultAmenities = [
        '24/7 Monitored CCTV Security',
        'Otis High-Speed Elevator Access',
        'Heavy Standby Generator Power',
        'Dedicated Reserved Basement Parking',
        'Direct Natural Gas Pipeline',
        'High-Pressure Water Filtration',
        'Rooftop Garden Walking Track',
        'Emergency Fire Hydrant System',
    ];

    const displayAmenities = flat.amenities && flat.amenities.length > 0 ? flat.amenities : defaultAmenities;

    return (
        <FrontendLayout>
            <Head title={`Unit ${flat.flat_number} (${flat.bedrooms} BHK, ${flat.floor}) - Skyline Heights`} />

            {/* Top Navigation & Breadcrumb */}
            <div className="border-b border-slate-800 bg-slate-900 py-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
                    <Link
                        href="/flats"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to All Available Flats</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
                                isVacant
                                    ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                                    : 'border border-amber-500/40 bg-amber-500/20 text-amber-400'
                            }`}
                        >
                            {flat.status}
                        </span>
                        <span className="hidden text-xs font-medium text-slate-400 sm:inline">{flat.floor}</span>
                    </div>
                </div>
            </div>

            {/* Main Flat Content */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Left Column: Gallery + Details */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Gallery Section */}
                        <div className="space-y-3">
                            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
                                <img
                                    src={activeImage}
                                    alt={`Unit ${flat.flat_number}`}
                                    className="h-full w-full object-cover transition-all duration-300"
                                />
                                <div className="absolute top-4 left-4 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-1.5 text-xs font-bold text-white shadow backdrop-blur-md">
                                    Flat {flat.flat_number}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                                                activeImage === img
                                                    ? 'scale-95 border-emerald-500 shadow-md shadow-emerald-950'
                                                    : 'border-slate-800 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Core Specs */}
                        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8">
                            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight text-white">Executive Flat {flat.flat_number}</h1>
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                                        Skyline Heights Residency · {flat.floor} · Banani, Dhaka
                                    </p>
                                </div>

                                <div className="text-left sm:text-right">
                                    <span className="block text-[11px] font-medium tracking-wider text-slate-400 uppercase">Monthly Rent</span>
                                    <span className="text-3xl font-black text-emerald-400">৳ {Number(flat.rent_cost).toLocaleString()}</span>
                                    <span className="block text-xs font-normal text-slate-400">exclusive of utilities</span>
                                </div>
                            </div>

                            {/* Core Specs Grid */}
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <Bed className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400">Bedrooms</span>
                                        <strong className="text-sm font-bold text-white">{flat.bedrooms} BHK</strong>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <Bath className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400">Bathrooms</span>
                                        <strong className="text-sm font-bold text-white">{flat.bathrooms} Baths</strong>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400">Balconies</span>
                                        <strong className="text-sm font-bold text-white">{flat.balconies} Balcony</strong>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <Maximize2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400">Floor Area</span>
                                        <strong className="text-sm font-bold text-white">{flat.size_sqft} Sq Ft</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="mb-2 text-base font-bold text-white">Apartment Overview</h3>
                                <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                                    {flat.description ||
                                        'This premium residential unit provides open-concept living, Italian ceramic floor tiles, abundant natural cross-ventilation, and dedicated kitchen cabinetry. Fully serviced and ready for occupancy.'}
                                </p>
                            </div>
                        </div>

                        {/* Amenities Included */}
                        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-8">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                                <Sparkles className="h-4 w-4 text-emerald-400" />
                                <span>Unit & Building Features</span>
                            </h3>

                            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                                {displayAmenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300"
                                    >
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Terms & Deposit */}
                        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-xs text-slate-400">
                            <div className="flex items-center gap-2 text-sm font-bold text-white">
                                <Info className="h-4 w-4 text-emerald-400" />
                                <span>Rental Agreement & Lease Terms</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                                <div>
                                    <span className="block text-slate-500">Security Deposit (Refundable)</span>
                                    <strong className="text-sm text-slate-200">৳ {securityDeposit.toLocaleString()} (2 Months)</strong>
                                </div>
                                <div>
                                    <span className="block text-slate-500">Advance Rent</span>
                                    <strong className="text-sm text-slate-200">৳ {Number(flat.rent_cost).toLocaleString()} (1 Month)</strong>
                                </div>
                                <div>
                                    <span className="block text-slate-500">Minimum Lease Period</span>
                                    <strong className="text-sm text-slate-200">12 Months (Renewable)</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Widget */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">
                            <div>
                                <span className="mb-2 inline-block rounded-full border border-emerald-800/80 bg-emerald-950 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                                    Instant Tour Booking
                                </span>
                                <h3 className="text-xl font-bold text-white">Schedule a Private Inspection</h3>
                                <p className="mt-1 text-xs text-slate-400">Book a guided tour of Unit {flat.flat_number} with our on-site manager.</p>
                            </div>

                            {wasSuccessful ? (
                                <div className="space-y-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/70 p-5 text-center">
                                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                                    <h4 className="text-sm font-bold text-white">Visit Request Received!</h4>
                                    <p className="text-xs text-emerald-200">
                                        We will call you shortly to confirm the scheduled tour time for Unit {flat.flat_number}.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSidebarBooking} className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-300">
                                            Your Full Name <span className="text-rose-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Tanvir Ahmed"
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                        />
                                        {errors.name && <p className="mt-1 text-[11px] text-rose-400">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-300">
                                            Phone Number <span className="text-rose-400">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+88017XXXXXXXX"
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                        />
                                        {errors.phone && <p className="mt-1 text-[11px] text-rose-400">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-300">
                                            Email Address <span className="text-rose-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                        />
                                        {errors.email && <p className="mt-1 text-[11px] text-rose-400">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-300">Preferred Tour Date</label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={data.visit_date}
                                            onChange={(e) => setData('visit_date', e.target.value)}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-300">Notes / Moving Timeline (Optional)</label>
                                        <textarea
                                            rows={2}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="e.g. Planning to move next month..."
                                            className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !isVacant}
                                        className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/60 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <Send className="h-4 w-4" />
                                            {processing ? 'Submitting...' : isVacant ? 'Schedule Private Visit' : 'Currently Unavailable'}
                                        </span>
                                    </button>
                                </form>
                            )}

                            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
                                <p className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                    <span>
                                        Immediate Inquiries: <strong>+880 1711-000002</strong>
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                    <span>Open for visit 7 days a week (9 AM - 7 PM)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Flats Section */}
                {relatedFlats && relatedFlats.length > 0 && (
                    <div className="mt-20 border-t border-slate-800 pt-12">
                        <div className="mb-8">
                            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Similar Accommodations</span>
                            <h3 className="mt-1 text-2xl font-bold text-white">Other Available Flats You Might Like</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {relatedFlats.map((rFlat) => (
                                <FlatCard key={rFlat.id} flat={rFlat} onBookTour={() => setIsTourModalOpen(true)} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <TourBookingModal isOpen={isTourModalOpen} onClose={() => setIsTourModalOpen(false)} flat={flat} />
        </FrontendLayout>
    );
}
