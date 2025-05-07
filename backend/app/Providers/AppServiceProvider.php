<?php

namespace App\Providers;

use App\Http\Repositories\TransactionInterfaceRepository;
use App\Http\Repositories\TransactionRepository;
use App\Http\Repositories\UserInterfaceRepository;
use App\Http\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserInterfaceRepository::class, UserRepository::class);
        $this->app->bind(TransactionInterfaceRepository::class, TransactionRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
