<?php

namespace App\Http\Requests\Transactions;

use App\Http\Enum\TransactionTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GetTransactionsRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'type' => ['nullable', Rule::enum(TransactionTypeEnum::class)],
            'start' => ['nullable', 'date', 'date_format:Y-m-d'],
            'end' => ['nullable', 'date', 'date_format:Y-m-d'],
            'limit' => ['required', 'integer', 'min:1'],
        ];
    }


}
