<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthLogoutController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        auth()->logout();
        return response()->noContent();
    }
}
