<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
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
        $id = $this->input('role_id') ?? $this->input('id');
        $Role = config('laravel-access-list.Role');

        return [
            'name' => [
                'required',
                'min:3',
                'max:255',
                'unique:' . $Role . ',name,' . ($id ?: 'NULL'),
            ],
            'description' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }
}
