<?php

use App\Http\Controllers\Auth\AuthLoginController;
use App\Http\Controllers\Auth\AuthLogoutController;
use App\Http\Controllers\Transactions\CreateDepositController;
use App\Http\Controllers\Transactions\CreateTransferController;
use App\Http\Controllers\Transactions\GetTransactionsController;
use App\Http\Controllers\Transactions\PiggyDepositController;
use App\Http\Controllers\Transactions\WithdrawPiggyController;
use App\Http\Controllers\User\CreateUserController;
use App\Http\Controllers\User\GetBalanceController;
use App\Http\Controllers\User\GetUserController;
use App\Http\Controllers\User\UpdateUserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



Route::middleware('api')->group(function () {
    Route::post('/login', AuthLoginController::class);
    Route::post('/signup', CreateUserController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', AuthLogoutController::class);
    Route::get('/user', GetUserController::class);
    Route::put('/user', UpdateUserController::class);
    Route::get('/balance', GetBalanceController::class);
    Route::prefix('piggy')->group(function () {
        Route::post('/deposit', PiggyDepositController::class);
        Route::post('/withdraw', WithdrawPiggyController::class);
    });
    Route::get('transactions', GetTransactionsController::class);
    Route::post('transfer', CreateTransferController::class);
    Route::post('deposit', CreateDepositController::class);
});

