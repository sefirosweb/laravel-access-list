<?php

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Models\User;
use Sefirosweb\LaravelAccessList\Http\Requests\UserRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request)
    {
        $query = User::query();
        if ($request->status === 'all') {
            $query->withTrashed();
        } else  if ($request->status === 'deleted') {
            $query->onlyTrashed();
        }

        $data = $query->get([
            'id', 'name', 'email', 'deleted_at'
        ]);

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\UserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        $request->merge([
            'password' => $request->password ? Hash::make($request->password) : Hash::make('guest')
        ]);

        User::create($request->all());
        return response()->json(['success' => true]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\UserRequest $request
     * @param  \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, User $user)
    {
        $update = $request->all();
        if (isset($update['password']) && $update['password']) {
            $update['password'] = Hash::make($request->password);
        } else {
            unset($update['password']);
        }

        $user = User::withTrashed()->findOrFail($request->id);
        $user->update($update);
        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $user = User::withTrashed()->findOrFail($request->id);
        if (!$user->deleted_at) {
            $user->delete();
        } else {
            $user->restore();
        }
        return response()->json(['success' => true]);
    }

    public function get_roles_from_user(Request $request)
    {
        $user = User::withTrashed()->with('roles:id,name,description')->findOrFail($request->primaryKeyId);
        return response()->json(['success' => true, 'data' => $user->roles]);
    }

    public function add_role_to_user(Request $request)
    {
        $user = User::withTrashed()->findOrFail($request->primaryKeyId);
        $user->roles()->syncWithoutDetaching($request->name['value']);
        return response()->json(['success' => true]);
    }

    public function delete_role_of_the_user(Request $request)
    {
        $user = User::withTrashed()->findOrFail($request->primaryKeyId);
        $user->roles()->detach($request->idDataField);
        return response()->json(['success' => true]);
    }

    public function get_roles_array()
    {
        $users = Role::select([
            'id AS value',
            'name AS name',
        ])->get();
        return response()->json(['data' => $users]);
    }
}
