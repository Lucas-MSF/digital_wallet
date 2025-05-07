<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cpf' => $this->cpf,
            'phone_number' => $this->phone_number ?? null,
            'email' => $this->email,
            'account_number' => $this->account->account_number,
            'bank' => $this->account->bank,
            'agency' => $this->account->agency,
            'balance' => $this->account->balance,
            'safe_balance' => $this->account->safe_balance,
        ];
    }
}
