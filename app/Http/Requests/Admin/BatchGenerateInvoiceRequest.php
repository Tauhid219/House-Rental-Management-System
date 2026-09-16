<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class BatchGenerateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'billing_month' => ['required', 'string', 'regex:/^\d{4}-\d{2}$/'],
            'due_date' => ['required', 'date'],
            'use_lease_defaults' => ['nullable', 'boolean'],
            'service_charge' => ['nullable', 'numeric', 'min:0'],
            'utility_charges' => ['nullable', 'numeric', 'min:0'],
            'other_charges' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
