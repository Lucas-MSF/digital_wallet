<?php

namespace App\Observers;

use App\Models\Account;
use App\Models\User;
use Illuminate\Support\Str;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $user->account()->create([
            'user_id' => $user->getKey(),
            'account_number' => $user->getKey() . random_int(1000000, 9999999),
            'balance' => 0,
            'safe_balance' => 0,
            'bank' => random_int(100, 999),
            'agency' => random_int(1000, 9999),
        ]);
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        Account::query()->where('user_id', $user->getKey())->delete();
    }
}
