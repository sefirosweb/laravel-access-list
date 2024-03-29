<?php

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Sefirosweb\LaravelAccessList\Http\Models\User;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Requests\RoleRequest;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function get()
    {
        $Role = config('laravel-access-list.Role');
        return response()->json(['success' => true, 'data' => $Role::query()->get()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\RoleRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RoleRequest $request)
    {
        $Role = config('laravel-access-list.Role');
        $Role::create($request->all());
        return response()->json(['success' => true]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\RoleRequest  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(RoleRequest $request, Role $role)
    {
        $Role = config('laravel-access-list.Role');
        $role = $Role::findOrFail($request->role_id);
        $role->update($request->all());
        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $Role = config('laravel-access-list.Role');
        $role = $Role::findOrFail($request->role_id);
        $role->delete();
        return response()->json(['success' => true]);
    }

    public function get_users_from_role(Request $request)
    {
        $Role = config('laravel-access-list.Role');
        $role = $Role::with('users')->findOrFail($request->role_id);
        return response()->json(['success' => true, 'data' => $role->users]);
    }

    public function add_user_to_role(Request $request)
    {
        $Role = config('laravel-access-list.Role');
        $role = $Role::findOrFail($request->role_id);
        $role->users()->syncWithoutDetaching($request->user_id);
        return response()->json(['success' => true]);
    }

    public function delete_user_of_the_role(Request $request)
    {
        $Role = config('laravel-access-list.Role');
        $role = $Role::findOrFail($request->role_id);
        $role->users()->detach($request->user_id);
        return response()->json(['success' => true]);
    }

    public function get_access_list_from_role(Request $request)
    {
        $Role = config('laravel-access-list.Role');
        $role = $Role::findOrFail($request->role_id);
        return response()->json(['success' => true, 'data' => $role->access_lists]);
    }

    public function add_access_list_to_role(Request $request)
    {
        $Role = config('laravel-access-list.Role');
        $role = $Role::findOrFail($request->role_id);
        $role->access_lists()->syncWithoutDetaching($request->acl_id);
        return response()->json(['success' => true]);
    }

    public function delete_access_list_of_the_role(Request $request)
    {
        $Role = config('laravel-access-list.Role');
        $role = $Role::findOrFail($request->role_id);
        $role->access_lists()->detach($request->acl_id);
        return response()->json(['success' => true]);
    }

    public function get_users_array()
    {
        $User = config('laravel-access-list.User');
        $users = $User::select(['id', 'id as value', 'email as name'])->get();
        return response()->json(['data' => $users]);
    }

    public function get_acl_array()
    {
        $User = config('laravel-access-list.AccessList');
        $accessList = $User::select(['id', 'id as value', 'name'])->get();
        return response()->json(['data' => $accessList]);
    }
}
