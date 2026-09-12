import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Printer,
    ArrowLeft,
    CreditCard,
    Building2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ShieldCheck
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface PaymentRecord {
    id: number;
    payment_no: string;
    amount_paid: number | string;
    payment_method: string;
    transaction_id?: string;
    payment_date: string;
    notes?: string;
    received_by?: {
        name: string;
    };
}

interface InvoiceDetailProps {
    invoice: {
        id: number;
        invoice_no: string;
        billing_month: string;
        rent_amount: number | string;
        utility_charges: number | string;
        other_charges: number | string;
        discount: number | string;
        total_payable: number | string;
        paid_amount: number | string;
        due_amount: number;
        due_date?: string;
        status: 'unpaid' | 'partially_paid' | 'paid';
        created_at: string;
        tenant?: {
            id: number;
            name: string;
            phone: string;
            email?: string;
            nid_passport: string;
            occupation?: string;
        };
        lease?: {
            flat?: {
                id: number;
                flat_number: string;
                floor: string;
                size_sqft: number;
                bedrooms: number;
            };
        };
        payments?: PaymentRecord[];
    };
}

export default function InvoiceShow({ invoice }: InvoiceDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Invoices', href: '/admin/invoices' },
        { title: invoice.invoice_no, href: `/admin/invoices/${invoice.id}` },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout title={`Invoice ${invoice.invoice_no} • Skyline Heights`} breadcrumbs={breadcrumbs}>
            {/* Print & Action Buttons Bar (Hidden in Print) */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <Link
                    href="/admin/invoices"
                    className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Invoices</span>
                </Link>

                <div className="flex items-center gap-2">
                    {invoice.status !== 'paid' && (
                        <Link
                            href={`/admin/payments/create?invoice_id=${invoice.id}`}
                            className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                        >
                            <CreditCard size={15} />
                            <span>Record Payment</span>
                        </Link>
                    )}
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        <Printer size={15} />
                        <span>Print Invoice / Save PDF</span>
                    </button>
                </div>
            </div>

            {/* AdminLTE 3 Styled Invoice Document Container */}
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 print:border-none print:shadow-none p-8 max-w-4xl mx-auto">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded bg-blue-600 font-black text-white text-xl">
                            S
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                                Skyline Heights Residency
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Luxury Residential Living & Property Administration
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-0 text-left sm:text-right">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Issue Date: {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                        <span
                            className={`mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                invoice.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : invoice.status === 'partially_paid'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                        >
                            {invoice.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* 3-Column Invoice Info Row (AdminLTE .invoice-info) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-slate-200 text-xs dark:border-slate-800">
                    {/* From */}
                    <div>
                        <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Billed From:
                        </span>
                        <address className="not-italic text-slate-700 dark:text-slate-300 space-y-1">
                            <strong className="text-slate-900 dark:text-white font-bold block">
                                Skyline Heights Building Office
                            </strong>
                            <div>Plot 45, Road 11, Block D, Banani</div>
                            <div>Dhaka-1213, Bangladesh</div>
                            <div>Phone: +880 1711-000000</div>
                            <div>Email: billing@skylineheights.com</div>
                        </address>
                    </div>

                    {/* To */}
                    <div>
                        <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Billed To (Resident):
                        </span>
                        <address className="not-italic text-slate-700 dark:text-slate-300 space-y-1">
                            <strong className="text-slate-900 dark:text-white font-bold block">
                                {invoice.tenant?.name || 'Resident'}
                            </strong>
                            <div>
                                Flat {invoice.lease?.flat?.flat_number} ({invoice.lease?.flat?.floor})
                            </div>
                            <div>Phone: {invoice.tenant?.phone}</div>
                            {invoice.tenant?.email && <div>Email: {invoice.tenant?.email}</div>}
                            <div>NID/Passport: {invoice.tenant?.nid_passport}</div>
                        </address>
                    </div>

                    {/* Invoice Meta */}
                    <div className="space-y-1 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Invoice Details:
                        </span>
                        <div>
                            <b>Invoice #:</b> <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{invoice.invoice_no}</span>
                        </div>
                        <div>
                            <b>Billing Month:</b> {invoice.billing_month}
                        </div>
                        <div>
                            <b>Payment Due Date:</b>{' '}
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                                {invoice.due_date || 'Within 10th of Month'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="py-6 border-b border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                            <tr>
                                <th className="py-2.5 px-4">Item #</th>
                                <th className="py-2.5 px-4">Description</th>
                                <th className="py-2.5 px-4">Period / Unit</th>
                                <th className="py-2.5 px-4 text-right">Subtotal (BDT)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            <tr>
                                <td className="py-3 px-4 font-mono">1</td>
                                <td className="py-3 px-4">
                                    <span className="font-bold text-slate-900 dark:text-white block">
                                        Residential Apartment Rent
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        Flat {invoice.lease?.flat?.flat_number} ({invoice.lease?.flat?.bedrooms} BHK, {invoice.lease?.flat?.size_sqft} sqft)
                                    </span>
                                </td>
                                <td className="py-3 px-4">{invoice.billing_month}</td>
                                <td className="py-3 px-4 text-right font-semibold">
                                    ৳{Number(invoice.rent_amount).toLocaleString()}
                                </td>
                            </tr>

                            {Number(invoice.utility_charges) > 0 && (
                                <tr>
                                    <td className="py-3 px-4 font-mono">2</td>
                                    <td className="py-3 px-4">
                                        <span className="font-bold text-slate-900 dark:text-white block">
                                            Utility Services & Power Backup
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            Gas, Water, Standby Generator, Lift Maintenance
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{invoice.billing_month}</td>
                                    <td className="py-3 px-4 text-right font-semibold">
                                        ৳{Number(invoice.utility_charges).toLocaleString()}
                                    </td>
                                </tr>
                            )}

                            {Number(invoice.other_charges) > 0 && (
                                <tr>
                                    <td className="py-3 px-4 font-mono">3</td>
                                    <td className="py-3 px-4">
                                        <span className="font-bold text-slate-900 dark:text-white block">
                                            Additional Facility Charges
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            Security & Rooftop Facility Charges
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{invoice.billing_month}</td>
                                    <td className="py-3 px-4 text-right font-semibold">
                                        ৳{Number(invoice.other_charges).toLocaleString()}
                                    </td>
                                </tr>
                            )}

                            {Number(invoice.discount) > 0 && (
                                <tr className="text-emerald-600 dark:text-emerald-400">
                                    <td className="py-3 px-4 font-mono">4</td>
                                    <td className="py-3 px-4 font-semibold">Approved Discount / Special Waiver</td>
                                    <td className="py-3 px-4">{invoice.billing_month}</td>
                                    <td className="py-3 px-4 text-right font-bold">
                                        - ৳{Number(invoice.discount).toLocaleString()}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Calculation & Payment Terms Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs">
                    {/* Payment methods & Terms */}
                    <div className="space-y-2 text-slate-600 dark:text-slate-400">
                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                            Payment Methods Accepted:
                        </p>
                        <div className="rounded bg-slate-50 p-3 dark:bg-slate-800/40 space-y-1 text-[11px]">
                            <div>• <strong>Bank Wire:</strong> City Bank AC: 110294820194 (Skyline Heights)</div>
                            <div>• <strong>bKash Merchant:</strong> 01711-000000 (Counter 1)</div>
                            <div>• <strong>Cashier Desk:</strong> Ground Floor Management Office</div>
                        </div>
                        <p className="text-[11px] text-slate-400 italic">
                            * Please ensure payment is completed on or before the 10th of every month to avoid late fees.
                        </p>
                    </div>

                    {/* Financial Totals */}
                    <div className="space-y-2">
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500">Total Invoiced Amount:</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                                ৳{Number(invoice.total_payable).toLocaleString()} BDT
                            </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                            <span>Total Paid To Date:</span>
                            <span className="font-bold">
                                ৳{Number(invoice.paid_amount).toLocaleString()} BDT
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-t-2 border-slate-300 dark:border-slate-700 text-base font-extrabold text-slate-900 dark:text-white">
                            <span>Balance Due:</span>
                            <span className={invoice.due_amount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                ৳{Number(invoice.due_amount).toLocaleString()} BDT
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Receipts Section (If payments recorded) */}
                {invoice.payments && invoice.payments.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            <span>Payment Receipts Recorded Against This Invoice</span>
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                                    <tr>
                                        <th className="py-2 px-3">Receipt No</th>
                                        <th className="py-2 px-3">Date</th>
                                        <th className="py-2 px-3">Payment Method</th>
                                        <th className="py-2 px-3">Trx ID / Ref</th>
                                        <th className="py-2 px-3">Received By</th>
                                        <th className="py-2 px-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {invoice.payments.map((p) => (
                                        <tr key={p.id}>
                                            <td className="py-2 px-3 font-mono font-bold text-blue-600">
                                                {p.payment_no}
                                            </td>
                                            <td className="py-2 px-3">{p.payment_date}</td>
                                            <td className="py-2 px-3 font-medium uppercase text-[11px]">
                                                {p.payment_method}
                                            </td>
                                            <td className="py-2 px-3 font-mono text-[11px]">
                                                {p.transaction_id || 'N/A'}
                                            </td>
                                            <td className="py-2 px-3">{p.received_by?.name || 'Staff'}</td>
                                            <td className="py-2 px-3 text-right font-bold text-emerald-600">
                                                ৳{Number(p.amount_paid).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
