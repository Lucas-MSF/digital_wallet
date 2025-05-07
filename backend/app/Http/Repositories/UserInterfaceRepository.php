<?php

namespace App\Http\Repositories;

use App\Models\User;

interface UserInterfaceRepository {
    public function create(array $data): User;

    public function getById(int $id): User;

    public function update(array $data): User;
}
