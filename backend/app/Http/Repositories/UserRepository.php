<?php

namespace App\Http\Repositories;

use App\Models\User;

class UserRepository implements UserInterfaceRepository
{
    public function __construct(private readonly User $model)
    {
    }

    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    public function getById(int $id): User
    {
        return $this->model->find($id);
    }

    public function update(array $data): User
    {
        $user = $this->model->query()->find(auth()->id());
        $user->update($data);
        return $user;
    }
}
