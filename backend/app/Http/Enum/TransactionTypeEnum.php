<?php

namespace App\Http\Enum;
enum TransactionTypeEnum: int
{
    case DEPOSIT = 1;
    case TRANSFER = 2;
    case WITHDRAW = 3;
    case PIGGY_IN = 4;
    case PIGGY_OUT = 5;
}
