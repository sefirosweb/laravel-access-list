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
        $Role = config('laravel-access-list.User');
        return $this->belongsToMany($Role, 'role_has_acl');
    }
}
