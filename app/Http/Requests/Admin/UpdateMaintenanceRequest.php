<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMaintenanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'flat_id' => ['required', 'exists:flats,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'cost' => ['required', 'numeric', 'min:0'],
            'reported_date' => ['required', 'date'],
            'completed_date' => ['nullable', 'date', 'after_or_equal:reported_date'],
            'status' => ['required', 'in:pending,in_progress,completed'],
        ];
    }
}
