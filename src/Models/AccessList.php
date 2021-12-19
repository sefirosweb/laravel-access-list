<?php

namespace Sefirosweb\LaravelAccessList\Models;

use Illuminate\Database\Eloquent\Model;

class AccessList extends Model
{
    protected $fillable = [
        'name',
        'description'
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_has_acl');
    }
}
