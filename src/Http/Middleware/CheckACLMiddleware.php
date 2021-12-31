<?php

namespace Sefirosweb\LaravelAccessList\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

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
        if (!request()->user() || request()->user()->is_active === 0) {
            if ($request->ajax()) {
                return response()
                    ->json(['message'   => "You don't have permissions for this site"])
                    ->setStatusCode(401);
            }
            return redirect('/');
        }

        $acl_list = request()->user()->getAclList();

        if (in_array('admin', $acl_list)) {
            return $next($request);
        }

        if (!in_array($acl, $acl_list)) {
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
