import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Printer, 
    ArrowLeft, 
    Building2, 
    CheckCircle2, 
    CreditCard, 
    Receipt, 
    Calendar,
    Phone,
    MapPin,
    FileText
} from 'lucide-react';

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
        <div className="rounded-xl border border-slate-300 bg-white p-6 sm:p-8 text-slate-800 shadow-sm print:shadow-none print:border-slate-800 print:rounded-none">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-black tracking-tight text-slate-900 leading-tight">
                            SKYLINE HEIGHTS RESIDENCY
                        </h2>
                        <p className="text-[11px] text-slate-500">
                            House 42, Road 11, Block D, Banani, Dhaka-1213 · Tel: +880 1711-000001
                        </p>
                    </div>
                </div>

                <div className="mt-3 sm:mt-0 text-left sm:text-right">
                    <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-700 border border-slate-200">
                        {copyType}
                    </span>
                    <h3 className="text-sm font-extrabold text-emerald-700 mt-1">
                        RENT MONEY RECEIPT
                    </h3>
                </div>
            </div>

            {/* Receipt Meta Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-100 text-xs">
                <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Receipt No</span>
                    <strong className="font-mono text-slate-900 font-bold">{payment.payment_no}</strong>
                </div>
                <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Payment Date</span>
                    <strong className="text-slate-900">{payment.payment_date}</strong>
                </div>
                <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Invoice Ref</span>
                    <strong className="text-slate-900">{invoice ? invoice.invoice_no : 'N/A'}</strong>
                </div>
                <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Billing Month</span>
                    <strong className="text-slate-900">{invoice ? invoice.billing_month : 'N/A'}</strong>
                </div>
            </div>

            {/* Resident & Unit Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Received From (Resident):
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{tenant ? tenant.name : 'Unknown Resident'}</p>
                    <p className="text-slate-600">Phone: {tenant ? tenant.phone : 'N/A'}</p>
                    <p className="text-slate-500 text-[11px]">NID/Passport: {tenant ? tenant.nid_passport : 'N/A'}</p>
                </div>

                <div className="space-y-1 sm:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Unit Details:
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                        Unit {flat ? flat.flat_number : 'N/A'} ({flat ? flat.floor : 'N/A'})
                    </p>
                    <p className="text-slate-600">Residential Tenancy Account</p>
                    <p className="text-slate-500 text-[11px]">Authorized Residence</p>
                </div>
            </div>

            {/* Transaction Particulars Table */}
            <div className="py-4">
                <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                        <tr>
                            <th className="p-2.5">Payment Particulars</th>
                            <th className="p-2.5">Method</th>
                            <th className="p-2.5">Txn / Ref No</th>
                            <th className="p-2.5 text-right">Amount Received</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-100">
                            <td className="p-2.5 font-medium text-slate-800">
                                Monthly Rent & Utilities Payment
                                {payment.notes && (
                                    <span className="block text-[11px] text-slate-500 font-normal italic mt-0.5">
                                        Note: {payment.notes}
                                    </span>
                                )}
                            </td>
                            <td className="p-2.5 uppercase font-semibold text-slate-700">
                                {payment.payment_method}
                            </td>
                            <td className="p-2.5 font-mono text-slate-600">
                                {payment.transaction_id || 'Cash Transaction'}
                            </td>
                            <td className="p-2.5 text-right font-bold text-emerald-700 text-sm">
                                ৳ {Number(payment.amount_paid).toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Total Highlight & Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 items-end">
                <div className="text-xs text-slate-500 space-y-1">
                    <p className="text-[11px]">
                        Received By: <strong className="text-slate-800">{payment.received_by?.name || 'Property Accounts Officer'}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 italic">
                        * This is an automated computerized money receipt generated by Skyline Heights Property Management System.
                    </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-10 text-center text-xs pt-8 sm:pt-0">
                    <div>
                        <div className="w-32 border-b border-slate-400 mb-1" />
                        <span className="text-[10px] text-slate-500">Resident Signature</span>
                    </div>
                    <div>
                        <div className="w-32 border-b border-slate-400 mb-1" />
                        <span className="text-[10px] text-slate-500">Authorized Officer</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 print:bg-white print:p-0">
            <Head title={`Receipt #${payment.payment_no} - Skyline Heights`} />

            {/* Top Toolbar (Hidden when printing) */}
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href="/admin/payments"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Payment Ledger</span>
                </Link>

                <div className="flex items-center gap-2.5">
                    {invoice && (
                        <Link
                            href={`/admin/invoices/${invoice.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                        >
                            <FileText size={14} />
                            <span>View Linked Invoice</span>
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow cursor-pointer"
                    >
                        <Printer size={14} />
                        <span>Print Money Receipt</span>
                    </button>
                </div>
            </div>

            {/* Slips Container */}
            <div className="max-w-4xl mx-auto space-y-8">
                {/* 1. Tenant Copy */}
                {renderSlip('TENANT COPY')}

                {/* Perforation Line for Print */}
                <div className="border-t-2 border-dashed border-slate-300 relative text-center print:my-6">
                    <span className="bg-slate-100 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative -top-2.5 print:bg-white">
                        ✂ Tear Along Perforation · Office Record Below
                    </span>
                </div>

                {/* 2. Management / Office Copy */}
                {renderSlip('OFFICE COPY')}
            </div>
        </div>
    );
}
