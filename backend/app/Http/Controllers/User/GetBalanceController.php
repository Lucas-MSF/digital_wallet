<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\GetBalanceResource;
use Illuminate\Http\Resources\Json\JsonResource;

class GetBalanceController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): JsonResource
    {
        $userAccount = auth()->user()->account;
        return GetBalanceResource::make([
            'balance' => $userAccount->balance,
            'safe_balance' => $userAccount->safe_balance,
        ]);
    }
}
