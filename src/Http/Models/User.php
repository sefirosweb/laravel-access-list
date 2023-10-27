<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Sefirosweb\LaravelAccessList\Http\Traits\HasAcl;
use Sefirosweb\LaravelAccessList\Http\Traits\SelfModelValidator;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use SelfModelValidator, HasAcl;

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
}
