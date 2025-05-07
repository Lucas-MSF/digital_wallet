<?php

namespace App\Http\Controllers\Transactions;

use App\Exceptions\InvalidAmountException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\CreateDepositRequest;
use App\Http\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CreateDepositController extends Controller
{
    public function __construct(private readonly TransactionService $transactionService)
    {
    }
    /**
     * Handle the incoming request.
     */
    public function __invoke(CreateDepositRequest $request)
    {
        try {
            $this->transactionService->createDeposit($request->validated());
            return response()->noContent();
        } catch (InvalidAmountException $exception) {
            return response()->json(['error' => $exception->getMessage()], $exception->getCode());
        } catch (\Exception $error) {
            Log::error('CREATE_DEPOSIT_ERRO', [
                'message' => $error->getMessage(),
                'file' => $error->getFile(),
                'line' => $error->getLine(),
                'trace' => $error->getTrace()
            ]);
            return response()->json(['error' => 'Erro interno, tente novamente mais tarde!'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
