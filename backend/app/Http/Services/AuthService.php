<?php

namespace App\Http\Services;

use Illuminate\Validation\UnauthorizedException;

class AuthService
{
    public function login(array $data): array
    {
        $token = $this->validateLogin($data['cpf'], $data['password']);
        $user = auth()->user();
        return [
            'id' => $user->getKey(),
            'name' => $user->name,
            'email' => $user->email,
            'cpf' => $user->cpf,
            'account_number' => $user->account->account_number,
            'balance' => $user->account->balance,
            'safe_balance' => $user->account->safe_balance,
            'token' => $token
        ];
    }

    private function validateLogin(string $cpf, string $password): string
    {
        if (! $token = auth()->attempt([
            'cpf' => $cpf,
            'password' => $password,
        ])) {
            throw new UnauthorizedException();
        }

        return $token;
    }
}
