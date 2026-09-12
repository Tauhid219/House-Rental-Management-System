<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tenant_id' => ['required', 'exists:tenants,id'],
            'flat_id' => ['required', 'exists:flats,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'agreed_monthly_rent' => ['required', 'numeric', 'min:0'],
            'security_deposit' => ['required', 'numeric', 'min:0'],
            'advance_paid' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:active,closed'],
        ];
    }
}
