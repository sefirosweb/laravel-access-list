<?php

namespace Sefirosweb\LaravelAccessList\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Sefirosweb\LaravelAccessList\Http\Models\User;

class CheckACLMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $acl)
    {
        $User = config('laravel-access-list.User');

        if (!request()->user()) {
            if ($request->ajax()) {
                return response()
                    ->json(['message'   => "You don't have permissions for this site"])
                    ->setStatusCode(401);
            }
            return redirect('/');
        }

        $acl = str_replace(':class:', '', $acl);

        $user = $User::find($request->user()->id);

        if (!$user->hasAcl($acl)) {
            if ($request->ajax()) {
                return response()
                    ->json(['message'   => "You don't have permissions for this site"])
                    ->setStatusCode(401);
            }
            return redirect('/');
        }

        return $next($request);
    }
}
