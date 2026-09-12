<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'nid_passport' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'emergency_contact' => ['nullable', 'string', 'max:100'],
            'occupation' => ['nullable', 'string', 'max:150'],
            'family_members' => ['required', 'integer', 'min:1', 'max:20'],
            'permanent_address' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'in:active,past'],
        ];
    }
}
