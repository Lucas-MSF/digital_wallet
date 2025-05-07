<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'balance',
        'safe_balance',
        'account_number',
        'bank',
        'agency',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getBalanceAttribute($value): string
    {
        return number_format($value, 2, '.', '');
    }

    public function getSafeBalanceAttribute($value): string
    {
        return number_format($value, 2, '.', '');
    }
}
