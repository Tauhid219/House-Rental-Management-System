import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Calendar, Clock, MapPin, Send, X, CheckCircle } from 'lucide-react';

import { FlatType } from './flat-card';

export interface Flat {
    id?: number;
    flat_number: string;
    floor: string;
    bedrooms: number;
    rent_cost?: number | string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    flat?: FlatType | Flat | null;
}

export default function TourBookingModal({ isOpen, onClose, flat }: Props) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        preferred_flat_type: flat ? `${flat.flat_number} (${flat.bedrooms} BHK, ${flat.floor})` : '2 Bedroom',
        visit_date: '',
        message: '',
    });

    useEffect(() => {
        if (flat) {
            setData('preferred_flat_type', `Flat ${flat.flat_number} - ${flat.bedrooms} Bedroom (${flat.floor})`);
        }
    }, [flat]);

    useEffect(() => {
        if (wasSuccessful) {
            reset();
            const timer = setTimeout(() => {
                onClose();
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [wasSuccessful]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                // Success handled by flash message & wasSuccessful
            },
        });
    };

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <TransitionChild
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-6 sm:p-8">
                                <button
                                    onClick={onClose}
                                    className="absolute top-5 right-5 text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {wasSuccessful ? (
                                    <div className="py-8 text-center space-y-3">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Viewing Tour Scheduled!</h3>
                                        <p className="text-slate-300 text-sm max-w-sm mx-auto">
                                            Thank you for your interest. Our resident manager will get in touch with you shortly to confirm the scheduled visit.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full mb-2">
                                                VIP Property Experience
                                            </span>
                                            <DialogTitle as="h3" className="text-2xl font-bold text-white">
                                                Schedule a Private Viewing
                                            </DialogTitle>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Select your preferred date to inspect the unit and explore our luxury building amenities.
                                            </p>
                                        </div>

                                        {flat && (
                                            <div className="mb-5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                                                <div>
                                                    <span className="text-slate-400 block">Selected Unit:</span>
                                                    <strong className="text-white font-semibold text-sm">Flat {flat.flat_number}</strong> ({flat.bedrooms} BHK · {flat.floor})
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-slate-400 block">Monthly Rent</span>
                                                    <span className="text-emerald-400 font-bold text-sm">৳ {Number(flat.rent_cost).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                                                />
                                                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
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
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                                                    />
                                                    {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                                        Preferred Tour Date
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            min={new Date().toISOString().split('T')[0]}
                                                            value={data.visit_date}
                                                            onChange={(e) => setData('visit_date', e.target.value)}
                                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                                                        />
                                                    </div>
                                                    {errors.visit_date && <p className="text-xs text-rose-400 mt-1">{errors.visit_date}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                                        Interested Unit / Layout
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.preferred_flat_type}
                                                        onChange={(e) => setData('preferred_flat_type', e.target.value)}
                                                        placeholder="e.g. 3 Bedroom or Penthouse"
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                                    Special Requests / Questions (Optional)
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={data.message}
                                                    onChange={(e) => setData('message', e.target.value)}
                                                    placeholder="Let us know if you need parking specifications, moving date requirements, or elevator access notes..."
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all resize-none"
                                                />
                                                {errors.message && <p className="text-xs text-rose-400 mt-1">{errors.message}</p>}
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-60 text-sm cursor-pointer"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    {processing ? 'Booking Your Tour...' : 'Confirm Schedule Request'}
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
