<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => ['required', 'exists:rent_invoices,id'],
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'in:cash,bank,bkash,nagad,other'],
            'transaction_id' => ['nullable', 'string', 'max:100'],
            'payment_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
