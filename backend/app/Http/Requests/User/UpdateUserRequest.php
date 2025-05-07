<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => ['required', 'email', 'string'],
            'cpf' => [
                'required',
                'cpf',
                'string',
                Rule::unique('users', 'cpf')->ignore($this->user()->id)],
            'name' => ['required', 'string'],
        ];
    }


}
