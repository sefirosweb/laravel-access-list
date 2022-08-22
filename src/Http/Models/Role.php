<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'description'
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_has_role');
    }

    public function access_lists(): BelongsToMany
    {
        return $this->belongsToMany(AccessList::class, 'role_has_acl');
    }
}
