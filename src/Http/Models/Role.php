<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name',
        'description'
    ];

    public function users()
    {
        return $this->belongsToMany(\App\User::class, 'user_has_role');
    }

    public function access_lists()
    {
        return $this->belongsToMany(AccessList::class, 'role_has_acl');
    }
}
