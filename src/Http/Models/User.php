<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use App\Models\User as ModelsUser;
use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends ModelsUser
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    public function getDeletedAtAttribute($date)
    {
        if (!$date) return null;
        $time = new DateTime($date);
        return $time->format('Y-m-d H:i:s');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_has_role');
    }

    public function getAclList()
    {
        return array_unique($this->roles->reduce(function ($carry, $role) {
            return array_merge($carry, array_column($role->access_lists->toArray(), 'name'));
        }, []));
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

    public function getSoftDeletingAttribute()
    {
        return in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses(ModelsUser::class));
    }
}
