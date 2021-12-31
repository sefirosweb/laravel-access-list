<?php

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Requests\AccessListRequest;

class AccessListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function get()
    {
        return response()->json(['success' => true, 'data' => AccessList::all()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\AccessListRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AccessListRequest $request)
    {
        AccessList::create($request->all());
        return response()->json(['success' => true]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\AccessListRequest  $request
     * @param  \App\Models\AccessList  $accessList
     * @return \Illuminate\Http\Response
     */
    public function update(AccessListRequest $request, AccessList $accessList)
    {
        $accessList = AccessList::findOrFail($request->id);
        $accessList->update($request->all());
        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AccessList  $accessList
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $accessList = AccessList::findOrFail($request->id);
        $accessList->delete();
        return response()->json(['success' => true]);
    }

    public function get_roles_from_access_list(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;

        $roles = Role::whereHas('access_lists', function ($query) use ($primaryKeyId) {
            $query->where('id', $primaryKeyId);
        })->get();

        return response()->json(['success' => true, 'data' => $roles]);
    }
    public function add_role_to_access_list(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;
        $name = $request->name;
        $role = Role::firstWhere('name', $name);
        if (!$role) return response("Data not found", 404);

        $role->access_lists()->syncWithoutDetaching($primaryKeyId);
        return response()->json(['success' => true, 'data' => $role]);
    }
    public function delete_role_of_the_access_list(Request $request)
    {
        $primaryKeyId = $request->primaryKeyId;
        $id = $request->id;
        $role = Role::findOrFail($id);
        $role->access_lists()->detach($primaryKeyId);
        return response()->json(['success' => true]);
    }
    public function get_roles_array()
    {
        return response()->json(['success' => true, 'data' => Role::all()->map->name]);
    }
}
