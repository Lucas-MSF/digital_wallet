<?php

namespace App\Http\Services;

use App\Http\Repositories\UserInterfaceRepository;
use App\Models\User;

class UserService
{
    public function __construct(private readonly UserInterfaceRepository $repository)
    {
    }

    public function create(array $data): User
    {
        return $this->repository->create($data);
    }

    public function getUser(int $id): array
    {
        $user = $this->repository->getById($id);
        return [
            'name' => $user->name,
            'email' => $user->email
        ];
    }

    public function update(array $data): User
    {
        return $this->repository->update($data);
    }
}
