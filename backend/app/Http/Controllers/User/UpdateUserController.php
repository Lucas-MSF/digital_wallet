<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Http\Services\UserService;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class UpdateUserController extends Controller
{
    public function __construct(private readonly UserService $userService)
    {
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(UpdateUserRequest $request)
    {
        try {
            return UserResource::make($this->userService->update($request->validated()));
        } catch (\Exception $error) {
            Log::error('UPDATE_USER_ERROR', [
                'message' => $error->getMessage(),
                'file' => $error->getFile(),
                'line' => $error->getLine(),
                'trace' => $error->getTrace()
            ]);
            return response()->json(['error' => 'Erro interno, tente novamente mais tarde!'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
