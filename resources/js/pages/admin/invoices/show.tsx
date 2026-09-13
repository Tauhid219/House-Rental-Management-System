import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Printer, ShieldCheck } from 'lucide-react';

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
            <div className="mx-auto max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:border-none print:shadow-none">
                {/* Header Row */}
                <div className="flex flex-col items-start justify-between border-b border-slate-200 pb-6 sm:flex-row sm:items-center dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded bg-blue-600 text-xl font-black text-white">S</div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase dark:text-white">Skyline Heights Residency</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Luxury Residential Living & Property Administration</p>
                        </div>
                    </div>

                    <div className="mt-3 text-left sm:mt-0 sm:text-right">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Issue Date: {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                        <span
                            className={`mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold tracking-wider uppercase ${
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
                <div className="grid grid-cols-1 gap-6 border-b border-slate-200 py-6 text-xs sm:grid-cols-3 dark:border-slate-800">
                    {/* From */}
                    <div>
                        <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase">Billed From:</span>
                        <address className="space-y-1 text-slate-700 not-italic dark:text-slate-300">
                            <strong className="block font-bold text-slate-900 dark:text-white">Skyline Heights Building Office</strong>
                            <div>Plot 45, Road 11, Block D, Banani</div>
                            <div>Dhaka-1213, Bangladesh</div>
                            <div>Phone: +880 1711-000000</div>
                            <div>Email: billing@skylineheights.com</div>
                        </address>
                    </div>

                    {/* To */}
                    <div>
                        <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase">Billed To (Resident):</span>
                        <address className="space-y-1 text-slate-700 not-italic dark:text-slate-300">
                            <strong className="block font-bold text-slate-900 dark:text-white">{invoice.tenant?.name || 'Resident'}</strong>
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
                        <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase">Invoice Details:</span>
                        <div>
                            <b>Invoice #:</b> <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{invoice.invoice_no}</span>
                        </div>
                        <div>
                            <b>Billing Month:</b> {invoice.billing_month}
                        </div>
                        <div>
                            <b>Payment Due Date:</b>{' '}
                            <span className="font-semibold text-rose-600 dark:text-rose-400">{invoice.due_date || 'Within 10th of Month'}</span>
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="border-b border-slate-200 py-6 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/60">
                            <tr>
                                <th className="px-4 py-2.5">Item #</th>
                                <th className="px-4 py-2.5">Description</th>
                                <th className="px-4 py-2.5">Period / Unit</th>
                                <th className="px-4 py-2.5 text-right">Subtotal (BDT)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                            <tr>
                                <td className="px-4 py-3 font-mono">1</td>
                                <td className="px-4 py-3">
                                    <span className="block font-bold text-slate-900 dark:text-white">Residential Apartment Rent</span>
                                    <span className="text-[11px] text-slate-500">
                                        Flat {invoice.lease?.flat?.flat_number} ({invoice.lease?.flat?.bedrooms} BHK, {invoice.lease?.flat?.size_sqft}{' '}
                                        sqft)
                                    </span>
                                </td>
                                <td className="px-4 py-3">{invoice.billing_month}</td>
                                <td className="px-4 py-3 text-right font-semibold">৳{Number(invoice.rent_amount).toLocaleString()}</td>
                            </tr>

                            {Number(invoice.utility_charges) > 0 && (
                                <tr>
                                    <td className="px-4 py-3 font-mono">2</td>
                                    <td className="px-4 py-3">
                                        <span className="block font-bold text-slate-900 dark:text-white">Utility Services & Power Backup</span>
                                        <span className="text-[11px] text-slate-500">Gas, Water, Standby Generator, Lift Maintenance</span>
                                    </td>
                                    <td className="px-4 py-3">{invoice.billing_month}</td>
                                    <td className="px-4 py-3 text-right font-semibold">৳{Number(invoice.utility_charges).toLocaleString()}</td>
                                </tr>
                            )}

                            {Number(invoice.other_charges) > 0 && (
                                <tr>
                                    <td className="px-4 py-3 font-mono">3</td>
                                    <td className="px-4 py-3">
                                        <span className="block font-bold text-slate-900 dark:text-white">Additional Facility Charges</span>
                                        <span className="text-[11px] text-slate-500">Security & Rooftop Facility Charges</span>
                                    </td>
                                    <td className="px-4 py-3">{invoice.billing_month}</td>
                                    <td className="px-4 py-3 text-right font-semibold">৳{Number(invoice.other_charges).toLocaleString()}</td>
                                </tr>
                            )}

                            {Number(invoice.discount) > 0 && (
                                <tr className="text-emerald-600 dark:text-emerald-400">
                                    <td className="px-4 py-3 font-mono">4</td>
                                    <td className="px-4 py-3 font-semibold">Approved Discount / Special Waiver</td>
                                    <td className="px-4 py-3">{invoice.billing_month}</td>
                                    <td className="px-4 py-3 text-right font-bold">- ৳{Number(invoice.discount).toLocaleString()}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Calculation & Payment Terms Row */}
                <div className="grid grid-cols-1 gap-6 pt-6 text-xs sm:grid-cols-2">
                    {/* Payment methods & Terms */}
                    <div className="space-y-2 text-slate-600 dark:text-slate-400">
                        <p className="font-bold tracking-wide text-slate-800 uppercase dark:text-slate-200">Payment Methods Accepted:</p>
                        <div className="space-y-1 rounded bg-slate-50 p-3 text-[11px] dark:bg-slate-800/40">
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
                        <p className="text-[11px] text-slate-400 italic">
                            * Please ensure payment is completed on or before the 10th of every month to avoid late fees.
                        </p>
                    </div>

                    {/* Financial Totals */}
                    <div className="space-y-2">
                        <div className="flex justify-between border-b border-slate-100 py-1 dark:border-slate-800">
                            <span className="text-slate-500">Total Invoiced Amount:</span>
                            <span className="font-bold text-slate-900 dark:text-white">৳{Number(invoice.total_payable).toLocaleString()} BDT</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 py-1 text-emerald-600 dark:border-slate-800 dark:text-emerald-400">
                            <span>Total Paid To Date:</span>
                            <span className="font-bold">৳{Number(invoice.paid_amount).toLocaleString()} BDT</span>
                        </div>
                        <div className="flex justify-between border-t-2 border-slate-300 py-2 text-base font-extrabold text-slate-900 dark:border-slate-700 dark:text-white">
                            <span>Balance Due:</span>
                            <span className={invoice.due_amount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                ৳{Number(invoice.due_amount).toLocaleString()} BDT
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Receipts Section (If payments recorded) */}
                {invoice.payments && invoice.payments.length > 0 && (
                    <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
                        <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-900 uppercase dark:text-white">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            <span>Payment Receipts Recorded Against This Invoice</span>
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/60">
                                    <tr>
                                        <th className="px-3 py-2">Receipt No</th>
                                        <th className="px-3 py-2">Date</th>
                                        <th className="px-3 py-2">Payment Method</th>
                                        <th className="px-3 py-2">Trx ID / Ref</th>
                                        <th className="px-3 py-2">Received By</th>
                                        <th className="px-3 py-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {invoice.payments.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-3 py-2 font-mono font-bold text-blue-600">{p.payment_no}</td>
                                            <td className="px-3 py-2">{p.payment_date}</td>
                                            <td className="px-3 py-2 text-[11px] font-medium uppercase">{p.payment_method}</td>
                                            <td className="px-3 py-2 font-mono text-[11px]">{p.transaction_id || 'N/A'}</td>
                                            <td className="px-3 py-2">{p.received_by?.name || 'Staff'}</td>
                                            <td className="px-3 py-2 text-right font-bold text-emerald-600">
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
