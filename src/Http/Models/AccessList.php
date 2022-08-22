<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AccessList extends Model
{
    protected $fillable = [
        'name',
        'description'
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_has_acl');
    }
}
