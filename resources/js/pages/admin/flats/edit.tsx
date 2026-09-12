import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AdminCard from '@/components/admin/admin-card';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface FlatData {
    id: number;
    flat_number: string;
    floor: string;
    size_sqft: number;
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    rent_cost: number;
    status: 'vacant' | 'occupied' | 'maintenance';
    description?: string;
    amenities?: string[];
}

interface EditFlatProps {
    flat: FlatData;
    commonAmenities: string[];
}

export default function FlatEdit({ flat, commonAmenities }: EditFlatProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Flats', href: '/admin/flats' },
        { title: `Edit Flat ${flat.flat_number}`, href: `/admin/flats/${flat.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        flat_number: flat.flat_number || '',
        floor: flat.floor || '1st Floor',
        size_sqft: flat.size_sqft || 1450,
        bedrooms: flat.bedrooms || 3,
        bathrooms: flat.bathrooms || 3,
        balconies: flat.balconies || 2,
        rent_cost: flat.rent_cost || 35000,
        status: flat.status || 'vacant',
        description: flat.description || '',
        amenities: flat.amenities || [] as string[],
    });

    const handleAmenityToggle = (amenity: string) => {
        if (data.amenities.includes(amenity)) {
            setData('amenities', data.amenities.filter((a) => a !== amenity));
        } else {
            setData('amenities', [...data.amenities, amenity]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/flats/${flat.id}`);
    };

    return (
        <AdminLayout title={`Edit Flat ${flat.flat_number} • Skyline Heights`} breadcrumbs={breadcrumbs}>
            <div className="max-w-4xl">
                <form onSubmit={handleSubmit}>
                    <AdminCard
                        title={
                            <div className="flex items-center gap-2">
                                <Building2 size={18} className="text-blue-600" />
                                <span>Edit Specifications for Flat {flat.flat_number}</span>
                            </div>
                        }
                        tools={
                            <Link
                                href="/admin/flats"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            >
                                <ArrowLeft size={14} />
                                <span>Back to Flats</span>
                            </Link>
                        }
                        variant="primary"
                    >
                        <div className="space-y-6">
                            {/* Row 1: Flat Number & Floor & Status */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Flat / Unit Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.flat_number}
                                        onChange={(e) => setData('flat_number', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {errors.flat_number && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.flat_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Floor Level *
                                    </label>
                                    <select
                                        value={data.floor}
                                        onChange={(e) => setData('floor', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="1st Floor">1st Floor</option>
                                        <option value="2nd Floor">2nd Floor</option>
                                        <option value="3rd Floor">3rd Floor</option>
                                        <option value="4th Floor">4th Floor</option>
                                        <option value="5th Floor">5th Floor</option>
                                        <option value="6th Floor">6th Floor</option>
                                        <option value="7th Floor">7th Floor</option>
                                        <option value="8th Floor">8th Floor (Penthouse)</option>
                                    </select>
                                    {errors.floor && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.floor}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Occupancy Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="vacant">Vacant</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="maintenance">Under Maintenance</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Size & Specs */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Size (Sq Ft) *
                                    </label>
                                    <input
                                        type="number"
                                        min="100"
                                        value={data.size_sqft}
                                        onChange={(e) => setData('size_sqft', Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {errors.size_sqft && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.size_sqft}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Bedrooms (BHK) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={data.bedrooms}
                                        onChange={(e) => setData('bedrooms', Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {errors.bedrooms && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.bedrooms}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Bathrooms *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={data.bathrooms}
                                        onChange={(e) => setData('bathrooms', Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {errors.bathrooms && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.bathrooms}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Balconies
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={data.balconies}
                                        onChange={(e) => setData('balconies', Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    {errors.balconies && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.balconies}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Rent Cost */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Monthly Rent Cost (৳ BDT) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="500"
                                        value={data.rent_cost}
                                        onChange={(e) => setData('rent_cost', Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    />
                                    {errors.rent_cost && (
                                        <p className="mt-1 text-[11px] text-rose-600">{errors.rent_cost}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Unit Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Amenities Checklist */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Amenities & Building Perks Included
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-200 rounded p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                                    {commonAmenities.map((amenity, idx) => {
                                        const checked = data.amenities.includes(amenity);
                                        return (
                                            <label
                                                key={idx}
                                                className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => handleAmenityToggle(amenity)}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span>{amenity}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href="/admin/flats"
                                className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Save size={15} />
                                <span>{processing ? 'Saving Changes...' : 'Update Flat'}</span>
                            </button>
                        </div>
                    </AdminCard>
                </form>
            </div>
        </AdminLayout>
    );
}
