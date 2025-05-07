<?php

namespace App\Observers;

use App\Http\Enum\TransactionTypeEnum;
use App\Models\Account;
use App\Models\Transaction;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        match ($transaction->type) {
            TransactionTypeEnum::DEPOSIT->value => $this->updateDepositValues($transaction->amount),
            TransactionTypeEnum::TRANSFER->value => $this->updateTransferValues($transaction->amount, $transaction->destiny_account),
            TransactionTypeEnum::WITHDRAW->value => $this->updateWithdrawValues($transaction->amount),
            TransactionTypeEnum::PIGGY_IN->value => $this->updatePiggyInValues($transaction->amount),
            TransactionTypeEnum::PIGGY_OUT->value => $this->updatePiggyOutValues($transaction->amount),
        };
        $transaction->balance_after_transaction = auth()->user()->account->balance;
        $transaction->save();
    }
    private function updateDepositValues(float $amount): void
    {
        $userAccount = auth()->user()->account;
        $userAccount->balance += $amount;
        $userAccount->save();
    }
    private function updateTransferValues(float $amount, string $destinyAccount): void
    {
        $userAccount = auth()->user()->account;
        $userAccount->balance -= $amount;
        $userAccount->save();
        Account::where('account_number', $destinyAccount)
            ->first()
            ->increment('balance', $amount);
    }
    private function updateWithdrawValues(float $amount): void
    {
        $userAccount = auth()->user()->account;
        $userAccount->balance -= $amount;
        $userAccount->save();
    }
    private function updatePiggyInValues(float $amount): void
    {
        $userAccount = auth()->user()->account;
        $userAccount->balance -= $amount;
        $userAccount->safe_balance += $amount;
        $userAccount->save();
    }
    private function updatePiggyOutValues(float $amount): void
    {
        $userAccount = auth()->user()->account;
        $userAccount->balance += $amount;
        $userAccount->safe_balance -= $amount;
        $userAccount->save();
    }
}
