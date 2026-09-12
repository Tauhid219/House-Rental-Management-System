import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import FrontendLayout from '../../../layouts/frontend-layout';
import FlatCard, { FlatType } from '../../../components/flat-card';
import TourBookingModal from '../../../components/tour-booking-modal';
import { 
    Bed, 
    Bath, 
    Layers, 
    Maximize2, 
    CheckCircle2, 
    Calendar, 
    ShieldCheck, 
    MapPin, 
    ArrowLeft, 
    Send, 
    Phone, 
    Clock, 
    Sparkles, 
    Info
} from 'lucide-react';

interface Props {
    flat: FlatType;
    relatedFlats: FlatType[];
}

export default function FlatShow({ flat, relatedFlats }: Props) {
    const images = flat.images && flat.images.length > 0
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
            <div className="bg-slate-900 border-b border-slate-800 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
                    <Link
                        href="/flats"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Available Flats</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                isVacant
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            }`}
                        >
                            {flat.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                            {flat.floor}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Flat Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Gallery + Details */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Gallery Section */}
                        <div className="space-y-3">
                            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                                <img
                                    src={activeImage}
                                    alt={`Unit ${flat.flat_number}`}
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-white shadow">
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
                                            className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                                activeImage === img
                                                    ? 'border-emerald-500 scale-95 shadow-md shadow-emerald-950'
                                                    : 'border-slate-800 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Core Specs */}
                        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                                <div>
                                    <h1 className="text-3xl font-black text-white tracking-tight">
                                        Executive Flat {flat.flat_number}
                                    </h1>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                        Skyline Heights Residency · {flat.floor} · Banani, Dhaka
                                    </p>
                                </div>

                                <div className="text-left sm:text-right">
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">Monthly Rent</span>
                                    <span className="text-3xl font-black text-emerald-400">
                                        ৳ {Number(flat.rent_cost).toLocaleString()}
                                    </span>
                                    <span className="text-xs text-slate-400 block font-normal">exclusive of utilities</span>
                                </div>
                            </div>

                            {/* Core Specs Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                        <Bed className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block">Bedrooms</span>
                                        <strong className="text-white text-sm font-bold">{flat.bedrooms} BHK</strong>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                        <Bath className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block">Bathrooms</span>
                                        <strong className="text-white text-sm font-bold">{flat.bathrooms} Baths</strong>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block">Balconies</span>
                                        <strong className="text-white text-sm font-bold">{flat.balconies} Balcony</strong>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                        <Maximize2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block">Floor Area</span>
                                        <strong className="text-white text-sm font-bold">{flat.size_sqft} Sq Ft</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-base font-bold text-white mb-2">Apartment Overview</h3>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    {flat.description || 'This premium residential unit provides open-concept living, Italian ceramic floor tiles, abundant natural cross-ventilation, and dedicated kitchen cabinetry. Fully serviced and ready for occupancy.'}
                                </p>
                            </div>
                        </div>

                        {/* Amenities Included */}
                        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span>Unit & Building Features</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {displayAmenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Terms & Deposit */}
                        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-3">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <Info className="w-4 h-4 text-emerald-400" />
                                <span>Rental Agreement & Lease Terms</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <span className="text-slate-500 block">Security Deposit (Refundable)</span>
                                    <strong className="text-slate-200 text-sm">৳ {securityDeposit.toLocaleString()} (2 Months)</strong>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Advance Rent</span>
                                    <strong className="text-slate-200 text-sm">৳ {Number(flat.rent_cost).toLocaleString()} (1 Month)</strong>
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Minimum Lease Period</span>
                                    <strong className="text-slate-200 text-sm">12 Months (Renewable)</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Widget */}
                    <div className="lg:col-span-4">
                        <div className="p-7 rounded-3xl bg-slate-900 border border-slate-800 sticky top-28 space-y-6 shadow-2xl">
                            <div>
                                <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800/80 rounded-full mb-2">
                                    Instant Tour Booking
                                </span>
                                <h3 className="text-xl font-bold text-white">
                                    Schedule a Private Inspection
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Book a guided tour of Unit {flat.flat_number} with our on-site manager.
                                </p>
                            </div>

                            {wasSuccessful ? (
                                <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-2">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                                    <h4 className="text-sm font-bold text-white">Visit Request Received!</h4>
                                    <p className="text-xs text-emerald-200">
                                        We will call you shortly to confirm the scheduled tour time for Unit {flat.flat_number}.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSidebarBooking} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                                            Your Full Name <span className="text-rose-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Tanvir Ahmed"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                        {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                                            Phone Number <span className="text-rose-400">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+88017XXXXXXXX"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                        {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                                            Email Address <span className="text-rose-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                        {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                                            Preferred Tour Date
                                        </label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={data.visit_date}
                                            onChange={(e) => setData('visit_date', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                                            Notes / Moving Timeline (Optional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="e.g. Planning to move next month..."
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !isVacant}
                                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <Send className="w-4 h-4" />
                                            {processing ? 'Submitting...' : isVacant ? 'Schedule Private Visit' : 'Currently Unavailable'}
                                        </span>
                                    </button>
                                </form>
                            )}

                            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                                <p className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Immediate Inquiries: <strong>+880 1711-000002</strong></span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Open for visit 7 days a week (9 AM - 7 PM)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Flats Section */}
                {relatedFlats && relatedFlats.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-slate-800">
                        <div className="mb-8">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                                Similar Accommodations
                            </span>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                Other Available Flats You Might Like
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedFlats.map((rFlat) => (
                                <FlatCard
                                    key={rFlat.id}
                                    flat={rFlat}
                                    onBookTour={() => setIsTourModalOpen(true)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <TourBookingModal
                isOpen={isTourModalOpen}
                onClose={() => setIsTourModalOpen(false)}
                flat={flat}
            />
        </FrontendLayout>
    );
}
