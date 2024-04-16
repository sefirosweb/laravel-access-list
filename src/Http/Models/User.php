<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    public function getDeletedAtAttribute($date)
    {
        if (!$date) return null;
        $time = new DateTime($date);
        return $time->format('Y-m-d H:i:s');
    }

    public function roles(): BelongsToMany
    {
        $Role = config('laravel-access-list.Role');
        return $this->belongsToMany($Role, 'user_has_role');
    }

    public function getAclList()
    {
        return array_values(array_unique($this->roles->reduce(function ($carry, $role) {
            return array_merge($carry, array_column($role->access_lists->toArray(), 'name'));
        }, [])));
    }

    public function hasAcl($acl)
    {
        $acl_list = $this->getAclList();

        if (in_array('admin', $acl_list)) {
            return true;
        }

        if (in_array($acl, $acl_list)) {
            return true;
        }

        return false;
    }
}
