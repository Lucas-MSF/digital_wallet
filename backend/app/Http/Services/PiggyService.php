<?php

namespace App\Http\Services;

use App\Exceptions\InvalidAmountException;
use App\Http\Enum\TransactionTypeEnum;
use App\Http\Repositories\TransactionRepository;
use Symfony\Component\HttpFoundation\Response;

class PiggyService
{
    public function __construct(private readonly TransactionRepository $transactionRepository)
    {
    }

    public function deposit(array $data): array
    {
        $userAccount = auth()->user()->account;
        throw_if(
          $data['amount'] > $userAccount->balance,
            InvalidAmountException::class,
            'Saldo insuficiente!',
            Response::HTTP_BAD_REQUEST
        );
        $this->createTransaction(array_merge($data, [
            'user_id' => auth()->id(),
            'destiny_account' => $userAccount->account_number,
            'type' => TransactionTypeEnum::PIGGY_IN->value
        ]));

        return [
            'balance' => $userAccount->balance,
            'safe_balance' => $userAccount->safe_balance,
        ];
    }

    public function withdraw(array $data): array
    {
        $userAccount = auth()->user()->account;
        throw_if(
            $data['amount'] > $userAccount->safe_balance,
            InvalidAmountException::class,
            'Saldo insuficiente!',
            Response::HTTP_BAD_REQUEST
        );

        $this->createTransaction(array_merge($data, [
            'user_id' => auth()->id(),
            'destiny_account' => $userAccount->account_number,
            'type' => TransactionTypeEnum::PIGGY_OUT->value
        ]));

        return [
            'balance' => $userAccount->balance,
            'safe_balance' => $userAccount->safe_balance,
        ];
    }

    private function createTransaction(array $data): void
    {
        $dataTransaction = [
            'user_id' => $data['user_id'],
            'destiny_account' => $data['destiny_account'],
            'amount' => $data['amount'],
            'description' => $data['description'] ?? null,
            'type' => $data['type'],

        ];
        $this->transactionRepository->create($dataTransaction);
    }
}
