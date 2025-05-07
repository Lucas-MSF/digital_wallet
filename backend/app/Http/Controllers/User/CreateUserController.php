<?php

namespace App\Http\Controllers\User;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Services\AuthService;
use App\Http\Services\UserService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserRequest;
use Symfony\Component\HttpFoundation\Response;

class CreateUserController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
        private readonly UserService $userService
    ) {}

    public function __invoke(CreateUserRequest $request): JsonResponse
    {
        try {
            $response = DB::transaction(function () use ($request) {
                $this->userService->create($request->validated());
                return $this->authService->login($request->validated());
            });

            return response()->json($response, Response::HTTP_OK);
        } catch (Exception $error) {
            Log::error('CREATE_USER_ERROR: ', [
                'message' => $error->getMessage(),
                'file' => $error->getFile(),
                'line' => $error->getLine(),
                'trace' => $error->getTrace()
            ]);
            return response()->json(['error' => 'Erro interno, tente novamente mais tarde!'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
