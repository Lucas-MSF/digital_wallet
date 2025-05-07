<?php

namespace App\Http\Repositories;

use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TransactionRepository implements TransactionInterfaceRepository
{
    public function __construct(private readonly Transaction $model)
    {
    }

    public function create(array $data): Transaction
    {
        return $this->model->query()->create($data);
    }

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->model->query()
            ->where('user_id', auth()->id())
            ->when(isset($filters['type']), fn ($query) => $query->where('type', $filters['type']))
            ->when(isset($filters['start']), fn ($query) => $query->whereDate('created_at','>=', $filters['start']))
            ->when(isset($filters['end']), fn ($query) => $query->whereDate('created_at', '<=', $filters['end']))
            ->paginate(perPage: $filters['limit']);
    }

}
