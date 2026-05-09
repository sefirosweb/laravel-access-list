<?php

declare(strict_types=1);

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MeController extends Controller
{
    /**
     * Return the currently authenticated user, or null if anonymous.
     * Only public-safe fields are exposed: id, name, email.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['data' => null]);
        }
        return response()->json([
            'data' => [
                'id' => $user->getKey(),
                'name' => $user->name ?? null,
                'email' => $user->email ?? null,
            ],
        ]);
    }
}
