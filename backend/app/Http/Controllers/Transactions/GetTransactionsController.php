<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\GetTransactionsRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Services\TransactionService;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class GetTransactionsController extends Controller
{
    public function __construct(private readonly TransactionService $transactionService)
    {
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(GetTransactionsRequest $request)
    {
        try {
            return TransactionResource::collection($this->transactionService->getAll($request->validated()));
        }  catch (\Exception $error) {
            Log::error('GET_TRANSACTIONS_ERROR', [
                'message' => $error->getMessage(),
                'file' => $error->getFile(),
                'line' => $error->getLine(),
                'trace' => $error->getTrace()
            ]);
            return response()->json(['error' => 'Erro interno, tente novamente mais tarde!'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
