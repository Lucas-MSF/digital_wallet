<?php

namespace App\Http\Services;

use App\Http\Enum\TransactionTypeEnum;
use App\Http\Repositories\TransactionInterfaceRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

class TransactionService
{
    public function __construct(private readonly TransactionInterfaceRepository $transactionRepository)
    {
    }

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->transactionRepository->getAll($filters);
    }

    public function createTransfer(array $data): void
    {
        $this->createTransaction($data, TransactionTypeEnum::TRANSFER->value);
    }

    private function createTransaction(array $data, int $type): void
    {
        $userAccount = auth()->user()->account;
        $dataTransaction = [
            'user_id' => $userAccount->user_id,
            'origin_account' => $type == TransactionTypeEnum::TRANSFER->value ? $userAccount->account_number : null,
            'destiny_account' => $data['account'],
            'amount' => $data['amount'],
            'description' => $data['description'] ?? null,
            'type' => $type,

        ];
        $this->transactionRepository->create($dataTransaction);
    }

    public function createDeposit(array $data): void
    {
        $this->createTransaction($data, TransactionTypeEnum::DEPOSIT->value);
    }

}
