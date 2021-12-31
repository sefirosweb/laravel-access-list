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
        return response()->json(['success' => true, 'data' => Role::all()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\RoleRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RoleRequest $request)
    {
        Role::create($request->all());
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
        $role = Role::findOrFail($request->id);
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
        $role = Role::findOrFail($request->id);
        $role->delete();
        return response()->json(['success' => true]);
    }


    public function get_users_from_role(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;

        $users = User::whereHas('roles', function ($query) use ($primaryKeyId) {
            $query->where('id', $primaryKeyId);
        })->get();

        return response()->json(['success' => true, 'data' => $users]);
    }
    public function add_user_to_role(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;
        $name = $request->name;
        $user = User::firstWhere('email', $name);
        if (!$user) return response("Data not found", 404);

        $user->roles()->syncWithoutDetaching($primaryKeyId);
        return response()->json(['success' => true, 'data' => $user]);
    }
    public function delete_user_of_the_role(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;
        $id = $request->id;
        $user = User::findOrFail($id);
        $user->roles()->detach($primaryKeyId);
        return response()->json(['success' => true]);
    }

    public function get_access_list_from_role(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;

        $accessLists = AccessList::whereHas('roles', function ($query) use ($primaryKeyId) {
            $query->where('id', $primaryKeyId);
        })->get();

        return response()->json(['success' => true, 'data' => $accessLists]);
    }
    public function add_access_list_to_role(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;
        $name = $request->name;
        $accessList = AccessList::firstWhere('name', $name);
        if (!$accessList) return response("Data not found", 404);

        $accessList->roles()->syncWithoutDetaching($primaryKeyId);
        return response()->json(['success' => true, 'data' => $accessList]);
    }
    public function delete_access_list_of_the_role(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;
        $id = $request->id;
        $accessList = AccessList::findOrFail($id);
        $accessList->roles()->detach($primaryKeyId);
        return response()->json(['success' => true]);
    }

    public function get_users_array()
    {
        return response()->json(['success' => true, 'data' => User::all()->map->email]);
    }

    public function get_acl_array()
    {
        return response()->json(['success' => true, 'data' => AccessList::all()->map->name]);
    }
}
