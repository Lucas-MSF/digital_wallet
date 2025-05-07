<?php

namespace App\Http\Requests\Transactions;

use App\Http\Enum\TransferTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateDepositRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $this->merge(['account' => $this->user()->account->account_number]);
    }

    public function rules()
    {
        return [
            'account' => ['required', 'exists:accounts,account_number'],
            'amount' => ['required', 'numeric', 'min:0.1'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function authorize()
    {
        return true;
    }
}
