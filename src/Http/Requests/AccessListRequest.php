<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccessListRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $id = $this->input('access_list_id') ?? $this->input('id');
        $AccessList = config('laravel-access-list.AccessList');

        return [
            'name' => [
                'required',
                'min:3',
                'max:255',
                'unique:' . $AccessList . ',name,' . ($id ?: 'NULL'),
            ],
            'description' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }
}
