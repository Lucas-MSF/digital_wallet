<?php

namespace App\Http\Repositories;

use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TransactionInterfaceRepository
{
    public function create(array $data): Transaction;

    public function getAll(array $filters): LengthAwarePaginator;
}
