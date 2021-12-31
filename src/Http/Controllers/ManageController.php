<?php

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Models\User;

class ManageController extends Controller
{

    public function get_roles_from_user(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;

        $roles = Role::whereHas('users', function ($query) use ($primaryKeyId) {
            $query->where('id', $primaryKeyId);
        })->get();

        return response()->json(['success' => true, 'data' => $roles]);
    }
    public function add_role_to_user(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;
        $name = $request->name;
        $role = Role::firstWhere('name', $name);
        if (!$role) return response("Data not found", 404);

        $role->users()->syncWithoutDetaching($primaryKeyId);
        return response()->json(['success' => true, 'data' => $role]);
    }
    public function delete_role_of_the_user(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;
        $id = $request->id;
        $role = Role::findOrFail($id);
        $role->users()->detach($primaryKeyId);
        return response()->json(['success' => true]);
    }






    public function get_roles_array()
    {
        return response()->json(Role::all()->map->name);
    }
    public function get_acl_array()
    {
        return response()->json(AccessList::all()->map->name);
    }
    public function get_users_array()
    {
        return response()->json(User::all()->map->email);
    }
}
