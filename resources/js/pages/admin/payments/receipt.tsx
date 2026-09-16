import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, FileText, Printer } from 'lucide-react';

interface Tenant {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    nid_passport: string;
}

interface Flat {
    id: number;
    flat_number: string;
    floor: string;
}

interface Lease {
    id: number;
    flat: Flat;
}

interface RentInvoice {
    id: number;
    invoice_no: string;
    billing_month: string;
    total_payable: string | number;
    paid_amount: string | number;
    tenant: Tenant;
}

interface Payment {
    id: number;
    payment_no: string;
    invoice_id: number | null;
    amount_paid: string | number;
    payment_method: 'cash' | 'bank' | 'bkash' | 'nagad' | 'other';
    transaction_id: string | null;
    payment_date: string;
    notes: string | null;
    invoice: RentInvoice | null;
    lease: Lease | null;
    received_by: { id: number; name: string } | null;
}

interface Props {
    payment: Payment;
}

export default function PaymentReceipt({ payment }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const tenant = payment.invoice?.tenant;
    const flat = payment.lease?.flat;
    const invoice = payment.invoice;

    const renderSlip = (copyType: 'TENANT COPY' | 'OFFICE COPY') => (
        <div className="receipt-slip rounded-xl border border-slate-300 bg-white p-6 text-slate-800 shadow-sm sm:p-7 print:rounded-md print:border-slate-400 print:shadow-none">
            {/* Header */}
            <div className="flex flex-col items-start justify-between border-b border-slate-200 pb-3.5 sm:flex-row sm:items-center print:flex-row print:items-center print:pb-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white shadow-sm print:h-9 print:w-9">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-black tracking-tight text-slate-900 leading-tight print:text-sm">
                            SKYLINE HEIGHTS RESIDENCY
                        </h2>
                        <p className="text-xs text-slate-500 print:text-[11px]">
                            House 42, Road 11, Block D, Banani, Dhaka-1213 · Tel: +880 1711-000001
                        </p>
                    </div>
                </div>

                <div className="mt-3 text-left sm:mt-0 sm:text-right print:mt-0 print:text-right">
                    <span className="inline-block rounded border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest text-slate-700 uppercase print:bg-slate-50">
                        {copyType}
                    </span>
                    <h3 className="mt-1 text-sm font-extrabold text-emerald-700">RENT MONEY RECEIPT</h3>
                </div>
            </div>

            {/* Receipt Meta Details */}
            <div className="grid grid-cols-2 gap-3 border-b border-slate-100 py-3 text-xs sm:grid-cols-4 print:grid-cols-4 print:py-2.5">
                <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Receipt No</span>
                    <strong className="font-mono text-xs font-bold text-slate-900 sm:text-sm print:text-xs">{payment.payment_no}</strong>
                </div>
                <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Payment Date</span>
                    <strong className="text-xs font-bold text-slate-900 sm:text-sm print:text-xs">{payment.payment_date}</strong>
                </div>
                <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Invoice Ref</span>
                    <strong className="text-xs font-bold text-slate-900 sm:text-sm print:text-xs">{invoice ? invoice.invoice_no : 'N/A'}</strong>
                </div>
                <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Billing Month</span>
                    <strong className="text-xs font-bold text-slate-900 sm:text-sm print:text-xs">{invoice ? invoice.billing_month : 'N/A'}</strong>
                </div>
            </div>

            {/* Resident & Unit Information */}
            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 py-3 text-xs sm:grid-cols-2 print:grid-cols-2 print:py-2.5">
                <div className="space-y-1">
                    <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Received From (Resident):</span>
                    <p className="text-sm font-bold text-slate-900 print:text-xs">{tenant ? tenant.name : 'Unknown Resident'}</p>
                    <p className="text-slate-600">Phone: {tenant ? tenant.phone : 'N/A'}</p>
                    <p className="text-[11px] text-slate-500">NID / Passport: {tenant ? tenant.nid_passport : 'N/A'}</p>
                </div>

                <div className="space-y-1 sm:text-right print:text-right">
                    <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Unit Details:</span>
                    <p className="text-sm font-bold text-slate-900 print:text-xs">
                        Unit {flat ? flat.flat_number : 'N/A'} ({flat ? flat.floor : 'N/A'})
                    </p>
                    <p className="text-slate-600">Residential Tenancy Account</p>
                    <p className="text-[11px] text-slate-500">Authorized Residence</p>
                </div>
            </div>

            {/* Transaction Particulars Table */}
            <div className="py-3 print:py-2.5">
                <table className="w-full border border-slate-200 text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600 uppercase">
                        <tr>
                            <th className="px-3 py-2 print:px-2.5 print:py-1.5">Payment Particulars</th>
                            <th className="px-3 py-2 print:px-2.5 print:py-1.5">Method</th>
                            <th className="px-3 py-2 print:px-2.5 print:py-1.5">Txn / Ref No</th>
                            <th className="px-3 py-2 text-right print:px-2.5 print:py-1.5">Amount Received</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-100">
                            <td className="px-3 py-2.5 font-medium text-slate-800 print:px-2.5 print:py-1.5">
                                <span>Monthly Rent & Utilities Payment</span>
                                {payment.notes && (
                                    <span className="mt-0.5 block text-[11px] font-normal text-slate-500 italic">
                                        Note: {payment.notes}
                                    </span>
                                )}
                            </td>
                            <td className="px-3 py-2.5 font-semibold text-slate-700 uppercase print:px-2.5 print:py-1.5">
                                {payment.payment_method}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-xs text-slate-600 print:px-2.5 print:py-1.5">
                                {payment.transaction_id || 'Cash Transaction'}
                            </td>
                            <td className="px-3 py-2.5 text-right text-sm font-extrabold text-emerald-700 print:px-2.5 print:py-1.5 print:text-xs">
                                ৳ {Number(payment.amount_paid).toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Total Highlight & Signatures */}
            <div className="grid grid-cols-1 items-end gap-4 pt-3 sm:grid-cols-2 print:grid-cols-2 print:pt-2">
                <div className="space-y-1 text-xs text-slate-500">
                    <p className="text-[11px]">
                        Received By: <strong className="text-slate-800">{payment.received_by?.name || 'Property Accounts Officer'}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 italic">
                        * Computerized money receipt generated by Skyline Heights Property Management System.
                    </p>
                </div>

                <div className="flex items-center justify-between gap-8 pt-4 text-center text-xs sm:justify-end sm:pt-0 print:pt-0">
                    <div>
                        <div className="mb-1.5 w-32 border-b border-slate-400 print:w-28" />
                        <span className="text-[10px] font-medium text-slate-600">Resident Signature</span>
                    </div>
                    <div>
                        <div className="mb-1.5 w-32 border-b border-slate-400 print:w-28" />
                        <span className="text-[10px] font-medium text-slate-600">Authorized Officer</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 print:min-h-0 print:bg-white print:p-0">
            <Head title={`Receipt #${payment.payment_no} - Skyline Heights`} />

            {/* Print Styles: Spacious, dignified, and guaranteed to fit on 1 single A4 sheet */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        @page {
                            size: A4 portrait;
                            margin: 7mm 9mm;
                        }
                        html, body {
                            background: #ffffff !important;
                            color: #0f172a !important;
                            font-size: 11.5px !important;
                            line-height: 1.3 !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .receipt-container {
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        .receipt-slip {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                            border: 1px solid #cbd5e1 !important;
                            border-radius: 6px !important;
                            padding: 14px 18px !important;
                            margin: 0 !important;
                            box-shadow: none !important;
                        }
                        .perforation-divider {
                            margin: 10px 0 !important;
                            padding: 0 !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        tr, td, th {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                    }
                `,
                }}
            />

            {/* Top Toolbar (Hidden when printing) */}
            <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between print:hidden">
                <Link
                    href="/admin/payments"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Payment Ledger</span>
                </Link>

                <div className="flex items-center gap-2.5">
                    {invoice && (
                        <Link
                            href={`/admin/invoices/${invoice.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                        >
                            <FileText size={14} />
                            <span>View Linked Invoice</span>
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition-colors hover:bg-emerald-700"
                    >
                        <Printer size={14} />
                        <span>Print Money Receipt</span>
                    </button>
                </div>
            </div>

            {/* Slips Container */}
            <div className="receipt-container mx-auto max-w-4xl space-y-6 print:space-y-0">
                {/* 1. Tenant Copy */}
                {renderSlip('TENANT COPY')}

                {/* Perforation Line for Print */}
                <div className="perforation-divider relative my-5 border-t-2 border-dashed border-slate-300 text-center print:my-2.5">
                    <span className="relative -top-2.5 bg-slate-100 px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase print:bg-white print:text-slate-400">
                        ✂ Tear Along Perforation · Office Record Below
                    </span>
                </div>

                {/* 2. Management / Office Copy */}
                {renderSlip('OFFICE COPY')}
            </div>
        </div>
    );
}
