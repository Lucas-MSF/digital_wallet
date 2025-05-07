<?php

namespace App\Http\Controllers\Transactions;

use App\Exceptions\InvalidAmountException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\PiggyRequest;
use App\Http\Resources\GetBalanceResource;
use App\Http\Services\PiggyService;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class WithdrawPiggyController extends Controller
{

    public function __construct(private readonly PiggyService $piggyService)
    {
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(PiggyRequest $request)
    {
        try {
            return GetBalanceResource::make($this->piggyService->withdraw($request->validated()));
        } catch (InvalidAmountException $exception) {
            return response()->json(['error' => $exception->getMessage()], $exception->getCode());
        } catch (\Exception $error) {
            Log::error('WITHDRAW_PIGGY_ERROR', [
                'message' => $error->getMessage(),
                'file' => $error->getFile(),
                'line' => $error->getLine(),
                'trace' => $error->getTrace()
            ]);
            return response()->json(['error' => 'Erro interno, tente novamente mais tarde!'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
