<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreRentInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lease_id' => ['required', 'exists:leases,id'],
            'billing_month' => ['required', 'string', 'regex:/^\d{4}-\d{2}$/'],
            'rent_amount' => ['required', 'numeric', 'min:0'],
            'water_bill' => ['nullable', 'numeric', 'min:0'],
            'service_charge' => ['nullable', 'numeric', 'min:0'],
            'gas_bill' => ['nullable', 'numeric', 'min:0'],
            'gas_type' => ['nullable', 'string', 'in:prepaid,billed'],
            'electricity_bill' => ['nullable', 'numeric', 'min:0'],
            'electricity_type' => ['nullable', 'string', 'in:prepaid,billed'],
            'utility_charges' => ['nullable', 'numeric', 'min:0'],
            'other_charges' => ['nullable', 'numeric', 'min:0'],
            'other_charges_description' => ['nullable', 'string', 'max:255'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'advance_adjustment' => ['nullable', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
