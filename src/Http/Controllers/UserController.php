<?php

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

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
}
