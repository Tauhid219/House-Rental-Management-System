import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import { useState } from 'react';

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
        water_bill?: number | string;
        service_charge?: number | string;
        gas_bill?: number | string;
        gas_type?: string;
        electricity_bill?: number | string;
        electricity_type?: string;
        utility_charges: number | string;
        other_charges: number | string;
        other_charges_description?: string | null;
        advance_adjustment?: number | string;
        discount: number | string;
        total_payable: number | string;
        paid_amount: number | string;
        due_amount: number;
        due_date?: string;
        status: 'unpaid' | 'partially_paid' | 'paid';
        total_in_words?: string;
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
            start_date?: string;
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
    const [viewMode, setViewMode] = useState<'dual_slip' | 'formal_invoice'>('dual_slip');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Invoices', href: '/admin/invoices' },
        { title: invoice.invoice_no, href: `/admin/invoices/${invoice.id}` },
    ];

    const handlePrint = () => {
        window.print();
    };

    const formattedDate = new Date(invoice.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
    });

    const rentAmount = Number(invoice.rent_amount || 0);
    const waterBill = Number(invoice.water_bill ?? (Number(invoice.utility_charges) > 3500 ? Number(invoice.utility_charges) - 3500 : 0));
    const serviceCharge = Number(invoice.service_charge ?? (Number(invoice.utility_charges) >= 3500 ? 3500 : 0));
    const gasBill = Number(invoice.gas_bill || 0);
    const gasType = invoice.gas_type || 'prepaid';
    const electricityBill = Number(invoice.electricity_bill || 0);
    const electricityType = invoice.electricity_type || 'prepaid';
    const otherCharges = Number(invoice.other_charges || 0);
    const advanceAdjustment = Number(invoice.advance_adjustment || 0);
    const discount = Number(invoice.discount || 0);
    const totalPayable = Number(invoice.total_payable);

    // Render single slip component for Client Bill Slip
    const renderBillSlip = (copyType: 'TENANT COPY' | 'OFFICE COPY') => (
        <div className="flex-1 border border-slate-300 bg-white p-3.5 font-sans text-[12px] leading-snug text-black select-none sm:p-5 print:border-black">
            {/* Slip Header */}
            <div className="border-b border-black pb-2 text-center">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase print:text-black">
                    <span>{copyType}</span>
                    <span className="font-mono">Bill #{invoice.invoice_no.replace('BILL-202609-', '')}</span>
                </div>
                <h3 className="mt-1 text-base font-black tracking-wide text-black uppercase">HOUSE RENT BILL</h3>
                <p className="text-[11px] leading-tight font-bold text-slate-800 print:text-black">PLOT NO.54, ROAD NO. 10, SECTOR NO. 10</p>
                <p className="text-[10px] leading-tight font-semibold text-slate-700 print:text-black">UTTARA, MODEL TOWN, DHAKA-1230</p>
            </div>

            {/* Metadata Info Row */}
            <div className="space-y-1 border-b border-black py-2.5 text-[11px]">
                <div className="flex justify-between">
                    <div>
                        <span className="font-bold">Serial No: </span>
                        <span className="font-mono font-bold">{invoice.id}</span>
                    </div>
                    <div>
                        <span className="font-bold">Dated: </span>
                        <span>{formattedDate}</span>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div>
                        <span className="font-bold">Flat No: </span>
                        <span className="font-mono text-[12px] font-bold">{invoice.lease?.flat?.flat_number || 'N/A'}</span>
                    </div>
                    <div className="text-right">
                        <span className="font-bold uppercase">{invoice.tenant?.name || 'RESIDENT'}</span>
                    </div>
                </div>

                <div className="flex justify-between text-[10.5px]">
                    <div>
                        <span className="font-bold">Billing Month: </span>
                        <span>{invoice.billing_month}</span>
                    </div>
                    <div>
                        <span className="font-bold">Date of Occupation: </span>
                        <span>{invoice.lease?.start_date || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Financial Line Items Table */}
            <div className="py-2">
                <table className="w-full border-collapse text-left text-[11.5px]">
                    <thead>
                        <tr className="border-b border-black text-[11px] font-bold">
                            <th className="py-1">Items Description</th>
                            <th className="py-1 text-center">Status</th>
                            <th className="py-1 text-right">Total Amount (৳)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 print:divide-black">
                        <tr>
                            <td className="py-1">Apartment Rent</td>
                            <td className="py-1 text-center text-slate-400">—</td>
                            <td className="py-1 text-right font-mono font-bold">৳{rentAmount.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="py-1">GAS Bill</td>
                            <td className="py-1 text-center text-[10px] font-semibold">{gasType === 'prepaid' ? 'Prepaid' : 'Billed'}</td>
                            <td className="py-1 text-right font-mono font-bold">{gasBill > 0 ? `৳${gasBill.toLocaleString()}` : '-'}</td>
                        </tr>
                        <tr>
                            <td className="py-1">Electric Bill</td>
                            <td className="py-1 text-center text-[10px] font-semibold">{electricityType === 'prepaid' ? 'Prepaid' : 'Billed'}</td>
                            <td className="py-1 text-right font-mono font-bold">
                                {electricityBill > 0 ? `৳${electricityBill.toLocaleString()}` : '-'}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-1">Water Bill</td>
                            <td className="py-1 text-center text-slate-400">—</td>
                            <td className="py-1 text-right font-mono font-bold">{waterBill > 0 ? `৳${waterBill.toLocaleString()}` : '-'}</td>
                        </tr>
                        <tr>
                            <td className="py-1">Service Charge</td>
                            <td className="py-1 text-center text-slate-400">—</td>
                            <td className="py-1 text-right font-mono font-bold">৳{serviceCharge.toLocaleString()}</td>
                        </tr>
                        {otherCharges > 0 && (
                            <tr>
                                <td className="py-1">{invoice.other_charges_description || 'Other Charges / Shop Rent'}</td>
                                <td className="py-1 text-center text-slate-400">—</td>
                                <td className="py-1 text-right font-mono font-bold">৳{otherCharges.toLocaleString()}</td>
                            </tr>
                        )}
                        {advanceAdjustment > 0 && (
                            <tr className="text-rose-600 print:text-black">
                                <td className="py-1 font-semibold">Advance Deduction</td>
                                <td className="py-1 text-center text-[10px]">Less</td>
                                <td className="py-1 text-right font-mono font-bold">- ৳{advanceAdjustment.toLocaleString()}</td>
                            </tr>
                        )}
                        {discount > 0 && (
                            <tr className="text-emerald-600 print:text-black">
                                <td className="py-1 font-semibold">Approved Waiver</td>
                                <td className="py-1 text-center text-[10px]">Waiver</td>
                                <td className="py-1 text-right font-mono font-bold">- ৳{discount.toLocaleString()}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Total Payable Box */}
            <div className="space-y-1 border-t-2 border-black py-2">
                <div className="flex justify-between text-[12px] font-black">
                    <span>Total Rent Payable:</span>
                    <span className="font-mono">৳{totalPayable.toLocaleString()} BDT</span>
                </div>
                {Number(invoice.paid_amount) > 0 && (
                    <div className="flex justify-between text-[11px] font-bold text-emerald-700 print:text-black">
                        <span>Amount Paid:</span>
                        <span className="font-mono">৳{Number(invoice.paid_amount).toLocaleString()} BDT</span>
                    </div>
                )}
                {Number(invoice.due_amount) > 0 && (
                    <div className="flex justify-between text-[11.5px] font-black text-rose-700 print:text-black">
                        <span>Net Outstanding Due:</span>
                        <span className="font-mono">৳{Number(invoice.due_amount).toLocaleString()} BDT</span>
                    </div>
                )}
                <div className="pt-1 text-[10px] text-slate-600 italic print:text-black">
                    <strong>In Words: </strong>
                    {invoice.total_in_words || 'N/A'}
                </div>
            </div>

            {/* Policy & Signature Line */}
            <div className="flex items-end justify-between border-t border-black pt-3 text-[10px]">
                <div className="max-w-[65%] space-y-0.5">
                    <p className="text-[9.5px] font-bold uppercase">Policy Note:</p>
                    <p className="leading-tight text-slate-700 print:text-black">Requested to pay bill by 7th of each month.</p>
                </div>
                <div className="text-center">
                    <div className="mb-1 w-24 border-b border-black"></div>
                    <span className="text-[9px] font-bold tracking-wider uppercase">Manager / Landlord</span>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout title={`Bill #${invoice.invoice_no}`} breadcrumbs={breadcrumbs}>
            <Head title={`Invoice #${invoice.invoice_no} • Skyline Heights`} />

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        @page {
                            size: A4 landscape;
                            margin: 8mm;
                        }
                        body {
                            background: white !important;
                            color: black !important;
                        }
                        .print\\:hidden {
                            display: none !important;
                        }
                        .print-area {
                            width: 100% !important;
                            box-shadow: none !important;
                            border: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                    }
                `,
                }}
            />

            {/* Action Bar (Hidden in Print) */}
            <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
                <Link
                    href="/admin/invoices"
                    className="inline-flex items-center gap-1.5 self-start rounded border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Invoices</span>
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                    {/* View Switcher Toggle */}
                    <div className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-100 p-0.5 sm:w-auto dark:border-slate-700 dark:bg-slate-800">
                        <button
                            type="button"
                            onClick={() => setViewMode('dual_slip')}
                            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition sm:flex-none sm:px-3 ${
                                viewMode === 'dual_slip'
                                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            <FileSpreadsheet size={14} />
                            <span>
                                Dual Slip <span className="hidden sm:inline">(Excel Format)</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('formal_invoice')}
                            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition sm:flex-none sm:px-3 ${
                                viewMode === 'formal_invoice'
                                    ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            <FileText size={14} />
                            <span>Formal Invoice</span>
                        </button>
                    </div>

                    {invoice.status !== 'paid' && (
                        <Link
                            href={`/admin/payments/create?invoice_id=${invoice.id}`}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:flex-none"
                        >
                            <CreditCard size={15} />
                            <span>Record Payment</span>
                        </Link>
                    )}

                    <button
                        onClick={handlePrint}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 sm:flex-none"
                    >
                        <Printer size={15} />
                        <span>Print / Save PDF</span>
                    </button>
                </div>
            </div>

            {/* View Mode 1: Client Rent Bill Slip (Exact Replica of Client's Excel Sheet with Side-by-Side Dual Copies) */}
            {viewMode === 'dual_slip' ? (
                <div className="print-area mx-auto max-w-5xl rounded-lg border border-slate-200 bg-slate-100 p-3 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-950 print:border-none print:bg-white print:p-0">
                    <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 print:hidden">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">• Client Format: Dual Slip (Tenant Copy + Office Copy)</span>
                        <span className="hidden text-[11px] sm:inline">Ready for printing / PDF</span>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row print:flex-row print:gap-3">
                        {renderBillSlip('TENANT COPY')}

                        {/* Dashed Cut Line */}
                        <div className="hidden flex-col items-center justify-center px-1 text-slate-400 md:flex print:flex">
                            <div className="h-full border-r-2 border-dashed border-slate-300 print:border-black"></div>
                            <span className="my-2 rotate-90 font-mono text-[9px] tracking-widest text-slate-400 uppercase print:text-black">
                                ✂ CUT HERE
                            </span>
                            <div className="h-full border-r-2 border-dashed border-slate-300 print:border-black"></div>
                        </div>

                        {renderBillSlip('OFFICE COPY')}
                    </div>
                </div>
            ) : (
                /* View Mode 2: Executive Full Invoice */
                <div className="print-area mx-auto max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900 print:w-full print:max-w-none print:overflow-visible print:border-none print:bg-white print:p-0 print:text-slate-900 print:shadow-none">
                    {/* Header Row */}
                    <div className="flex flex-col items-start justify-between border-b border-slate-200 pb-6 sm:flex-row sm:items-center dark:border-slate-800 print:flex-row print:items-center print:border-slate-300 print:pb-2.5">
                        <div className="flex items-center gap-3 print:gap-2.5">
                            <div className="flex size-10 items-center justify-center rounded bg-blue-600 text-xl font-black text-white shadow-sm print:size-8 print:text-base">
                                S
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase dark:text-white print:text-base print:text-slate-900">
                                    HOUSE RENT BILL
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 print:text-[10px] print:text-slate-600">
                                    PLOT NO.54, ROAD NO. 10, SECTOR NO. 10, UTTARA, MODEL TOWN, DHAKA-1230
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 text-left sm:mt-0 sm:text-right print:mt-0 print:text-right">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 print:text-xs print:text-slate-900">
                                Dated: {formattedDate}
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

                    {/* 3-Column Info Row */}
                    <div className="grid grid-cols-1 gap-6 border-b border-slate-200 py-6 text-xs sm:grid-cols-3 dark:border-slate-800 print:grid-cols-3 print:gap-4 print:border-slate-300 print:py-2.5 print:text-[10.5px]">
                        <div>
                            <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase print:font-bold print:text-slate-500">
                                Property Information:
                            </span>
                            <address className="space-y-1 text-slate-700 not-italic dark:text-slate-300 print:space-y-0.5 print:text-slate-800">
                                <strong className="block font-bold text-slate-900 dark:text-white print:text-slate-900">
                                    Skyline Heights Residency
                                </strong>
                                <div>Plot No. 54, Road No. 10, Sector 10</div>
                                <div>Uttara, Model Town, Dhaka-1230</div>
                                <div>Phone: +880 1711-000000</div>
                            </address>
                        </div>

                        <div>
                            <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase print:font-bold print:text-slate-500">
                                Resident Information:
                            </span>
                            <address className="space-y-1 text-slate-700 not-italic dark:text-slate-300 print:space-y-0.5 print:text-slate-800">
                                <strong className="block font-bold text-slate-900 dark:text-white print:text-slate-900">
                                    {invoice.tenant?.name || 'Resident'}
                                </strong>
                                <div>
                                    Flat {invoice.lease?.flat?.flat_number} ({invoice.lease?.flat?.floor})
                                </div>
                                <div>Phone: {invoice.tenant?.phone}</div>
                                <div>Date of Occupation: {invoice.lease?.start_date || 'N/A'}</div>
                            </address>
                        </div>

                        <div className="space-y-1 text-slate-700 dark:text-slate-300 print:space-y-0.5 print:text-slate-800">
                            <span className="mb-1 block font-semibold tracking-wider text-slate-400 uppercase print:font-bold print:text-slate-500">
                                Invoice Details:
                            </span>
                            <div>
                                <b>Invoice #:</b>{' '}
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 print:text-slate-900">
                                    {invoice.invoice_no}
                                </span>
                            </div>
                            <div>
                                <b>Billing Month:</b> {invoice.billing_month}
                            </div>
                            <div>
                                <b>Payment Due Date:</b>{' '}
                                <span className="font-semibold text-rose-600 dark:text-rose-400 print:text-rose-700">
                                    {invoice.due_date || 'Within 7th of Month'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="border-b border-slate-200 py-6 dark:border-slate-800 print:border-slate-300 print:py-2">
                        <table className="w-full text-left text-xs print:text-[11px]">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/60 print:bg-slate-100 print:text-[10px] print:text-slate-700">
                                <tr>
                                    <th className="px-4 py-2.5 print:px-2.5 print:py-1">Item #</th>
                                    <th className="px-4 py-2.5 print:px-2.5 print:py-1">Description</th>
                                    <th className="px-4 py-2.5 text-center print:px-2.5 print:py-1">Status / Type</th>
                                    <th className="px-4 py-2.5 text-right print:px-2.5 print:py-1">Subtotal (BDT)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300 print:divide-slate-200 print:text-slate-800">
                                <tr>
                                    <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">1</td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                        <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">
                                            Monthly Apartment Rent
                                        </span>
                                        <span className="text-[11px] text-slate-500 print:text-[9.5px]">Flat {invoice.lease?.flat?.flat_number}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-400">—</td>
                                    <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">৳{rentAmount.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">2</td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                        <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">GAS Bill</span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                                        {gasType === 'prepaid' ? 'Prepaid' : 'Billed'}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">
                                        {gasBill > 0 ? `৳${gasBill.toLocaleString()}` : ' - '}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">3</td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                        <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">Electric Bill</span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                                        {electricityType === 'prepaid' ? 'Prepaid' : 'Billed'}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">
                                        {electricityBill > 0 ? `৳${electricityBill.toLocaleString()}` : ' - '}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">4</td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                        <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">Water Bill</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-400">—</td>
                                    <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">৳{waterBill.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">5</td>
                                    <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                        <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">Service Charge</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-400">—</td>
                                    <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">
                                        ৳{serviceCharge.toLocaleString()}
                                    </td>
                                </tr>
                                {otherCharges > 0 && (
                                    <tr>
                                        <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">6</td>
                                        <td className="px-4 py-3 print:px-2.5 print:py-1.5">
                                            <span className="block font-bold text-slate-900 dark:text-white print:text-slate-900">
                                                {invoice.other_charges_description || 'Other Charges / Shop Rent'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-400">—</td>
                                        <td className="px-4 py-3 text-right font-semibold print:px-2.5 print:py-1.5">
                                            ৳{otherCharges.toLocaleString()}
                                        </td>
                                    </tr>
                                )}
                                {advanceAdjustment > 0 && (
                                    <tr className="text-rose-600 dark:text-rose-400">
                                        <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">7</td>
                                        <td className="px-4 py-3 font-semibold print:px-2.5 print:py-1.5">Advance Adjustment</td>
                                        <td className="px-4 py-3 text-center text-xs">Deduction</td>
                                        <td className="px-4 py-3 text-right font-bold print:px-2.5 print:py-1.5">
                                            - ৳{advanceAdjustment.toLocaleString()}
                                        </td>
                                    </tr>
                                )}
                                {discount > 0 && (
                                    <tr className="text-emerald-600 dark:text-emerald-400">
                                        <td className="px-4 py-3 font-mono print:px-2.5 print:py-1.5">8</td>
                                        <td className="px-4 py-3 font-semibold print:px-2.5 print:py-1.5">Approved Waiver / Discount</td>
                                        <td className="px-4 py-3 text-center text-xs">Waiver</td>
                                        <td className="px-4 py-3 text-right font-bold print:px-2.5 print:py-1.5">- ৳{discount.toLocaleString()}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Calculation & In Words */}
                    <div className="grid grid-cols-1 gap-6 pt-6 text-xs sm:grid-cols-2 print:grid-cols-2 print:gap-4 print:pt-2 print:text-[10.5px]">
                        <div className="space-y-2 text-slate-600 dark:text-slate-400 print:space-y-1 print:text-slate-700">
                            <p className="font-bold tracking-wide text-slate-800 uppercase dark:text-slate-200 print:text-[10px] print:text-slate-900">
                                Payment Policy:
                            </p>
                            <p className="font-semibold text-rose-600 dark:text-rose-400">Requested to pay bill by 7th of each month.</p>
                            <div className="rounded bg-slate-50 p-3 text-[11px] dark:bg-slate-800/40 print:rounded print:border print:border-slate-200 print:p-2">
                                <div>
                                    <strong>Total In Words:</strong> <em>{invoice.total_in_words || 'N/A'}</em>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 print:space-y-0.5">
                            <div className="flex justify-between border-b border-slate-100 py-1 dark:border-slate-800 print:border-slate-200 print:py-0.5">
                                <span className="text-slate-500">Total Bill Amount:</span>
                                <span className="font-bold text-slate-900 dark:text-white">৳{totalPayable.toLocaleString()} BDT</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 py-1 text-emerald-600 dark:border-slate-800 dark:text-emerald-400 print:border-slate-200 print:py-0.5">
                                <span>Paid Amount:</span>
                                <span className="font-bold">৳{Number(invoice.paid_amount).toLocaleString()} BDT</span>
                            </div>
                            <div className="flex justify-between border-t-2 border-slate-200 pt-2 text-sm font-black text-rose-600 dark:border-slate-700 dark:text-rose-400 print:border-slate-300 print:pt-1">
                                <span>Net Outstanding Due:</span>
                                <span>৳{Number(invoice.due_amount).toLocaleString()} BDT</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
