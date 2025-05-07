<?php

use App\Http\Enum\TransactionTypeEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->enum('type', [
                TransactionTypeEnum::DEPOSIT->value,
                TransactionTypeEnum::TRANSFER->value,
                TransactionTypeEnum::WITHDRAW->value,
                TransactionTypeEnum::PIGGY_IN->value,
                TransactionTypeEnum::PIGGY_OUT->value,
            ]);
            $table->float('amount');
            $table->string('description')->nullable();
            $table->string('destiny_account');
            $table->string('origin_account')->nullable();
            $table->float('balance_after_transaction')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
