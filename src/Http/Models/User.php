<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use App\Models\User as ModelsUser;
use Illuminate\Database\Eloquent\Model;

class User extends ModelsUser
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->mergeFillable(['is_active']);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_has_role');
    }

    public function getAclList()
    {
        return array_unique($this->roles->reduce(function ($carry, $role) {
            return array_merge($carry, array_column($role->access_lists->toArray(), 'name'));
        }, []));
    }
}
