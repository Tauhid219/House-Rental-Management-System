import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Printer, ShieldCheck } from 'lucide-react';
import React from 'react';

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
            <Head title={`Invoice ${invoice.invoice_no} - Skyline Heights`} />

            {/* Print Scoped Styles to guarantee single-page fit */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        @page {
                            size: A4 portrait;
                            margin: 6mm 8mm;
                        }
                        html, body {
                            background: #ffffff !important;
                            color: #0f172a !important;
                            font-size: 11px !important;
                            line-height: 1.3 !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .invoice-document {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            border: none !important;
                            box-shadow: none !important;
                        }
                        .invoice-document * {
                            box-sizing: border-box !important;
                        }
                        tr, td, th {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                    }
                `,
                }}
            />

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
                            className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                        >
                            <CreditCard size={15} />
                            <span>Record Payment</span>
                        </Link>
                    )}
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                        <Printer size={15} />
                        <span>Print Invoice / Save PDF</span>
                    </button>
                </div>
            </div>

            {/* AdminLTE 3 Styled Invoice Document Container */}
            <div className="invoice-document mx-auto max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:w-full print:max-w-none print:overflow-visible print:border-none print:bg-white print:p-0 print:text-slate-900 print:shadow-none">
                {/* Header Row */}
                <div className="flex flex-col items-start justify-between border-b border-slate-200 pb-6 sm:flex-row sm:items-center dark:border-slate-800 print:flex-row print:items-center print:border-slate-300 print:pb-2.5">
                    <div className="flex items-center gap-3 print:gap-2.5">
                        <div className="flex size-10 items-center justify-center rounded bg-blue-600 text-xl font-black text-white shadow-sm print:size-8 print:text-base">
                            S
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase dark:text-white print:text-base print:text-slate-900">
                                Skyline Heights Residency
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 print:text-[10px] print:text-slate-600">
                                Luxury Residential Living & Property Administration
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 text-left sm:mt-0 sm:text-right print:mt-0 print:text-right">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 print:text-xs print:text-slate-900">
                            Issue Date: {new Date(invoice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <span
                            className={`mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold tracking-wider uppercase print:px-2 print:py-0 print:text-[10px] ${
                                invoice.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 print:border print:border-emerald-300'
                                    : invoice.status === 'partially_paid'
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 print:border print:border-amber-300'
                                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 print:border print:border-rose-300'
                            }`}
                        >
                            {invoice.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* 3-Column Invoice Info Row (AdminLTE .invoice-info) */}
                <div className="grid grid-cols-1 gap-6 border-b border-slate-200 py-6 text-xs sm:grid-cols-3 dark:border-slate-800 print:grid-cols-3 print:gap-4 print:border-slate-300 print:py-2.5 print:text-[10.5px]">
                    {/* From */}
                    <div>
                        <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500 print:font-bold">
                            Billed From:
                        </span>
                        <address className="space-y-1 text-slate-700 not-italic dark:text-slate-300 print:space-y-0.5 print:text-slate-800">
                            <strong className="block font-bold text-slate-900 dark:text-white print:text-slate-900">
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
                        <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500 print:font-bold">
                            Billed To (Resident):
                        </span>
                        <address className="space-y-1 text-slate-700 not-italic dark:text-slate-300 print:space-y-0.5 print:text-slate-800">
                            <strong className="block font-bold text-slate-900 dark:text-white print:text-slate-900">
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
                    <div className="space-y-1 text-slate-700 dark:text-slate-300 print:space-y-0.5 print:text-slate-800">
                        <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase print:text-slate-500 print:font-bold">
                            Invoice Details:
                        </span>
                        <div>
                            <b>Invoice #:</b> <span className="font-mono font-bold text-blue-600 dark:text-blue-400 print:text-slate-900">{invoice.invoice_no}</span>
                        </div>
                        <div>
                            <b>Billing Month:</b> {invoice.billing_month}
                        </div>
                        <div>
                            <b>Payment Due Date:</b>{' '}
                            <span className="font-semibold text-rose-600 dark:text-rose-400 print:text-rose-700">{invoice.due_date || 'Within 10th of Month'}</span>
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="border-b border-slate-200 py-6 dark:border-slate-800 print:border-slate-300 print:py-2">
                    <table className="w-full text-left text-xs print:text-[11px]">
                        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/60 print:bg-slate-100 print:text-slate-700 print:text-[10px]">
                            <tr>
                                <th className="px-4 py-2.5 print:px-2.5 print:py-1">Item #</th>
                                <th className="px-4 py-2.5 print:px-2.5 print:py-1">Description</th>
                                <th className="px-4 py-2.5 print:px-2.5 print:py-1">Period / Unit</th>
                                <th className="px-4 py-2.5 text-right print:px-2.5 print:py-1">Subtotal (BDT)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300 print:divide-slate-200 print:text-slate-800">
                            <tr>
                                <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">1</td>
                                <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                    <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">Residential Apartment Rent</span>
                                    <span className="text-[11px] text-slate-500 print:text-[9.5px] print:text-slate-500">
                                        Flat {invoice.lease?.flat?.flat_number} ({invoice.lease?.flat?.bedrooms} BHK, {invoice.lease?.flat?.size_sqft}{' '}
                                        sqft)
                                    </span>
                                </td>
                                <td className="px-4 py-3 print:px-2.5 print:py-1.5">{invoice.billing_month}</td>
                                <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">৳{Number(invoice.rent_amount).toLocaleString()}</td>
                            </tr>

                            {Number(invoice.utility_charges) > 0 && (
                                <tr>
                                    <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">2</td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                        <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">Utility Services & Power Backup</span>
                                        <span className="text-[11px] text-slate-500 print:text-[9.5px] print:text-slate-500">Gas, Water, Standby Generator, Lift Maintenance</span>
                                    </td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">{invoice.billing_month}</td>
                                    <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">৳{Number(invoice.utility_charges).toLocaleString()}</td>
                                </tr>
                            )}

                            {Number(invoice.other_charges) > 0 && (
                                <tr>
                                    <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">3</td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                        <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">Additional Facility Charges</span>
                                        <span className="text-[11px] text-slate-500 print:text-[9.5px] print:text-slate-500">Security & Rooftop Facility Charges</span>
                                    </td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">{invoice.billing_month}</td>
                                    <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">৳{Number(invoice.other_charges).toLocaleString()}</td>
                                </tr>
                            )}

                            {Number(invoice.discount) > 0 && (
                                <tr className="text-emerald-600 dark:text-emerald-400 print:text-emerald-700">
                                    <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">4</td>
                                    <td className="px-4 py-3 font-semibold print:px-2.5 print:py-1.5">Approved Discount / Special Waiver</td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">{invoice.billing_month}</td>
                                    <td className="px-4 py-3 text-right font-bold print:px-2.5 print:py-1.5">- ৳{Number(invoice.discount).toLocaleString()}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Calculation & Payment Terms Row */}
                <div className="grid grid-cols-1 gap-6 pt-6 text-xs sm:grid-cols-2 print:grid-cols-2 print:gap-4 print:pt-2 print:text-[10.5px]">
                    {/* Payment methods & Terms */}
                    <div className="space-y-2 text-slate-600 dark:text-slate-400 print:space-y-1 print:text-slate-700">
                        <p className="font-bold tracking-wide text-slate-800 uppercase dark:text-slate-200 print:text-slate-900 print:text-[10px]">Payment Methods Accepted:</p>
                        <div className="space-y-1 rounded bg-slate-50 p-3 text-[11px] dark:bg-slate-800/40 print:rounded print:border print:border-slate-200 print:bg-slate-50/80 print:p-2 print:text-[9.5px] print:space-y-0.5">
                            <div>
                                • <strong>Bank Wire:</strong> City Bank AC: 110294820194 (Skyline Heights)
                            </div>
                            <div>
                                • <strong>bKash Merchant:</strong> 01711-000000 (Counter 1)
                            </div>
                            <div>
                                • <strong>Cashier Desk:</strong> Ground Floor Management Office
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 italic print:text-[9px] print:text-slate-500">
                            * Please ensure payment is completed on or before the 10th of every month to avoid late fees.
                        </p>
                    </div>

                    {/* Financial Totals */}
                    <div className="space-y-2 print:space-y-0.5">
                        <div className="flex justify-between border-b border-slate-100 py-1 dark:border-slate-800 print:border-slate-200 print:py-0.5">
                            <span className="text-slate-500 print:text-slate-600">Total Invoiced Amount:</span>
                            <span className="font-bold text-slate-900 dark:text-white print:text-slate-900">৳{Number(invoice.total_payable).toLocaleString()} BDT</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 py-1 text-emerald-600 dark:border-slate-800 dark:text-emerald-400 print:border-slate-200 print:py-0.5 print:text-emerald-700">
                            <span>Total Paid To Date:</span>
                            <span className="font-bold">৳{Number(invoice.paid_amount).toLocaleString()} BDT</span>
                        </div>
                        <div className="flex justify-between border-t-2 border-slate-300 py-2 text-base font-extrabold text-slate-900 dark:border-slate-700 dark:text-white print:border-slate-400 print:py-1 print:text-sm print:text-slate-900">
                            <span>Balance Due:</span>
                            <span className={invoice.due_amount > 0 ? 'text-rose-600 dark:text-rose-400 print:text-rose-700' : 'text-emerald-600 dark:text-emerald-400 print:text-emerald-700'}>
                                ৳{Number(invoice.due_amount).toLocaleString()} BDT
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Receipts Section (If payments recorded) */}
                {invoice.payments && invoice.payments.length > 0 && (
                    <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800 print:mt-2.5 print:border-slate-300 print:pt-2">
                        <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-900 uppercase dark:text-white print:mb-1 print:text-[10px] print:text-slate-900">
                            <ShieldCheck size={16} className="text-emerald-600 print:size-3.5" />
                            <span>Payment Receipts Recorded Against This Invoice</span>
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300 print:text-[10px] print:text-slate-800">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/60 print:bg-slate-100 print:text-[9px] print:text-slate-700">
                                    <tr>
                                        <th className="px-3 py-2 print:px-2 print:py-1">Receipt No</th>
                                        <th className="px-3 py-2 print:px-2 print:py-1">Date</th>
                                        <th className="px-3 py-2 print:px-2 print:py-1">Method</th>
                                        <th className="px-3 py-2 print:px-2 print:py-1">Trx ID / Ref</th>
                                        <th className="px-3 py-2 print:px-2 print:py-1">Received By</th>
                                        <th className="px-3 py-2 text-right print:px-2 print:py-1">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200">
                                    {invoice.payments.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-3 py-2 font-mono font-bold text-blue-600 print:px-2 print:py-1 print:text-slate-900">{p.payment_no}</td>
                                            <td className="px-3 py-2 print:px-2 print:py-1">{p.payment_date}</td>
                                            <td className="px-3 py-2 text-[11px] font-medium uppercase print:px-2 print:py-1 print:text-[9.5px]">{p.payment_method}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] print:px-2 print:py-1 print:text-[9.5px]">{p.transaction_id || 'N/A'}</td>
                                            <td className="px-3 py-2 print:px-2 print:py-1">{p.received_by?.name || 'Staff'}</td>
                                            <td className="px-3 py-2 text-right font-bold text-emerald-600 print:px-2 print:py-1 print:text-emerald-700">
                                                ৳{Number(p.amount_paid).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Official Signatures & Stamp for Print */}
                <div className="hidden pt-6 mt-4 border-t border-slate-300 print:grid print:grid-cols-2 print:gap-12">
                    <div className="pt-2 text-center">
                        <div className="mx-auto w-48 border-b border-slate-400 mb-1" />
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                            Tenant / Resident Acknowledgment
                        </span>
                    </div>
                    <div className="pt-2 text-center">
                        <div className="mx-auto w-48 border-b border-slate-400 mb-1" />
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                            Authorized Estate Manager Stamp
                        </span>
                    </div>
                </div>

                {/* Print Bottom Footer Note */}
                <div className="hidden text-center text-[9px] text-slate-400 pt-2 mt-2 border-t border-slate-200 print:block">
                    Skyline Heights Residency • Official Computer-Generated Rent Invoice • Banani, Dhaka-1213 • Tel: +880 1711-000000
                </div>
            </div>
        </AdminLayout>
    );
}
