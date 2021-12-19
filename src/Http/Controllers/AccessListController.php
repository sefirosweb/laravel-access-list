<?php

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Requests\AccessListRequest;

class AccessListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
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
}
