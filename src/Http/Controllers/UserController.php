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
    public function get()
    {
        return response()->json(['success' => true, 'data' => User::all()]);
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

        $mailingGroup = User::findOrFail($request->id);
        $mailingGroup->update($update);
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
        $mailingGroup = User::findOrFail($request->id);
        $switch = $mailingGroup->is_active === 1 ? 0 : 1;
        $mailingGroup->update(['is_active' => $switch]);
        return response()->json(['success' => true, $switch]);
    }


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
        return response()->json(['success' => true, 'data' => Role::all()->map->name]);
    }
}
