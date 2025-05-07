<?php

namespace App\Models;

use App\Observers\TransactionObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy(TransactionObserver::class)]
class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'description',
        'destiny_account',
        'origin_account',
        'balance_after_transaction',
    ];

    public function getAmountAttribute($value): string
    {
        return number_format($value, 2, '.', '');
    }

    public function getBalanceAfterTransactionAttribute($value): string
    {
        return number_format($value, 2, '.', '');
    }
}
