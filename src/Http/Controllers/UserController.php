<?php

namespace Sefirosweb\LaravelAccessList\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User as ModelsUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Sefirosweb\LaravelAccessList\Http\Models\Role;
use Sefirosweb\LaravelAccessList\Http\Models\User;

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

        if ($this->enabledSoftDelete()) {
            if ($request->status === 'all') {
                $query->withTrashed();
            } else  if ($request->status === 'deleted') {
                $query->onlyTrashed();
            }
        }

        $data = $query->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\UserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Validator::make($request->all(), User::getRules())->validate();

        $request->merge([
            'password' => $request->password ? Hash::make($request->password) : Hash::make('guest')
        ]);

        $rules = User::getRules();
        unset($rules['password']);

        $user = new User($request->all());
        $user->changeRules($rules);
        $user->save();
        return response()->json(['success' => true]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $rules = User::getRules($request);

        $update = $request->all();
        if (isset($update['password']) && $update['password']) {
            Validator::make($request->all(), $rules)->validate();
            $update['password'] = Hash::make($request->password);
            unset($rules['password']);
        } else {
            unset($rules['password']);
            unset($update['password']);
            Validator::make($request->all(), $rules)->validate();
        }

        if ($this->enabledSoftDelete()) {
            $user = User::withTrashed()->findOrFail($request->user_id);
        } else {
            $user = User::findOrFail($request->user_id);
        }

        $user->changeRules($rules);
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
        if ($this->enabledSoftDelete()) {
            $user = User::withTrashed()->findOrFail($request->user_id);
            if (!$user->deleted_at) {
                $user->delete();
            } else {
                $user->changeRules([]);
                $user->restore();
            }
        } else {
            $user = User::findOrFail($request->user_id);
            $user->delete();
        }

        return response()->json(['success' => true]);
    }

    public function get_roles_from_user(Request $request)
    {
        if ($this->enabledSoftDelete()) {
            $user = User::withTrashed()->with('roles:id,name,description')->findOrFail($request->user_id);
        } else {
            $user = User::with('roles:id,name,description')->findOrFail($request->user_id);
        }

        return response()->json(['success' => true, 'data' => $user->roles]);
    }

    public function add_role_to_user(Request $request)
    {
        if ($this->enabledSoftDelete()) {
            $user = User::withTrashed()->findOrFail($request->user_id);
        } else {
            $user = User::findOrFail($request->user_id);
        }

        $user->roles()->syncWithoutDetaching($request->role_id);
        return response()->json(['success' => true]);
    }

    public function delete_role_of_the_user(Request $request)
    {
        if ($this->enabledSoftDelete()) {
            $user = User::withTrashed()->findOrFail($request->user_id);
        } else {
            $user = User::findOrFail($request->user_id);
        }
        $user->roles()->detach($request->role_id);
        return response()->json(['success' => true]);
    }

    public function get_roles_array()
    {
        $users = Role::get()->map(function ($row) {
            $row['value'] = $row->id;
            return $row;
        });
        return response()->json(['data' => $users]);
    }

    private function enabledSoftDelete()
    {
        $model = new ModelsUser();
        return in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($model));
    }

    public function get_fillable_data()
    {
        $model = new ModelsUser();

        $id = $model->getKeyName();
        $fillable = $model->getFillable();
        $hidden = $model->getHidden();
        $softDelete = in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($model));

        $columns = DB::select('describe users');
        $columns = array_filter($columns, fn ($row) => in_array($row->Field, $fillable));
        $columns = array_map(function ($row) use ($hidden) {
            $fieldType = 'text';

            if (str_contains($row->Type, 'varchar')) {
                $fieldType = 'text';
            }

            if (str_contains($row->Type, 'varchar') && in_array($row->Field, $hidden)) {
                $fieldType = 'password';
            }

            if (str_contains($row->Type, 'int')) {
                $fieldType = 'number';
            }

            if (str_contains($row->Type, 'timestamp')) {
                $fieldType = 'datetime';
            }

            return [
                'field' => $row->Field,
                'fieldType' => $fieldType
            ];
        }, $columns);
        $columns = array_values($columns);

        return response()->json([
            'id' => $id,
            'columns' => $columns,
            'hidden' => $hidden,
            'softDelete' => $softDelete,
        ]);
    }
}
