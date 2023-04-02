<?php

namespace Sefirosweb\LaravelAccessList\Http\Models;

use App\Models\User as ModelsUser;
use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Sefirosweb\LaravelAccessList\Http\Traits\HasAcl;
use Sefirosweb\LaravelAccessList\Http\Traits\SelfModelValidator;

class User extends ModelsUser
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
        return $this->belongsToMany(Role::class, 'user_has_role');
    }
}
