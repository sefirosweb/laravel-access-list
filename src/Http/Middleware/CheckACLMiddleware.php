<?php

namespace Sefirosweb\LaravelAccessList\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckACLMiddleware
{
    public function handle(Request $request, Closure $next, string $acl)
    {
        $userClass = config('laravel-access-list.User');

        $authUser = $request->user();

        if (!$authUser) {
            return $this->deny($request);
        }

        $acl = str_replace(':class:', '', $acl);

        /** @var object|null $user */
        $user = $userClass::find($authUser->id);

        if (!$user || !$user->hasAcl($acl)) {
            return $this->deny($request);
        }

        return $next($request);
    }

    private function deny(Request $request)
    {
        if ($request->ajax() || $request->expectsJson()) {
            return response()
                ->json(['message' => "You don't have permissions for this site"])
                ->setStatusCode(401);
        }

        return redirect('/');
    }
}
