import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { CheckCircle, Send, X } from 'lucide-react';
import React, { useEffect } from 'react';

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
    }, [flat, setData]);

    useEffect(() => {
        if (wasSuccessful) {
            reset();
            const timer = setTimeout(() => {
                onClose();
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [wasSuccessful, onClose, reset]);

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
                            <DialogPanel className="relative transform overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-8">
                                <button
                                    onClick={onClose}
                                    className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                {wasSuccessful ? (
                                    <div className="space-y-3 py-8 text-center">
                                        <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                            <CheckCircle className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Viewing Tour Scheduled!</h3>
                                        <p className="mx-auto max-w-sm text-sm text-slate-300">
                                            Thank you for your interest. Our resident manager will get in touch with you shortly to confirm the
                                            scheduled visit.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <span className="mb-2 inline-block rounded-full border border-emerald-800/60 bg-emerald-950/80 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                                                VIP Property Experience
                                            </span>
                                            <DialogTitle as="h3" className="text-2xl font-bold text-white">
                                                Schedule a Private Viewing
                                            </DialogTitle>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Select your preferred date to inspect the unit and explore our luxury building amenities.
                                            </p>
                                        </div>

                                        {flat && (
                                            <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/80 p-3.5 text-xs text-slate-300">
                                                <div>
                                                    <span className="block text-slate-400">Selected Unit:</span>
                                                    <strong className="text-sm font-semibold text-white">Flat {flat.flat_number}</strong> (
                                                    {flat.bedrooms} BHK · {flat.floor})
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-slate-400">Monthly Rent</span>
                                                    <span className="text-sm font-bold text-emerald-400">
                                                        ৳ {Number(flat.rent_cost).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                />
                                                {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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
                                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
                                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                    />
                                                    {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-slate-300">Preferred Tour Date</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            min={new Date().toISOString().split('T')[0]}
                                                            value={data.visit_date}
                                                            onChange={(e) => setData('visit_date', e.target.value)}
                                                            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    {errors.visit_date && <p className="mt-1 text-xs text-rose-400">{errors.visit_date}</p>}
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-slate-300">Interested Unit / Layout</label>
                                                    <input
                                                        type="text"
                                                        value={data.preferred_flat_type}
                                                        onChange={(e) => setData('preferred_flat_type', e.target.value)}
                                                        placeholder="e.g. 3 Bedroom or Penthouse"
                                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-slate-300">
                                                    Special Requests / Questions (Optional)
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={data.message}
                                                    onChange={(e) => setData('message', e.target.value)}
                                                    placeholder="Let us know if you need parking specifications, moving date requirements, or elevator access notes..."
                                                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                />
                                                {errors.message && <p className="mt-1 text-xs text-rose-400">{errors.message}</p>}
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-950/50 transition-all hover:from-emerald-500 hover:to-teal-500 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none disabled:opacity-60"
                                                >
                                                    <Send className="h-4 w-4" />
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
