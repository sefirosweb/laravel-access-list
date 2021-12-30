<?php

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Requests\UserRequest;

class UserController extends Controller
{
    public function get()
    {
        $users = User::all()->toArray();
        return response()->json(['totalNotFiltered' => count($users), 'total' => count($users), 'rows' => $users]);
    }

    public function get_group_info(Request $request)
    {
        if ($request->type === 'acl') {
            return response()->json(['success' => true, 'data' => Role::findOrFail($request->primaryKey)->access_lists]);
        }
        if ($request->type === 'users') {
            return response()->json(['success' => true, 'data' => Role::findOrFail($request->primaryKey)->users]);
        }
        return response("Data not found", 404);
    }

    public function get_users_list()
    {
        return response()->json(['success' => true, 'data' => User::all()->map->email]);
    }

    public function get_acl_list()
    {
        return response()->json(['success' => true, 'data' => AccessList::all()->map->name]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\UserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        $request->merge([
            'password' => Hash::make('guest')
        ]);

        User::create($request->all());
        return response()->json(['success' => true]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\UserRequest  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, User $user)
    {
        $mailingGroup = User::findOrFail($request->id);
        $mailingGroup->update($request->all());
        return response()->json(['success' => true]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(Request $request, User $user)
    {
        $user = User::findOrFail($request->id);

        $validated = $request->validate([
            'password' => 'required|min:8|max:255'
        ]);

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'success' => true,
            'message' => "Contraseña actualizada!",
            'messageStatus' => "success",
            'title' => 'Esto es el titulo'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $mailingGroup = User::findOrFail($request->id);
        $mailingGroup->update(['is_active' => $mailingGroup->is_active === 1 ? 0 : 1]);
        return response()->json(['success' => true]);
    }

    public function delete_from_role(Request $request)
    {
        $role = Role::findOrFail($request->primaryKey);
        if ($request->type === 'user') {
            $user = User::findOrFail($request->id);
            $user->roles()->detach($role);
            return response()->json(['success' => true]);
        }
        if ($request->type === 'acl') {
            $accessList = AccessList::findOrFail($request->id);
            $accessList->roles()->detach($role);
            return response()->json(['success' => true]);
        }
    }

    public function insert_into_role(Request $request)
    {
        $role = Role::findOrFail($request->primaryKey);

        if ($request->type === 'users') {
            $user = User::where('email', $request->name)->get()->first();
            if (!$user) {
                return response("Data not found", 404);
            }

            $user->roles()->attach($role);
            return response()->json(['success' => true]);
        }

        if ($request->type === 'acl') {
            $accessList = AccessList::where('name', $request->name)->get()->first();
            if (!$accessList) {
                return response("Data not found", 404);
            }

            $accessList->roles()->attach($role);
            return response()->json(['success' => true]);
        }
    }
}
