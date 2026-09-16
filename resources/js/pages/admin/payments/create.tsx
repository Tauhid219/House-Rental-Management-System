import AdminCard from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, CreditCard, Save, Zap } from 'lucide-react';
import React from 'react';

interface DueInvoice {
    id: number;
    invoice_no: string;
    billing_month: string;
    total_payable: number | string;
    paid_amount: number | string;
    due_amount: number;
    status: string;
    tenant?: {
        name: string;
        phone: string;
    };
    lease?: {
        flat?: {
            flat_number: string;
            floor: string;
        };
    };
}

interface CreatePaymentProps {
    dueInvoices: DueInvoice[];
    preselectedInvoiceId?: number | null;
    today: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payments', href: '/admin/payments' },
    { title: 'Record Collection', href: '/admin/payments/create' },
];

export default function PaymentCreate({ dueInvoices, preselectedInvoiceId, today }: CreatePaymentProps) {
    const defaultInvoice =
        preselectedInvoiceId && dueInvoices.some((i) => i.id === preselectedInvoiceId)
            ? dueInvoices.find((i) => i.id === preselectedInvoiceId)!
            : dueInvoices.length > 0
              ? dueInvoices[0]
              : null;

    const { data, setData, post, processing, errors } = useForm({
        invoice_id: defaultInvoice ? defaultInvoice.id : '',
        amount_paid: defaultInvoice ? defaultInvoice.due_amount : 0,
        payment_method: 'cash',
        transaction_id: '',
        payment_date: today,
        notes: '',
    });

    const handleInvoiceChange = (invoiceId: number) => {
        const inv = dueInvoices.find((i) => i.id === invoiceId);
        setData((prev) => ({
            ...prev,
            invoice_id: invoiceId,
            amount_paid: inv ? inv.due_amount : prev.amount_paid,
        }));
    };

    const selectedInvoice = dueInvoices.find((i) => i.id === Number(data.invoice_id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/payments');
    };

    return (
        <AdminLayout title="Record Rent Payment Collection • Skyline Heights" breadcrumbs={breadcrumbs}>
            <div className="max-w-3xl">
                {dueInvoices.length === 0 ? (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <CheckCircle size={18} className="text-emerald-600" />
                            <span>All Invoices Fully Paid!</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed">
                            There are currently no outstanding unpaid or partially paid rent invoices in the system. Great job on collections!
                        </p>
                        <div className="mt-4 flex gap-3">
                            <Link
                                href="/admin/invoices"
                                className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                                View Invoices Directory
                            </Link>
                            <Link
                                href="/admin/payments"
                                className="rounded border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50"
                            >
                                View Payment History
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <AdminCard
                            title={
                                <div className="flex items-center gap-2">
                                    <CreditCard size={18} className="text-emerald-600" />
                                    <span>Record Rent Collection Transaction</span>
                                </div>
                            }
                            tools={
                                <Link
                                    href="/admin/payments"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Back to Payments</span>
                                </Link>
                            }
                            variant="success"
                        >
                            <div className="space-y-5">
                                {/* Invoice Selection */}
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Select Due Invoice to Collect Against *
                                    </label>
                                    <select
                                        value={data.invoice_id}
                                        onChange={(e) => handleInvoiceChange(Number(e.target.value))}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        required
                                    >
                                        {dueInvoices.map((inv) => (
                                            <option key={inv.id} value={inv.id}>
                                                {inv.invoice_no} ({inv.billing_month}) - {inv.tenant?.name} [Flat {inv.lease?.flat?.flat_number}] —
                                                Due: ৳{inv.due_amount.toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.invoice_id && <p className="mt-1 text-[11px] text-rose-600">{errors.invoice_id}</p>}
                                </div>

                                {/* Selected Invoice Overview Banner */}
                                {selectedInvoice && (
                                    <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                                        <div className="grid grid-cols-2 gap-3 text-slate-700 sm:grid-cols-4 dark:text-slate-300">
                                            <div>
                                                <span className="block text-[10px] text-slate-400 uppercase">Resident</span>
                                                <strong>{selectedInvoice.tenant?.name}</strong>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400 uppercase">Flat Unit</span>
                                                <strong>Flat {selectedInvoice.lease?.flat?.flat_number}</strong>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400 uppercase">Total Invoiced</span>
                                                <span>৳{Number(selectedInvoice.total_payable).toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-bold text-rose-500 uppercase">Outstanding Due</span>
                                                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                                                    ৳{selectedInvoice.due_amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Row 2: Amount & Date */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Collection Amount (৳ BDT) *
                                        </label>
                                        <div className="flex">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">৳</span>
                                                <input
                                                    type="number"
                                                    min="0.01"
                                                    step="any"
                                                    placeholder="0.00"
                                                    value={data.amount_paid === 0 ? '' : data.amount_paid}
                                                    onChange={(e) => setData('amount_paid', e.target.value === '' ? ('' as any) : Number(e.target.value))}
                                                    className={`w-full ${selectedInvoice ? 'rounded-l border-r-0' : 'rounded'} border border-slate-300 bg-white py-2 pl-7 pr-3 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white`}
                                                    required
                                                />
                                            </div>
                                            {selectedInvoice && (
                                                <button
                                                    type="button"
                                                    onClick={() => setData('amount_paid', selectedInvoice.due_amount)}
                                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-r bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 active:scale-95 whitespace-nowrap"
                                                    title={`Click to fill full due amount: ৳${selectedInvoice.due_amount.toLocaleString()}`}
                                                >
                                                    <Zap size={13} className="fill-current text-emerald-200" />
                                                    <span>Pay Full Due (৳{selectedInvoice.due_amount.toLocaleString()})</span>
                                                </button>
                                            )}
                                        </div>
                                        {errors.amount_paid && <p className="mt-1 text-[11px] text-rose-600">{errors.amount_paid}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Collection / Received Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.payment_date}
                                            onChange={(e) => setData('payment_date', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            required
                                        />
                                        {errors.payment_date && <p className="mt-1 text-[11px] text-rose-600">{errors.payment_date}</p>}
                                    </div>
                                </div>

                                {/* Row 3: Method & Transaction ID */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Payment Method *
                                        </label>
                                        <select
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        >
                                            <option value="cash">Cash (Office Cashier)</option>
                                            <option value="bank">Bank Wire / Deposit Slip</option>
                                            <option value="bkash">bKash Merchant Pay</option>
                                            <option value="nagad">Nagad Pay</option>
                                            <option value="other">Other / Cheque</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Transaction ID / Bank Reference #
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 9J4K28192 or Bank Slip #..."
                                            value={data.transaction_id}
                                            onChange={(e) => setData('transaction_id', e.target.value)}
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Receipt Notes / Remarks
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Additional collection remarks (e.g. Received via caretaker Arif, cash counted and verified)..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                                <Link
                                    href="/admin/payments"
                                    className="rounded border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    <Save size={15} />
                                    <span>{processing ? 'Recording Payment...' : 'Record Payment Receipt'}</span>
                                </button>
                            </div>
                        </AdminCard>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
