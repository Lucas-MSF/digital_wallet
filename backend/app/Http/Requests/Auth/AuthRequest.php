<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'password' => ['required'],
            'cpf' => ['required', 'cpf', 'exists:users,cpf'],
        ];
    }

    public function bodyParameters(): array
    {
        return [
            'email' => [
                'description' => 'E-mail para login.',
                'example'     => 'joao@email.com'
            ],
            'password' => [
                'description' => 'Senha para login.',
                'example'     => '********'
            ]
        ];
    }
}
