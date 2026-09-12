<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreFlatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'flat_number' => ['required', 'string', 'max:50', 'unique:flats,flat_number'],
            'floor' => ['required', 'string', 'max:50'],
            'size_sqft' => ['required', 'integer', 'min:100', 'max:20000'],
            'bedrooms' => ['required', 'integer', 'min:1', 'max:10'],
            'bathrooms' => ['required', 'integer', 'min:1', 'max:10'],
            'balconies' => ['nullable', 'integer', 'min:0', 'max:10'],
            'rent_cost' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:vacant,occupied,maintenance'],
            'description' => ['nullable', 'string', 'max:3000'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string'],
        ];
    }
}
