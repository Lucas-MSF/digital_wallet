<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{

    protected function prepareForValidation()
    {
        $this->merge(['cpf' => preg_replace('/\D/', '', $this['cpf'])]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'cpf' => ['required', 'cpf', 'unique:users,cpf'],
            'password' => ['required', 'string'],
        ];
    }
}
